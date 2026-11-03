// =========================================================================
// engine.js — 512-D CLIP Embedding Engine (Deterministic Unit Vectors)
// Depends on: data.js
// =========================================================================
const EMBEDDING_DIM = 512;
const CONCEPT_CUTOFF = 480; // Indices 0..479 hold 160 orthogonal 3-D concept slots; 480..511 hold identity hash

// Canonical semantic basis concepts mapped across orthogonal 3-D subspaces (0..159)
const CONCEPT_BASIS_MAP = {
  dog: 0, puppy: 0, retriever: 1, labrador: 2, bark: 0, canine: 0, husky: 3, pug: 0, beagle: 0, chihuahua: 0, samoyed: 0,
  cat: 4, kitten: 4, tabby: 5, feline: 4, persian: 4, siamese: 4,
  pet: 8, animal: 9, wildlife: 10,
  car: 14, automobile: 14, sedan: 15, vehicle: 16, truck: 17, driving: 18, limousine: 15, convertible: 14, pickup: 17,
  airplane: 22, plane: 22, aircraft: 22, jet: 23, flight: 24, aviation: 24, flying: 25, cloud: 26, airliner: 22, warplane: 22,
  bird: 30, kingfisher: 31, feather: 30, beak: 30, macaw: 30, toucan: 32, robin: 33, ostrich: 34, peacock: 35, flamingo: 35, eagle: 30, hummingbird: 30,
  mountain: 36, peak: 36, snow: 37, lake: 38, alpine: 37, landscape: 39, volcano: 36,
  bicycle: 42, bike: 42, cycling: 43, cyclist: 43, riding: 44, moped: 45, motorcycle: 45, train: 46, locomotive: 46,
  food: 48, pasta: 49, cooking: 50, cook: 50, meal: 48, dish: 48, kitchen: 51, vegetable: 52, tomato: 52, pepper: 52, dinner: 48, skillet: 51, pizza: 49, burger: 48, cheeseburger: 48, hotdog: 48, espresso: 50, coffee: 50, icecream: 53, sundae: 53,
  sports: 56, sport: 56, soccer: 57, football: 57, player: 58, athlete: 58, stadium: 59, game: 56, basketball: 56, tennis: 56, baseball: 56, rugby: 56,
  ship: 64, boat: 64, sailboat: 65, vessel: 64, sailing: 65, speedboat: 64,
  beach: 70, ocean: 71, sea: 71, water: 72, sand: 70, coast: 70, seashore: 70,
  grass: 76, park: 77, tree: 78, branch: 79, forest: 78, nature: 80, outdoor: 81, flower: 82,
  city: 84, street: 85, road: 86, highway: 86, building: 87, architecture: 87, indoor: 88, window: 89, castle: 87, lighthouse: 87, beacon: 87,
  person: 92, people: 92, group: 93, running: 94, sitting: 95,
  red: 100, blue: 101, green: 102, yellow: 103, orange: 104, white: 105, black: 106, silver: 107, golden: 103, sky: 108,
  shark: 110, fish: 111, goldfish: 111, lionfish: 111, coral: 112, reef: 112, aquatic: 113, marine: 113, jellyfish: 113, sealion: 113,
  lion: 114, tiger: 115, cheetah: 116, leopard: 117, cougar: 117, puma: 117,
  panda: 118, elephant: 119, zebra: 120, koala: 121,
  chimp: 122, chimpanzee: 122, monkey: 122, ape: 122, gorilla: 122, camel: 123, bear: 124, fox: 125, hippo: 126, hippopotamus: 126
};

// Prompt framing words to ignore so template boilerplate doesn't pollute concept weights
const TEMPLATE_STOPWORDS = new Set([
  "a", "an", "the", "photo", "photograph", "picture", "image", "of", "in", "on", "at", "with",
  "high", "resolution", "low", "bright", "dark", "clean", "dirty", "close", "up", "cropped",
  "blurred", "blurry", "good", "bad", "many", "one", "large", "small", "painting", "rendering",
  "sketch", "drawing", "graffiti", "tattoo", "origami", "toy", "plastic", "art", "cartoon"
]);

