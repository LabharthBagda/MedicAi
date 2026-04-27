import UploadBox from "../components/UploadBox";
import ResultView from "../components/ResultView";
import { useState } from "react";
import { analyzeChestImage } from "../services/api";

export default function Chest() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const data = await analyzeChestImage(file);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFile(null);
  };

  return (
    <div className="analysis-layout">
      <div className="scan-viewer">
        <div className="viewer-header">
          <h2 className="viewer-title">Chest X-ray Analysis</h2>
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
            <img src={URL.createObjectURL(file)} alt="Chest X-ray" className="uploaded-image" />
          ) : (
            <UploadBox file={file} setFile={setFile} onUpload={handleUpload} />
          )}
        </div>
      </div>

      <div className="results-panel">
        <div className="results-header">
          <h3 className="results-title">Analysis Results</h3>
          <p className="results-subtitle">Deep Learning Classification</p>
        </div>

        {result ? (
          <>
            <ResultView result={result} />
            <button className="analyze-btn" onClick={handleReset}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Analyze Another
            </button>
          </>
        ) : (
          <div className="confidence-section">
            <div className="confidence-label">
              <span>Ready</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
              {file ? "Click analyze to process the scan" : "Upload a chest X-ray to begin analysis"}
            </p>
            <button 
              className="analyze-btn"
              onClick={handleUpload}
              disabled={!file}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              Analyze Scan
            </button>
            {file && (
              <button 
                onClick={() => setFile(null)}
                style={{ background: "transparent", marginTop: "0.75rem", color: "var(--text-muted)" }}
              >
                Remove image
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}