import { NextRequest, NextResponse } from "next/server";
import { VisualizerSynthesizer } from "@/lib/visualizer-synthesizer";
import { MOCK_EVENTS } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const fixtureId = Number(params?.id) || 101;
    
    // Find match event from mock data or default to Hradec vs Pardubice
    const matchEvent = MOCK_EVENTS.find(e => e.id === 'hradec_pardubice') || MOCK_EVENTS[1];
    
    const homeTeam = matchEvent.title?.split(' vs ')[0] || "FC Hradec Králové";
    const awayTeam = matchEvent.title?.split(' vs ')[1] || "FK Pardubice";

    // Generate mock events for telemetry timeline
    const mockTxline = VisualizerSynthesizer.generateMockEvents(homeTeam, awayTeam, 2, 1, fixtureId);
    const timeline = VisualizerSynthesizer.synthesizeTimeline(mockTxline);
    const momentum = VisualizerSynthesizer.calculateMomentum(timeline, 90);

    // Compute stats
    const homeShots = timeline.filter(e => e.team === 'home' && e.kind === 'shot').length;
    const awayShots = timeline.filter(e => e.team === 'away' && e.kind === 'shot').length;
    const homeGoals = timeline.filter(e => e.team === 'home' && e.isGoal).length;
    const awayGoals = timeline.filter(e => e.team === 'away' && e.isGoal).length;
    const homeCorners = timeline.filter(e => e.team === 'home' && e.corner).length;
    const awayCorners = timeline.filter(e => e.team === 'away' && e.corner).length;

    const stats = {
      home: { goals: homeGoals, shots: homeShots, corners: homeCorners, yellows: 1, reds: 0 },
      away: { goals: awayGoals, shots: awayShots, corners: awayCorners, yellows: 2, reds: 0 }
    };

    return NextResponse.json({
      success: true,
      timeline,
      momentum,
      stats,
      isRich: true
    });
  } catch (err: any) {
    console.error(`Failed to fetch scores:`, err?.message || err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
