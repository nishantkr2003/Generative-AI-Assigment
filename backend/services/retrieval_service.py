from config import Config
from services.embedding_service import get_embedding_model
from services.vector_store_service import get_pinecone_index


def retrieve_relevant_chunks(
    query,
    active_document=None,
    top_k=None
):
    """
    Convert query into embedding and retrieve top matching chunks
    only from selected active document
    """
    if not query:
        raise Exception("Query is required")

    try:
        # Use config default if top_k not provided
        top_k = top_k or Config.TOP_K_RESULTS

        # =========================
        # STEP 1: Generate query embedding
        # =========================
        embedding_model = get_embedding_model()
        query_embedding = embedding_model.encode(
            [query],
            normalize_embeddings=True
        ).tolist()[0]

        # =========================
        # STEP 2: Build Pinecone query params
        # =========================
        query_params = {
            "vector": query_embedding,
            "top_k": top_k,
            "include_metadata": True
        }

        # Filter by active document if selected
        if active_document:
            query_params["filter"] = {
                "filename": {"$eq": active_document}
            }

        # =========================
        # STEP 3: Search Pinecone
        # =========================
        index = get_pinecone_index()

        results = index.query(**query_params)

        matches = results.get("matches", [])

        # Empty safety
        if not matches:
            return []

        # =========================
        # STEP 4: Format results
        # =========================
        retrieved_chunks = []

        for match in matches:
            metadata = match.get("metadata", {})

            # Skip invalid chunks
            if not metadata.get("text"):
                continue

            retrieved_chunks.append({
                "chunk": metadata.get("text", ""),
                "filename": metadata.get("filename"),
                "chunk_id": metadata.get("chunk_id"),
                "score": match.get("score", 0)
            })

        return retrieved_chunks

    except Exception as e:
        raise Exception(f"Retrieval failed: {str(e)}")