def extract_text_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read().strip()

    except Exception as e:
        raise Exception(f"Text file extraction failed: {str(e)}")