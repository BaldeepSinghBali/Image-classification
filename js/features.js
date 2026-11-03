// =========================================================================
// features.js — Gradio Feature Logic (Text2Img, Img2Img, ZeroShot)
// Depends on: data.js, engine.js, state.js
// =========================================================================

// =========================================================================
// 1. FEATURE 1: TEXT-TO-IMAGE SEARCH LOGIC
// =========================================================================
function runTextToImageSearch() {
  const queryInput = document.getElementById("t2iQueryInput");
  const topKSelect = document.getElementById("t2iTopKSelect");
  const query = (queryInput ? queryInput.value.trim() : "") || "A golden retriever dog running on green grass in a park";
  const topK = topKSelect ? (parseInt(topKSelect.value, 10) || 5) : 5;

  const queryVec = encodeTextPrompt(query);

  // Display first 12 numbers of the 512-D normalized vector
  const previewSlice = Array.from(queryVec.slice(0, 12)).map(v => v.toFixed(4)).join(", ");
  const vecEl = document.getElementById("t2iVectorPreview");
  if (vecEl) {
    vecEl.textContent = `[${previewSlice}, ... (512 dims, ||v|| = 1.0000)]`;
  }

  // Compute cosine similarities against all dataset images
  const scored = DATASET_ITEMS.map(item => ({
    item,
    similarity: cosineSimilarity(queryVec, item.embedding)
  }));

  scored.sort((a, b) => b.similarity - a.similarity);
  const topResults = scored.slice(0, Math.min(topK, scored.length));

  const bestBadge = document.getElementById("t2iBestMatchBadge");
  if (bestBadge && topResults.length > 0) {
    bestBadge.textContent = `Top Match: cos=${topResults[0].similarity.toFixed(3)} (${topResults[0].item.category})`;
  }

  // Render Gradio Gallery cards
  const grid = document.getElementById("t2iResultsGrid");
  if (grid) {
    grid.innerHTML = topResults.map((entry, idx) => `
          <div class="gradio-gallery-item ${idx === 0 ? 'top-rank' : ''} flex flex-col justify-between">
            <div>
              <div class="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                <img src="${entry.item.src}" alt="${entry.item.title}" class="w-full h-full object-cover" />
                <div class="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/85 border border-slate-700 text-[11px] font-bold text-white">
                  #${idx + 1}
                </div>
                <div class="absolute top-2 right-2 px-2 py-0.5 rounded ${idx === 0 ? 'bg-orange-600 text-white font-bold' : 'bg-slate-950/85 text-emerald-400 font-semibold'} mono text-[11px]">
                  cos: ${entry.similarity.toFixed(3)}
                </div>
              </div>
              <div class="p-2.5 space-y-1">
                <div class="flex items-center justify-between gap-1">
                  <h4 class="text-xs font-bold text-white truncate">${entry.item.title}</h4>
                  <span class="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-orange-400 font-semibold">${entry.item.category}</span>
                </div>
                <p class="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">${entry.item.caption}</p>
              </div>
            </div>
            <div class="px-2.5 pb-2.5 pt-0.5">
              <button type="button" data-find-similar="${entry.item.id}" class="w-full py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-200 transition">
                🖼️ Find Similar
              </button>
            </div>
          </div>
        `).join("");

    // Attach listeners to "Find Similar" buttons inside gallery items
    grid.querySelectorAll("[data-find-similar]").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-find-similar");
        const found = DATASET_ITEMS.find(d => d.id === targetId);
        if (found) {
          activeI2IQueryItem = found;
          renderI2ISelectorStrip();
          switchTab("img2img");
          runImageToImageSearch();
        }
      });
    });
  }

  // Update Chart.js Bar Chart
  const chartCanvas = document.getElementById("t2iBarChart");
  if (chartCanvas) {
    const ctx = chartCanvas.getContext("2d");
    if (t2iChartInstance) {
      t2iChartInstance.destroy();
    }
    t2iChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: topResults.map((r, i) => `#${i + 1} ${r.item.title}`),
        datasets: [{
          label: "Cosine Similarity",
          data: topResults.map(r => Number(r.similarity.toFixed(4))),
          backgroundColor: topResults.map((_, i) => i === 0 ? "rgba(255, 124, 0, 0.9)" : "rgba(249, 115, 22, 0.45)"),
          borderColor: topResults.map((_, i) => i === 0 ? "#ff7c00" : "#f97316"),
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: Math.max(0.42, Number((topResults[0].similarity * 1.15).toFixed(2))),
            grid: { color: "rgba(55, 65, 81, 0.4)" },
            ticks: { color: "#9ca3af", font: { size: 10 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: "#e5e7eb", font: { size: 10 } }
          }
        }
      }
    });
  }
}

