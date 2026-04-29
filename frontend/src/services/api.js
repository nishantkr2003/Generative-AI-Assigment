import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api/document",
});

// Upload Document
export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Process Document
export const processDocument = async (filename) => {
  const response = await API.post("/process", {
    filename,
  });

  return response.data;
};

// Store Document
export const storeDocument = async (filename) => {
  const response = await API.post("/store", {
    filename,
  });

  return response.data;
};

// Ask Question
export const askDocument = async (question) => {
  const response = await API.post("/ask", {
    question,
  });

  return response.data;
};
