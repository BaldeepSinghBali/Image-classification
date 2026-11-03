// =========================================================================
// state.js - Global UI State & Toast Utility
// =========================================================================
let t2iChartInstance = null;
let zsChartInstance = null;
let activeI2IQueryItem = DATASET_ITEMS[0];
let activeZSTargetItem = DATASET_ITEMS[0];

function showToast(message, icon = "✓") {
  const banner = document.getElementById("toastBanner");
  if (!banner) return;
  const iconEl = document.getElementById("toastIcon");
  const msgEl = document.getElementById("toastMessage");
  if (iconEl) iconEl.textContent = icon;
  if (msgEl) msgEl.textContent = message;
  banner.classList.remove("hidden");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    banner.classList.add("hidden");
  }, 3200);
}