export type VibeCategory = 'vse' | 'hokej' | 'fotbal' | 'koncerty' | 'festivaly' | 'zoo' | 'vystaviste' | 'florbal' | 'sport' | 'divadlo' | 'party' | 'standup' | 'konference';

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
  | null;

