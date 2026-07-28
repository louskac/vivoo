export interface TxlineEvent {
  FixtureId: number;
  GameState: string;
  StartTime: number;
  Action: string;
  Clock?: {
    Seconds: number;
  };
  Participant?: number; // 1 = Home, 2 = Away
  Score?: {
    Participant1?: { Total?: { Goals?: number } };
    Participant2?: { Total?: { Goals?: number } };
  };
  Data?: {
    PlayerId?: number;
    PlayerName?: string;
    PlayerInId?: number;
    PlayerOutId?: number;
    GoalType?: string;
    Outcome?: string;
    Minutes?: number;
    Conditions?: string[];
    Type?: string;
  };
}

export interface VisualEvent {
  t: number;          // clock seconds
  minute: number;     // display minute
  team: "home" | "away";
  kind: "shot" | "pass" | "event";
  dispMin: number;
  label: string;
  u: number;          // normalized coordinate x (0..1)
  v: number;          // normalized coordinate y (0..1)
  type: string;       // action type
  outcome: string;    // e.g. "OnTarget", "Goal"
  isTouch: boolean;
  len: number;
  long: boolean;
  cross: boolean;
  corner: boolean;
  xg?: number;
  isGoal?: boolean;
  ownGoal?: boolean;
  name?: string;
  surname?: string;
  position?: string;
  fotmobId?: number;
  eu?: number;
  ev?: number;
  through?: boolean;
}

export interface MomentumPoint {
  minute: number;
  v: number; // -1.0 to +1.0
}

export interface MatchStats {
  home: {
    goals: number;
    shots: number;
    corners: number;
    yellows: number;
    reds: number;
  };
  away: {
    goals: number;
    shots: number;
    corners: number;
    yellows: number;
    reds: number;
  };
}

export class VisualizerSynthesizer {
  public static generateMockEvents(
    homeTeam: string,
    awayTeam: string,
    homeScore: number,
    awayScore: number,
    fixtureId: number = 101
  ): TxlineEvent[] {
    const mockEvents: TxlineEvent[] = [];
    let seed = fixtureId || 101;
    const rand = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // Kickoff
    mockEvents.push({
      FixtureId: fixtureId,
      GameState: "inplay",
      StartTime: Date.now() - 5400000,
      Action: "status",
      Clock: { Seconds: 0 },
      Participant: 1
    });

    // Home goals
    const homeScorers = [
      { name: 'Mick van Buren', pos: 'FWD', min: 44 },
      { name: 'František Čech', pos: 'DEF', min: 56 }
    ];
    for (let g = 0; g < homeScore; g++) {
      const scorer = homeScorers[g] || { name: 'Slončík', pos: 'FWD', min: 78 };
      mockEvents.push({
        FixtureId: fixtureId,
        GameState: "inplay",
        StartTime: Date.now(),
        Action: "goal",
        Clock: { Seconds: scorer.min * 60 },
        Participant: 1,
        Data: { PlayerName: scorer.name, Outcome: "Goal" }
      });
    }

    // Away goals
    const awayScorers = [
      { name: 'Tobias Boledovič', pos: 'MID', min: 60 }
    ];
    for (let g = 0; g < awayScore; g++) {
      const scorer = awayScorers[g] || { name: 'Tanko', pos: 'FWD', min: 82 };
      mockEvents.push({
        FixtureId: fixtureId,
        GameState: "inplay",
        StartTime: Date.now(),
        Action: "goal",
        Clock: { Seconds: scorer.min * 60 },
        Participant: 2,
        Data: { PlayerName: scorer.name, Outcome: "Goal" }
      });
    }

    // Shots
    const numShots = 14;
    for (let s = 0; s < numShots; s++) {
      const min = Math.floor(5 + (s / numShots) * 82);
      const team = s % 2 === 0 ? 1 : 2;
      mockEvents.push({
        FixtureId: fixtureId,
        GameState: "inplay",
        StartTime: Date.now(),
        Action: "shot",
        Clock: { Seconds: min * 60 + Math.floor(rand() * 45) },
        Participant: team,
        Data: { Outcome: rand() > 0.4 ? "OnTarget" : "OffTarget" }
      });
    }

    // Corners
    const numCorners = 8;
    for (let c = 0; c < numCorners; c++) {
      const min = Math.floor(8 + (c / numCorners) * 80);
      const team = c % 2 === 0 ? 1 : 2;
      mockEvents.push({
        FixtureId: fixtureId,
        GameState: "inplay",
        StartTime: Date.now(),
        Action: "corner",
        Clock: { Seconds: min * 60 + Math.floor(rand() * 40) },
        Participant: team
      });
    }

    // Danger possessions
    for (let p = 0; p < 25; p++) {
      const min = Math.floor(1 + rand() * 89);
      const team = rand() > 0.45 ? 1 : 2;
      mockEvents.push({
        FixtureId: fixtureId,
        GameState: "inplay",
        StartTime: Date.now(),
        Action: rand() > 0.4 ? "danger_possession" : "high_danger_possession",
        Clock: { Seconds: min * 60 + Math.floor(rand() * 45) },
        Participant: team
      });
    }

    mockEvents.sort((a, b) => (a.Clock?.Seconds || 0) - (b.Clock?.Seconds || 0));
    return mockEvents;
  }

