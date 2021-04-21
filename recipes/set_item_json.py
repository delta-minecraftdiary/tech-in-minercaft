import json
import time
import requests
from urllib.request import urlopen
from urllib.error import HTTPError
from bs4 import BeautifulSoup as bf


ver = "1.16.5"

def get_items(recipe):
    with open("../sources/inventory/{0}/recipes/{1}.json".format(ver, recipe), mode="r", encoding="UTF-8") as f:
        recipe_json = json.load(f)
        item_list = []
        if recipe_json["type"] == "minecraft:crafting_shaped":
            for item in recipe_json["key"].keys():
                try:
                    if type(recipe_json["key"][item]) is list:
                        for in_item in recipe_json["key"][item]:
                            item_list.append(in_item["item"].replace("minecraft:", ""))
                    else:
                        item_list.append(recipe_json["key"][item]["item"].replace("minecraft:", ""))
                except KeyError:
                    if type(recipe_json["key"][item]) is list:
                        for in_item in recipe_json["key"][item]:
                            item_list.append(in_item["tag"].replace("minecraft:", ""))
                    else:
                        item_list.append(recipe_json["key"][item]["tag"].replace("minecraft:", ""))
        elif (recipe_json["type"] == "minecraft:stonecutting" 
            or recipe_json["type"] == "minecraft:campfire_cooking"
            or recipe_json["type"] == "minecraft:smoking"
            or recipe_json["type"] == "minecraft:smelting"
            or recipe_json["type"] == "minecraft:blasting"):
            try:
                if type(recipe_json["ingredient"]) is list:
                    for item in recipe_json["ingredient"]:
                        item_list.append(item["item"].replace("minecraft:", ""))
                else:
                    item_list.append(recipe_json["ingredient"]["item"].replace("minecraft:", ""))
            except KeyError:
                if type(recipe_json["ingredient"]) is list:
                    for item in recipe_json["ingredient"]:
                        item_list.append(item["tag"].replace("minecraft:", ""))
                item_list.append(recipe_json["ingredient"]["tag"].replace("minecraft:", ""))
        elif recipe_json["type"] == "minecraft:smithing":
            item_list.append(recipe_json["base"]["item"].replace("minecraft:", ""))
            item_list.append(recipe_json["addition"]["item"])
        else:
            for item in recipe_json["ingredients"]:
                try:
                    if type(item) is list:
                        for in_item in item:
                            item_list.append(in_item["item"].replace("minecraft:", ""))
                    else:
                        item_list.append(item["item"].replace("minecraft:", ""))
                except KeyError:
                    if type(item) is list:
                        for in_item in item:
                            item_list.append(in_item["tag"].replace("minecraft:", ""))
                    else:
                        item_list.append(item["tag"].replace("minecraft:", ""))
    item_list = set(item_list)
    return item_list


with open("../sources/inventory/{}/items.json".format(ver), mode="r", encoding="UTF-8") as item_file:
    items_json = json.load(item_file)

url = "https://minecraft.fandom.com/wiki/"
j = 0
http_error = []
value_error = []
'flag_tmp = 0'

for key in items_json[ver]:
    print(key["id"])
    item = key["id"]
    '''if item == "yellow_stained_glass_pane":
        flag_tmp = 1
    if flag_tmp == 0:
        j += 1
        continue'''
    time.sleep(2)
    if "_trapdoor" in item: item = "trapdoor"
    elif "_bed" in item: item = "bed"
    elif "_carpet" in item: item = "carpet"
    elif "_concrete_powder" in item: item = "concrete_powder"
    elif "_terracotta" in item and "glazed" not in item: item = "terracotta"
    elif "_terracotta" in item and "glazed" in item: item = "glazed_terracotta"
    elif "button" in item: item = "button"
    elif "door" in item: item = "door"
    elif "fence_gate" in item: item = "fence_gate"
    elif "fence" in item: item = "fence"
    elif "pressure_plate" in item: item = "pressure_plate"
    elif "sign" in item: item = "sign"
    elif "slab" in item: item = "slab"
    elif "furnace_minecart" in item: item = "minecart_with_furnace"
    elif "jack_o_lantern" in item: item = "jack_o'lantern"
    elif "stripped" in item: item = "Wood"
    try:
        html = urlopen(url + item).read()
    except HTTPError:
        print("!HTTPError:" + item)
        http_error.append(item)
        j += 1
        continue

    soup = bf(html, "html.parser")

    for i in soup.find_all(["h2", "h3", "h4"]):
        text = i.text.replace("[edit]", "").replace("\n", "")
        
        if text == "Contents":
            continue
        elif text == "Obtaining":
            flag = "obtaining"
            continue
        elif text == "Usage":
            flag = "usage"
            continue
        elif text == "Sounds" or text == "Data values" or text == "Behavior":
            break
        items_json[ver][j][flag].append(text)

    for recipe in items_json[ver][j]["recipes"]:
        items = get_items(recipe)
        items_json[ver][j]["crafting"].extend(items)
    items_json[ver][j]["crafting"] = set(items_json[ver][j]["crafting"])
    items_json[ver][j]["url"] = requests.get(url + item).url
    j += 1

with open("../sources/inventory/{}/items.json".format(ver), mode="w", encoding="UTF-8") as json_file:
    json.dump(items_json, json_file)

with open("recipes/error_log.txt", mode="w", encoding="UTF-8") as log:
    log.write("HTTP Error\n" + ",".join(http_error) + "\n")
    log.write("Value Error\n" + ",".join(value_error))