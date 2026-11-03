// =========================================================================
// main.js — Event Listeners & Gradio App Initialization
// Depends on: features.js, state.js
// =========================================================================

window.addEventListener("DOMContentLoaded", () => {
  // 1. Gradio Tab Navigation
  document.querySelectorAll(".nav-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      switchTab(tabId);
    });
  });

  // 2. Feature 1: Text-to-Image Controls
  const t2iSearchBtn = document.getElementById("t2iSearchBtn");
  if (t2iSearchBtn) t2iSearchBtn.addEventListener("click", runTextToImageSearch);

  const t2iTopKSelect = document.getElementById("t2iTopKSelect");
  if (t2iTopKSelect) t2iTopKSelect.addEventListener("change", runTextToImageSearch);

  const t2iQueryInput = document.getElementById("t2iQueryInput");
  if (t2iQueryInput) {
    t2iQueryInput.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        runTextToImageSearch();
      }
    });
  }

  const t2iClearBtn = document.getElementById("t2iClearBtn");
  if (t2iClearBtn) {
    t2iClearBtn.addEventListener("click", () => {
      if (t2iQueryInput) {
        t2iQueryInput.value = "";
        t2iQueryInput.focus();
      }
    });
  }

  document.querySelectorAll(".preset-prompt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (t2iQueryInput) {
        t2iQueryInput.value = btn.getAttribute("data-prompt");
        runTextToImageSearch();
      }
    });
  });

  // 3. Feature 2: Image-to-Image Controls
  const i2iExcludeSelfToggle = document.getElementById("i2iExcludeSelfToggle");
  if (i2iExcludeSelfToggle) i2iExcludeSelfToggle.addEventListener("change", runImageToImageSearch);

  const i2iSearchBtn = document.getElementById("i2iSearchBtn");
  if (i2iSearchBtn) i2iSearchBtn.addEventListener("click", runImageToImageSearch);

  const i2iUploadInput = document.getElementById("i2iUploadInput");
  const i2iDropZone = document.getElementById("i2iDropZone");

  if (i2iDropZone && i2iUploadInput) {
    i2iDropZone.addEventListener("click", () => i2iUploadInput.click());

    i2iDropZone.addEventListener("dragover", e => {
      e.preventDefault();
      i2iDropZone.classList.add("border-orange-500", "bg-orange-500/10");
    });
    i2iDropZone.addEventListener("dragleave", e => {
      e.preventDefault();
      i2iDropZone.classList.remove("border-orange-500", "bg-orange-500/10");
    });
    i2iDropZone.addEventListener("drop", e => {
      e.preventDefault();
      i2iDropZone.classList.remove("border-orange-500", "bg-orange-500/10");
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleCustomImageUpload(e.dataTransfer.files[0], "i2i");
      }
    });

    i2iUploadInput.addEventListener("change", e => {
      if (e.target.files && e.target.files[0]) {
        handleCustomImageUpload(e.target.files[0], "i2i");
      }
    });
  }

  // 4. Feature 3: Zero-Shot Classification Controls
  const zsClassifyBtn = document.getElementById("zsClassifyBtn");
  if (zsClassifyBtn) zsClassifyBtn.addEventListener("click", runZeroShotClassification);

  const zsTemplateSelect = document.getElementById("zsTemplateSelect");
  if (zsTemplateSelect) zsTemplateSelect.addEventListener("change", runZeroShotClassification);

  const zsLabelsInput = document.getElementById("zsLabelsInput");
  if (zsLabelsInput) {
    zsLabelsInput.addEventListener("keydown", e => {
      if (e.key === "Enter") runZeroShotClassification();
    });
  }

  const zsUploadInput = document.getElementById("zsUploadInput");
  const zsDropZone = document.getElementById("zsDropZone");

  if (zsDropZone && zsUploadInput) {
    zsDropZone.addEventListener("click", () => zsUploadInput.click());

    zsDropZone.addEventListener("dragover", e => {
      e.preventDefault();
      zsDropZone.classList.add("border-orange-500", "bg-orange-500/10");
    });
    zsDropZone.addEventListener("dragleave", e => {
      e.preventDefault();
      zsDropZone.classList.remove("border-orange-500", "bg-orange-500/10");
    });
    zsDropZone.addEventListener("drop", e => {
      e.preventDefault();
      zsDropZone.classList.remove("border-orange-500", "bg-orange-500/10");
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleCustomImageUpload(e.dataTransfer.files[0], "zs");
      }
    });

    zsUploadInput.addEventListener("change", e => {
      if (e.target.files && e.target.files[0]) {
        handleCustomImageUpload(e.target.files[0], "zs");
      }
    });
  }

  // 5. Initial Render of Views
  renderI2ISelectorStrip();
  renderZSSelectorStrip();
  runTextToImageSearch();
  runImageToImageSearch();
  runZeroShotClassification();
});
