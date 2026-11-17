from io import BytesIO
from pathlib import Path

from docx import Document
from fastapi import HTTPException, UploadFile
from pypdf import PdfReader

MAX_FILE_SIZE = 5 * 1024 * 1024
SUPPORTED_EXTENSIONS = {".pdf", ".docx"}


async def extract_resume_text(upload: UploadFile) -> str:
    extension = Path(upload.filename or "").suffix.lower()
    if extension not in SUPPORTED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Upload a PDF or DOCX resume.")

    content = await upload.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Resume files must be 5 MB or smaller.")
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded resume is empty.")

    try:
        if extension == ".pdf":
            text = "\n".join(page.extract_text() or "" for page in PdfReader(BytesIO(content)).pages)
        else:
            document = Document(BytesIO(content))
            text = "\n".join(paragraph.text for paragraph in document.paragraphs)
            text += "\n" + "\n".join(
                cell.text
                for table in document.tables
                for row in table.rows
                for cell in row.cells
            )
    except Exception as exc:
        raise HTTPException(status_code=400, detail="We could not read this file. Try exporting the resume again.") from exc

    clean_text = " ".join(text.split())
    if not clean_text:
        raise HTTPException(
            status_code=400,
            detail="No selectable text was found. Scanned PDFs need OCR before uploading.",
        )
    return clean_text
