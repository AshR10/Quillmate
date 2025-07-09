from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq
from langchain.chains import LLMChain
import os
from dotenv import load_dotenv
from .state import user_sample_text
import importlib

load_dotenv()

# Check if API key is available
api_key = os.getenv("GROQ_API_KEY")

if api_key:
    llm = ChatGroq(
        api_key=api_key,
        model=os.getenv("GROQ_MODEL", "llama3-8b-8192"),
        temperature=0.7,
    )
    llm_available = True
else:
    llm_available = False
    print("❌ GROQ_API_KEY is missing. Please check your .env file.")

def generate_text(request):
    if not llm_available:
        return {"output": "Please configure your GROQ API key in the .env file to use this feature."}

    template = PromptTemplate.from_template(
        "Write a {mode} in the {genre} genre. Tone: {tone}. Start with:\n{input_text}"
    )
    chain = LLMChain(llm=llm, prompt=template)
    return {"output": chain.run(mode=request.mode, genre=request.genre, tone=request.tone, input_text=request.input_text)}

def expand_text(request):
    if not llm_available:
        return {"output": "Please configure your GROQ API key in the .env file to use this feature."}

    template = PromptTemplate.from_template(
        "Continue this {mode} in the same tone and style:\n{input_text}"
    )
    chain = LLMChain(llm=llm, prompt=template)
    return {"output": chain.run(mode=request.mode, input_text=request.input_text)}

def analyze_tone(request):
    if not llm_available:
        return {"output": "Please configure your GROQ API key in the .env file to use this feature."}

    template = PromptTemplate.from_template(
        "Analyze the tone and writing style of the following text:\n{input_text}"
    )
    chain = LLMChain(llm=llm, prompt=template)
    return {"output": chain.run(input_text=request.input_text)}

def enhance_style(request):
    if not llm_available:
        return {"output": "Please configure your GROQ API key in the .env file to use this feature."}
    import importlib
    text_mod = importlib.import_module("backend.text")
    importlib.reload(text_mod)
    sample_text = getattr(text_mod, "text", "")
    input_text = request.input_text if hasattr(request, 'input_text') and request.input_text else ""
    user_request = request.style if hasattr(request, 'style') and request.style else "Rewrite in the uploaded style."
    prompt = (
        "Rewrite the following text in the uploaded style. "
        "Return only the rewritten text, preserving formatting and paragraph breaks. "
        "Do not include explanations, commentary, or bullet points.\n\n"
        f"Sample:\n{sample_text[:2000]}\n\n"
        f"Text to change:\n{input_text}\n"
        f"User request: {user_request}"
    )
    print("[DEBUG] Style Enhancer prompt sent to LLM:\n", prompt[:1000])
    chain = LLMChain(llm=llm, prompt=PromptTemplate.from_template("{prompt}"))
    return {"output": chain.run(prompt=prompt)}

def style_mimicry(request):
    if not llm_available:
        return {"output": "Please configure your GROQ API key in the .env file to use this feature."}
    import importlib
    text_mod = importlib.import_module("backend.text")
    importlib.reload(text_mod)
    sample_text = getattr(text_mod, "text", "")
    input_text = request.input_text if hasattr(request, 'input_text') and request.input_text else ""
    user_request = request.style if hasattr(request, 'style') and request.style else "Mimic the uploaded style."
    prompt = (
        "Rewrite the following text in the uploaded style. "
        "Return only the rewritten text, preserving formatting and paragraph breaks. "
        "Do not include explanations, commentary, or bullet points.\n\n"
        f"Sample:\n{sample_text[:2000]}\n\n"
        f"Text to change:\n{input_text}\n"
        f"User request: {user_request}"
    )
    print("[DEBUG] Style Mimicry prompt sent to LLM:\n", prompt[:1000])
    chain = LLMChain(llm=llm, prompt=PromptTemplate.from_template("{prompt}"))
    return {"output": chain.run(prompt=prompt)}