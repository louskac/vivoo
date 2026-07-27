export type VibeCategory = 'vse' | 'koncerty' | 'festivaly' | 'sport' | 'divadlo' | 'party' | 'standup';

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

export type ActiveModal =
  | 'checkout'
  | 'topup'
  | 'saved_events'
  | 'rewards'
  | 'my_videos'
  | 'transaction_receipt'
  | 'city_selector'
  | 'filter_drawer'
  | null;

