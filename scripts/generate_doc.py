import os
import glob

BASE_DIR = 'd:/arif/Test'

PATTERNS = [
    # SERVER - Routes, Controllers, Models, Main entry, Auth logic, Middlewares
    "server/src/index.ts",
    "server/src/**/router.ts",
    "server/src/**/controller.ts",
    "server/src/**/service.ts",
    "server/src/**/model.ts",
    "server/src/**/schema.ts",
    "server/src/**/entity.ts",
    "server/src/**/middlewares/**/*.ts",
    "server/src/common/auth/**/*.ts",
    "server/src/common/database/**/*.ts",
    "server/src/common/db/**/*.ts",
    "server/postgres_schema.sql",

    # CLIENT - Core architecture, Auth, main UI components
    "client/src/app/app.routes.ts",
    "client/src/app/app.config.ts",
    "client/src/app/app.component.ts",
    "client/src/app/core/services/**/*.ts",
    "client/src/app/core/interceptors/**/*.ts",
    "client/src/app/core/guards/**/*.ts",
    "client/src/app/0.login/login.component.ts",
    "client/src/app/0.login/login.component.html",
    "client/src/app/8.dashboards/**/*.component.ts",
    "client/src/app/8.dashboards/**/*.component.html",
    "client/src/app/9.evaluation/**/*.component.ts",
    "client/src/app/9.evaluation/**/*.component.html",

    # CROSS-ENCODERS - Core logic
    "cross-encoders/server.py",
    "cross-encoders/cross_encoders.py",
    "cross-encoders/models/**/*.py",
    "cross-encoders/client.py",
    "cross-encoders/requirements.txt"
]

EXCLUDE_PATTERNS = [
    "node_modules", "dist", ".spec.ts", ".test.ts", "__pycache__", "out-tsc", ".angular"
]

def is_excluded(path):
    for ex in EXCLUDE_PATTERNS:
        if ex in path:
            return True
    return False

def generate_document():
    files = set()
    for pattern in PATTERNS:
        full_pattern = os.path.join(BASE_DIR, pattern)
        for filepath in glob.glob(full_pattern, recursive=True):
            filepath = filepath.replace('\\', '/')
            if os.path.isfile(filepath) and not is_excluded(filepath):
                files.add(filepath)

    # Convert to sorted list
    sorted_files = sorted(list(files))

    # Group by directory
    dir_to_files = {}
    for f in sorted_files:
        rel_path = os.path.relpath(f, BASE_DIR).replace('\\', '/')
        directory = os.path.dirname(rel_path)
        if not directory:
            directory = '.'
        
        if directory not in dir_to_files:
            dir_to_files[directory] = []
        dir_to_files[directory].append(f)

    doc_path = os.path.join(BASE_DIR, 'source_code_consolidation.md')
    with open(doc_path, 'w', encoding='utf-8') as out:
        out.write("# 📑 System Architecture & Source Code Documentation\n\n")
        out.write("> This document consolidates important source code spanning the Client (Frontend), Server (Backend), and Cross-Encoder layers.\n\n")
        
        # Sort directories so they group logically
        # Start with server, then cross-encoder, then client
        def dir_sort_key(d):
            if d.startswith('server'): return '1_' + d
            if d.startswith('cross-encoders'): return '2_' + d
            if d.startswith('client'): return '3_' + d
            return '4_' + d
            
        sorted_dirs = sorted(dir_to_files.keys(), key=dir_sort_key)
        
        for directory in sorted_dirs:
            out.write("========================\n")
            out.write(f"📁 {directory}/\n")
            out.write("========\n\n")
            
            for file_path in sorted(dir_to_files[directory]):
                filename = os.path.basename(file_path)
                out.write(f"{filename};\n")
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                except Exception as e:
                    content = f"// Error reading file: {e}"
                
                # Determine language for highlighting
                ext = filename.split('.')[-1].lower() if '.' in filename else ''
                lang = ""
                if ext in ['ts', 'js']: lang = "typescript"
                elif ext in ['html', 'htm']: lang = "html"
                elif ext in ['py']: lang = "python"
                elif ext in ['sql']: lang = "sql"
                elif ext in ['json']: lang = "json"
                elif ext in ['css', 'scss']: lang = "css"
                
                out.write(f"```{lang}\n")
                out.write(content.strip() + "\n")
                out.write("```\n\n")

    print(f"Generated doc with {len(sorted_files)} files at {doc_path}")

if __name__ == '__main__':
    generate_document()
