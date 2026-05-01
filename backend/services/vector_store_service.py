from pinecone import Pinecone, ServerlessSpec

from config import Config



_pc = None
_index = None


def get_pinecone_index():
    """
    Lazy load Pinecone only when needed
    Prevents Render startup OOM
    """
    global _pc, _index

    # Return cached index
    if _index is not None:
        return _index

    # Initialize Pinecone
    _pc = Pinecone(
        api_key=Config.PINECONE_API_KEY
    )

    # Check existing indexes
    existing_indexes = [
        index["name"]
        for index in _pc.list_indexes()
    ]

    # Create if missing
    if Config.PINECONE_INDEX_NAME not in existing_indexes:
        _pc.create_index(
            name=Config.PINECONE_INDEX_NAME,
            dimension=Config.EMBEDDING_DIMENSION,
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )
        )

    # Connect
    _index = _pc.Index(
        Config.PINECONE_INDEX_NAME
    )

    return _index


def delete_document_by_filename(
    filename,
    namespace=None
):
    """
    Prevent duplicate uploads
    """
    try:
        index = get_pinecone_index()

        delete_params = {
            "filter": {
                "filename": {"$eq": filename}
            }
        }

        if namespace:
            delete_params["namespace"] = namespace

        index.delete(**delete_params)

    except Exception:
        pass


def store_document_embeddings(
    filename,
    chunks,
    embeddings,
    namespace=None
):
    """
    Store document chunks + embeddings in Pinecone
    """
    if not filename:
        raise Exception("Filename is required")

    if not chunks or not embeddings:
        raise Exception("Chunks or embeddings missing")

    if len(chunks) != len(embeddings):
        raise Exception(
            "Chunks and embeddings count mismatch"
        )

    try:
        
        index = get_pinecone_index()

       
        delete_document_by_filename(
            filename,
            namespace
        )

        
        vectors = []

        for i, (chunk, embedding) in enumerate(
            zip(chunks, embeddings)
        ):

            if not chunk:
                continue

            vectors.append({
                "id": f"{filename}_chunk_{i}",
                "values": embedding,
                "metadata": {
                    "filename": filename,
                    "chunk_id": i,
                    "text": chunk
                }
            })

        if not vectors:
            raise Exception(
                "No valid vectors to store"
            )

        
        upsert_params = {
            "vectors": vectors
        }

        if namespace:
            upsert_params["namespace"] = namespace

        index.upsert(**upsert_params)

        return {
            "filename": filename,
            "stored_chunks": len(vectors)
        }

    except Exception as e:
        raise Exception(
            f"Pinecone storage failed: {str(e)}"
        )