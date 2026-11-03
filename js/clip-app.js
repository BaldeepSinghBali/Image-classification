import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';

// Browser-only inference: no API key or Python server is required.
env.allowLocalModels = false;
env.useBrowserCache = true;

const MODEL_ID = 'Xenova/clip-vit-base-patch32';
let classifierPromise = null;
let uploadedImageUrl = { image: null, zero: null };
const $ = (id) => document.getElementById(id);

function setMessage(text, isError = false) {
  const el = $('message');
  el.textContent = text;
  el.classList.remove('hidden', 'text-red-300', 'text-emerald-300', 'text-slate-200');
  el.classList.add(isError ? 'text-red-300' : 'text-slate-200');
}
function clearMessage() { $('message').classList.add('hidden'); }
function setBusy(button, busy, label) {
  button.disabled = busy;
  button.innerHTML = busy ? `<span class="spinner"></span> ${label || 'Running CLIP…'}` : label;
}
async function getClassifier() {
  if (!classifierPromise) {
    $('modelStatus').textContent = 'Downloading model…';
    $('modelStatus').className = 'text-sm font-semibold text-amber-300 mt-1';
    $('modelDetail').textContent = 'First load is large (roughly 150 MB). Keep this tab open.';
    classifierPromise = pipeline('zero-shot-image-classification', MODEL_ID, {
      progress_callback: (p) => {
        if (p && p.status === 'progress' && Number.isFinite(p.progress)) {
          $('modelDetail').textContent = `${p.file || 'Model file'}: ${Math.round(p.progress)}%`;
        } else if (p && p.status === 'done') {
          $('modelDetail').textContent = 'Model files downloaded.';
        }
      }
    });
  }
  try {
    const model = await classifierPromise;
    $('modelStatus').textContent = 'Ready';
    $('modelStatus').className = 'text-sm font-semibold text-emerald-300 mt-1';
    $('modelDetail').textContent = 'CLIP is running in this browser.';
    return model;
  } catch (err) {
    classifierPromise = null;
    $('modelStatus').textContent = 'Load failed';
    $('modelStatus').className = 'text-sm font-semibold text-red-300 mt-1';
    $('modelDetail').textContent = 'Check your connection, then try again.';
    throw err;
  }
}
function toAbsoluteImagePath(src) { return new URL(src, document.baseURI).href; }
function scoreForLabel(output, label) {
  const found = output.find((item) => item.label === label);
  return found ? found.score : 0;
}
function normalizeOutput(result) {
  // Transformers.js returns a list for one image and a list-of-lists for a batch.
  if (!Array.isArray(result)) return [];
  if (result.length && Array.isArray(result[0])) return result;
  return [result];
}
function renderCards(targetId, rows) {
  const target = $(targetId);
  if (!rows.length) { target.innerHTML = '<p class="text-sm text-slate-500">No results.</p>'; return; }
  target.innerHTML = rows.map((row, index) => {
    const score = Math.max(0, Math.min(1, row.score || 0));
    const item = row.item;
    return `<article class="result-card">
      <img loading="lazy" src="${toAbsoluteImagePath(item.src)}" alt="${escapeHtml(item.title)}" />
      <div class="p-3">
        <div class="flex items-start justify-between gap-2"><h3 class="text-sm font-bold text-slate-100">${escapeHtml(item.title)}</h3><span class="text-xs text-orange-300 font-bold whitespace-nowrap">${(score * 100).toFixed(1)}%</span></div>
        <p class="text-xs text-slate-500 mt-1">${escapeHtml(item.caption || item.category || '')}</p>
        <div class="meter mt-3"><span style="width:${score * 100}%"></span></div>
      </div>
    </article>`;
  }).join('');
}
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
async function runTextSearch() {
  const prompt = $('textQuery').value.trim();
  if (!prompt) { setMessage('Enter a text prompt first.', true); return; }
  const button = $('textSearch'); clearMessage(); setBusy(button, true, 'Searching gallery…');
  $('textResults').innerHTML = '<p class="text-sm text-slate-400"><span class="spinner"></span> Loading CLIP and scoring gallery images…</p>';
  try {
    const model = await getClassifier();
    const imageUrls = DATASET_ITEMS.map((item) => toAbsoluteImagePath(item.src));
    // Score each gallery image against the user's prompt and a contrasting negative prompt.
    // Both labels are evaluated by the real CLIP image/text model.
    const negative = `an image that does not show ${prompt}`;
    const results = [];
    // Process small batches to keep browser memory use reasonable.
    const batchSize = 4;
    for (let start = 0; start < DATASET_ITEMS.length; start += batchSize) {
      const batchItems = DATASET_ITEMS.slice(start, start + batchSize);
      const batchUrls = imageUrls.slice(start, start + batchSize);
      const batchOutput = normalizeOutput(await model(batchUrls, [prompt, negative]));
      batchOutput.forEach((out, idx) => results.push({ item: batchItems[idx], score: scoreForLabel(out, prompt) }));
      $('textCount').textContent = `${Math.min(start + batchItems.length, DATASET_ITEMS.length)} / ${DATASET_ITEMS.length} scored`;
    }
    results.sort((a, b) => b.score - a.score);
    const topK = Number($('textTopK').value) || 5;
    renderCards('textResults', results.slice(0, topK));
    $('textCount').textContent = `${results.length} images scored`;
    setMessage('Search complete. Rankings use real CLIP image–text inference in your browser.');
  } catch (err) {
    console.error(err); $('textResults').innerHTML = '';
    setMessage(`CLIP search failed: ${err?.message || err}. Try refreshing the page or opening it over HTTPS.`, true);
  } finally { setBusy(button, false, 'Search gallery'); }
}
async function runImageSearch() {
  const url = uploadedImageUrl.image;
  if (!url) { setMessage('Choose an image first.', true); return; }
  const button = $('imageSearch'); clearMessage(); setBusy(button, true, 'Comparing captions…');
  $('imageResults').innerHTML = '<p class="text-sm text-slate-400"><span class="spinner"></span> Comparing your image with gallery captions…</p>';
  try {
    const model = await getClassifier();
    const labels = DATASET_ITEMS.map((item) => `a photo of ${item.title}. ${item.caption || ''}`);
    const output = await model(url, labels);
    const rows = output.map((entry) => ({ item: DATASET_ITEMS[labels.indexOf(entry.label)], score: entry.score })).filter((row) => row.item);
    rows.sort((a, b) => b.score - a.score);
    renderCards('imageResults', rows.slice(0, Number($('imageTopK').value) || 5));
    setMessage('Image search complete. This browser-only version ranks gallery captions against your image using CLIP.');
  } catch (err) {
    console.error(err); $('imageResults').innerHTML = '';
    setMessage(`Image search failed: ${err?.message || err}`, true);
  } finally { setBusy(button, false, 'Find similar images'); }
}
async function runZeroShot() {
  const url = uploadedImageUrl.zero;
  const labels = $('zeroLabels').value.split(',').map((x) => x.trim()).filter(Boolean);
  if (!url) { setMessage('Choose an image first.', true); return; }
  if (labels.length < 2) { setMessage('Enter at least two comma-separated labels.', true); return; }
  const button = $('zeroClassify'); clearMessage(); setBusy(button, true, 'Classifying…');
  $('zeroResults').innerHTML = '<p class="text-sm text-slate-400"><span class="spinner"></span> Running zero-shot classification…</p>';
  try {
    const model = await getClassifier();
    const output = await model(url, labels);
    $('zeroResults').innerHTML = output.map((item) => `<div><div class="flex justify-between gap-3 text-sm mb-2"><span class="text-slate-100 font-semibold">${escapeHtml(item.label)}</span><span class="text-orange-300 font-bold">${(item.score * 100).toFixed(2)}%</span></div><div class="meter"><span style="width:${Math.max(0, Math.min(1, item.score)) * 100}%"></span></div></div>`).join('');
    setMessage('Classification complete. Scores are relative to the candidate labels you entered.');
  } catch (err) {
    console.error(err); $('zeroResults').innerHTML = '';
    setMessage(`Classification failed: ${err?.message || err}`, true);
  } finally { setBusy(button, false, 'Classify image'); }
}
function attachUpload(inputId, previewId, key, buttonId) {
  $(inputId).addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (uploadedImageUrl[key]) URL.revokeObjectURL(uploadedImageUrl[key]);
    uploadedImageUrl[key] = URL.createObjectURL(file);
    const preview = $(previewId); preview.src = uploadedImageUrl[key]; preview.classList.remove('hidden');
    $(buttonId).disabled = false; clearMessage();
  });
}

document.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('active', b === button));
  document.querySelectorAll('.tab-content').forEach((panel) => panel.classList.add('hidden'));
  $(`tab-${button.dataset.tab}`).classList.remove('hidden');
}));
$('textSearch').addEventListener('click', runTextSearch);
$('textQuery').addEventListener('keydown', (event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); runTextSearch(); } });
document.querySelectorAll('.example').forEach((button) => button.addEventListener('click', () => { $('textQuery').value = button.dataset.prompt; runTextSearch(); }));
$('imageSearch').addEventListener('click', runImageSearch);
$('zeroClassify').addEventListener('click', runZeroShot);
attachUpload('imageFile', 'imagePreview', 'image', 'imageSearch');
attachUpload('zeroFile', 'zeroPreview', 'zero', 'zeroClassify');
