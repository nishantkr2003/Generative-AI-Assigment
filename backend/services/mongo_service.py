from pymongo import MongoClient

from config import Config


# Mongo Client
mongo_client = MongoClient(Config.MONGO_URI)

# Database
db = mongo_client[Config.MONGO_DB_NAME]


# Collections
users_collection = db["users"]
chat_sessions_collection = db["chat_sessions"]


def test_mongo_connection():
    """
    Test MongoDB connection
    """
    try:
        mongo_client.admin.command("ping")
        print("MongoDB connected successfully.")
        return True

    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        return False