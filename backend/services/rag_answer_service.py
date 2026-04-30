from langchain_groq import ChatGroq

from config import Config
from services.retrieval_service import retrieve_relevant_chunks


# Load Groq LLM
llm = ChatGroq(
    groq_api_key=Config.GROQ_API_KEY,
    model_name=Config.GROQ_MODEL
)


def answer_document_query(query, active_document=None, memory_context=""):
    """
    Full RAG QA:
    Query -> Retrieve -> Answer
    """
    if not query:
        raise Exception("Query is required")

    try:
        # =========================
        # STEP 1: Retrieve relevant chunks
        # =========================
        retrieved_chunks = retrieve_relevant_chunks(
            query=query,
            active_document=active_document
        )

        # Empty retrieval protection
        if not retrieved_chunks:
            return {
                "question": query,
                "answer": "The document does not contain that information.",
                "sources": []
            }

        # =========================
        # STEP 2: Build context
        # =========================
        context = "\n\n".join([
            chunk["chunk"] for chunk in retrieved_chunks
        ])

        # =========================
        # STEP 3: Build exact sources
        # =========================
        sources = [
            {
                "filename": chunk["filename"],
                "chunk_id": chunk["chunk_id"],
                "score": chunk.get("score")
            }
            for chunk in retrieved_chunks
        ]

        # =========================
        # STEP 4: Final Prompt
        # =========================
        final_prompt = f"""
You are an AI document assistant.

Previous conversation:
{memory_context}

Document context:
{context}

Current user question:
{query}

Instructions:
- Answer ONLY from the provided document context
- Use previous conversation only for conversational continuity
- If answer is not explicitly in document context, say exactly:
  "The document does not contain that information."
- Do NOT hallucinate
- Be clear, concise, and precise
"""

        # =========================
        # STEP 5: Generate answer
        # =========================
        response = llm.invoke(final_prompt)

        final_answer = response.content.strip()

        # =========================
        # STEP 6: Final structured response
        # =========================
        return {
            "question": query,
            "answer": final_answer,
            "sources": sources
        }

    except Exception as e:
        raise Exception(f"RAG answer generation failed: {str(e)}")