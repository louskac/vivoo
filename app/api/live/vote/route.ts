import { NextResponse } from 'next/server';
import { MOCK_EVENTS } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, pollId, optionId } = body;

    const event = MOCK_EVENTS.find((e) => e.id === (eventId || 'derby'));
    if (!event || !event.liveConfig) {
      return NextResponse.json({ success: false, error: 'Live event not found' }, { status: 404 });
    }

    const poll = event.liveConfig.polls.find((p: any) => p.id === pollId);
    if (!poll) {
      return NextResponse.json({ success: false, error: 'Poll not found' }, { status: 404 });
    }

    const option = poll.options.find((o: any) => o.id === optionId);

    if (option) {
      option.votes += 1;
      poll.totalVotes += 1;
    }

    return NextResponse.json({
      success: true,
      poll
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
