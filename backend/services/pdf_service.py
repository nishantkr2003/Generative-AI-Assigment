from pypdf import PdfReader


def extract_pdf_text(file_path):
    """
    Robust PDF text extraction
    Handles:
    - Broken streams
    - Encrypted PDFs
    - Partial page failures
    """
    try:
        # strict=False ignores minor PDF structural issues
        reader = PdfReader(file_path, strict=False)

        # Handle encrypted PDFs
        if reader.is_encrypted:
            try:
                reader.decrypt("")
            except Exception:
                raise Exception("Encrypted PDF cannot be processed")

        extracted_text = []

        # Process page-by-page safely
        for page_num, page in enumerate(reader.pages):
            try:
                text = page.extract_text()

                if text and text.strip():
                    extracted_text.append(text)

            except Exception as page_error:
                print(f"Skipping page {page_num + 1}: {str(page_error)}")
                continue

        final_text = "\n".join(extracted_text).strip()

        if not final_text:
            raise Exception("No readable text found in PDF")

        return final_text

    except Exception as e:
        raise Exception(f"PDF extraction failed: {str(e)}")