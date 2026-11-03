"""
CLIP Multimodal Retrieval & Zero-Shot Classification Web Application
Powered by OpenAI's CLIP (openai/clip-vit-base-patch32) and Gradio.
Dataset: High-Resolution ImageNet-1k (evanarlian/imagenet_1k_resized_256)
Images: Native 256px+ high-definition photography across 1,000 categories.
"""

import os
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

import torch
import numpy as np
from PIL import Image
from datasets import load_dataset
from transformers import CLIPProcessor, CLIPModel
import gradio as gr

# 1. Load Pretrained CLIP Model (openai/clip-vit-base-patch32)
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODEL_NAME = "openai/clip-vit-base-patch32"
print(f"Loading CLIP model ({MODEL_NAME}) on {DEVICE}...")

processor = CLIPProcessor.from_pretrained(MODEL_NAME)
model = CLIPModel.from_pretrained(MODEL_NAME).to(DEVICE)
model.eval()

# 2. Universal Safe Embedding Helpers (Compatible with all Hugging Face transformers versions)
def encode_images(pil_images):
    rgb_imgs = [img.convert("RGB") for img in pil_images]
    with torch.no_grad():
        inputs = processor(images=rgb_imgs, return_tensors="pt").to(DEVICE)
        out = model.get_image_features(**inputs)
        if isinstance(out, torch.Tensor):
            feats = out
        elif hasattr(out, "image_embeds") and out.image_embeds is not None:
            feats = out.image_embeds
        elif hasattr(out, "pooler_output") and out.pooler_output is not None:
            feats = out.pooler_output
        elif hasattr(out, "last_hidden_state"):
            feats = model.visual_projection(out.last_hidden_state[:, 0, :])
        else:
            feats = out[0]
        vecs = feats.cpu().numpy().astype(np.float32)
    norms = np.linalg.norm(vecs, axis=1, keepdims=True)
    return vecs / np.maximum(norms, 1e-12)

def encode_texts(text_list):
    with torch.no_grad():
        inputs = processor(text=text_list, return_tensors="pt", padding=True, truncation=True).to(DEVICE)
        out = model.get_text_features(**inputs)
        if isinstance(out, torch.Tensor):
            feats = out
        elif hasattr(out, "text_embeds") and out.text_embeds is not None:
            feats = out.text_embeds
        elif hasattr(out, "pooler_output") and out.pooler_output is not None:
            feats = out.pooler_output
        elif hasattr(out, "last_hidden_state"):
            feats = model.text_projection(out.last_hidden_state[:, 0, :])
        else:
            feats = out[0]
        vecs = feats.cpu().numpy().astype(np.float32)
    norms = np.linalg.norm(vecs, axis=1, keepdims=True)
    return vecs / np.maximum(norms, 1e-12)

# 3. Load High-Resolution ImageNet-1k Photography (256px+ real photos)
NUM_IMAGES = int(os.environ.get("NUM_IMAGES", 2000))
print(f"Loading ImageNet-1k dataset (loading {NUM_IMAGES} high-res images)...")
hf_dataset = load_dataset("evanarlian/imagenet_1k_resized_256", split="val")

# Clean 1,000 class names (taking the primary common name for each category)
raw_classes = hf_dataset.features["label"].names
CLASSES = [name.split(",")[0].strip() for name in raw_classes]
dataset_labels = [CLASSES[hf_dataset[i]["label"]] for i in range(NUM_IMAGES)]

# Load or compute 512-D CLIP embeddings with local caching
EMBEDDINGS_CACHE = f"imagenet_embeddings_{NUM_IMAGES}.npy"
if os.path.exists(EMBEDDINGS_CACHE):
    print(f"Loading cached 512-D embeddings from {EMBEDDINGS_CACHE}...")
    image_embeddings = np.load(EMBEDDINGS_CACHE)
else:
    print(f"Precomputing 512-D CLIP embeddings for {NUM_IMAGES} high-res photos...")
    batch_size = 128
    embedding_batches = []
    for i in range(0, NUM_IMAGES, batch_size):
        end_idx = min(i + batch_size, NUM_IMAGES)
        # Load batch on demand from memory-mapped table to keep RAM usage minimal
        batch_imgs = [hf_dataset[j]["image"].convert("RGB") for j in range(i, end_idx)]
        embedding_batches.append(encode_images(batch_imgs))
        pct = (end_idx / NUM_IMAGES) * 100
        print(f"  Processed {end_idx} / {NUM_IMAGES} images ({pct:.1f}%)...")
    image_embeddings = np.vstack(embedding_batches)
    np.save(EMBEDDINGS_CACHE, image_embeddings)
    print(f"Dataset indexing complete! Saved cache to {EMBEDDINGS_CACHE}")

