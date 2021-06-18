from PIL import Image
import glob

files = glob.glob("textures/*")

for file in files:
    image = Image.open(file)
    larger_image = image.resize((512, 512))
    larger_image.save("resized/{}".format(file[9:]))
