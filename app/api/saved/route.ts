import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = getDatabase();
    const userId = db.user.id;
    const savedEventIds = db.savedEvents.filter((s) => s.userId === userId).map((s) => s.eventId);

    return NextResponse.json({
      success: true,
      savedEventIds
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { eventId } = await request.json();
    if (!eventId) {
      return NextResponse.json({ success: false, error: 'eventId is required' }, { status: 400 });
    }

    const db = getDatabase();
    const userId = db.user.id;

    const existingIndex = db.savedEvents.findIndex((s) => s.userId === userId && s.eventId === eventId);
    let isSaved = false;

    if (existingIndex >= 0) {
      db.savedEvents.splice(existingIndex, 1);
      isSaved = false;
    } else {
      db.savedEvents.push({
        userId,
        eventId,
        createdAt: new Date().toISOString()
      });
      isSaved = true;
    }

    saveDatabase(db);

    const savedEventIds = db.savedEvents.filter((s) => s.userId === userId).map((s) => s.eventId);

    return NextResponse.json({
      success: true,
      eventId,
      isSaved,
      savedEventIds
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
