"""Main module for the FastAPI application."""

# Importing necessary libraries
import logging
from typing import List
from fastapi import FastAPI
from models import GraphState
from langchain_community.vectorstores import FAISS
from models import GraphState, SentenceTransformers
from utils import build_lang_graph, store_user_data, create_faiss_db_from_document


logging.basicConfig(logging=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI()


@app.post("/store/user")
async def store_user_info(state: GraphState) -> list:
    """
    Handles a POST request to stores user data in a JSON file,
    and returns the complete list of all user records.

    This function ensures that user information is persisted between sessions
    by saving User's info into a JSON file (`user.json`). If the file
    doesn't exist, it will be created.
    """
    return store_user_data(state)



@app.post("/chat")
async def chat(state:GraphState):

    """
        Retrieves the query information from the User's message.
        This endpoint is run when the user clicks send, thereby sending the message to this endpoint.
    """

    app = build_lang_graph()
    result = app.invoke(state)

    try:
        if result["messages"]:
            reply = result["messages"][-1].content
            logger.info("reply message relayed")
            return reply
        else:
            logger.warning("No response generated")
    except Exception as e:
        raise e
        

            
    









@app.post("/create/FAISS")
async def create_faiss_db(
    documents: List[str],
    model_name: SentenceTransformers = SentenceTransformers.ALL_MINILM_L6_V2,
) -> bool:
    """
    Endpoint to create and save a FAISS vector store from a list of input documents.

    Args:
        documents (List[str]): A list of input text documents to be embedded and indexed.
        model_name (SentenceTransformers, optional): The SentenceTransformer model to use
            for generating embeddings. Defaults to ALL_MINILM_L6_V2.

    Returns:
        True if the function runs as expected, False if not
    """
    return create_faiss_db_from_document(documents, model_name.value)
