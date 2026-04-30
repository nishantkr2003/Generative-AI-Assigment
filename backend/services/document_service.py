import os
from services.pdf_service import extract_pdf_text
from services.docx_service import extract_docx_text
from services.text_service import extract_text_file


def extract_text_from_document(file_path):
    """
    Extract text based on document type
    Supports: PDF, DOCX, TXT, MD
    """
    try:
        # =========================
        # STEP 1: Validate file path
        # =========================
        if not file_path:
            raise Exception("File path is required")

        if not os.path.exists(file_path):
            raise Exception("Document not found")

        # =========================
        # STEP 2: Detect extension
        # =========================
        extension = os.path.splitext(file_path)[1].lower()

        # =========================
        # STEP 3: Route extractor
        # =========================
        if extension == ".pdf":
            return extract_pdf_text(file_path)

        elif extension == ".docx":
            return extract_docx_text(file_path)

        elif extension in [".txt", ".md"]:
            return extract_text_file(file_path)

        else:
            raise Exception(
                f"Unsupported file type: {extension}"
            )

    except Exception as e:
        raise Exception(
            f"Document extraction failed: {str(e)}"
        )