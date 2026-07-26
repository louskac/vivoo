import cv2
import os

videos = [
    ('metronome_festival.mp4', 'metronome_festival.jpg'),
    ('xindl_live.mp4', 'xindl_live.jpg'),
    ('prague_derby.mp4', 'prague_derby.jpg'),
    ('beats_for_love.mp4', 'beats_for_love.jpg'),
    ('labuti_jezero.mp4', 'labuti_jezero.jpg'),
    ('allstar_game.mp4', 'allstar_game.jpg')
]

src_dir = '/Users/jakub/Projects/ViVoo/next-app/public/videos'
out_dirs = [
    '/Users/jakub/Projects/ViVoo/images',
    '/Users/jakub/Projects/ViVoo/next-app/public/images'
]

for out_dir in out_dirs:
    os.makedirs(out_dir, exist_ok=True)

for vid_name, img_name in videos:
    vid_path = os.path.join(src_dir, vid_name)
    if not os.path.exists(vid_path):
        print(f"Skipping {vid_name}: file not found")
        continue

    cap = cv2.VideoCapture(vid_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    frame_no = int(fps * 3) # grab frame at 3 seconds in
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_no)
    
    ret, frame = cap.read()
    if not ret:
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        ret, frame = cap.read()

    if ret:
        for out_dir in out_dirs:
            out_path = os.path.join(out_dir, img_name)
            cv2.imwrite(out_path, frame)
            print(f"Extracted real frame to {out_path}")
    else:
        print(f"Failed to read frame from {vid_name}")
    
    cap.release()

print("All real video frames extracted successfully!")
