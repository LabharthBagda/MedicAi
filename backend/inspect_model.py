from tensorflow.keras.models import load_model

model = load_model("models/brain_model")
model.summary()
