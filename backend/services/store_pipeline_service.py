import os

from services.rag_pipeline_service import prepare_document_for_rag
from services.vector_store_service import store_document_embeddings


def store_document_for_rag(file_path, filename):
    """
    Full ingestion pipeline:
    Extract -> Chunk -> Embed -> Store
    """
    if not os.path.exists(file_path):
        raise Exception("Document not found")

    # Prepare document
    rag_data = prepare_document_for_rag(file_path)

    # Store in vector DB
    storage_result = store_document_embeddings(
        filename=filename,
        chunks=rag_data["chunks"],
        embeddings=rag_data["embeddings"]
    )

    return {
        "filename": filename,
        "raw_text_length": rag_data["raw_text_length"],
        "total_chunks": rag_data["total_chunks"],
        "embedding_dimension": rag_data["embedding_dimension"],
        "stored_chunks": storage_result["stored_chunks"]
    }