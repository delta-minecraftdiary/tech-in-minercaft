import json

with open("images/items/items.json", encoding="UTF-8") as f:
    json_items = json.load(f)
    json_items["1.16.5"][0]["obtaining"].append("crafting")

with open("images/items/items.json", mode="w", encoding="UTF-8") as g:
    json.dump(json_items, g)