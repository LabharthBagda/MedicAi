// src/components/ResultView.jsx
export default function ResultView({ result }) {
  if (!result) return null;

  return (
    <div className="result-view">
      <h2>Prediction: {result.label}</h2>
      <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
      {result.gradcam && (
        <div className="gradcam-image">
          <h3>Grad-CAM Heatmap:</h3>
          <img
            src={`data:image/png;base64,${result.gradcam}`}
            alt="Grad-CAM"
            style={{ maxWidth: "500px", marginTop: "10px" }}
          />
        </div>
      )}
    </div>
  );
}
