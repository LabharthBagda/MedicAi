import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export const analyzeChestImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${BASE_URL}/predict_gradcam_chest`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const analyzeBrainImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${BASE_URL}/predict_gradcam_brain`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const analyzeBoneImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${BASE_URL}/predict_bones`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};


export const analyzeBone = async () => {
  return "test";
};
