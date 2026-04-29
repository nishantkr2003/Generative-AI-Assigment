import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

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

    # App Config
    DEBUG = True