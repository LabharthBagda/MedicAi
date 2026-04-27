export default function ResultView({ result }) {
  if (!result) return null;

  const getConfidenceClass = (conf) => {
    if (conf >= 0.8) return "high";
    if (conf >= 0.5) return "medium";
    return "low";
  };

  const getFindingStatus = (label) => {
    if (label === "NORMAL") return "normal";
    if (label === "UNCERTAIN") return "warning";
    return "abnormal";
  };

  const confidenceClass = getConfidenceClass(result.confidence);
  const status = getFindingStatus(result.label);

  return (
    <div className="fade-in">
      <div className="results-header">
        <h3 className="results-title">AI Findings</h3>
        <p className="results-subtitle">Deep Learning Classification</p>
      </div>

      <div className="confidence-section">
        <div className="confidence-label">
          <span>Confidence Score</span>
          <span className="confidence-value">
            {(result.confidence * 100).toFixed(1)}%
          </span>
        </div>
        <div className="radial-gauge">
          <div 
            className={`radial-fill ${confidenceClass}`}
            style={{ width: `${result.confidence * 100}%` }}
          />
        </div>
      </div>

      <div className="findings-list">
        <div className="finding-card">
          <div className={`finding-indicator ${status}`} />
          <div className="finding-content">
            <div className="finding-title">{result.label}</div>
            <div className="finding-desc">
              {result.label === "NORMAL" 
                ? "No abnormalities detected" 
                : result.label === "UNCERTAIN"
                  ? "Low confidence - manual review recommended"
                  : "Abnormality detected - urgent review recommended"
              }
            </div>
          </div>
          <span className={`finding-badge ${
            status === "normal" ? "badge-normal" :
            status === "warning" ? "badge-warning" : "badge-abnormal"
          }`}>
            {result.label}
          </span>
        </div>
      </div>

      {result.gradcam && (
        <div className="confidence-section">
          <div className="confidence-label">
            <span>AI Attention Map</span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
            Red regions show where the AI focused most for this prediction
          </p>
          <img 
            src={`data:image/png;base64,${result.gradcam}`}
            alt="Grad-CAM" 
            style={{ width: "100%", borderRadius: "var(--radius-md)" }}
          />
        </div>
      )}

      <div className="recommendation">
        <div className="rec-title">Recommendation</div>
        <div className="rec-text">
          {result.label === "NORMAL"
            ? "Routine follow-up as scheduled"
            : result.label === "UNCERTAIN"
              ? "Additional imaging or clinical correlation recommended"
              : "Immediate clinical review and additional testing recommended"
          }
        </div>
      </div>
    </div>
  );
}