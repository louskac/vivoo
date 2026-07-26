import urllib.request
import json
import os

token = os.environ.get("FIGMA_TOKEN", "")
file_key = "FSD9vQjKoajc5Ve7sosz89"

frames = {
    "tiktok_feed_1": "3056:83",
    "grid_view": "3088:93",
    "detail_akce": "3022:20581",
    "profil": "3118:826",
    "penezenka": "3146:1301",
    "nav_bar": "3054:148"
}

out_dir = "/Users/jakub/.gemini/antigravity/brain/aeb6a1c9-d2cd-4ecf-a437-55424474b909/figma_screens"
os.makedirs(out_dir, exist_ok=True)

ids_str = ",".join(frames.values())
url = f"https://api.figma.com/v1/images/{file_key}?ids={ids_str}&format=png&scale=2"

req = urllib.request.Request(url)
req.add_header("X-Figma-Token", token)

print("Fetching Figma image URLs...")
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode("utf-8"))

images = data.get("images", {})
for name, fid in frames.items():
    img_url = images.get(fid)
    if img_url:
        print(f"Downloading {name} ({fid}) from S3...")
        img_req = urllib.request.Request(img_url, headers={"User-Agent": "Mozilla/5.0"})
        dest = os.path.join(out_dir, f"{name}.png")
        with urllib.request.urlopen(img_req) as img_resp:
            with open(dest, "wb") as f:
                f.write(img_resp.read())
        print(f"Saved {name}.png")
print("ALL_FIGMA_SCREENS_DOWNLOADED_SUCCESSFULLY")
