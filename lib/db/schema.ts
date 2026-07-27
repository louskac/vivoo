export interface UserDbModel {
  id: string;
  username: string;
  handle: string;
  fullName: string;
  avatarUrl: string;
  bio?: string;
  memberTier: string;
  cashlessCredit: number;
  isGuest?: boolean;
  phoneNumber?: string;
}

export interface EventDbModel {
  id: string;
  title: string;
  tag: string;
  vibe: string;
  location: string;
  date: string;
  lineup?: string;
  videoUrl?: string;
  bgImg: string;
  priceMin: number;
  priceMax?: number;
  isFree?: boolean;
}

export interface TicketDbModel {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  location: string;
  date: string;
  bgImg: string;
  tier: string;
  quantity: number;
  totalPrice: number;
  sectorName?: string;
  qrCode: string;
  status: 'active' | 'used' | 'refunded';
  createdAt: string;
}

export interface TransactionDbModel {
  id: string;
  userId: string;
  title: string;
  type: 'topup' | 'ticket' | 'nfc';
  dateStr: string;
  amount: number;
  isPositive: boolean;
  status: string;
  timestamp: string;
}

export interface UserLikeDbModel {
  userId: string;
  videoId: string;
  createdAt: string;
}

export interface UserSavedDbModel {
  userId: string;
  eventId: string;
  createdAt: string;
}

export interface UserVideoDbModel {
  id: string;
  userId: string;
  title: string;
  views: string;
  likes: number;
  img: string;
  videoUrl?: string;
  createdAt: string;
}

export interface VideoStatsDbModel {
  videoId: string;
  likesCount: number;
  viewsCount: number;
}

export interface ViVooDatabaseSchema {
  user: UserDbModel;
  likes: UserLikeDbModel[];
  savedEvents: UserSavedDbModel[];
  tickets: TicketDbModel[];
  transactions: TransactionDbModel[];
  userVideos: UserVideoDbModel[];
  videoStats: Record<string, VideoStatsDbModel>;
}

