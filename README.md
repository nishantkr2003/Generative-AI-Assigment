# Generative AI Document Assistant

A full-stack AI-powered document intelligence platform that allows users to upload PDFs, process them into vector embeddings, and interact with documents using Retrieval-Augmented Generation (RAG).

## Overview

This project is built to:

* Upload and parse PDF documents
* Chunk and preprocess document content
* Generate semantic embeddings using Sentence Transformers
* Store embeddings in Pinecone for scalable vector search
* Retrieve relevant document context intelligently
* Generate accurate answers using Groq LLM via LangChain
* Provide a clean React + Tailwind frontend for user interaction

---

# Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Axios
* React Router

## Backend

* Flask
* Flask-CORS
* Python-dotenv
* PyPDF
* Sentence Transformers (`all-MiniLM-L6-v2`)
* Pinecone
* LangChain
* Groq API

## Deployment

* Frontend: Vercel
* Backend: Render
* Vector Database: Pinecone Cloud

---

# Features

## Current Features

* PDF Upload System
* Document Text Extraction
* Intelligent Chunking Pipeline
* Embedding Generation
* Pinecone Vector DB Integration
* RAG-based Question Answering
* Modern Dashboard UI
* API-based Backend Architecture

## Planned Enhancements

* Multi-document chat
* Authentication system
* User history
* Document summarization
* Citation highlighting
* Role-based dashboard

---

# Folder Structure

```bash
genai-doc-assistant/
│
├── backend/
│   ├── __pycache__/
│   ├── routes/
│   │   ├── __pycache__/
│   │   ├── __init__.py
│   │   ├── document_routes.py
│   │   └── pdf_routes.py
│   ├── services/
│   │   ├── __pycache__/
│   │   ├── document_service.py
│   │   ├── docx_service.py
│   │   ├── embedding_service.py
│   │   ├── memory_service.py
│   │   ├── mongo_service.py
│   │   ├── pdf_service.py
│   │   ├── process_service.py
│   │   ├── rag_answer_service.py
│   │   ├── rag_pipeline_service.py
│   │   ├── retrieval_service.py
│   │   ├── store_pipeline_service.py
│   │   ├── text_service.py
│   │   └── vector_store_service.py
│   ├── uploads/
│   ├── utils/
│   │   ├── __pycache__/
│   │   └── text_chunker.py
│   ├── venv/
│   ├── .env
│   ├── .gitignore
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   └── runtime.txt
│
├── frontend/
│   ├── dist/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ChatBox.jsx
│   │   │   └── FileUploader.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Home.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
│
├── .gitignore
├──render.yaml
└── README.md
```

---

# Installation Guide

## 1. Clone Repository

```bash
git clone https://github.com/nishantkr2003/Generative-AI-Assigment.git
cd Generative-AI-Assigment
```

---

# Backend Setup

```bash
cd backend
python -m venv venv
```

## Activate Virtual Environment

### Windows:

```bash
venv\Scripts\activate
```

### Mac/Linux:

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Run Backend

```bash
python app.py
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Environment Variables

Create a `.env` file inside backend:

```env
GROQ_API_KEY=your_groq_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name
FLASK_ENV=development
```

---

# API Endpoints

Base URL (local): `http://localhost:5000/api/document`
Base URL (production): `https://your-backend.onrender.com/api/document`

---

## 1. Upload Document

```http
POST /api/document/upload
```

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | PDF, DOCX, TXT, or MD file |

**Response:**
```json
{
  "status": "success",
  "message": "Document uploaded, processed, and stored successfully in Pinecone",
  "filename": "example.pdf",
  "file_type": "pdf",
  "raw_text_length": 12400,
  "total_chunks": 48,
  "embedding_dimension": 384,
  "stored_chunks": 48,
  "preview": "First 1500 characters of extracted text..."
}
```

---

## 2. Process Document

```http
POST /api/document/process
```

**Content-Type:** `application/json`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `filename` | string | Yes | Name of already uploaded file |

**Response:**
```json
{
  "status": "success",
  "message": "Document processed successfully",
  "filename": "example.pdf",
  "raw_text_length": 12400,
  "total_chunks": 48,
  "sample_chunks": ["chunk1...", "chunk2...", "chunk3..."]
}
```

---

## 3. Embed Document

```http
POST /api/document/embed
```

**Content-Type:** `application/json`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `filename` | string | Yes | Name of already uploaded file |

**Response:**
```json
{
  "status": "success",
  "message": "Document embedded successfully",
  "filename": "example.pdf",
  "raw_text_length": 12400,
  "total_chunks": 48,
  "embedding_dimension": 384,
  "sample_chunk": "First chunk text...",
  "sample_embedding": [0.012, -0.034, 0.056, "..."]
}
```

---

## 4. Store Document in Pinecone

```http
POST /api/document/store
```

**Content-Type:** `application/json`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `filename` | string | Yes | Name of already uploaded file |

**Response:**
```json
{
  "status": "success",
  "message": "Document stored successfully in Pinecone",
  "filename": "example.pdf",
  "raw_text_length": 12400,
  "total_chunks": 48,
  "embedding_dimension": 384,
  "stored_chunks": 48
}
```

---

## 5. Ask a Question (RAG)

```http
POST /api/document/ask
```

**Content-Type:** `application/json`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `question` | string | Yes | Question to ask about the document |
| `user_id` | string | No | User ID for chat memory |
| `session_id` | string | No | Session ID for threaded history |
| `active_document` | string | No | Filename to scope the query |

**Response:**
```json
{
  "status": "success",
  "question": "What is this document about?",
  "answer": "This document is about...",
  "sources": ["chunk reference 1", "chunk reference 2"],
  "session_id": "session_abc123"
}
```

---

## 6. Get Chat History

```http
POST /api/document/history
```

**Content-Type:** `application/json`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | string | Yes | User ID to fetch history for |

**Response:**
```json
{
  "status": "success",
  "history": [
    {
      "question": "What is RAG?",
      "answer": "RAG stands for...",
      "sources": ["..."]
    }
  ]
}
```

---

## 7. Clear Chat History

```http
POST /api/document/clear-history
```

**Content-Type:** `application/json`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | string | Yes | User ID whose history to clear |

**Response:**
```json
{
  "status": "success",
  "message": "Deleted 12 chat records"
}
```

---

## Error Response (All Endpoints)

```json
{
  "status": "error",
  "message": "Description of what went wrong"
}
```

| Code | Meaning |
|------|---------|
| `400` | Bad request / missing fields |
| `404` | File not found |
| `500` | Internal server error |

---

# Deployment Notes

## Render Backend

* Set Python version in `runtime.txt`
* Add all environment variables
* Use `gunicorn app:app`

## Vercel Frontend

* Configure API base URL
* Add production environment variables

---

# Common Issues & Fixes

## CORS Error

Ensure Flask-CORS is configured:

```python
CORS(app, origins=["https://your-frontend-domain.vercel.app"])
```

## Pinecone Dimension Error

Make sure embedding model dimensions match index dimensions.

## Memory Issues on Render

* Reduce batch size
* Lazy load embedding model
* Use CPU-efficient settings

---

# Learning Outcomes

This project demonstrates:

* Full-stack AI integration
* RAG architecture
* Vector database migration (ChromaDB → Pinecone)
* Cloud deployment
* Production debugging
* API security

---

# Author

**Nishant Kumar**
Final Year Student | MERN Developer | AI Builder

GitHub: [https://github.com/nishantkr2003](https://github.com/nishantkr2003)

---

# License

This project is for educational and portfolio purposes.
