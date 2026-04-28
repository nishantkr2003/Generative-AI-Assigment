import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    # Folder Paths
    UPLOAD_FOLDER = "uploads"
    CHROMA_DIR = "chroma_db"

    # Models
    EMBEDDING_MODEL = "all-MiniLM-L6-v2"
    GROQ_MODEL = "llama3-8b-8192"

    # App Config
    DEBUG = True