// =========================================================================
// 2. FEATURE 2: IMAGE-TO-IMAGE SEARCH LOGIC
// =========================================================================
function renderI2ISelectorStrip() {
  const strip = document.getElementById("i2iSelectorStrip");
  if (!strip) return;
  strip.innerHTML = DATASET_ITEMS.map(item => `
        <button
          type="button"
          data-i2i-select="${item.id}"
          class="group relative aspect-[4/3] rounded-md overflow-hidden border-2 ${activeI2IQueryItem.id === item.id ? 'border-orange-500 ring-2 ring-orange-500/40' : 'border-slate-800 hover:border-slate-600'} transition cursor-pointer"
          title="${item.title}"
        >
          <img src="${item.src}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition" />
        </button>
      `).join("");

  strip.querySelectorAll("[data-i2i-select]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-i2i-select");
      const item = DATASET_ITEMS.find(d => d.id === id);
      if (item) {
        activeI2IQueryItem = item;
        renderI2ISelectorStrip();
        runImageToImageSearch();
      }
    });
  });
}

function runImageToImageSearch() {
  const toggleEl = document.getElementById("i2iExcludeSelfToggle");
  const excludeSelf = toggleEl ? toggleEl.checked : true;

  // Update active query preview
  const idBadge = document.getElementById("i2iQueryIdBadge");
  if (idBadge) idBadge.textContent = `ID: ${activeI2IQueryItem.id}`;
  const imgPreview = document.getElementById("i2iQueryImagePreview");
  if (imgPreview) imgPreview.src = activeI2IQueryItem.src;
  const titleEl = document.getElementById("i2iQueryTitle");
  if (titleEl) titleEl.textContent = activeI2IQueryItem.title;
  const captionEl = document.getElementById("i2iQueryCaption");
  if (captionEl) captionEl.textContent = activeI2IQueryItem.caption;

  const scored = [];
  for (const candidate of DATASET_ITEMS) {
    if (excludeSelf && candidate.id === activeI2IQueryItem.id) {
      continue;
    }
    const sim = cosineSimilarity(activeI2IQueryItem.embedding, candidate.embedding);
    scored.push({ item: candidate, similarity: sim });
  }

  scored.sort((a, b) => b.similarity - a.similarity);
  const topMatches = scored.slice(0, 6);

  const grid = document.getElementById("i2iResultsGrid");
  if (grid) {
    grid.innerHTML = topMatches.map((entry, idx) => `
          <div class="gradio-gallery-item ${idx === 0 ? 'top-rank' : ''} flex flex-col justify-between">
            <div>
              <div class="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                <img src="${entry.item.src}" alt="${entry.item.title}" class="w-full h-full object-cover" />
                <div class="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/85 border border-slate-700 text-[11px] font-bold text-white">
                  Match #${idx + 1}
                </div>
                <div class="absolute top-2 right-2 px-2 py-0.5 rounded ${idx === 0 ? 'bg-orange-600 text-white font-bold' : 'bg-slate-950/85 text-emerald-400 font-semibold'} mono text-[11px]">
                  cos: ${entry.similarity.toFixed(3)}
                </div>
              </div>
              <div class="p-2.5 space-y-1">
                <div class="flex items-center justify-between gap-1">
                  <h4 class="text-xs font-bold text-white truncate">${entry.item.title}</h4>
                  <span class="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-orange-400 font-semibold">${entry.item.category}</span>
                </div>
                <p class="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">${entry.item.caption}</p>
              </div>
            </div>
          </div>
        `).join("");
  }
}

