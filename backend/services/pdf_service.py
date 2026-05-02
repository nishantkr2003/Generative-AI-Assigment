from pypdf import PdfReader


def extract_pdf_text(file_path):
    try:
        reader = PdfReader(file_path)

        extracted_text = []

        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_text.append(text)

        return "\n".join(extracted_text).strip()

    except Exception as e:
        raise Exception(f"PDF extraction failed: {str(e)}")