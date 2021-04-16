from urllib.request import urlopen
from urllib.error import HTTPError
from bs4 import BeautifulSoup as bf
import pandas as pd
import json
import time

url = "https://minecraft.fandom.com/wiki/"
ver = "1.0"

with open("images/items/items.json", mode="r", encoding="UTF-8") as f:
    item_json = json.load(f)

for key in item_json[ver]:
    print(key)
    item = key
    time.sleep(1)
    try:
        html = urlopen(url + item.replace(" ", "_")).read()
    except HTTPError:
        continue

    soup = bf(html, "html.parser")
    time.sleep(1)
    try:
        dfs = pd.read_html(url + item.replace(" ", "_"))
    except ValueError:
        continue
    j = 0
    elements = ""

    with open("recipes/data/" + key + ".txt", mode="w", encoding="UTF-8") as g:
        for i in soup.find_all(["h2", "h3", "h4", "table"]):
            if i.name == "table":
                g.write(dfs[j].to_html(index=None, columns=None, na_rep="-").replace("\n", "").replace('"', "'") + "\n")
                j += 1
            else:
                text = i.text.replace("[edit]", "").replace("\n", "")
                if text == "Contents":
                    continue
                if text == "Sounds" or text == "Data values":
                    break
                g.write(text + "\n")