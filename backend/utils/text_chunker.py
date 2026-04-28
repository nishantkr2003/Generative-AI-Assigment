import re


def clean_text(text):
    """
    Clean extracted text:
    - Remove extra spaces
    - Remove multiple newlines
    - Normalize formatting
    """
    if not text:
        return ""

    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)

    # Normalize line breaks
    text = re.sub(r'\n+', '\n', text)

    return text.strip()


def chunk_text(text, chunk_size=800, overlap=150):
    """
    Split text into overlapping chunks
    """
    cleaned_text = clean_text(text)

    if not cleaned_text:
        return []

    chunks = []
    start = 0

    while start < len(cleaned_text):
        end = start + chunk_size
        chunk = cleaned_text[start:end]

        chunks.append(chunk)

        start += chunk_size - overlap

    return chunks