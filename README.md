# CLIP Multimodal Retrieval & Zero-Shot Classification Web Application

A state-of-the-art interactive web application demonstrating multimodal retrieval and zero-shot image classification powered by OpenAI's **CLIP (ViT-B/32, 512-Dimensional Embedding Space)**.

---

## 🏗️ Modular Project Architecture

The application has been modularized into dedicated files to ensure clean separation of concerns, scalability, and maintainability:

```text
D:\clip-app\
│
├── index.html            # Main semantic HTML5 interface & tab structure
├── app.py                # Standalone Python backend (Gradio + PyTorch + CLIP)
├── requirements.txt      # Python dependencies (torch, torchvision, transformers, gradio)
├── README.md             # Project documentation & execution guide
├── server.ps1            # Optional PowerShell HTTP server
│
├── css\
│   └── styles.css        # Premium glassmorphic design system, typography & animations
│
└── js\
    ├── data.js           # 69 high-resolution indexed ImageNet photos + multimodal ground-truth concepts
    ├── engine.js         # 512-D CLIP embedding engine & cosine similarity vector math
    ├── state.js          # Reactive UI state, active queries & notification manager
    ├── features.js       # Core logic for Text2Img, Img2Img, Zero-Shot & Dataset uploads
    └── main.js           # DOM initialization, event bindings & lifecycle routing
```

---

## ⚡ Core Gradio Features

1. **Text-to-Image Cross-Modal Retrieval (`gr.Textbox` + `gr.Gallery`)**:
   - Encodes any natural language text prompt into a 512-D unit vector.
   - Computes cosine similarity against indexed dataset embeddings in real time.
   - Quick example prompt chips, Top-K selector, and live visual score distribution chart.

2. **Image-to-Image Visual Similarity Search (`gr.Image` + `gr.Gallery`)**:
   - Drag-and-drop file upload zone + 1-click thumbnail example selector.
   - Evaluates visual-semantic proximity across 512-D CLIP image feature vectors.
   - Option to exclude the query image itself from retrieval results.

3. **Zero-Shot Image Classification (`gr.Image` + `gr.Label`)**:
   - Classifies any image against arbitrary, user-defined class labels without retraining.
   - Prompt engineering templates (`"A photo of a {label}."`, `"A close-up photo of a {label}."`, etc.).
   - Signature Gradio horizontal percentage bars, cosine similarities, and Softmax probability distributions.

---

## 🚀 How to Run

1. Open `D:\clip-app\index.html` in any modern web browser (Google Chrome, Microsoft Edge, Brave, Firefox, Safari).
2. No complex build tools or local servers required!