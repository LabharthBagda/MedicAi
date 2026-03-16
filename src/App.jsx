import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chest from "./pages/Chest";
import Brain from "./pages/Brain";
import Bones from "./pages/Bones";
import ImageUpload from "./components/UploadBox";

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>Medical AI Analyzer</h1>
        <ImageUpload />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chest" element={<Chest />} />
        <Route path="/brain" element={<Brain />} />
        <Route path="/bones" element={<Bones />} />

      </Routes>
    </BrowserRouter>
  );
}
