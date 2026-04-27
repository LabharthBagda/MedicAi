import { Link } from "react-router-dom";

export default function Home() {
  const quickActions = [
    {
      id: "bones",
      name: "Bone Fracture",
      description: "Detect fractures in X-ray images using AI",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 4c0-1 2-2 6-2s6 1 6 2M6 20c0 1 2 2 6 2s6-1 6-2M8 7c1 0 2 1 2 2s-1 2-2 2M8 17c1 0 2-1 2-2s-1-2-2-2M16 7c-1 0-2 1-2 2s1 2 2 2M16 17c-1 0-2-1-2-2s1-2 2-2" />
        </svg>
      ),
    },
    {
      id: "chest",
      name: "Chest X-ray",
      description: "Classify for COVID, pneumonia, or normal",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 21a9 9 0 109-9 9 9 0 00-9 9z" />
          <path d="M12 13v4M9 17h6" />
        </svg>
      ),
    },
    {
      id: "brain",
      name: "Brain MRI",
      description: "Detect tumors in brain scan images",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 4a4 4 0 014 4c0 2-2 3-4 3s-4-1-4-3a4 4 0 014-4z" />
          <path d="M4 10c0 4 4 6 8 6s8-2 8-6M4 14c0 3 4 5 8 5s8-2 8-5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="home-dashboard">
      <h1 className="dashboard-title">Diagnostics Dashboard</h1>
      <p className="dashboard-subtitle">Select a scan type to begin analysis</p>

      <div className="quick-actions">
        {quickActions.map((action) => (
          <Link key={action.id} to={`/${action.id}`} className="card action-card">
            <div className="action-icon">{action.icon}</div>
            <h3 className="action-title">{action.name}</h3>
            <p className="action-desc">{action.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}