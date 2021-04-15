import json
import re
from bs4 import BeautifulSoup as bf
import pandas as pd


def get_group(item):
    return "combat"


def get_image(item):
    return "Apple.png"


def change_list(text):
    soup = bf(text, "html.parser")
    table = soup.find('table')
    rows = table.find_all('tr')
    head = [v.text for v in rows[0].find_all('th')]
    list = [head]
    for row in rows:
        tds = row.find_all('td')
        if len(tds) > 0:
            values = [td.text for td in tds]
            list.append(values)
    return list


ver = "1.0"
with open("recipes/force layout.json", mode="r+", encoding="UTF-8") as fw:
    force_json = json.load(fw)
    with open("images/items/items.json", mode="r", encoding="UTF-8") as fr:
        item_json = json.load(fr)

    for key in item_json[ver]:
        print(key)
        item = key
        obtaining = ""
        usage = ""
        ingredients = []
        flag = False

        with open("recipes/data/{}.txt".format(item), mode="r", encoding="UTF-8") as gr:
            elements = gr.readlines()

        for element in elements:
            if "table" in element:
                list = change_list(element)
                for line in list:
                    if "Rarity color" in line:
                        rarity = list[1][1]
                        break
                    if "Ingredients" in line:
                        for i in range(len(list)):
                            if i == 0:
                                continue
                            if item in line:
                                ingredients.extend(list[i][1].replace("\xa0+", ", ").split())
                            else:
                                crafting_ingredients = list[i][1].replace("\xa0+", ", ").replace(item, "")
                            set(ingredients)
            else:
                if "Usage" in element:
                    flag = True
                    continue
                if flag:
                    usage += element.replace("\n", "") + ", "
                else:
                    obtaining += element.replace("\n", "") + ", "

        item_dict = {
            "id":item,
            "group":get_group(item),
            "image":get_image(item),
            "rarity":rarity,
            "obtaining":obtaining,
            "ingredients":ingredients,
            "usage":usage,
            "crafting":crafting_ingredients
        }
