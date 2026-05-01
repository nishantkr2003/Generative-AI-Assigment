import axios from "axios";

// Production + Development API URL
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://generative-ai-assigment-backend.onrender.com/api/document";


const API = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

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



export const processDocument = async (filename) => {
  const response = await API.post("/process", {
    filename,
  });

  return response.data;
};


export const storeDocument = async (filename) => {
  const response = await API.post("/store", {
    filename,
  });

  return response.data;
};


export const askDocument = async (question, userId) => {
  try {
    const response = await API.post("/ask", {
      question,
      user_id: userId,
    });

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        error: "Backend unavailable or CORS issue",
      }
    );
  }
};

export const getChatHistory = async (userId) => {
  const response = await API.post("/history", {
    user_id: userId,
  });

  return response.data;
};

export const clearChatHistory = async (userId) => {
  const response = await API.post("/clear-history", {
    user_id: userId,
  });

  return response.data;
};