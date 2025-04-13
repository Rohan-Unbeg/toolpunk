import os
from pathlib import Path

def generate_folder_structure(start_path=".", output_file="folder_structure.txt", ignore_dirs=[".git", "__pycache__", "node_modules", "venv", ".env"]):
    """
    Generates a visual folder structure starting from `start_path`.
    Saves to `output_file` (default: "folder_structure.txt").
    Skips directories listed in `ignore_dirs`.
    """
    with open(output_file, "w") as f:
        for root, dirs, files in os.walk(start_path):
            # Remove ignored directories
            dirs[:] = [d for d in dirs if d not in ignore_dirs]
            
            level = root.replace(start_path, "").count(os.sep)
            indent = "    " * (level)
            
            # Write current directory
            f.write(f"{indent}{os.path.basename(root)}/\n")
            
            # Write files in directory
            sub_indent = "    " * (level + 1)
            for file in files:
                if file not in ignore_dirs:
                    f.write(f"{sub_indent}{file}\n")

if __name__ == "__main__":
    project_root = input("Enter project path (default: current dir): ") or "."
    generate_folder_structure(project_root)
    print(f"Folder structure saved to 'folder_structure.txt'!")