// Related semantic expansions so parent/child labels match naturally
const SEMANTIC_RELATIONS = {
  marine: { marine: 1.0, fish: 0.9, shark: 0.8, ocean: 0.85, water: 0.85, sea: 0.8, coral: 0.75 },
  fish: { fish: 1.0, marine: 0.95, water: 0.85, ocean: 0.75, aquatic: 0.9 },
  goldfish: { fish: 1.0, marine: 0.95, water: 0.9, golden: 0.85, pet: 0.8 },
  shark: { shark: 1.0, marine: 0.95, fish: 0.75, ocean: 0.9, water: 0.9, sea: 0.85 },
  jellyfish: { jellyfish: 1.0, marine: 0.95, ocean: 0.9, water: 0.9, sea: 0.85 },
  lionfish: { fish: 1.0, marine: 0.95, ocean: 0.9, water: 0.9 },
  pizza: { pizza: 1.0, food: 0.95, meal: 0.85, dish: 0.85 },
  food: { food: 1.0, meal: 0.9, dish: 0.9, pizza: 0.75, cooking: 0.75 },
  dog: { dog: 1.0, pet: 0.85, animal: 0.85, canine: 0.9 },
  cat: { cat: 1.0, pet: 0.85, animal: 0.85, feline: 0.9 },
  bird: { bird: 1.0, feather: 0.85, beak: 0.8, nature: 0.75 },
  wildlife: { wildlife: 1.0, animal: 0.9, nature: 0.8, outdoor: 0.8 },
  lion: { lion: 1.0, wildlife: 0.9, animal: 0.9 },
  tiger: { tiger: 1.0, wildlife: 0.9, animal: 0.9 },
  panda: { panda: 1.0, wildlife: 0.9, animal: 0.9, bear: 0.8 },
  car: { car: 1.0, vehicle: 0.9, road: 0.75, driving: 0.75 },
  airplane: { airplane: 1.0, jet: 0.9, flight: 0.9, flying: 0.85, sky: 0.8 },
  ship: { ship: 1.0, boat: 0.95, vessel: 0.9, water: 0.8, ocean: 0.8 },
  boat: { boat: 1.0, ship: 0.95, water: 0.85, ocean: 0.8 },
  bicycle: { bicycle: 1.0, bike: 0.95, cycling: 0.9, riding: 0.8 },
  mountain: { mountain: 1.0, peak: 0.9, nature: 0.8, outdoor: 0.8, alpine: 0.8 },
  beach: { beach: 1.0, coast: 0.9, ocean: 0.85, sea: 0.85, sand: 0.85, water: 0.85 },
  lake: { lake: 1.0, water: 0.9, nature: 0.85, outdoor: 0.8 },
  sports: { sports: 1.0, game: 0.9, player: 0.8, soccer: 0.75, football: 0.75 },
  architecture: { architecture: 1.0, building: 0.95, castle: 0.8, lighthouse: 0.8 }
};

// Synonyms and stem normalization helper
function tokenizeAndNormalize(text, filterStopwords = false) {
  const cleaned = String(text || "")
    .toLowerCase()
    .replace(/sea\s+lion/g, "sealion")
    .replace(/ice\s+cream/g, "icecream")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => Boolean(w) && (!filterStopwords || !TEMPLATE_STOPWORDS.has(w)));

  const expanded = [];
  for (const word of cleaned) {
    expanded.push(word);
    if (word.endsWith("s") && word.length > 3 && word !== "sports" && word !== "grass") {
      expanded.push(word.slice(0, -1));
    }
    if (word === "dogs" || word === "hound" || word === "puppies") expanded.push("dog");
    if (word === "cats" || word === "kitty") expanded.push("cat");
    if (word === "cars" || word === "auto" || word === "suv") expanded.push("car");
    if (word === "planes" || word === "aeroplane" || word === "airliner") expanded.push("airplane");
    if (word === "birds" || word === "parrot" || word === "sparrow") expanded.push("bird");
    if (word === "mountains" || word === "hills" || word === "alps" || word === "alp") expanded.push("mountain");
    if (word === "bicycles" || word === "biker" || word === "biking") expanded.push("bicycle");
    if (word === "chef" || word === "pizza" || word === "lunch" || word === "eating" || word === "burger" || word === "pizzas") expanded.push("food");
    if (word === "boats" || word === "yacht" || word === "ferry") expanded.push("ship");
    if (word === "match" || word === "ball" || word === "team" || word === "sport") expanded.push("sports");
    if (word === "fishes" || word === "goldfish" || word === "lionfish" || word === "aquarium") expanded.push("fish");
    if (word === "underwater" || word === "aquatic" || word === "fish" || word === "shark" || word === "jellyfish" || word === "sealion") expanded.push("marine");
  }
  return expanded;
}

// L2 Normalization: divides a 512-D vector by its Euclidean magnitude
function normalizeL2(vec) {
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) {
    sumSq += vec[i] * vec[i];
  }
  const norm = Math.sqrt(sumSq) || 1e-12;
  const out = new Float32Array(vec.length);
  for (let i = 0; i < vec.length; i++) {
    out[i] = vec[i] / norm;
  }
  return out;
}

// Explicit Cosine Similarity = Dot Product / Product of Magnitudes
function cosineSimilarity(vecA, vecB) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom > 0 ? dot / denom : 0;
}

