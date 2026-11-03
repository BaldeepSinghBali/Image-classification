// =========================================================================
// engine.js — 512-D CLIP Embedding Engine (Deterministic Unit Vectors)
// Depends on: data.js
// =========================================================================
    // =========================================================================
    // 2. 512-D MULTIMODAL EMBEDDING SPACE ENGINE (Deterministic Unit Vectors)
    // =========================================================================
    const EMBEDDING_DIM = 512;

    // Canonical semantic basis concepts mapped across the 512 dimensions
    // Canonical semantic basis concepts mapped across the 512 dimensions
    const CONCEPT_BASIS_MAP = {
      dog: 0, puppy: 0, retriever: 1, labrador: 2, Bark: 0, canine: 0, husky: 3, pug: 0,
      cat: 4, kitten: 4, tabby: 5, feline: 4,
      pet: 8, animal: 9, wildlife: 10,
      car: 14, automobile: 14, sedan: 15, vehicle: 16, truck: 17, driving: 18,
      airplane: 22, plane: 22, aircraft: 22, jet: 23, flight: 24, aviation: 24, flying: 25, cloud: 26,
      bird: 30, kingfisher: 31, feather: 30, beak: 30, macaw: 30, toucan: 32, robin: 33, ostrich: 34, peacock: 35, flamingo: 35, eagle: 30,
      mountain: 36, peak: 36, snow: 37, lake: 38, alpine: 37, landscape: 39, volcano: 36,
      bicycle: 42, bike: 42, cycling: 43, cyclist: 43, riding: 44, moped: 42, motorcycle: 42,
      food: 48, pasta: 49, cooking: 50, cook: 50, meal: 48, dish: 48, kitchen: 51, vegetable: 52, tomato: 52, dinner: 48, skillet: 51, pizza: 49, burger: 48, cheeseburger: 48, hotdog: 48, espresso: 50, coffee: 50,
      sports: 56, soccer: 57, football: 57, player: 58, athlete: 58, stadium: 59, game: 56, basketball: 56, tennis: 56, baseball: 56, rugby: 56,
      ship: 64, boat: 64, sailboat: 65, vessel: 64, sailing: 65, speedboat: 64,
      beach: 70, ocean: 71, sea: 71, water: 72, sand: 70, coast: 70,
      grass: 76, park: 77, tree: 78, branch: 79, forest: 78, nature: 80, outdoor: 81, flower: 82,
      city: 84, street: 85, road: 86, highway: 86, building: 87, indoor: 88, window: 89, castle: 87, lighthouse: 87, beacon: 87,
      person: 92, people: 92, group: 93, running: 94, sitting: 95,
      red: 100, blue: 101, green: 102, yellow: 103, orange: 104, white: 105, black: 106, silver: 107, golden: 103, sky: 108,
      shark: 110, fish: 111, coral: 112, aquatic: 113, marine: 113,
      lion: 114, tiger: 115, cheetah: 116, leopard: 117,
      panda: 118, elephant: 119, zebra: 120, koala: 121,
      chimp: 122, monkey: 122, ape: 122, gorilla: 122, camel: 123, bear: 124, fox: 125
    };

    // Synonyms and stem normalization helper
    function tokenizeAndNormalize(text) {
      const cleaned = String(text || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean);

      const expanded = [];
      for (const word of cleaned) {
        expanded.push(word);
        if (word.endsWith("s") && word.length > 3) {
          expanded.push(word.slice(0, -1));
        }
        if (word === "dogs" || word === "hound" || word === "puppies") expanded.push("dog");
        if (word === "cats" || word === "kitty") expanded.push("cat");
        if (word === "cars" || word === "auto" || word === "suv") expanded.push("car");
        if (word === "planes" || word === "aeroplane" || word === "airliner") expanded.push("airplane");
        if (word === "birds" || word === "parrot" || word === "sparrow") expanded.push("bird");
        if (word === "mountains" || word === "hills" || word === "alps") expanded.push("mountain");
        if (word === "bicycles" || word === "biker" || word === "biking") expanded.push("bicycle");
        if (word === "chef" || word === "pizza" || word === "lunch" || word === "eating" || word === "burger" || word === "pizzas") expanded.push("food");
        if (word === "boats" || word === "yacht" || word === "ferry") expanded.push("ship");
        if (word === "match" || word === "ball" || word === "team") expanded.push("sports");
        if (word === "sharks") expanded.push("shark");
        if (word === "lions") expanded.push("lion");
        if (word === "tigers") expanded.push("tiger");
        if (word === "pandas") expanded.push("panda");
        if (word === "elephants") expanded.push("elephant");
        if (word === "zebras") expanded.push("zebra");
        if (word === "camels") expanded.push("camel");
        if (word === "bears") expanded.push("bear");
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
      // Shared background prior typical of CLIP's cone geometry (produces ~0.16 baseline similarity)
      for (let i = 0; i < EMBEDDING_DIM; i++) {
        vec[i] = 0.032 * Math.sin(i * 0.73 + 1.1);
      }

      // Inject semantic concept energy across orthogonal 4-dimensional subspaces
      for (const [concept, weight] of Object.entries(conceptWeights)) {
        const baseIdx = CONCEPT_BASIS_MAP[concept];
        if (baseIdx !== undefined) {
          const slot = (baseIdx * 4) % (EMBEDDING_DIM - 8);
          vec[slot] += weight * 0.55;
          vec[slot + 1] += weight * 0.42;
          vec[slot + 2] += weight * 0.35;
          vec[slot + 3] += weight * 0.28;
        }
      }

      // Deterministic fine-grained hash signature for unique text/image identity
      let hash = 2166136261;
      for (let c = 0; c < seedString.length; c++) {
        hash ^= seedString.charCodeAt(c);
        hash = Math.imul(hash, 16777619);
      }
      for (let i = 440; i < EMBEDDING_DIM; i++) {
        const pseudo = Math.sin(hash * 0.0001 + i * 1.7) * 0.025;
        vec[i] += pseudo;
      }

      return normalizeL2(vec);
    }

    // Encode any natural language prompt into a 512-D L2-normalized CLIP text embedding
    function encodeTextPrompt(promptText) {
      const tokens = tokenizeAndNormalize(promptText);
      const weights = {};
      for (const t of tokens) {
        if (CONCEPT_BASIS_MAP[t] !== undefined) {
          weights[t] = Math.min(1.2, (weights[t] || 0) + 0.85);
        }
      }
      // Also check substring matches for compound words
      const lower = String(promptText || "").toLowerCase();
      for (const key of Object.keys(CONCEPT_BASIS_MAP)) {
        if (lower.includes(key) && !weights[key]) {
          weights[key] = 0.75;
        }
      }
      // Calibrate text-to-image scaling so raw cosine similarities match CLIP ViT-B/32 range (~0.18 - 0.36)
      const vec = build512DEmbeddingFromConcepts(weights, lower);
      for (let i = 0; i < 440; i++) {
        vec[i] *= 0.44;
      }
      for (let i = 440; i < EMBEDDING_DIM; i++) {
        vec[i] += 0.11 * Math.cos(i * 0.51);
      }
      return normalizeL2(vec);
    }

    // Initialize embeddings for all dataset items
    function initializeDatasetEmbeddings() {
      for (const item of DATASET_ITEMS) {
        item.embedding = build512DEmbeddingFromConcepts(item.concepts, item.id + item.caption);
      }
    }
    initializeDatasetEmbeddings();
