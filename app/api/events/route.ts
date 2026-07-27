import { NextResponse } from 'next/server';
import { mockEvents } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vibe = searchParams.get('vibe');

  let events = mockEvents;
  if (vibe && vibe !== 'all') {
    events = events.filter((e) => e.vibe === vibe);
  }

  return NextResponse.json({
    success: true,
    data: events
  });
}
