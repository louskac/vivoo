export interface UserDbModel {
  id: number;
  username: string;
  passwordHash: string;
  fullName: string;
  bio?: string;
  cashlessCredit: number;
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
  userId: number;
  eventId: string;
  sectorName: string;
  price: number;
  holderName: string;
  status: 'active' | 'used' | 'refunded';
}

export interface ActivityDbModel {
  id: number;
  userId: number;
  type: string;
  title: string;
  time: string;
  amount: number;
}
