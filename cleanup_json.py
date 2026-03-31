import json
import collections

def clean_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        # Load JSON into a dictionary, preserving only the last occurrence of duplicate keys
        data = json.load(f)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    clean_json(r'c:\Users\User\Desktop\zero-projects\src\locales\tk.json')
