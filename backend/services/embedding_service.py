from sentence_transformers import SentenceTransformer
from config import Config

# Lazy-loaded model
_model = None


def get_embedding_model():
    """
    Load embedding model only once
    """
    global _model

    if _model is None:
        _model = SentenceTransformer(
            Config.EMBEDDING_MODEL,
            device="cpu"
        )

    return _model


# Global reusable model
embedding_model = get_embedding_model()


def generate_embeddings(chunks):
    """
    Convert text chunks into embeddings
    """
    if not chunks:
        raise Exception("No chunks provided for embedding")

    try:
        embeddings = embedding_model.encode(
            chunks,
            batch_size=8,
            show_progress_bar=False,
            convert_to_numpy=True,
            normalize_embeddings=True
        ).tolist()

        return {
            "total_chunks": len(chunks),
            "embedding_dimension": len(embeddings[0]) if embeddings else 0,
            "embeddings": embeddings
        }

    except Exception as e:
        raise Exception(f"Embedding generation failed: {str(e)}")