import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    # MongoDB
    MONGO_URI = os.getenv("MONGO_URI")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")
    
    # Detect Render environment
    #BASE_STORAGE = "/var/data" if os.getenv("RENDER") else "."

    # Folder Paths
    UPLOAD_FOLDER = "uploads"
    CHROMA_DIR = "chroma_db"

    # Persistent folders
    # UPLOAD_FOLDER = os.path.join(BASE_STORAGE, "uploads")
    # CHROMA_DIR = os.path.join(BASE_STORAGE, "chroma_db")

    # Models
    EMBEDDING_MODEL = "all-MiniLM-L6-v2"
    GROQ_MODEL = "llama-3.3-70b-versatile"

    CHUNK_SIZE = 500
    CHUNK_OVERLAP = 50
    TOP_K_RESULTS = 3


    # App Config
    DEBUG = True