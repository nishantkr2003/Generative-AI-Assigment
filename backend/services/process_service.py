import os

from services.document_service import extract_text_from_document
from utils.text_chunker import chunk_text


def process_document(file_path):
    """
    Full processing pipeline:
    Extract text -> Clean -> Chunk
    """
    if not os.path.exists(file_path):
        raise Exception("Document not found")

    # Extract text from document
    extracted_text = extract_text_from_document(file_path)

    if not extracted_text:
        raise Exception("No readable text found in document")

    # Chunk text
    chunks = chunk_text(extracted_text)

    if not chunks:
        raise Exception("Chunk generation failed")

    return {
        "raw_text_length": len(extracted_text),
        "total_chunks": len(chunks),
        "chunks": chunks
    }

