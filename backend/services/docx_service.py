from docx import Document


def extract_docx_text(file_path):
    try:
        doc = Document(file_path)

        extracted_text = []

        for para in doc.paragraphs:
            if para.text.strip():
                extracted_text.append(para.text)

        return "\n".join(extracted_text).strip()

    except Exception as e:
        raise Exception(f"DOCX extraction failed: {str(e)}")