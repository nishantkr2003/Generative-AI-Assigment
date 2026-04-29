from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

from config import Config
from services.retrieval_service import retrieve_relevant_chunks


# Load Groq LLM
llm = ChatGroq(
    groq_api_key=Config.GROQ_API_KEY,
    model_name=Config.GROQ_MODEL
)


def answer_document_query(query):
    """
    Full RAG QA:
    Query -> Retrieve -> Answer
    """
    if not query:
        raise Exception("Query is required")

    # Step 1: Retrieve relevant chunks
    retrieved_chunks = retrieve_relevant_chunks(query)

    if not retrieved_chunks:
        raise Exception("No relevant document context found")

    # Step 2: Build context
    context = "\n\n".join(
        [chunk["chunk"] for chunk in retrieved_chunks]
    )

    # Step 3: Prompt Template
    prompt = ChatPromptTemplate.from_template(
        """
        You are a document assistant.
        Answer ONLY from the provided document context.
        If answer is not available, say:
        "The document does not contain that information."

        Context:
        {context}

        Question:
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
        "answer": response.content,
        "sources": retrieved_chunks
    }