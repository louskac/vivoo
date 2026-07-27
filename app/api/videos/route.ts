import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { UserVideoDbModel } from '@/lib/db/schema';

export async function GET() {
  try {
    const db = getDatabase();
    const userId = db.user.id;
    const videos = db.userVideos.filter((v) => v.userId === userId);

    return NextResponse.json({
      success: true,
      videos
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, img, videoUrl } = await request.json();

    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const db = getDatabase();
    const userId = db.user.id;

    const newVid: UserVideoDbModel = {
      id: `v-${Date.now()}`,
      userId,
      title,
      views: '1',
      likes: 0,
      img: img || '/images/metronome_festival.jpg',
      videoUrl: videoUrl || '/videos/metronome_festival.mp4',
      createdAt: new Date().toISOString()
    };

    db.userVideos.unshift(newVid);

    saveDatabase(db);

    return NextResponse.json({
      success: true,
      video: newVid,
      videos: db.userVideos.filter((v) => v.userId === userId)
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
