import os
from services.pdf_service import extract_pdf_text
from services.docx_service import extract_docx_text
from services.text_service import extract_text_file


def extract_text_from_document(file_path):
    extension = os.path.splitext(file_path)[1].lower()

    if extension == ".pdf":
        return extract_pdf_text(file_path)

    elif extension == ".docx":
        return extract_docx_text(file_path)

    elif extension in [".txt", ".md"]:
        return extract_text_file(file_path)

    else:
        raise Exception("Unsupported file type")