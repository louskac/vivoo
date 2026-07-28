export type VibeCategory = 'vse' | 'hokej' | 'fotbal' | 'koncerty' | 'festivaly' | 'zoo' | 'vystaviste' | 'florbal' | 'sport' | 'divadlo' | 'party' | 'standup' | 'konference';

export type LiveModuleType = 'timeline' | 'express_bar' | 'crowd_pulse' | 'venue_map' | 'memory_vault';


export interface LiveTimelineItem {
  id: string;
  time: string;
  title: string;
  subtitle?: string;
  status: 'past' | 'live' | 'upcoming';
  badge?: string;
}

export interface LivePollOption {
  id: string;
  label: string;
  votes: number;
}

export interface LivePoll {
  id: string;
  question: string;
  options: LivePollOption[];
  totalVotes: number;
  isActive: boolean;
}

export interface VenuePOI {
  id: string;
  name: string;
  category: 'wc' | 'bar' | 'merch' | 'first_aid' | 'info';
  locationDetail: string;
  queueLevel: 'low' | 'med' | 'high';
  waitTimeMinutes: number;
}

export interface ExpressOrderItem {
  id: string;
  name: string;
  category: 'pivo' | 'nealko' | 'snack' | 'merch';
  price: number;
  volumeOrSize?: string;
  icon: string;
}

export interface ExpressOrder {
  id: string;
  items: Array<{ item: ExpressOrderItem; quantity: number }>;
  totalAmount: number;
  pickupCode: string;
  status: 'ordered' | 'preparing' | 'ready' | 'collected';
  createdAt: string;
}

export interface MatchPlayer {
  id: string;
  name: string;
  lastName?: string;
  number: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  rating?: number;
  avatarUrl?: string;
  xPct?: number;
  yPct?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  isCaptain?: boolean;
}


export interface MatchMomentum {
  homeScore: number;
  awayScore: number;
  homeTeamName?: string;
  awayTeamName?: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  homePossessionPct: number;
  awayPossessionPct: number;
  homeShotsOnTarget: number;
  awayShotsOnTarget: number;
  homeDangerousAttacks: number;
  awayDangerousAttacks: number;
  momentumGraph: number[]; // positive = home team, negative = away team
}

export interface JerseyRaffle {
  title: string;
  playerName: string;
  playerNumber: number;
  totalEntries: number;
}

export interface LiveEventConfig {
  enabled: boolean;
  eventCategoryType: 'sports' | 'festival' | 'concert' | 'theater' | 'zoo' | 'exhibition';
  activeModules: LiveModuleType[];
  statusHeader: string; // e.g. "2nd Period • 14:20", "Main Stage • Raye Live", "Pauza • 10 min"
  statusBadge?: string; // e.g. "LIVE", "POLOČAS", "PRE-SHOW"
  timeline: LiveTimelineItem[];
  polls: LivePoll[];
  pois: VenuePOI[];
  expressMenu: ExpressOrderItem[];
  lightshowPresets?: Array<{ id: string; name: string; colors: string[] }>;
  matchMomentum?: MatchMomentum;
  homeLineup?: MatchPlayer[];
  awayLineup?: MatchPlayer[];
  jerseyRaffle?: JerseyRaffle;
  nextGoalTeamPoll?: LivePoll;
  nextGoalScorerPoll?: LivePoll;
}


export interface EventItem {
  id: string;
  title: string;
  location: string;
  date: string;
  priceMin: number;
  priceMax?: number;
  bgImg: string;
  videoUrl: string;
  tag: string;
  vibe: VibeCategory;
  lineup: string;
  promoter?: string;
  description?: string;
  isFree?: boolean;
  badge?: 'SOLD OUT' | 'VIP' | 'EARLY BIRD' | 'LIMITED' | 'FESTIVAL' | 'HUDBA';
  weather?: { temp: string; text: string; icon: string };
  sectors?: { name: string; price: number; povType: string }[];
  liveConfig?: LiveEventConfig;
}

export interface ActivityItem {
  id: string;
  title: string;
  dateStr: string;
  amount: number;
  isPositive: boolean;
}

export type TabId = 'feed' | 'discover' | 'tickets' | 'profile';

export type TicketTier = 'standard' | 'vip' | 'early_bird' | 'student';

export interface PurchasedTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  location: string;
  date: string;
  bgImg: string;
  tier: TicketTier;
  quantity: number;
  totalPrice: number;
  sectorName?: string;
  qrCode: string;
}

export interface TicketDetailSpec {
  id: string;
  title: string;
  date: string;
  location: string;
  seatDetail: string;
  bgImg: string;
  badge?: string;
  qrCode: string;
  isPast?: boolean;
  eventId?: string;
  isTodayLive?: boolean;
}

export type DateFilterType = 'all' | 'today' | 'tomorrow' | 'weekend' | 'this_month' | 'next_month';

export type ActiveModal =
  | 'checkout'
  | 'topup'
  | 'saved_events'
  | 'rewards'
  | 'my_videos'
  | 'transaction_receipt'
  | 'city_selector'
  | 'date_selector'
  | 'filter_drawer'
  | 'ticket_qr'
  | 'settings'
  | 'ticket_transfer'
  | 'auth'
  | 'edit_profile'
  | 'live_mode'
  | null;


