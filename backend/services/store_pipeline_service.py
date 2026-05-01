import os

from services.rag_pipeline_service import prepare_document_for_rag
from services.vector_store_service import store_document_embeddings


def store_document_for_rag(
    file_path,
    filename,
    namespace=None
):
    """
    Full ingestion pipeline:
    Extract -> Chunk -> Embed -> Store
    """
    try:
    
        if not file_path or not os.path.exists(file_path):
            raise Exception("Document not found")

        if not filename:
            raise Exception("Filename is required")

       
        rag_data = prepare_document_for_rag(file_path)

        if not rag_data.get("chunks"):
            raise Exception("No valid chunks generated")

        if not rag_data.get("embeddings"):
            raise Exception("No embeddings generated")

       
        storage_result = store_document_embeddings(
            filename=filename,
            chunks=rag_data["chunks"],
            embeddings=rag_data["embeddings"],
            namespace=namespace
        )


        return {
            "filename": filename,
            "raw_text_length": rag_data["raw_text_length"],
            "total_chunks": rag_data["total_chunks"],
            "embedding_dimension": rag_data["embedding_dimension"],
            "stored_chunks": storage_result["stored_chunks"]
        }

    except Exception as e:
        raise Exception(f"RAG storage pipeline failed: {str(e)}")