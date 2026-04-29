from services.embedding_service import embedding_model
from services.vector_store_service import collection


def retrieve_relevant_chunks(query, active_document=None, top_k=4):
    """
    Convert query into embedding and retrieve top matching chunks
    only from the selected active document
    """
    if not query:
        raise Exception("Query is required")

    try:
        # Embed query
        query_embedding = embedding_model.encode(
            [query],
            normalize_embeddings=True
        ).tolist()[0]

        # Optional document filter
        query_params = {
            "query_embeddings": [query_embedding],
            "n_results": top_k
        }

        if active_document:
            query_params["where"] = {
                "filename": active_document
            }

        # Search ChromaDB
        results = collection.query(**query_params)

        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]

        retrieved_chunks = []

        for doc, meta in zip(documents, metadatas):
            retrieved_chunks.append({
                "chunk": doc,
                "filename": meta.get("filename"),
                "chunk_id": meta.get("chunk_id")
            })

        return retrieved_chunks

    except Exception as e:
        raise Exception(f"Retrieval failed: {str(e)}")