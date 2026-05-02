import os
from dotenv import load_dotenv

load_dotenv()


class Config:

    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    # Pinecone
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    PINECONE_INDEX_NAME = os.getenv(
        "PINECONE_INDEX_NAME",
        "genai-doc-assistant"
    )


    MONGO_URI = os.getenv("MONGO_URI")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")


    IS_RENDER = os.getenv("RENDER") is not None
    BASE_STORAGE = "/var/data" if IS_RENDER else "."

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))


    # UPLOAD_FOLDER = os.path.join(BASE_STORAGE, "uploads")
    UPLOAD_FOLDER = os.getenv(
        "UPLOAD_FOLDER",
        os.path.join(BASE_DIR, "uploads")
    )

    EMBEDDING_MODEL = "sentence-transformers/paraphrase-MiniLM-L3-v2"

    # Groq LLM
    GROQ_MODEL = "llama-3.3-70b-versatile"

    CHUNK_SIZE = 300
    CHUNK_OVERLAP = 50
    TOP_K_RESULTS = 5

    # all-MiniLM-L6-v2 = 384 dimensions
    EMBEDDING_DIMENSION = 384


    DEBUG = not IS_RENDER
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB