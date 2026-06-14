import os

pdf_path = r"c:\Users\Lucas\OneDrive\Desktop\MATA KULIAH SARJANA S1\06_SEMESTER 6\KP\SMAN12\TATA TERTIB SMA NEGERI 12 KOTA TANGERANG SELATAN_revisi 2025.pdf"

try:
    import pypdf
    reader = pypdf.PdfReader(pdf_path)
    print(f"pypdf reader success: {len(reader.pages)} pages")
    text = ""
    for i, page in enumerate(reader.pages):
        text += f"\n--- Page {i+1} ---\n"
        text += page.extract_text() or ""
    with open("pdf_text.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("Saved to pdf_text.txt")
except Exception as e:
    print("pypdf failed:", e)
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(pdf_path)
        print(f"PyPDF2 reader success: {len(reader.pages)} pages")
        text = ""
        for i, page in enumerate(reader.pages):
            text += f"\n--- Page {i+1} ---\n"
            text += page.extract_text() or ""
        with open("pdf_text.txt", "w", encoding="utf-8") as f:
            f.write(text)
        print("Saved to pdf_text.txt")
    except Exception as e2:
        print("PyPDF2 failed:", e2)
