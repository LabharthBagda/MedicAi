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

  return (
    <div className="chest-page">
      <h1>Chest X-ray Analysis</h1>
      <UploadBox file={file} setFile={setFile} onUpload={handleUpload} />
      {loading && <p>Analyzing image...</p>}
      {result && <ResultView result={result} />}
    </div>
  );
}
