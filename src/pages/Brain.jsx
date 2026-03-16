import { useState } from "react";
import UploadBox from "../components/UploadBox";
import ResultView from "../components/ResultView";
import { analyzeBrainImage } from "../services/api";

export default function Brain() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const data = await analyzeBrainImage(file);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brain-page">
      <h1>Brain Image Analysis</h1>
      <UploadBox file={file} setFile={setFile} onUpload={handleUpload} />
      {loading && <p>Analyzing image...</p>}
      {result && <ResultView result={result} />}
    </div>
  );
}
