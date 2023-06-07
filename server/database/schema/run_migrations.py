import sys
import os
import subprocess
import re

if len(sys.argv) < 2:
    print("Need database name as first arg")

db_name = sys.argv[1]
dirname = os.path.dirname(__file__)
db_path = os.path.join(dirname, db_name)
print(f"Using DB at path {db_path}, continue?")
input()

print(dirname)
schema_files = [f for f in os.listdir(dirname) if re.search("\.sql$", f)]
schema_files.sort(key=lambda x: re.search("^\d+", x).group())

for file in schema_files:
    full_path = os.path.join(dirname, file)
    print(f"Applying schema file {full_path}")
    subprocess.run(f"cat {full_path} | sqlite3 {db_name}", shell=True)