print(f"Ready: {len(image_embeddings)} high-resolution images indexed across {len(CLASSES)} categories.")

# Helper to fetch image on demand in native high resolution
def get_dataset_image(idx):
    return hf_dataset[int(idx)]["image"].convert("RGB")

# 4. Feature 1: Text-to-Image Search
def search_by_text(prompt, top_k=5):
    if not prompt or not prompt.strip():
        prompt = "a photo of a monkey"
    q_vec = encode_texts([prompt.strip()])
    sims = np.dot(image_embeddings, q_vec.T).flatten()
    top_idx = np.argsort(sims)[::-1][:int(top_k)]
    return [(get_dataset_image(i), f"Rank #{r+1} | Sim: {sims[i]:.3f} ({dataset_labels[i]})") for r, i in enumerate(top_idx)]

# 5. Feature 2: Image-to-Image Search
def search_by_image(query_img, top_k=5):
    if query_img is None:
        query_img = get_dataset_image(0)
    q_vec = encode_images([query_img])
    sims = np.dot(image_embeddings, q_vec.T).flatten()
    sorted_idx = [i for i in np.argsort(sims)[::-1] if sims[i] < 0.9998][:int(top_k)]
    return [(get_dataset_image(i), f"Match #{r+1} | Sim: {sims[i]:.3f} ({dataset_labels[i]})") for r, i in enumerate(sorted_idx)]

# 6. Feature 3: Zero-Shot Classification
def zero_shot_classify(image, labels_csv):
    if image is None:
        query_img = get_dataset_image(0)
    else:
        query_img = image
    labels = [l.strip() for l in labels_csv.split(",") if l.strip()] or ["chimpanzee", "macaque", "gorilla", "dog", "cat", "car"]
    prompts = [f"a photo of a {l}" for l in labels]
    img_vec = encode_images([query_img])
    txt_vecs = encode_texts(prompts)
    sims = np.dot(txt_vecs, img_vec.T).flatten()
    logits = sims * 100.0
    exp_l = np.exp(logits - np.max(logits))
    probs = exp_l / np.sum(exp_l)
    return {f"{labels[i]} (cos={sims[i]:.3f})": float(probs[i]) for i in range(len(labels))}

# 7. Build Clean Multi-Tab Web Interface
with gr.Blocks(title="CLIP Multimodal Retrieval & Zero-Shot Classification (High-Res ImageNet)") as demo:
    gr.Markdown("# Multimodal Image Retrieval & Zero-Shot Classification Using CLIP (`openai/clip-vit-base-patch32`)")
    gr.Markdown("**Dataset:** High-Resolution ImageNet Photography (`evanarlian/imagenet_1k_resized_256`) — **Crystal-clear real photos** across 1,000 categories.")
    
    with gr.Tab("1. Text-to-Image Search"):
        t_in = gr.Textbox(value="a photo of a monkey sitting on a tree branch", label="Enter Text Prompt")
        t_btn = gr.Button("Search Matching Images", variant="primary")
        t_out = gr.Gallery(label="Top Matching Images (with Cosine Similarity)", columns=5)
        t_btn.click(search_by_text, inputs=[t_in], outputs=t_out)
        
    with gr.Tab("2. Image-to-Image Search"):
        i_in = gr.Image(type="pil", label="Upload or Select Query Image")
        i_btn = gr.Button("Find Most Similar Images", variant="primary")
        i_out = gr.Gallery(label="Top Visually Similar Images", columns=5)
        i_btn.click(search_by_image, inputs=[i_in], outputs=i_out)
        
    with gr.Tab("3. Zero-Shot Classification"):
        z_img = gr.Image(type="pil", label="Upload Image to Classify")
        z_lbl = gr.Textbox(value="macaque, chimpanzee, gorilla, orangutan, baboon, lion, tiger, dog", label="Candidate Labels (comma-separated)")
        z_btn = gr.Button("Run Zero-Shot Classification", variant="primary")
        z_out = gr.Label(num_top_classes=5, label="Predicted Labels & Similarity Scores")
        z_btn.click(zero_shot_classify, inputs=[z_img, z_lbl], outputs=z_out)

if __name__ == "__main__":
    demo.launch()