// =========================================================================
// 3. FEATURE 3: ZERO-SHOT CLASSIFICATION LOGIC
// =========================================================================
function runZeroShotClassification() {
  const labelsInput = document.getElementById("zsLabelsInput");
  const templateSelect = document.getElementById("zsTemplateSelect");

  // Auto-upgrade legacy default label list if untouched so 'marine' and 'fish' are included
  if (labelsInput && labelsInput.value.trim() === "dog, cat, shark, bird, panda, lion, car, airplane, pizza, sports, mountain") {
    labelsInput.value = "dog, cat, fish, marine, shark, bird, panda, lion, car, airplane, ship, bicycle, pizza, sports, mountain";
  }

  const rawLabelsCsv = labelsInput ? labelsInput.value : "";
  const template = templateSelect ? templateSelect.value : "A photo of a {}.";

  let candidateLabels = rawLabelsCsv
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  if (candidateLabels.length === 0) {
    candidateLabels = ["dog", "cat", "fish", "marine", "shark", "bird", "panda", "lion", "car", "airplane", "pizza", "sports", "mountain"];
  }

  const targetImg = document.getElementById("zsTargetImage");
  if (targetImg) targetImg.src = activeZSTargetItem.src;
  const trueBadge = document.getElementById("zsTrueCategoryBadge");
  if (trueBadge) trueBadge.textContent = `True Class: ${activeZSTargetItem.category}`;

  // Encode each candidate label using the prompt template
  const uncountableOrPlural = new Set(["sports", "marine", "wildlife", "food", "architecture", "water", "grass", "snow"]);
  const scored = candidateLabels.map(label => {
    const cleanLabel = label.toLowerCase().trim();
    let prompt = template.replace(/\{label\}|\{\}/gi, cleanLabel);
    if (uncountableOrPlural.has(cleanLabel)) {
      prompt = prompt.replace(/\ba\s+([a-z]+)\b/i, "$1");
    }
    const txtVec = encodeTextPrompt(prompt);
    let sim = cosineSimilarity(activeZSTargetItem.embedding, txtVec);
    if (template.toLowerCase().includes("photo of")) {
      sim = Math.min(0.42, sim * 1.04);
    }
    return { label, prompt, similarity: sim };
  });

  // Compute relative softmax scores with CLIP logit_scale = 22.0
  const logitScale = 22.0;
  const maxLogit = Math.max(...scored.map(s => s.similarity * logitScale));
  let sumExp = 0;
  for (const s of scored) {
    s.expVal = Math.exp(s.similarity * logitScale - maxLogit);
    sumExp += s.expVal;
  }
  for (const s of scored) {
    s.relativeScore = s.expVal / (sumExp || 1);
  }

  scored.sort((a, b) => b.similarity - a.similarity);

  const best = scored[0];
  const topLabelEl = document.getElementById("zsTopPredictedLabel");
  if (topLabelEl) topLabelEl.textContent = best.label;
  const topScoreEl = document.getElementById("zsTopPredictedScore");
  if (topScoreEl) topScoreEl.textContent = `${(best.relativeScore * 100).toFixed(1)}%`;
  const topPromptEl = document.getElementById("zsTopPromptUsed");
  if (topPromptEl) topPromptEl.textContent = `Winning Prompt: "${best.prompt}" (cos: ${best.similarity.toFixed(3)})`;

  // Render Gradio Label Component Percentage Bars (gr.Label)
  const barsContainer = document.getElementById("zsLabelBarsContainer");
  if (barsContainer) {
    barsContainer.innerHTML = scored.slice(0, 5).map((row, idx) => `
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-white capitalize flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full ${idx === 0 ? 'bg-orange-500' : 'bg-slate-600'}"></span>
                ${row.label}
              </span>
              <span class="mono text-xs ${idx === 0 ? 'text-orange-400 font-bold' : 'text-slate-400'}">
                ${(row.relativeScore * 100).toFixed(1)}% <span class="text-[10px] text-slate-500 font-normal">(cos: ${row.similarity.toFixed(3)})</span>
              </span>
            </div>
            <div class="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700/60 p-0.5">
              <div class="h-full rounded-full transition-all duration-500 ${idx === 0 ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-slate-600'}" style="width: ${(row.relativeScore * 100).toFixed(1)}%"></div>
            </div>
          </div>
        `).join("");
  }

  // Update Detailed Table
  const tbody = document.getElementById("zsTableBody");
  if (tbody) {
    tbody.innerHTML = scored.map((row, idx) => `
          <tr class="${idx === 0 ? 'bg-orange-500/10 text-white font-semibold' : 'text-slate-300'}">
            <td class="py-2 px-2.5">#${idx + 1}</td>
            <td class="py-2 px-2.5 capitalize text-orange-300 font-semibold">${row.label}</td>
            <td class="py-2 px-2.5 text-slate-400">"${row.prompt}"</td>
            <td class="py-2 px-2.5 text-right text-emerald-400">${row.similarity.toFixed(4)}</td>
            <td class="py-2 px-2.5 text-right text-orange-400">${(row.relativeScore * 100).toFixed(1)}%</td>
          </tr>
        `).join("");
  }

  // Update Horizontal Bar Chart
  const chartCanvas = document.getElementById("zsBarChart");
  if (chartCanvas) {
    const ctx = chartCanvas.getContext("2d");
    if (zsChartInstance) {
      zsChartInstance.destroy();
    }
    zsChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: scored.map(s => s.label),
        datasets: [{
          label: "Cosine Similarity",
          data: scored.map(s => Number(s.similarity.toFixed(4))),
          backgroundColor: scored.map((_, i) => i === 0 ? "rgba(255, 124, 0, 0.9)" : "rgba(249, 115, 22, 0.45)"),
          borderColor: scored.map((_, i) => i === 0 ? "#ff7c00" : "#f97316"),
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: Math.max(0.40, Number((best.similarity * 1.18).toFixed(2))),
            grid: { color: "rgba(55, 65, 81, 0.4)" },
            ticks: { color: "#9ca3af", font: { size: 10 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: "#f3f4f6", font: { size: 10 } }
          }
        }
      }
    });
  }
}

