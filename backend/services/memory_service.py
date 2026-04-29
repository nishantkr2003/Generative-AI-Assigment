from datetime import datetime

from services.mongo_service import chat_sessions_collection


def save_chat_message(user_id, question, answer, sources):
    """
    Save a single Q&A interaction for a user
    """
    if not user_id:
        raise Exception("User ID is required")

    chat_sessions_collection.insert_one({
        "user_id": user_id,
        "question": question,
        "answer": answer,
        "sources": sources,
        "timestamp": datetime.utcnow()
    })

    return True


def get_user_chat_history(user_id, limit=20):
    """
    Retrieve previous chat history for a user
    """
    if not user_id:
        raise Exception("User ID is required")

    chats = list(
        chat_sessions_collection
        .find({"user_id": user_id})
        .sort("timestamp", -1)
        .limit(limit)
    )

    # Convert ObjectId for JSON
    for chat in chats:
        chat["_id"] = str(chat["_id"])

    return chats


def clear_user_chat_history(user_id):
    """
    Delete all chat history for a user
    """
    if not user_id:
        raise Exception("User ID is required")

    result = chat_sessions_collection.delete_many({
        "user_id": user_id
    })

    return result.deleted_count