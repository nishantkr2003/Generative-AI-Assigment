import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

from config import Config
from services.document_service import extract_text_from_document
from services.process_service import process_document
from services.rag_pipeline_service import prepare_document_for_rag
from services.store_pipeline_service import store_document_for_rag
from services.rag_answer_service import answer_document_query
from services.memory_service import (
    create_or_get_session,
    save_message,
    get_chat_history
)

document_bp = Blueprint("document_bp", __name__)

ALLOWED_EXTENSIONS = {"pdf", "docx", "txt", "md"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@document_bp.route("/upload", methods=["POST"])
def upload_document():
    try:
        # Validate file exists
        if "file" not in request.files:
            return jsonify({
                "status": "error",
                "message": "No file part in request"
            }), 400

        file = request.files["file"]

        # Validate selected file
        if file.filename == "":
            return jsonify({
                "status": "error",
                "message": "No file selected"
            }), 400

        # Validate extension
        if not allowed_file(file.filename):
            return jsonify({
                "status": "error",
                "message": "Unsupported file type. Allowed: pdf, docx, txt, md"
            }), 400

        # Ensure upload folder exists
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

        # Secure filename
        filename = secure_filename(file.filename)

        # Save file
        file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(file_path)

        # Extract text
        extracted_text = extract_text_from_document(file_path)

        if not extracted_text:
            return jsonify({
                "status": "error",
                "message": "No readable text found in document"
            }), 400

        return jsonify({
            "status": "success",
            "message": "Document uploaded and processed successfully",
            "filename": filename,
            "file_type": filename.rsplit(".", 1)[1].lower(),
            "text_length": len(extracted_text),
            "preview": extracted_text[:1500]
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    


@document_bp.route("/process", methods=["POST"])
def process_uploaded_document():
    try:
        data = request.get_json()

        if not data or "filename" not in data:
            return jsonify({
                "status": "error",
                "message": "Filename is required"
            }), 400

        filename = secure_filename(data["filename"])

        file_path = os.path.join(Config.UPLOAD_FOLDER, filename)

        if not os.path.exists(file_path):
            return jsonify({
                "status": "error",
                "message": "File not found"
            }), 404

        processed_data = process_document(file_path)

        return jsonify({
            "status": "success",
            "message": "Document processed successfully",
            "filename": filename,
            "raw_text_length": processed_data["raw_text_length"],
            "total_chunks": processed_data["total_chunks"],
            "sample_chunks": processed_data["chunks"][:3]
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    

@document_bp.route("/embed", methods=["POST"])
def embed_document():
    try:
        data = request.get_json()

        if not data or "filename" not in data:
            return jsonify({
                "status": "error",
                "message": "Filename is required"
            }), 400

        filename = secure_filename(data["filename"])

        file_path = os.path.join(Config.UPLOAD_FOLDER, filename)

        if not os.path.exists(file_path):
            return jsonify({
                "status": "error",
                "message": "File not found"
            }), 404

        # Full RAG prep
        rag_data = prepare_document_for_rag(file_path)

        return jsonify({
            "status": "success",
            "message": "Document embedded successfully",
            "filename": filename,
            "raw_text_length": rag_data["raw_text_length"],
            "total_chunks": rag_data["total_chunks"],
            "embedding_dimension": rag_data["embedding_dimension"],
            "sample_chunk": rag_data["chunks"][0] if rag_data["chunks"] else "",
            "sample_embedding": rag_data["embeddings"][0][:10] if rag_data["embeddings"] else []
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    

@document_bp.route("/store", methods=["POST"])
def store_document():
    try:
        data = request.get_json()

        if not data or "filename" not in data:
            return jsonify({
                "status": "error",
                "message": "Filename is required"
            }), 400

        filename = secure_filename(data["filename"])

        file_path = os.path.join(Config.UPLOAD_FOLDER, filename)

        if not os.path.exists(file_path):
            return jsonify({
                "status": "error",
                "message": "File not found"
            }), 404

        # Full storage pipeline
        stored_data = store_document_for_rag(file_path, filename)

        return jsonify({
            "status": "success",
            "message": "Document stored successfully in ChromaDB",
            "filename": stored_data["filename"],
            "raw_text_length": stored_data["raw_text_length"],
            "total_chunks": stored_data["total_chunks"],
            "embedding_dimension": stored_data["embedding_dimension"],
            "stored_chunks": stored_data["stored_chunks"]
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    
@document_bp.route("/ask", methods=["POST"])
def ask_document():
    try:
        data = request.get_json()

        if not data or "question" not in data:
            return jsonify({
                "status": "error",
                "message": "Question is required"
            }), 400

        question = data["question"].strip()

        if not question:
            return jsonify({
                "status": "error",
                "message": "Question cannot be empty"
            }), 400

        user_id = data.get("user_id")
        session_id = data.get("session_id")
        active_document = data.get("active_document")

        memory_context = ""

        # Safe Mongo memory block
        if user_id and session_id:
            try:
                create_or_get_session(user_id, session_id)

                chat_history = get_chat_history(user_id, session_id)

                memory_context = "\n".join([
                    f"{msg['role']}: {msg['content']}"
                    for msg in chat_history
                ])

            except Exception as memory_error:
                print("Mongo Memory Error:", str(memory_error))

        # Enhanced prompt
        enhanced_question = question

        # Main RAG Answer
        result = answer_document_query(
            query=enhanced_question,
            active_document=active_document
            
        )

        # Safe save block
        if user_id and session_id:
            try:
                save_message(user_id, session_id, "user", question)
                save_message(
                    user_id,
                    session_id,
                    "assistant",
                    result["answer"]
                )
            except Exception as save_error:
                print("Mongo Save Error:", str(save_error))

        return jsonify({
            "status": "success",
            "question": question,
            "answer": result["answer"],
            "sources": result["sources"],
            "session_id": session_id
        }), 200

    except Exception as e:
        print("Ask Route Error:", str(e))

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# @document_bp.route("/history/<user_id>/<session_id>", methods=["GET"])
# def get_session_history(user_id, session_id):
    try:
        history = get_chat_history(user_id, session_id) or []

        return jsonify({
            "status": "success",
            "session_id": session_id,
            "history": history
        }), 200

    except Exception as e:
        print("History Route Error:", str(e))

        return jsonify({
            "status": "success",
            "session_id": session_id,
            "history": []
        }), 200