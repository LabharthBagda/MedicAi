import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1>Medical AI Dashboard</h1>
      <p>Select a model to analyze your images:</p>

      <div className="model-buttons">
        <button onClick={() => navigate("/brain")}>Brain Model</button>
        <button onClick={() => navigate("/chest")}>Chest Model</button>
        <button onClick={() => navigate("/bones")}>Bone Model</button>
      </div>
    </div>
  );
}
