import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .chains import enhance_style, style_mimicry, generate_text, analyze_tone, expand_text
from .style_index import build_user_index, generate_with_style
from . import state
from . import text

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    mode: str
    input_text: str
    genre: str = ""
    style: str = ""
    tone: str = ""

@app.post("/generate/")
def generate(request: PromptRequest):
    return generate_text(request)

@app.post("/analyze/")
def analyze(request: PromptRequest):
    return analyze_tone(request)

@app.post("/expand/")
def expand(request: PromptRequest):
    return expand_text(request)

@app.post("/upload/")
async def upload(file: UploadFile = File(...)):
    try:
        # Ensure the directory exists
        os.makedirs("data/user_writings", exist_ok=True)

        content = await file.read()
        filename = f"data/user_writings/{file.filename}"

        # Save the file
        with open(filename, "wb") as f:
            f.write(content)

        # Get absolute path for parsing
        abs_filename = os.path.abspath(filename)

        # Check if file is supported
        supported_extensions = ['.pdf', '.txt']
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in supported_extensions:
            return {"status": f"Upload failed: unsupported file type {file_ext}. Only .txt and .pdf are allowed."}

        # Parse file
        parsed_text = None
        if file_ext == ".txt":
            with open(abs_filename, "r", encoding="utf-8") as f:
                parsed_text = f.read()
        elif file_ext == ".pdf":
            try:
                import fitz  # PyMuPDF
                doc = fitz.open(abs_filename)
                parsed_text = "\n".join(page.get_text() for page in doc)
            except Exception as e:
                return {"status": f"PDF parsing failed: {str(e)}. PDF support is experimental.", "preview": None}
        if parsed_text is not None:
            # Write to text.py
            with open(os.path.join(os.path.dirname(__file__), "text.py"), "w", encoding="utf-8") as f:
                f.write(f'text = {parsed_text!r}\n')
            preview = parsed_text[:1000]
            return {"status": "Upload and parsing successful.", "preview": preview}
        else:
            return {"status": "Parsing failed.", "preview": None}
    except Exception as e:
        return {"status": f"Upload failed: {str(e)}"}

# Remove the /upload/ endpoint and related logic

# @app.post("/style_generate/")
# def style_generate(request: PromptRequest):
#     return generate_with_style(request.input_text)

@app.post("/enhance/")
async def enhance(request: Request):
    data = await request.json()
    class Req: pass
    req = Req()
    for k, v in data.items():
        setattr(req, k, v)
    return enhance_style(req)

@app.post("/mimic/")
async def mimic(request: Request):
    data = await request.json()
    class Req: pass
    req = Req()
    for k, v in data.items():
        setattr(req, k, v)
    return style_mimicry(req)

@app.get("/test-index/")
def test_index():
    """Test endpoint to check if LlamaIndex is working properly"""
    try:
        from llama_index.core import VectorStoreIndex
        from llama_index.core import Document
        
        # Create a simple test document
        test_doc = Document(text="This is a test document for LlamaIndex.")
        index = VectorStoreIndex.from_documents([test_doc])
        
        return {"status": "LlamaIndex is working properly"}
    except Exception as e:
        return {"status": f"LlamaIndex test failed: {str(e)}"}

from fastapi.responses import FileResponse
from fastapi import Body
from fpdf import FPDF
import tempfile
import os

class PDFExportRequest(BaseModel):
    text: str

@app.post("/export-pdf/")
def export_pdf(request: PDFExportRequest):
    try:
        if not request.text.strip():
            return {"error": "No text provided to export"}
            
        # Create a temporary file
        temp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        pdf = FPDF()
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.set_font("Arial", size=12)

        # Write text line-by-line
        for line in request.text.split("\n"):
            pdf.multi_cell(0, 10, line)

        pdf.output(temp.name)

        # Clean up the temporary file after sending
        def cleanup():
            try:
                os.unlink(temp.name)
            except:
                pass

        return FileResponse(
            path=temp.name,
            media_type="application/pdf",
            filename="quillmate_output.pdf",
            background=cleanup
        )
    except Exception as e:
        return {"error": str(e)}

