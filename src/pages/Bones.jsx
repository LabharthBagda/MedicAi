import { useState } from "react";
import { analyzeBoneImage } from "../services/api";


export default function Bones() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPrediction(null);
  };

  const handlePredict = async () => {
    if (!file) return alert("Please upload an image first!");
    setLoading(true);
    try {
      const result = await analyzeBoneImage(file);
      setPrediction(result);
    } catch (err) {
      console.error(err);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Bone Fracture Detection</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {file && (
        <div>
          <h4>Selected Image:</h4>
          <img src={URL.createObjectURL(file)} alt="Selected" width={300} />
        </div>
      )}
      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Analyzing..." : "Predict"}
      </button>
      {prediction && (
        <div>
          <h4>Predictions:</h4>
          <ul>
            {prediction.predictions.map((p, idx) => (
              <li key={idx}>
                Class {p.class}, Confidence: {(p.confidence*100).toFixed(2)}%
              </li>
            ))}
          </ul>
          {prediction.image && (
            <div>
              <h4>Detected Fractures:</h4>
              <img src={`data:image/png;base64,${prediction.image}`} alt="Predicted" width={300} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
