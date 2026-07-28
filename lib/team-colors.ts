export interface TeamTheme {
  primary: string;
  secondary: string;
  accent: string;
}

export const TEAM_THEMES: Record<string, TeamTheme> = {
  // FK Pardubice - Bright Red & White
  "FK Pardubice": { primary: "#DE1D3E", secondary: "#FFFFFF", accent: "#EF4444" },
  "Pardubice": { primary: "#DE1D3E", secondary: "#FFFFFF", accent: "#EF4444" },
  "PCE": { primary: "#DE1D3E", secondary: "#FFFFFF", accent: "#EF4444" },

  // FC Hradec Králové - Black, White & Slate Silver
  "FC Hradec Králové": { primary: "#94A3B8", secondary: "#E2E8F0", accent: "#CBD5E1" },
  "Hradec Králové": { primary: "#94A3B8", secondary: "#E2E8F0", accent: "#CBD5E1" },
  "HKR": { primary: "#94A3B8", secondary: "#E2E8F0", accent: "#CBD5E1" },

  // SK Slavia Praha - Red & White
  "SK Slavia Praha": { primary: "#E11D48", secondary: "#FFFFFF", accent: "#F43F5E" },
  "Slavia Praha": { primary: "#E11D48", secondary: "#FFFFFF", accent: "#F43F5E" },
  "SLA": { primary: "#E11D48", secondary: "#FFFFFF", accent: "#F43F5E" },

  // AC Sparta Praha - Maroon Crimson Red
  "AC Sparta Praha": { primary: "#B91C1C", secondary: "#F59E0B", accent: "#DC2626" },
  "Sparta Praha": { primary: "#B91C1C", secondary: "#F59E0B", accent: "#DC2626" },
  "SPA": { primary: "#B91C1C", secondary: "#F59E0B", accent: "#DC2626" },

  // FC Viktoria Plzeň - Royal Blue & Red
  "FC Viktoria Plzeň": { primary: "#2563EB", secondary: "#DC2626", accent: "#3B82F6" },
  "Viktoria Plzeň": { primary: "#2563EB", secondary: "#DC2626", accent: "#3B82F6" },
  "PLZ": { primary: "#2563EB", secondary: "#DC2626", accent: "#3B82F6" },

  // FC Baník Ostrava - Cyan / Sky Blue
  "FC Baník Ostrava": { primary: "#0284C7", secondary: "#FFFFFF", accent: "#38BDF8" },
  "Baník Ostrava": { primary: "#0284C7", secondary: "#FFFFFF", accent: "#38BDF8" },
  "FCB": { primary: "#0284C7", secondary: "#FFFFFF", accent: "#38BDF8" },

  // FC Slovan Liberec - Blue & White
  "FC Slovan Liberec": { primary: "#1D4ED8", secondary: "#FFFFFF", accent: "#3B82F6" },
  "Slovan Liberec": { primary: "#1D4ED8", secondary: "#FFFFFF", accent: "#3B82F6" },
  "LIB": { primary: "#1D4ED8", secondary: "#FFFFFF", accent: "#3B82F6" },

  // Bohemians 1905 - Emerald Green & White
  "Bohemians 1905": { primary: "#10B981", secondary: "#FFFFFF", accent: "#34D399" },
  "Bohemians": { primary: "#10B981", secondary: "#FFFFFF", accent: "#34D399" },
  "BOH": { primary: "#10B981", secondary: "#FFFFFF", accent: "#34D399" },

  // FK Jablonec - Forest Green
  "FK Jablonec": { primary: "#15803D", secondary: "#FFFFFF", accent: "#22C55E" },
  "Jablonec": { primary: "#15803D", secondary: "#FFFFFF", accent: "#22C55E" },
  "JAB": { primary: "#15803D", secondary: "#FFFFFF", accent: "#22C55E" },

  // SK Sigma Olomouc - Royal Blue
  "SK Sigma Olomouc": { primary: "#2563EB", secondary: "#FFFFFF", accent: "#60A5FA" },
  "Sigma Olomouc": { primary: "#2563EB", secondary: "#FFFFFF", accent: "#60A5FA" },
  "SIG": { primary: "#2563EB", secondary: "#FFFFFF", accent: "#60A5FA" },

  // FK Teplice - Amber Yellow
  "FK Teplice": { primary: "#EAB308", secondary: "#1D4ED8", accent: "#FACC15" },
  "Teplice": { primary: "#EAB308", secondary: "#1D4ED8", accent: "#FACC15" },
  "TEP": { primary: "#EAB308", secondary: "#1D4ED8", accent: "#FACC15" },

  // FC Zlín - Yellow & Blue
  "FC Zlín": { primary: "#EAB308", secondary: "#2563EB", accent: "#FACC15" },
  "Zlín": { primary: "#EAB308", secondary: "#2563EB", accent: "#FACC15" },
  "ZLN": { primary: "#EAB308", secondary: "#2563EB", accent: "#FACC15" },

  // MFK Karviná - Green & White
  "MFK Karviná": { primary: "#059669", secondary: "#FFFFFF", accent: "#10B981" },
  "Karviná": { primary: "#059669", secondary: "#FFFFFF", accent: "#10B981" },
  "KAR": { primary: "#059669", secondary: "#FFFFFF", accent: "#10B981" },

  // FK Mladá Boleslav - Blue
  "FK Mladá Boleslav": { primary: "#2563EB", secondary: "#FFFFFF", accent: "#3B82F6" },
  "Mladá Boleslav": { primary: "#2563EB", secondary: "#FFFFFF", accent: "#3B82F6" },
  "MBL": { primary: "#2563EB", secondary: "#FFFFFF", accent: "#3B82F6" },

  // SK Dynamo Č. Budějovice - Slate Gray & White
  "SK Dynamo Č. Budějovice": { primary: "#475569", secondary: "#FFFFFF", accent: "#94A3B8" },
  "České Budějovice": { primary: "#475569", secondary: "#FFFFFF", accent: "#94A3B8" },
  "CEB": { primary: "#475569", secondary: "#FFFFFF", accent: "#94A3B8" },

  // 1. FC Slovácko - Navy Blue
  "1. FC Slovácko": { primary: "#1E3A8A", secondary: "#FFFFFF", accent: "#3B82F6" },
  "Slovácko": { primary: "#1E3A8A", secondary: "#FFFFFF", accent: "#3B82F6" },
  "SLO": { primary: "#1E3A8A", secondary: "#FFFFFF", accent: "#3B82F6" },
};

/**
 * Resolves a team's primary kit color dynamically based on its name.
 */
export function getTeamColor(teamName?: string, defaultColor: string = "#94A3B8"): string {
  if (!teamName) return defaultColor;
  const normalized = teamName.trim().toLowerCase();
  
  for (const [key, theme] of Object.entries(TEAM_THEMES)) {
    const k = key.toLowerCase();
    if (normalized.includes(k) || k.includes(normalized)) {
      return theme.primary;
    }
  }
  
  return defaultColor;
}

/**
 * Returns contrasting dynamic colors for Home and Away teams.
 * Ensures that Home and Away never collide with identical colors.
 */
export function getDynamicMatchColors(homeTeamName?: string, awayTeamName?: string) {
  let homeColor = getTeamColor(homeTeamName, "#94A3B8");
  let awayColor = getTeamColor(awayTeamName, "#DE1D3E");

  // If home and away resolve to the exact same hex color, give away team slate/silver contrast
  if (homeColor.toLowerCase() === awayColor.toLowerCase()) {
    awayColor = "#94A3B8";
  }

  return { homeColor, awayColor };
}
