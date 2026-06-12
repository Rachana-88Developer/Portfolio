"""
Remove checkerboard v6 - Aggressive cleanup of remaining grey patches
in hair strands and small locations. Multiple passes with expanding radius.
"""
from PIL import Image
import os

INPUT = r"d:\Resumes\Portfolio\assets\rachu-avatar.png"
OUTPUT = r"d:\Resumes\Portfolio\assets\rachu-avatar.png"

img = Image.open(INPUT).convert("RGBA")
pixels = img.load()
w, h = img.size

total_cleaned = 0

for pass_num in range(5):
    cleaned = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            spread = max(r, g, b) - min(r, g, b)
            avg = (r + g + b) // 3
            # Grey pixel detection
            if spread < 25 and 50 <= avg <= 230:
                # Count transparent neighbours in radius
                t_count = 0
                total = 0
                radius = 2 + pass_num  # Expand each pass
                for dy in range(-radius, radius + 1):
                    for dx in range(-radius, radius + 1):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < w and 0 <= ny < h and (dx != 0 or dy != 0):
                            total += 1
                            if pixels[nx, ny][3] == 0:
                                t_count += 1
                # If touching enough transparent pixels, it's a leftover patch
                if total > 0 and t_count / total > 0.20:
                    pixels[x, y] = (0, 0, 0, 0)
                    cleaned += 1
    total_cleaned += cleaned
    print(f"Pass {pass_num + 1}: cleaned {cleaned} pixels")
    if cleaned == 0:
        break

img.save(OUTPUT, "PNG")
print(f"Total cleaned: {total_cleaned}. Saved to {OUTPUT}")
