from pymongo import MongoClient
from config import Config


# MongoDB Client
client = MongoClient(Config.MONGO_URI)

# Database
db = client["genai_doc_assistant"]

# Collections
users_collection = db["users"]
chat_sessions_collection = db["chat_sessions"]
messages_collection = db["messages"]


def test_mongo_connection():
    """
    Test MongoDB connection
    """
    try:
        client.admin.command("ping")
        print("MongoDB connected successfully!")
        return True
    except Exception as e:
        print("MongoDB connection failed:", str(e))
        return False