import os
from services.document_service import extract_text_from_document
from utils.text_chunker import chunk_text
from services.embedding_service import generate_embeddings


def prepare_document_for_rag(file_path):
    """
    Complete pipeline:
    Extract -> Chunk -> Embed
    """
    if not os.path.exists(file_path):
        raise Exception("Document not found")

    # Step 1: Extract text
    extracted_text = extract_text_from_document(file_path)

    if not extracted_text:
        raise Exception("No readable text found in document")

    # Step 2: Chunk text
    chunks = chunk_text(extracted_text)

    if not chunks:
        raise Exception("Chunk generation failed")

    # Step 3: Generate embeddings
    embedding_data = generate_embeddings(chunks)

    return {
        "raw_text_length": len(extracted_text),
        "total_chunks": len(chunks),
        "embedding_dimension": embedding_data["embedding_dimension"],
        "chunks": chunks,
        "embeddings": embedding_data["embeddings"]
    }