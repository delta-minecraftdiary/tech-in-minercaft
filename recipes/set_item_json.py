import json
import time
import sys
import requests
from urllib.request import urlopen
from urllib.error import HTTPError
from bs4 import BeautifulSoup as bf

buf = ["night_vision", "invisibility", "leaping", "fire_resistance", "swiftness", "slowmess", "turtle_master", "water_breathing", "healing", "harming", "poison", "regeneration", "strength", "weakness", "luck", "slow_falling"]

def modify_name(item):
    names = ["nylium", "planks", "log", "wood", "wool", "slab", "stairs", "glazed_terracotta", "terracotta", "glass_pane", "glass", "concrete_powder", "concrete", "coral_fan", "coral_block", "coral", "sapling", "leaves", "fence_gate", "fence", "wall", "carpet", "shulker_box", "sign", "_bed", "head", "banner_pattern", "banner", "pressure_plate", "trapdoor", "button", "door", "boat", "sword", "helmet", "chestplate", "leggings", "boots", "pickaxe", "axe", "shovel", "hoe", "dye", "spawn_egg", "horse_armor", "music_disc"]
    for name in names:
        if name in item: return name
    for effect in buf:
        if effect in item: return effect

with open("sources/inventory/1.16.5/creative_tab.json", mode="r", encoding="UTF-8") as tab_file:
    tab_json = json.load(tab_file)

with open("sources/inventory/1.16.5/items.json", mode="r", encoding="UTF-8") as before_file:
    items_json = json.load(before_file)

url = "https://minecraft.fandom.com/wiki/"
ver = "1.16.5"

for key in items_json[ver]:
    print(key["id"])
    item = key["id"]
    item = modify_name(item)
    time.sleep(2)
    try:
        html = urlopen(url + item).read()
        soup = bf(html, "html.parser")
    except HTTPError:
        print("!HTTPError:" + item)
        sys.exit()
    
    for tag in soup.find_all(["h2", "h3", "h4"]):
        title = tag.text.replace("[edit]", "").replace("\n", "")
        items_json[ver][j][flag].append(text)


with open("sources/inventory/1.16.5/items.json", mode="w", encoding="UTF-8") as new_file:
    json.dump(items_json, new_file, indent=4)


# def get_items(recipe):
#     with open("sources/inventory/{0}/recipes/{1}.json".format(ver, recipe), mode="r", encoding="UTF-8") as f:
#         recipe_json = json.load(f)
#         item_list = []
#         if recipe_json["type"] == "minecraft:crafting_shaped":
#             for item in recipe_json["key"].keys():
#                 try:
#                     if type(recipe_json["key"][item]) is list:
#                         for in_item in recipe_json["key"][item]:
#                             item_list.append(in_item["item"].replace("minecraft:", ""))
#                     else:
#                         item_list.append(recipe_json["key"][item]["item"].replace("minecraft:", ""))
#                 except KeyError:
#                     if type(recipe_json["key"][item]) is list:
#                         for in_item in recipe_json["key"][item]:
#                             item_list.append(in_item["tag"].replace("minecraft:", ""))
#                     else:
#                         item_list.append(recipe_json["key"][item]["tag"].replace("minecraft:", ""))
#         elif (recipe_json["type"] == "minecraft:stonecutting" 
#             or recipe_json["type"] == "minecraft:campfire_cooking"
#             or recipe_json["type"] == "minecraft:smoking"
#             or recipe_json["type"] == "minecraft:smelting"
#             or recipe_json["type"] == "minecraft:blasting"):
#             try:
#                 if type(recipe_json["ingredient"]) is list:
#                     for item in recipe_json["ingredient"]:
#                         item_list.append(item["item"].replace("minecraft:", ""))
#                 else:
#                     item_list.append(recipe_json["ingredient"]["item"].replace("minecraft:", ""))
#             except KeyError:
#                 if type(recipe_json["ingredient"]) is list:
#                     for item in recipe_json["ingredient"]:
#                         item_list.append(item["tag"].replace("minecraft:", ""))
#                 item_list.append(recipe_json["ingredient"]["tag"].replace("minecraft:", ""))
#         elif recipe_json["type"] == "minecraft:smithing":
#             item_list.append(recipe_json["base"]["item"].replace("minecraft:", ""))
#             item_list.append(recipe_json["addition"]["item"])
#         else:
#             for item in recipe_json["ingredients"]:
#                 try:
#                     if type(item) is list:
#                         for in_item in item:
#                             item_list.append(in_item["item"].replace("minecraft:", ""))
#                     else:
#                         item_list.append(item["item"].replace("minecraft:", ""))
#                 except KeyError:
#                     if type(item) is list:
#                         for in_item in item:
#                             item_list.append(in_item["tag"].replace("minecraft:", ""))
#                     else:
#                         item_list.append(item["tag"].replace("minecraft:", ""))
#     item_list = list(set(item_list))
#     return item_list

# for key in items_json[ver]:
#     print(key["id"])
#     item = key["id"]
#     time.sleep(2)

#     for i in soup.find_all(["h2", "h3", "h4"]):
#         text = i.text.replace("[edit]", "").replace("\n", "")
        
#         if text == "Contents":
#             continue
#         elif text == "Obtaining":
#             flag = "obtaining"
#             continue
#         elif text == "Usage":
#             flag = "usage"
#             continue
#         elif text == "Sounds" or text == "Data values" or text == "Behavior":
#             break
#         items_json[ver][j][flag].append(text)

#     for recipe in items_json[ver][j]["recipes"]:
#         items = get_items(recipe)
#         items_json[ver][j]["crafting"].extend(items)
#     items_json[ver][j]["crafting"] = list(set(items_json[ver][j]["crafting"]))
#     items_json[ver][j]["url"] = requests.get(url + item).url
#     j += 1

# with open("sources/inventory/{}/items.json".format(ver), mode="w", encoding="UTF-8") as json_file:
#     json.dump(items_json, json_file)

# with open("recipes/error_log.txt", mode="w", encoding="UTF-8") as log:
#     log.write("HTTP Error\n" + ",".join(http_error) + "\n")
#     log.write("Value Error\n" + ",".join(value_error))