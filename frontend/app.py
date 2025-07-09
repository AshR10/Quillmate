import gradio as gr
import requests
from fpdf import FPDF



def generate(mode, genre, tone, input_text):
    try:
        data = {"mode": mode, "input_text": input_text, "genre": genre, "tone": tone}
        response = requests.post("http://localhost:8000/generate/", json=data)
        return response.json()["output"]
    except Exception as e:
        return f"Error: {str(e)}"

def expand(input_text, mode):
    try:
        data = {"mode": mode, "input_text": input_text}
        response = requests.post("http://localhost:8000/expand/", json=data)
        return response.json()["output"]
    except Exception as e:
        return f"Error: {str(e)}"

def analyze(input_text):
    try:
        data = {"input_text": input_text, "mode": "", "genre": "", "tone": ""}
        response = requests.post("http://localhost:8000/analyze/", json=data)
        return response.json()["output"]
    except Exception as e:
        return f"Error: {str(e)}"

def style_generate(prompt):
    try:
        data = {"input_text": prompt, "mode": "", "genre": "", "tone": "", "style": ""}
        response = requests.post("http://localhost:8000/enhance/", json=data)
        return response.json()["output"]
    except Exception as e:
        return f"Error: {str(e)}"

def upload_file(file):
    if file is None:
        return "Please select a file first"
    try:
        with open(file.name, "rb") as f:
            files = {"file": (file.name, f)}
            response = requests.post("http://localhost:8000/upload/", files=files)
            return response.json()["status"]
    except Exception as e:
        return f"Error: {str(e)}"

def enhance(input_text):
    try:
        data = {"input_text": input_text, "mode": "", "genre": "", "tone": "", "style": ""}
        response = requests.post("http://localhost:8000/enhance/", json=data)
        return response.json()["output"]
    except Exception as e:
        return f"Error: {str(e)}"


def export_to_pdf(text, filename="quillmate_output.pdf"):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_font("Arial", size=12)

    for line in text.split("\n"):
        pdf.multi_cell(0, 10, line)

    path = f"./{filename}"
    pdf.output(path)
    return path

def handle_pdf_export(text):
    if not text.strip():
        return None
    return export_to_pdf(text)

modes = ["Story", "Poem", "Microfiction", "Dialogue"]

with gr.Blocks() as app:
    gr.Markdown("""
        <h1 style="text-align: center; font-size: 3.5rem; margin-bottom: 0.2rem; margin-top: 0;">🪶QuillMate</h1>
        <p style="text-align: center; font-size: 1.8rem; font-style: italic; color: #ccc; margin-bottom: 1.5rem;">
        AI-Powered Creative Writing Assistant
        </p>
        """)
    with gr.Tab("🧠 Idea Generator"):
        genre = gr.Textbox(label="Genre")
        tone = gr.Textbox(label="Tone")
        prompt = gr.Textbox(label="Start with...", lines=4)
        mode = gr.Dropdown(modes, label="Mode", value="Story")
        generate_btn = gr.Button("Generate")
        output = gr.Textbox(label="Generated Text", lines=8)
        download_btn = gr.Button("Export as PDF")
        pdf_file = gr.File(label="Download PDF")

        generate_btn.click(fn=generate, inputs=[mode, genre, tone, prompt], outputs=output)
        download_btn.click(fn=handle_pdf_export, inputs=output, outputs=pdf_file)

    with gr.Tab("🧱 Text Expansion"):
        expansion_input = gr.Textbox(label="Your Text", lines=5)
        mode2 = gr.Dropdown(modes, label="Mode", value="Story")
        expand_btn = gr.Button("Expand")
        expansion_output = gr.Textbox(label="Expanded Text", lines=8)
        download_btn2 = gr.Button("Export as PDF")
        pdf_file2 = gr.File(label="Download PDF")

        expand_btn.click(fn=expand, inputs=[expansion_input, mode2], outputs=expansion_output)
        download_btn2.click(fn=handle_pdf_export, inputs=expansion_output, outputs=pdf_file2)

    with gr.Tab("🎭 Tone & Style Analyzer"):
        analyzer_input = gr.Textbox(label="Text to Analyze", lines=5)
        analyze_btn = gr.Button("Analyze Tone & Style")
        analyzer_output = gr.Textbox(label="Analysis", lines=5)

        analyze_btn.click(fn=analyze, inputs=analyzer_input, outputs=analyzer_output)

    with gr.Tab("📚 Style Mimicry"):
        file = gr.File(label="Upload Your Writing Sample")
        upload_btn = gr.Button("Upload")
        mimic_prompt = gr.Textbox(label="Ask AI to write something in your style", lines=4)
        mimic_btn = gr.Button("Generate")
        mimic_output = gr.Textbox(label="Mimicked Output", lines=6)
        download_btn3 = gr.Button("Export as PDF")
        pdf_file3 = gr.File(label="Download PDF")

        upload_btn.click(fn=upload_file, inputs=file)
        mimic_btn.click(fn=style_generate, inputs=mimic_prompt, outputs=mimic_output)
        download_btn3.click(fn=handle_pdf_export, inputs=mimic_output, outputs=pdf_file3)

    with gr.Tab("✍️ Style Enhancer"):
        enhance_input = gr.Textbox(label="Your Writing", lines=5)
        enhance_btn = gr.Button("Enhance Style")
        enhance_output = gr.Textbox(label="Enhanced Version", lines=8)

        enhance_btn.click(fn=enhance, inputs=enhance_input, outputs=enhance_output)


app.launch()
