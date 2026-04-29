from datetime import datetime
from services.mongo_service import chat_sessions_collection


def create_or_get_session(user_id, session_id):
    """
    Safe Mongo session creation
    """
    if chat_sessions_collection is None:
        return session_id

    session = chat_sessions_collection.find_one({
        "user_id": user_id,
        "session_id": session_id
    })

    if not session:
        new_session = {
            "user_id": user_id,
            "session_id": session_id,
            "messages": [],
            "created_at": datetime.utcnow()
        }

        chat_sessions_collection.insert_one(new_session)

    return session_id


def save_message(user_id, session_id, role, content):
    """
    Safe save
    """
    if chat_sessions_collection is None:
        return

    chat_sessions_collection.update_one(
        {
            "user_id": user_id,
            "session_id": session_id
        },
        {
            "$push": {
                "messages": {
                    "role": role,
                    "content": content,
                    "timestamp": datetime.utcnow()
                }
            }
        },
        upsert=True
    )


def get_chat_history(user_id, session_id, limit=10):
    """
    Safe retrieval
    """
    if chat_sessions_collection is None:
        return []

    session = chat_sessions_collection.find_one({
        "user_id": user_id,
        "session_id": session_id
    })

    if not session:
        return []

    return session.get("messages", [])[-limit:]