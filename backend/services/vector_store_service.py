from pinecone import Pinecone, ServerlessSpec

from config import Config


# =========================
# Initialize Pinecone
# =========================
pc = Pinecone(api_key=Config.PINECONE_API_KEY)


# =========================
# Create index if missing
# =========================
existing_indexes = [index["name"] for index in pc.list_indexes()]

if Config.PINECONE_INDEX_NAME not in existing_indexes:
    pc.create_index(
        name=Config.PINECONE_INDEX_NAME,
        dimension=Config.EMBEDDING_DIMENSION,
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        )
    )


# =========================
# Connect to index
# =========================
index = pc.Index(Config.PINECONE_INDEX_NAME)


def delete_document_by_filename(filename):
    """
    Prevent duplicate uploads by deleting old vectors
    """
    try:
        index.delete(
            filter={
                "filename": {"$eq": filename}
            }
        )
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
        raise Exception("Chunks and embeddings count mismatch")

    try:
        # =========================
        # STEP 1: Remove old file vectors
        # =========================
        delete_document_by_filename(filename)

        # =========================
        # STEP 2: Build vectors
        # =========================
        vectors = []

        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):

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
            raise Exception("No valid vectors to store")

        # =========================
        # STEP 3: Pinecone upsert
        # =========================
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
        raise Exception(f"Pinecone storage failed: {str(e)}")