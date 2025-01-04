import os

def write_files_to_txt(root_dir, output_file, exclude_dirs=None, exclude_files=None):
    """
    Write the content of all files from the root directory to the leaf directory into a .txt file,
    excluding specified directories and files.

    Args:
        root_dir (str): The root directory to start traversing.
        output_file (str): The path to the output .txt file.
        exclude_dirs (list): A list of directory names to exclude.
        exclude_files (list): A list of file names to exclude.
    """
    exclude_dirs = exclude_dirs or []
    exclude_files = exclude_files or []

    with open(output_file, 'w', encoding='utf-8') as out_file:
        for dirpath, dirnames, filenames in os.walk(root_dir):
            # Exclude specified directories
            dirnames[:] = [d for d in dirnames if d not in exclude_dirs]

            for filename in filenames:
                if filename in exclude_files:
                    continue

                file_path = os.path.join(dirpath, filename)
                try:
                    with open(file_path, 'r', encoding='utf-8') as file:
                        content = file.read()
                        out_file.write(f"\n=== Content of {file_path} ===\n")
                        out_file.write(content)
                        out_file.write("\n\n")
                except Exception as e:
                    print(f"Could not read file {file_path}: {e}")

if __name__ == "__main__":
    root_directory = "./"  # Replace with your root directory
    output_txt_file = "output.txt"

    # Directories and files to exclude
    directories_to_exclude = ["node_modules", "out", ".git", "build"]
    files_to_exclude = ["excluded_file.txt", "package-lock.json", "xcript.py"]

    write_files_to_txt(root_directory, output_txt_file, directories_to_exclude, files_to_exclude)
    print(f"Content written to {output_txt_file}")
