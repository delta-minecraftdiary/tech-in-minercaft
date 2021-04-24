import json

ver = "1.16.5"
with open("sources/inventory/{}/items.json".format(ver), mode="r", encoding="UTF-8") as item_file:
    items_json = json.load(item_file)

j = 0
for key in items_json[ver]:
    items_json[ver][j]["crafting"] = list(set(items_json[ver][j]["crafting"]))
    j += 1

with open("sources/inventory/{}/items.json".format(ver), mode="w", encoding="UTF-8") as json_file:
    json.dump(items_json, json_file)