  public static synthesizeTimeline(events: TxlineEvent[]): VisualEvent[] {
    const sorted = [...events]
      .filter(e => e.Clock && e.Clock.Seconds !== undefined)
      .sort((a, b) => (a.Clock?.Seconds || 0) - (b.Clock?.Seconds || 0));

    const out: VisualEvent[] = [];

    for (let i = 0; i < sorted.length; i++) {
      const e = sorted[i];
      const seconds = e.Clock?.Seconds || 0;
      const minute = Math.floor(seconds / 60);
      const team: "home" | "away" = e.Participant === 2 ? "away" : "home";

      let kind: "shot" | "pass" | "event" = "event";
      let isGoal = false;
      let isCorner = false;

      if (e.Action === "goal") {
        kind = "shot";
        isGoal = true;
      } else if (e.Action === "shot") {
        kind = "shot";
      } else if (e.Action === "corner") {
        isCorner = true;
      }

      const seedX = Math.abs(Math.sin((i + 1) * 78.233));
      const seedY = Math.abs(Math.cos((i + 1) * 34.197));
      let u = 0.5;
      let v = 0.5;

      if (isGoal) {
        // Goals are mapped inside the 6-yard or 12-yard box
        u = team === "home" ? 0.88 + seedX * 0.08 : 0.12 - seedX * 0.08;
        v = 0.40 + seedY * 0.20;
      } else if (e.Action === "shot") {
        // Shots are scattered across the 16m penalty box and arc
        u = team === "home" ? 0.76 + seedX * 0.18 : 0.24 - seedX * 0.18;
        v = 0.22 + seedY * 0.56;
      } else if (isCorner) {
        u = team === "home" ? 0.98 : 0.02;
        v = seedY > 0.5 ? 0.96 : 0.04;
      } else if (e.Action.includes("danger")) {
        u = team === "home" ? 0.65 + seedX * 0.25 : 0.35 - seedX * 0.25;
        v = 0.15 + seedY * 0.70;
      }

      let xg = 0;
      if (isGoal) xg = 0.45 + seedX * 0.45;
      else if (e.Action === "shot") xg = 0.05 + seedX * 0.28;

      const playerName = e.Data?.PlayerName || (team === "home" ? "van Buren" : "Boledovič");
      const parts = playerName.split(" ");
      const surname = parts[parts.length - 1] || playerName;
      const name = parts.length > 1 ? parts.slice(0, -1).join(" ") : "Hráč";

      out.push({
        t: seconds,
        minute,
        team,
        kind,
        dispMin: minute,
        label: isGoal ? "GÓL" : (e.Action === "shot" ? "STŘELA" : (e.Action === "corner" ? "ROH" : e.Action.toUpperCase())),
        u,
        v,
        type: e.Action,
        outcome: e.Data?.Outcome || (isGoal ? "Goal" : "Normal"),
        isTouch: false,
        len: 0,
        long: false,
        cross: false,
        corner: isCorner,
        xg,
        isGoal,
        name,
        surname,
        position: isGoal ? "FWD" : "MID"
      });
    }

    return out;
  }

  public static calculateMomentum(events: VisualEvent[], maxMinute = 90): MomentumPoint[] {
    const points: MomentumPoint[] = [];
    const windowSec = 300; // 5 minutes

    for (let m = 0; m <= maxMinute; m++) {
      const centerSec = m * 60;
      let homeScore = 0;
      let awayScore = 0;

      for (const ev of events) {
        const dt = Math.abs(ev.t - centerSec);
        if (dt <= windowSec) {
          const weight = Math.exp(- (dt * dt) / (windowSec * windowSec));
          let val = 0.1;
          if (ev.isGoal) val = 1.0;
          else if (ev.kind === "shot") val = 0.4;
          else if (ev.corner) val = 0.2;
          else if (ev.type.includes("danger")) val = 0.25;

          if (ev.team === "home") homeScore += val * weight;
          else awayScore += val * weight;
        }
      }

      const total = homeScore + awayScore;
      let norm = 0;
      if (total > 0.05) {
        norm = (homeScore - awayScore) / Math.max(total, 1.0);
      }
      points.push({ minute: m, v: Math.max(-1.0, Math.min(1.0, norm)) });
    }

    return points;
  }
}
