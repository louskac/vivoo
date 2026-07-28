import { NextResponse } from 'next/server';
import { MOCK_EVENTS } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId') || 'derby';

  const event = MOCK_EVENTS.find((e) => e.id === eventId);
  if (!event || !event.liveConfig) {
    return NextResponse.json({ success: false, error: 'Live event config not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    eventId: event.id,
    title: event.title,
    location: event.location,
    liveConfig: event.liveConfig
  });
}