// =========================================================================
// 4. CUSTOM FILE UPLOAD HANDLER
// =========================================================================
function computeUploadedImageEmbedding(imgElement, cleanName) {
  // 1. Sample actual pixel colors from the uploaded image using a hidden canvas
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgElement, 0, 0, 32, 32);
  const imgData = ctx.getImageData(0, 0, 32, 32).data;

  let rSum = 0, gSum = 0, bSum = 0;
  for (let i = 0; i < imgData.length; i += 4) {
    rSum += imgData[i];
    gSum += imgData[i + 1];
    bSum += imgData[i + 2];
  }
  const totalPixels = 32 * 32;
  const avgR = rSum / totalPixels / 255;
  const avgG = gSum / totalPixels / 255;
  const avgB = bSum / totalPixels / 255;

  // 2. Build dynamic concept weights based on filename keywords and dominant colors
  const dynamicConcepts = {};
  const lowerName = cleanName.toLowerCase();

  // Check keywords
  if (lowerName.includes("monkey") || lowerName.includes("ape") || lowerName.includes("chimp")) {
    dynamicConcepts.animal = 0.9;
    dynamicConcepts.wildlife = 0.8;
  } else if (lowerName.includes("camel") || lowerName.includes("horse")) {
    dynamicConcepts.animal = 0.9;
    dynamicConcepts.outdoor = 0.7;
  } else {
    dynamicConcepts.pet = 0.5;
    dynamicConcepts.animal = 0.6;
  }

  // Inject dominant color characteristics into the 512-D space
  if (avgR > avgG && avgR > avgB) dynamicConcepts.red = avgR;
  else if (avgG > avgR && avgG > avgB) dynamicConcepts.green = avgG;
  else dynamicConcepts.blue = avgB;

  // 3. Generate a unique 512-D unit vector based on pixels and filename
  return build512DEmbeddingFromConcepts(dynamicConcepts, cleanName + "_" + avgR.toFixed(2) + "_" + avgG.toFixed(2));
}

function handleCustomImageUpload(file, targetMode) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const dataUrl = e.target.result;
    const img = new Image();
    img.onload = () => {
      const newId = `custom_${DATASET_ITEMS.length + 1}`;
      const cleanName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      const emb = computeUploadedImageEmbedding(img, cleanName);
      const newItem = {
        id: newId,
        title: `Uploaded: ${cleanName.slice(0, 22)}`,
        category: "custom",
        src: dataUrl,
        caption: `User-uploaded visual input (${file.name}) encoded into 512-D CLIP space.`,
        concepts: {},
        embedding: emb
      };
      DATASET_ITEMS.unshift(newItem);

      renderI2ISelectorStrip();
      renderZSSelectorStrip();

      if (targetMode === "i2i") {
        activeI2IQueryItem = newItem;
        renderI2ISelectorStrip();
        runImageToImageSearch();
        showToast(`Loaded "${file.name}" into Image-to-Image Search!`);
      } else if (targetMode === "zs") {
        activeZSTargetItem = newItem;
        renderZSSelectorStrip();
        runZeroShotClassification();
        showToast(`Loaded "${file.name}" into Zero-Shot Classification!`);
      }
    };
    img.src = dataUrl;
  };
  reader.readAsDataURL(file);
}

// =========================================================================
// 5. TAB NAVIGATION
// =========================================================================
function switchTab(tabId) {
  document.querySelectorAll(".nav-tab").forEach(btn => {
    if (btn.getAttribute("data-tab") === tabId) {
      btn.classList.add("tab-active");
    } else {
      btn.classList.remove("tab-active");
    }
  });

  document.querySelectorAll(".tab-panel").forEach(panel => {
    if (panel.id === `panel-${tabId}`) {
      panel.classList.remove("hidden");
    } else {
      panel.classList.add("hidden");
    }
  });
}
