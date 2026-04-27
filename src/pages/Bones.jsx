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
    if (!file) return;
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

  const getConfidenceClass = (conf) => {
    if (conf >= 0.8) return "high";
    if (conf >= 0.5) return "medium";
    return "low";
  };

  const getFindingStatus = (predictions) => {
    if (!predictions || predictions.length === 0) return "normal";
    return "abnormal";
  };

  const status = getFindingStatus(prediction?.predictions);

  return (
    <div className="analysis-layout">
      <div className="scan-viewer">
        <div className="viewer-header">
          <h2 className="viewer-title">Bone Fracture Detection</h2>
          <div className="viewer-controls">
            <button className="control-btn" title="Zoom In">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
              </svg>
            </button>
            <button className="control-btn" title="Zoom Out">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35M8 11h6" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="viewer-content">
          {loading ? (
            <div className="loading-skeleton">
              <div className="skeleton-line shimmer" />
              <div className="skeleton-line shimmer" />
              <div className="skeleton-line shimmer" />
            </div>
          ) : file ? (
            <img src={URL.createObjectURL(file)} alt="Bone X-ray" className="uploaded-image" />
          ) : (
            <div className="upload-placeholder">
              <div 
                className="upload-dashed"
                onClick={() => document.getElementById('bone-input').click()}
              >
                <input
                  id="bone-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />
                <div className="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="upload-text">Drop X-ray here</p>
                <p className="upload-subtext">or click to browse</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="results-panel">
        <div className="results-header">
          <h3 className="results-title">Analysis Results</h3>
          <p className="results-subtitle">YOLO Object Detection</p>
        </div>

        {prediction ? (
          <>
            <div className="confidence-section">
              <div className="confidence-label">
                <span>Fracture Detected</span>
                <span className="confidence-value">
                  {prediction.predictions?.length || 0} findings
                </span>
              </div>
              <div className="radial-gauge">
                <div 
                  className={`radial-fill ${status === 'normal' ? 'high' : 'low'}`}
                  style={{ width: status === 'normal' ? '100%' : '30%' }}
                />
              </div>
            </div>

            <div className="findings-list">
              {prediction.predictions && prediction.predictions.length > 0 ? (
                prediction.predictions.map((p, idx) => (
                  <div key={idx} className="finding-card">
                    <div className="finding-indicator abnormal" />
                    <div className="finding-content">
                      <div className="finding-title">Fracture Detected</div>
                      <div className="finding-desc">
                        Confidence: {(p.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    <span className="finding-badge badge-abnormal">Alert</span>
                  </div>
                ))
              ) : (
                <div className="finding-card">
                  <div className="finding-indicator normal" />
                  <div className="finding-content">
                    <div className="finding-title">No Fractures Detected</div>
                    <div className="finding-desc">
                      X-ray appears normal
                    </div>
                  </div>
                  <span className="finding-badge badge-normal">Clear</span>
                </div>
              )}
            </div>

            {prediction.image && (
              <div className="confidence-section">
                <div className="confidence-label">
                  <span>Detection Overlay</span>
                </div>
                <img 
                  src={`data:image/png;base64,${prediction.image}`}
                  alt="Detection" 
                  style={{ width: "100%", borderRadius: "var(--radius-md)" }}
                />
              </div>
            )}

            <button 
              className="analyze-btn card"
              onClick={() => { setPrediction(null); setFile(null); }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Analyze Another
            </button>
          </>
        ) : (
          <button 
            className="analyze-btn"
            onClick={handlePredict}
            disabled={!file}
          >
            Run Detection
          </button>
        )}
      </div>
    </div>
  );
}