import os
from PIL import Image, ImageDraw, ImageFont

brain_dir = "/Users/jakub/.gemini/antigravity/brain/aeb6a1c9-d2cd-4ecf-a437-55424474b909"
figma_dir = os.path.join(brain_dir, "figma_screens")
app_dir = os.path.join(brain_dir, "app_screens")
comp_dir = os.path.join(brain_dir, "comparisons")
os.makedirs(comp_dir, exist_ok=True)

pairs = [
    ("tiktok_feed_1.png", "app_feed.png", "compare_feed.png", "TikTok Feed Screen"),
    ("grid_view.png", "app_grid.png", "compare_grid.png", "Grid Discovery Screen"),
    ("detail_akce.png", "app_detail.png", "compare_detail.png", "Event Detail Screen"),
    ("profil.png", "app_profile.png", "compare_profile.png", "Profile & Wallet Screen")
]

for figma_file, app_file, out_file, title in pairs:
    figma_path = os.path.join(figma_dir, figma_file)
    app_path = os.path.join(app_dir, app_file)
    out_path = os.path.join(brain_dir, out_file)
    
    if not os.path.exists(figma_path) or not os.path.exists(app_path):
        print(f"Skipping {out_file}, missing input files")
        continue

    img_figma = Image.open(figma_path).convert("RGB")
    img_app = Image.open(app_path).convert("RGB")

    # Resize app image to match Figma image height while preserving aspect ratio
    target_height = img_figma.height
    app_aspect = img_app.width / img_app.height
    new_app_width = int(target_height * app_aspect)
    img_app_resized = img_app.resize((new_app_width, target_height), Image.Resampling.LANCZOS)

    header_height = 80
    gap = 40
    total_width = img_figma.width + new_app_width + gap + 40
    total_height = target_height + header_height + 40

    canvas = Image.new("RGB", (total_width, total_height), (15, 17, 23))
    draw = ImageDraw.Draw(canvas)

    # Draw header text
    try:
        font_title = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
        font_label = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 22)
    except Exception:
        font_title = font_label = ImageFont.load_default()

    draw.text((20, 20), f"Redesign Review: {title}", fill=(255, 255, 255), font=font_title)
    
    # Left Label
    draw.text((20, 50), "FIGMA DESIGN (Reference)", fill=(0, 220, 255), font=font_label)
    # Right Label
    draw.text((20 + img_figma.width + gap, 50), "CURRENT IMPLEMENTATION", fill=(255, 180, 0), font=font_label)

    # Paste images
    canvas.paste(img_figma, (20, header_height))
    canvas.paste(img_app_resized, (20 + img_figma.width + gap, header_height))

    canvas.save(out_path, "PNG")
    print(f"Saved comparison: {out_path}")
