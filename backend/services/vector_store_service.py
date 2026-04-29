import chromadb
from chromadb.config import Settings

from config import Config

# Persistent Chroma client
chroma_client = chromadb.PersistentClient(path=Config.CHROMA_DIR)

# Collection
collection = chroma_client.get_or_create_collection(
    name="documents"
)


def store_document_embeddings(filename, chunks, embeddings):
    """
    Store document chunks + embeddings in ChromaDB
    """
    if not chunks or not embeddings:
        raise Exception("Chunks or embeddings missing")

    ids = []
    metadatas = []

    for i, chunk in enumerate(chunks):
        ids.append(f"{filename}_chunk_{i}")

        metadatas.append({
            "filename": filename,
            "chunk_id": i
        })

    try:
        collection.add(
            ids=ids,
            documents=chunks,
            embeddings=embeddings,
            metadatas=metadatas
        )

        return {
            "filename": filename,
            "stored_chunks": len(chunks)
        }

    except Exception as e:
        raise Exception(f"ChromaDB storage failed: {str(e)}")