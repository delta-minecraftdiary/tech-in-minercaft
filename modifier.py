import glob
import os
import json

with open("sources/inventory/1.16.5/items.json", mode="r", encoding="UTF-8") as items_file:
    items_json = json.load(items_file)

with open("sources/inventory/1.16.5/items.json", mode="w") as new_file:
    json.dump(items_json, new_file, indent=4, ensure_ascii=False)