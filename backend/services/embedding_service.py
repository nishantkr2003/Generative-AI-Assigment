from sentence_transformers import SentenceTransformer

from config import Config

# Load model once for performance
embedding_model = SentenceTransformer(Config.EMBEDDING_MODEL)


def generate_embeddings(chunks):
    """
    Convert text chunks into embeddings
    """
    if not chunks:
        raise Exception("No chunks provided for embedding")

    try:
        embeddings = embedding_model.encode(chunks).tolist()

        return {
            "total_chunks": len(chunks),
            "embedding_dimension": len(embeddings[0]) if embeddings else 0,
            "embeddings": embeddings
        }

    except Exception as e:
        raise Exception(f"Embedding generation failed: {str(e)}")