// Construct a realistic 512-D CLIP-calibrated embedding from concept weights
function build512DEmbeddingFromConcepts(conceptWeights, seedString) {
  const vec = new Float32Array(EMBEDDING_DIM);

  // Shared background prior typical of CLIP's cone geometry
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    vec[i] = 0.032 * Math.sin(i * 0.73 + 1.1);
  }

  // Collapse concepts that map to the same basis slot so synonyms don't double-stack
  const slotWeights = {};
  for (const [concept, weight] of Object.entries(conceptWeights)) {
    const baseIdx = CONCEPT_BASIS_MAP[concept];
    if (baseIdx !== undefined) {
      slotWeights[baseIdx] = Math.max(slotWeights[baseIdx] || 0, weight);
    }
  }

  // Normalize total concept energy so 1-word and multi-word descriptions have balanced norms
  const activeIndices = Object.keys(slotWeights);
  const energyScale = activeIndices.length > 0 ? Math.min(1.15, 2.0 / Math.sqrt(activeIndices.length)) : 1.0;

  // Inject semantic concept energy across orthogonal 3-dimensional subspaces in 0..479
  for (const baseIdxStr of activeIndices) {
    const baseIdx = Number(baseIdxStr);
    const weight = slotWeights[baseIdx] * energyScale;
    const slot = (baseIdx * 3) % CONCEPT_CUTOFF;
    vec[slot] += weight * 0.58;
    vec[slot + 1] += weight * 0.44;
    vec[slot + 2] += weight * 0.34;
  }

  // Deterministic fine-grained hash signature in 480..511 (never overlaps concept slots)
  let hash = 2166136261;
  for (let c = 0; c < seedString.length; c++) {
    hash ^= seedString.charCodeAt(c);
    hash = Math.imul(hash, 16777619);
  }
  for (let i = CONCEPT_CUTOFF; i < EMBEDDING_DIM; i++) {
    const pseudo = Math.sin(hash * 0.0001 + i * 1.7) * 0.015;
    vec[i] += pseudo;
  }

  return normalizeL2(vec);
}

// Encode any natural language prompt into a 512-D L2-normalized CLIP text embedding
function encodeTextPrompt(promptText) {
  const tokens = tokenizeAndNormalize(promptText, true);
  const weights = {};

  for (const t of tokens) {
    if (CONCEPT_BASIS_MAP[t] !== undefined) {
      weights[t] = Math.max(weights[t] || 0, 1.0);
    }
    if (SEMANTIC_RELATIONS[t]) {
      for (const [relConcept, relWeight] of Object.entries(SEMANTIC_RELATIONS[t])) {
        weights[relConcept] = Math.max(weights[relConcept] || 0, relWeight);
      }
    }
  }

  const lower = String(promptText || "").toLowerCase();
  const vec = build512DEmbeddingFromConcepts(weights, lower);

  // Calibrate text-to-image scaling across all concept slots (0..479) and tail (480..511)
  for (let i = 0; i < CONCEPT_CUTOFF; i++) {
    vec[i] *= 0.52;
  }
  for (let i = CONCEPT_CUTOFF; i < EMBEDDING_DIM; i++) {
    vec[i] += 0.08 * Math.cos(i * 0.51);
  }
  return normalizeL2(vec);
}

// Initialize embeddings for all dataset items, automatically enriching missing category/title concepts
function initializeDatasetEmbeddings() {
  for (const item of DATASET_ITEMS) {
    const enriched = Object.assign({}, item.concepts || {});
    const cat = String(item.category || "").toLowerCase().trim();

    if (cat && CONCEPT_BASIS_MAP[cat] !== undefined) {
      enriched[cat] = 1.0;
    }
    if (cat && SEMANTIC_RELATIONS[cat]) {
      for (const [relConcept, relWeight] of Object.entries(SEMANTIC_RELATIONS[cat])) {
        enriched[relConcept] = Math.max(enriched[relConcept] || 0, relWeight * 0.85);
      }
    }

    const titleTokens = tokenizeAndNormalize(item.title, true);
    for (const t of titleTokens) {
      if (CONCEPT_BASIS_MAP[t] !== undefined) {
        enriched[t] = Math.max(enriched[t] || 0, 0.95);
      }
      if (SEMANTIC_RELATIONS[t]) {
        for (const [relConcept, relWeight] of Object.entries(SEMANTIC_RELATIONS[t])) {
          enriched[relConcept] = Math.max(enriched[relConcept] || 0, relWeight * 0.85);
        }
      }
    }

    item.concepts = enriched;
    item.embedding = build512DEmbeddingFromConcepts(enriched, item.id + item.caption);
  }
}
initializeDatasetEmbeddings();