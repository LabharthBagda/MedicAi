import io
import base64
import glob
import numpy as np
import cv2
from PIL import Image

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import tensorflow as tf
from ultralytics import YOLO

# ============================================================
# App + CORS
# ============================================================
app = FastAPI(title="Medical AI Classifier + YOLO Bones")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# Load Models
# ============================================================
CHEST_MODEL_PATH = "models/chest_model_test.keras"
BRAIN_MODEL_PATH = "models/brain_model_test.keras"

chest_model = tf.keras.models.load_model(CHEST_MODEL_PATH, compile=False)
brain_model = tf.keras.models.load_model(BRAIN_MODEL_PATH, compile=False)

chest_classes = ["COVID", "NORMAL", "PNEUMONIA"]
brain_classes = ["TUMOR", "NORMAL"]

CONFIDENCE_THRESHOLD = 0.5

# ============================================================
# Utilities
# ============================================================
def find_last_conv_layer(model):
    for layer in reversed(model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            return layer.name
    raise ValueError("No Conv2D layer found in model")

CHEST_LAST_CONV_LAYER = find_last_conv_layer(chest_model)
BRAIN_LAST_CONV_LAYER = find_last_conv_layer(brain_model)

def preprocess_image(file_bytes, target_size=(224, 224)):
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = img.resize(target_size)
    img_array = np.array(img, dtype=np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)  # (1, H, W, C)
    return img, img_array

def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    """
    Grad-CAM: Computes heatmap for a given model and image tensor
    """
    img_tensor = tf.convert_to_tensor(img_array, dtype=tf.float32)

    # Grad model
    grad_model = tf.keras.models.Model(
        inputs=model.inputs,
        outputs=[model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        tape.watch(img_tensor)
        conv_outputs, predictions = grad_model(img_tensor)  # TensorFlow tensors

        # Ensure predictions is a tensor (if list, convert)
        if isinstance(predictions, list):
            predictions = predictions[0]

        # Determine class index
        if pred_index is None:
            pred_index = tf.argmax(predictions[0])

        # Grab the class score for the predicted index
        class_channel = predictions[:, pred_index]  # This works because predictions is now tensor

    grads = tape.gradient(class_channel, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    conv_outputs = conv_outputs[0]
    heatmap = tf.reduce_sum(conv_outputs * pooled_grads, axis=-1)
    heatmap = tf.maximum(heatmap, 0) / (tf.reduce_max(heatmap) + 1e-8)

    return heatmap.numpy()


def overlay_heatmap(img, heatmap):
    img_cv = np.array(img)
    heatmap_resized = cv2.resize(heatmap, (img_cv.shape[1], img_cv.shape[0]))
    heatmap_colored = cv2.applyColorMap(
        np.uint8(255 * heatmap_resized), cv2.COLORMAP_JET
    )
    overlay = cv2.addWeighted(img_cv, 0.6, heatmap_colored, 0.4, 0)
    _, buffer = cv2.imencode(".png", overlay)
    return base64.b64encode(buffer).decode("utf-8")

# ============================================================
# Chest Endpoints
# ============================================================
@app.post("/predict_chest")
async def predict_chest(file: UploadFile = File(...)):
    contents = await file.read()
    _, img_array = preprocess_image(contents)

    pred = chest_model(img_array, training=False)
    pred_idx = int(tf.argmax(pred[0]))
    confidence = float(pred[0][pred_idx])

    return JSONResponse({
        "label": chest_classes[pred_idx],
        "confidence": confidence,
    })

@app.post("/predict_gradcam_chest")
async def predict_gradcam_chest(file: UploadFile = File(...)):
    contents = await file.read()
    img, img_array = preprocess_image(contents)

    pred = chest_model(img_array, training=False)
    pred_idx = int(tf.argmax(pred[0]))
    confidence = float(pred[0][pred_idx])

    heatmap = make_gradcam_heatmap(
        img_array,
        chest_model,
        CHEST_LAST_CONV_LAYER,
        pred_idx,
    )

    gradcam_img = overlay_heatmap(img, heatmap)

    return JSONResponse({
        "label": chest_classes[pred_idx],
        "confidence": confidence,
        "gradcam": gradcam_img,
    })

# ============================================================
# Brain Endpoints
# ============================================================
@app.post("/predict_brain")
async def predict_brain(file: UploadFile = File(...)):
    contents = await file.read()
    _, img_array = preprocess_image(contents)

    pred = brain_model(img_array, training=False)
    pred_idx = int(tf.argmax(pred[0]))
    confidence = float(pred[0][pred_idx])

    return JSONResponse({
        "label": brain_classes[pred_idx],
        "confidence": confidence,
        "low_confidence": confidence < CONFIDENCE_THRESHOLD,
    })

@app.post("/predict_gradcam_brain")
async def predict_gradcam_brain(file: UploadFile = File(...)):
    contents = await file.read()
    img, img_array = preprocess_image(contents)

    pred = brain_model(img_array, training=False)
    pred_idx = int(tf.argmax(pred[0]))
    confidence = float(pred[0][pred_idx])

    label = brain_classes[pred_idx] if confidence >= CONFIDENCE_THRESHOLD else "UNCERTAIN"

    heatmap = make_gradcam_heatmap(
        img_array,
        brain_model,
        BRAIN_LAST_CONV_LAYER,
        pred_idx,
    )

    gradcam_img = overlay_heatmap(img, heatmap)

    return JSONResponse({
        "label": label,
        "confidence": confidence,
        "gradcam": gradcam_img,
    })

# ============================================================
# YOLO Bone Fracture
# ============================================================
weights_files = glob.glob("models/best.pt")
if not weights_files:
    raise RuntimeError("No YOLO bone weights found in models/")

yolo_model = YOLO(weights_files[0])

@app.post("/predict_bones")
async def predict_bones(file: UploadFile = File(...)):
    contents = await file.read()
    img = cv2.imdecode(np.frombuffer(contents, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        return JSONResponse({"error": "Invalid image"})

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = yolo_model.predict(img_rgb, imgsz=640, conf=0.25)

    output_img = results[0].plot()
    _, buffer = cv2.imencode(".png", output_img)
    img_str = base64.b64encode(buffer).decode("utf-8")

    predictions = []
    for box in results[0].boxes:
        predictions.append({
            "class": int(box.cls[0]),
            "confidence": float(box.conf[0]),
        })

    return JSONResponse({
        "predictions": predictions,
        "image": img_str,
    })

# ============================================================
# Root
# ============================================================
@app.get("/")
def root():
    return {"message": "Medical AI API is running"}
