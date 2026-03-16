export default function UploadBox({ file, setFile, onUpload }) {
  return (
    <div className="upload-box">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={onUpload} disabled={!file}>
        Upload & Analyze
      </button>
    </div>
  );
}
