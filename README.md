# CLIP Multimodal Image Search — GitHub Pages

A static browser-based version of the project using **Transformers.js** and the pretrained `Xenova/clip-vit-base-patch32` CLIP model. Model inference runs in the visitor's browser; no Python server or paid inference API is required.

## Features

- Text-to-image search across the included 69-image gallery using real CLIP image/text inference.
- Zero-shot image classification against user-provided labels.
- Image query retrieval by comparing the uploaded image against text captions for gallery items. This is caption-guided semantic retrieval, not direct image-embedding distance.

## Deploy to GitHub Pages

1. Upload the repository files to your GitHub repository (the `index.html`, `js/`, `css/`, and `dataset/` folders must be at the published root).
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose branch `main` and folder `/(root)`, then Save.
5. Wait for the Pages deployment and open the URL shown in Settings → Pages.

## Run locally

Because this app uses JavaScript modules and browser model downloads, serve it over HTTP rather than opening `index.html` directly from `file://`.

For example, with Python installed:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## First-use notes

- The first inference downloads the model files (roughly 150 MB, depending on model assets) from Hugging Face. Keep the page open until loading completes.
- Subsequent visits may reuse the browser cache.
- Performance depends on the visitor's device and browser. A modern desktop browser is recommended.
- GitHub Pages serves static files only; it does not run `app.py`. The original Python/Gradio application is retained as a separate reference implementation.
- If your GitHub repository is public, anyone can view and download its source files.
