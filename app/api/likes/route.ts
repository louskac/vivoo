import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = getDatabase();
    const userId = db.user.id;
    const likedVideoIds = db.likes.filter((l) => l.userId === userId).map((l) => l.videoId);

    return NextResponse.json({
      success: true,
      likedVideoIds,
      videoStats: db.videoStats
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { videoId } = await request.json();
    if (!videoId) {
      return NextResponse.json({ success: false, error: 'videoId is required' }, { status: 400 });
    }

    const db = getDatabase();
    const userId = db.user.id;

    // Check if already liked
    const existingIndex = db.likes.findIndex((l) => l.userId === userId && l.videoId === videoId);
    let isLiked = false;

    if (existingIndex >= 0) {
      // Remove like
      db.likes.splice(existingIndex, 1);
      isLiked = false;
    } else {
      // Add like
      db.likes.push({
        userId,
        videoId,
        createdAt: new Date().toISOString()
      });
      isLiked = true;
    }

    // Update video stats
    if (!db.videoStats[videoId]) {
      db.videoStats[videoId] = {
        videoId,
        likesCount: 100,
        viewsCount: 1000
      };
    }

    if (isLiked) {
      db.videoStats[videoId].likesCount += 1;
    } else {
      db.videoStats[videoId].likesCount = Math.max(0, db.videoStats[videoId].likesCount - 1);
    }

    saveDatabase(db);

    const likedVideoIds = db.likes.filter((l) => l.userId === userId).map((l) => l.videoId);

    return NextResponse.json({
      success: true,
      videoId,
      isLiked,
      likesCount: db.videoStats[videoId].likesCount,
      likedVideoIds,
      videoStats: db.videoStats
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
