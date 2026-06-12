from PIL import Image
import os

input_path = 'public/chat-icon.jpeg'
output_path = 'public/chat-icon.png'

im = Image.open(input_path).convert('RGBA')
data = list(im.getdata())
new_data = []

for r, g, b, a in data:
    if r > 230 and g > 230 and b > 230:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append((r, g, b, 255))

im.putdata(new_data)
im.save(output_path)
print('saved', output_path, 'size=', os.path.getsize(output_path))
