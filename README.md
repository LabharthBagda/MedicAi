# MedAI - Medical AI Diagnostics

An AI-powered medical image analysis web application for detecting Bone Fractures, Chest diseases (COVID/Pneumonia), and Brain Tumors.

![MedAI](https://img.shields.io/badge/MedAI-Medical%20AI%20Diagnostics-blue?style=for-the-badge)

## Features

- **Bone Fracture Detection**: Uses YOLO object detection to identify bone fractures in X-ray images
- **Chest X-ray Analysis**: Classifies chest X-rays as COVID, Pneumonia, or Normal using deep learning
- **Brain MRI Analysis**: Detects tumors in brain MRI scans with Grad-CAM visualization
- **Professional Clinical UI**: Clean, human-centered design built for medical professionals

## Tech Stack

### Frontend
- React + Vite
- React Router
- CSS (Custom design system)

### Backend
- FastAPI
- TensorFlow (Keras)
- Ultralytics YOLO
- OpenCV
- Python

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- pip

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/LabharthBagda/MedicAi.git
cd MedicAi
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
```

### Running the Application

1. **Start the backend server**
```bash
cd backend
python app.py
```
The backend will run at `http://localhost:8000`

2. **Start the frontend (in a new terminal)**
```bash
npm run dev
```
The frontend will run at `http://localhost:5173`

3. **Open your browser**
Navigate to `http://localhost:5173` to use the application

## Project Structure

```
MedicAi/
├── src/
│   ├── components/
│   │   ├── ResultView.jsx    # Displays analysis results
│   │   └── UploadBox.jsx      # Image upload component
│   ├── pages/
│   │   ├── Home.jsx          # Dashboard/Home page
│   │   ├── Chest.jsx          # Chest X-ray analysis
│   │   ├── Brain.jsx          # Brain MRI analysis
│   │   └── Bones.jsx         # Bone fracture detection
│   ├── services/
│   │   └── api.js             # API client
│   ├── App.jsx                # Main app component
│   ├── App.css                # App styles
│   ├── index.css              # Global styles
│   └── main.jsx               # Entry point
├── backend/
│   ├── app.py                 # FastAPI backend
│   ├── models/                # ML model files
│   │   ├── chest_model_test.keras
│   │   ├── brain_model_test.keras
│   │   └── best.pt            # YOLO weights
│   └── requirements.txt      # Python dependencies
├── package.json
└── README.md
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/predict_chest` | POST | Predict chest X-ray class |
| `/predict_brain` | POST | Predict brain MRI class |
| `/predict_gradcam_chest` | POST | Chest X-ray with Grad-CAM |
| `/predict_gradcam_brain` | POST | Brain MRI with Grad-CAM |
| `/predict_bones` | POST | Detect bone fractures |

## Required Model Files

Place these files in `backend/models/`:

- `chest_model_test.keras` - Trained chest X-ray classification model
- `brain_model_test.keras` - Trained brain MRI classification model  
- `best.pt` - YOLO model weights for bone fracture detection

## Usage

1. Select a scan type from the sidebar (Bone, Chest, or Brain)
2. Upload a medical image (X-ray or MRI)
3. Click "Analyze Scan" to process
4. View the AI predictions and confidence scores
5. Use Grad-CAM visualization to understand AI focus areas
6. Click "Analyze Another" to process more images

## Design

The UI follows a professional clinical aesthetic:
- Warm off-white background (#F7F6F3)
- Clean typography (DM Serif Display, DM Sans, JetBrains Mono)
- Muted clinical color palette
- Soft shadows and rounded corners

## License

MIT License

## Author

- Labharth Bagda - [GitHub](https://github.com/LabharthBagda)