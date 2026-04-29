from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

from config import Config
from services.retrieval_service import retrieve_relevant_chunks


# Load Groq LLM
llm = ChatGroq(
    groq_api_key=Config.GROQ_API_KEY,
    model_name=Config.GROQ_MODEL
)


def answer_document_query(query, active_document=None):
    """
    Full RAG QA:
    Query -> Retrieve -> Answer
    """
    if not query:
        raise Exception("Query is required")

    # Step 1: Retrieve relevant chunks
    retrieved_chunks = retrieve_relevant_chunks(
        query=query,
        active_document=active_document
    )

    if not retrieved_chunks:
        return {
            "question": query,
            "answer": "The document does not contain that information.",
            "sources": []
        }

    # Step 2: Build context
    context = "\n\n".join(
        [chunk["chunk"] for chunk in retrieved_chunks]
    )

    # Step 3: Prompt Template
    prompt = ChatPromptTemplate.from_template(
        """
        You are a highly accurate document assistant.

        STRICT RULES:
        1. Answer ONLY using the provided document context.
        2. Do NOT use outside knowledge.
        3. If answer is missing, reply exactly:
           "The document does not contain that information."
        4. Be concise and factual.

        Document Context:
        {context}

        User Question:
        {question}
        """
    )

    chain = prompt | llm

    # Step 4: Generate answer
    response = chain.invoke({
        "context": context,
        "question": query
    })

    return {
        "question": query,
        "answer": response.content.strip(),
        "sources": retrieved_chunks
    }