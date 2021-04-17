import json

with open("images/items/items.json", encoding="UTF-8") as f:
    json_items = json.load(f)

new_json = {"1.16.5":[]}
for element in json_items["1.16.5"]:
    new_json["1.16.5"].append({
        "id":element["id"],
        "tab":element["tab"],
        "group":element["group"],
        "dimension":element["dimension"],
        "obtaining":element["obtaining"],
        "recipes":element["recipes"],
        "usage":element["usage"],
        "crafting":element["crafting"]
    })

with open("images/items/items.json", mode="w", encoding="UTF-8") as g:
    json.dump(new_json, g)