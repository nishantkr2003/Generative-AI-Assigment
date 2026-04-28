import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

from config import Config
from backend.services.document_service import extract_text_from_pdf

pdf_bp = Blueprint("pdf_bp", __name__)

ALLOWED_EXTENSIONS = {"pdf"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@pdf_bp.route("/upload", methods=["POST"])
def upload_pdf():
    try:
        # Validate file exists
        if "file" not in request.files:
            return jsonify({
                "status": "error",
                "message": "No file part in request"
            }), 400

        file = request.files["file"]

        # Validate filename
        if file.filename == "":
            return jsonify({
                "status": "error",
                "message": "No file selected"
            }), 400

        # Validate extension
        if not allowed_file(file.filename):
            return jsonify({
                "status": "error",
                "message": "Only PDF files are allowed"
            }), 400

        # Ensure upload directory exists
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

        # Secure file name
        filename = secure_filename(file.filename)

        # Save file
        file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(file_path)

        # Extract text
        extracted_text = extract_text_from_pdf(file_path)

        if not extracted_text:
            return jsonify({
                "status": "error",
                "message": "No readable text found in PDF"
            }), 400

        return jsonify({
            "status": "success",
            "message": "PDF uploaded and processed successfully",
            "filename": filename,
            "text_length": len(extracted_text),
            "preview": extracted_text[:1500]
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500