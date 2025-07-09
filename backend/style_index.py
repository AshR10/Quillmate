from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.settings import Settings
import os

index = None

def build_user_index(filepath):
    global index
    try:
        Settings.embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
        documents = SimpleDirectoryReader(input_files=[filepath]).load_data()
        index = VectorStoreIndex.from_documents(documents)
    except Exception as e:
        raise Exception(f"Failed to build index: {str(e)}")

def generate_with_style(prompt):
    global index
    try:
        if index is None:
            return {"output": "Style mimicry is not available."}
        query_engine = index.as_query_engine()
        response = query_engine.query(prompt)
        return {"output": str(response)}
    except Exception as e:
        return {"output": f"Error generating with style: {str(e)}"}