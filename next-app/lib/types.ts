export type VibeCategory = 'vse' | 'koncerty' | 'festivaly' | 'sport' | 'divadlo' | 'party' | 'standup';

export interface EventItem {
  id: string;
  title: string;
  location: string;
  date: string;
  priceMin: number;
  bgImg: string;
  videoUrl: string;
  tag: string;
  vibe: VibeCategory;
  lineup: string;
  promoter: string;
  description: string;
  isFree?: boolean;
  badge?: 'SOLD OUT' | 'VIP' | 'EARLY BIRD' | 'LIMITED' | 'FESTIVAL' | 'HUDBA';
}

export interface ActivityItem {
  id: string;
  title: string;
  dateStr: string;
  amount: number;
  isPositive: boolean;
}

export type TabId = 'feed' | 'discover' | 'tickets' | 'profile';
