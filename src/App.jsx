import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Chest from "./pages/Chest";
import Brain from "./pages/Brain";
import Bones from "./pages/Bones";
import "./App.css";

const scanTypes = [
  { id: "bones", name: "Bone Fracture", icon: "bone" },
  { id: "chest", name: "Chest X-ray", icon: "chest" },
  { id: "brain", name: "Brain Tumor", icon: "brain" },
];

function Sidebar() {
  const location = useLocation();
  
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <svg viewBox="0 0 32 32" className="logo-icon">
            <circle cx="16" cy="16" r="14" fill="var(--primary)" />
            <path d="M16 8v16M8 16h16" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="logo-text">MedAI</span>
        </div>
      </div>
      
      <div className="scan-types">
        <h3 className="section-title">Scan Type</h3>
        <nav className="scan-nav">
          {scanTypes.map((type) => (
            <Link
              key={type.id}
              to={`/${type.id}`}
              className={`scan-link ${location.pathname === `/${type.id}` ? "active" : ""}`}
            >
              <span className="scan-icon">
                {type.id === "bones" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 4c0-1 2-2 6-2s6 1 6 2M6 20c0 1 2 2 6 2s6-1 6-2M8 7c1 0 2 1 2 2s-1 2-2 2M8 17c1 0 2-1 2-2s-1-2-2-2M16 7c-1 0-2 1-2 2s1 2 2 2M16 17c-1 0-2-1-2-2s1-2 2-2" />
                  </svg>
                )}
                {type.id === "chest" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 21a9 9 0 109-9 9 9 0 00-9 9z" />
                    <path d="M12 13v4M9 17h6" />
                  </svg>
                )}
                {type.id === "brain" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 4a4 4 0 014 4c0 2-2 3-4 3s-4-1-4-3a4 4 0 014-4z" />
                    <path d="M4 10c0 4 4 6 8 6s8-2 8-6M4 14c0 3 4 5 8 5s8-2 8-5" />
                  </svg>
                )}
              </span>
              <span className="scan-name">{type.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="top-header">
      <div className="header-left">
        <span className="header-title">Medical AI Diagnostics</span>
      </div>
      <div className="header-right">
        <div className="status-indicator">
          <span className="status-dot active" />
          <span>System Ready</span>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Header />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chest" element={<Chest />} />
              <Route path="/brain" element={<Brain />} />
              <Route path="/bones" element={<Bones />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}