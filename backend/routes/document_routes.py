import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

from config import Config
from services.document_service import extract_text_from_document
from services.process_service import process_document

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