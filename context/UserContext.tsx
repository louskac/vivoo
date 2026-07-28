'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserDbModel, TicketDbModel, TransactionDbModel, UserVideoDbModel, VideoStatsDbModel } from '@/lib/db/schema';
import { useAppStore } from '@/lib/store';

interface UserContextType {
  user: UserDbModel;
  isGuest: boolean;
  likedVideoIds: string[];
  savedEventIds: string[];
  tickets: TicketDbModel[];
  transactions: TransactionDbModel[];
  userVideos: UserVideoDbModel[];
  videoStats: Record<string, VideoStatsDbModel>;
  isLoading: boolean;
  
  toggleLike: (videoId: string) => Promise<boolean>;
  toggleSave: (eventId: string) => Promise<boolean>;
  topupBalance: (amount: number, paymentMethod?: string) => Promise<boolean>;
  purchaseTicket: (data: {
    eventId: string;
    eventTitle: string;
    location: string;
    date: string;
    bgImg: string;
    tier: string;
    quantity: number;
    totalPrice: number;
    sectorName?: string;
  }) => Promise<{ success: boolean; ticket?: TicketDbModel; error?: string }>;
  addUserVideo: (data: { title: string; img?: string; videoUrl?: string }) => Promise<boolean>;
  loginWithPasskey: () => Promise<boolean>;
  loginWithPhone: (phoneNumber: string, otpCode: string) => Promise<boolean>;
  switchProfile: (targetUserId: string) => Promise<boolean>;
  createTesterProfile: (data: { fullName: string; handle: string; memberTier?: string; cashlessCredit?: number }) => Promise<boolean>;
  updateProfile: (data: Partial<UserDbModel>) => Promise<boolean>;
  logoutToGuest: () => Promise<boolean>;
  refreshAllData: () => Promise<void>;
}

const DEFAULT_USER: UserDbModel = {
  id: 'usr-1',
  username: 'novakjan',
  handle: '@novakjan',
  fullName: 'Jan Novák',
  avatarUrl: '/images/avatar.jpg',
  bio: 'Festival enthusiast & music lover',
  memberTier: 'VIP Gold',
  cashlessCredit: 2360
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDbModel>(DEFAULT_USER);
  const [likedVideoIds, setLikedVideoIds] = useState<string[]>(['concert_hvezdy']);
  const [savedEventIds, setSavedEventIds] = useState<string[]>(['metronome_festival', 'concert_hvezdy']);
  const [tickets, setTickets] = useState<TicketDbModel[]>([]);
  const [transactions, setTransactions] = useState<TransactionDbModel[]>([]);
  const [userVideos, setUserVideos] = useState<UserVideoDbModel[]>([]);
  const [videoStats, setVideoStats] = useState<Record<string, VideoStatsDbModel>>({
    metronome_festival: { videoId: 'metronome_festival', likesCount: 1420, viewsCount: 5400 },
    concert_hvezdy: { videoId: 'concert_hvezdy', likesCount: 891, viewsCount: 3200 },
    derby: { videoId: 'derby', likesCount: 3120, viewsCount: 12800 },
    beats_for_love: { videoId: 'beats_for_love', likesCount: 4500, viewsCount: 18900 },
    ballet: { videoId: 'ballet', likesCount: 630, viewsCount: 2100 },
    basketball: { videoId: 'basketball', likesCount: 410, viewsCount: 1800 },
    pardubice_hokej: { videoId: 'pardubice_hokej', likesCount: 2840, viewsCount: 9400 },
    zoo_praha: { videoId: 'zoo_praha', likesCount: 3120, viewsCount: 14200 },
    plzen_hokej: { videoId: 'plzen_hokej', likesCount: 1950, viewsCount: 7800 },
    viktoria_plzen: { videoId: 'viktoria_plzen', likesCount: 2100, viewsCount: 8100 },
    zeme_zivitelka: { videoId: 'zeme_zivitelka', likesCount: 1680, viewsCount: 6200 },
    safari_park: { videoId: 'safari_park', likesCount: 2450, viewsCount: 11300 },
    tatran_florbal: { videoId: 'tatran_florbal', likesCount: 1340, viewsCount: 5100 },
    flora_olomouc: { videoId: 'flora_olomouc', likesCount: 980, viewsCount: 3900 },
    oktagon_mma: { videoId: 'oktagon_mma', likesCount: 5890, viewsCount: 24500 },
    standup_comedy: { videoId: 'standup_comedy', likesCount: 740, viewsCount: 2900 },
    ecommerce_summit: { videoId: 'ecommerce_summit', likesCount: 510, viewsCount: 1900 },
    barum_rally: { videoId: 'barum_rally', likesCount: 3890, viewsCount: 16400 }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const syncAppStore = useAppStore((state) => state.syncFromContext);

  const refreshAllData = useCallback(async () => {
    try {
      const [resUser, resLikes, resSaved, resTickets, resVideos] = await Promise.all([
        fetch('/api/user').then((r) => r.json()),
        fetch('/api/likes').then((r) => r.json()),
        fetch('/api/saved').then((r) => r.json()),
        fetch('/api/tickets').then((r) => r.json()),
        fetch('/api/videos').then((r) => r.json())
      ]);

      if (resUser.success && resUser.data) {
        setUser(resUser.data);
      }
      if (resLikes.success) {
        setLikedVideoIds(resLikes.likedVideoIds || []);
        if (resLikes.videoStats) setVideoStats(resLikes.videoStats);
      }
      if (resSaved.success) {
        setSavedEventIds(resSaved.savedEventIds || []);
      }
      if (resTickets.success) {
        setTickets(resTickets.tickets || []);
      }
      if (resVideos.success) {
        setUserVideos(resVideos.videos || []);
      }
    } catch (err) {
      console.error('[UserContext] Failed to load data from API:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Synchronize state with Zustand store whenever user or saved events change
  useEffect(() => {
    if (syncAppStore) {
      syncAppStore({
        userBalance: user.cashlessCredit,
        savedEventIds,
        tickets
      });
    }
  }, [user, savedEventIds, tickets, syncAppStore]);

  const toggleLike = async (videoId: string): Promise<boolean> => {
    const isCurrentlyLiked = likedVideoIds.includes(videoId);
    const newLikedIds = isCurrentlyLiked
      ? likedVideoIds.filter((id) => id !== videoId)
      : [...likedVideoIds, videoId];

    // Optimistic UI update
    setLikedVideoIds(newLikedIds);
    setVideoStats((prev) => {
      const current = prev[videoId] || { videoId, likesCount: 100, viewsCount: 1000 };
      const delta = isCurrentlyLiked ? -1 : 1;
      return {
        ...prev,
        [videoId]: {
          ...current,
          likesCount: Math.max(0, current.likesCount + delta)
        }
      };
    });

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId })
      }).then((r) => r.json());

      if (res.success) {
        setLikedVideoIds(res.likedVideoIds);
        if (res.videoStats) setVideoStats(res.videoStats);
        return res.isLiked;
      }
    } catch (err) {
      console.error('[UserContext] toggleLike error:', err);
    }
    return !isCurrentlyLiked;
  };

  const toggleSave = async (eventId: string): Promise<boolean> => {
    const isCurrentlySaved = savedEventIds.includes(eventId);
    const newSavedIds = isCurrentlySaved
      ? savedEventIds.filter((id) => id !== eventId)
      : [...savedEventIds, eventId];

    setSavedEventIds(newSavedIds);

    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      }).then((r) => r.json());

      if (res.success) {
        setSavedEventIds(res.savedEventIds);
        return res.isSaved;
      }
    } catch (err) {
      console.error('[UserContext] toggleSave error:', err);
    }
    return !isCurrentlySaved;
  };

  const topupBalance = async (amount: number, paymentMethod = 'apple_pay'): Promise<boolean> => {
    // Optimistic balance update
    setUser((prev) => ({ ...prev, cashlessCredit: prev.cashlessCredit + amount }));

    try {
      const res = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, paymentMethod })
      }).then((r) => r.json());

      if (res.success) {
        setUser((prev) => ({ ...prev, cashlessCredit: res.userBalance }));
        if (res.transactions) setTransactions(res.transactions);
        return true;
      }
    } catch (err) {
      console.error('[UserContext] topupBalance error:', err);
    }
    return false;
  };

  const purchaseTicket = async (data: {
    eventId: string;
    eventTitle: string;
    location: string;
    date: string;
    bgImg: string;
    tier: string;
    quantity: number;
    totalPrice: number;
    sectorName?: string;
  }) => {
    if (user.cashlessCredit < data.totalPrice) {
      return { success: false, error: 'Nedostatečný zůstatek kreditu na účtu.' };
    }

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then((r) => r.json());

      if (res.success) {
        setUser((prev) => ({ ...prev, cashlessCredit: res.userBalance }));
        setTickets(res.tickets);
        if (res.transactions) setTransactions(res.transactions);
        return { success: true, ticket: res.ticket };
      } else {
        return { success: false, error: res.error || 'Nákup se nezdařil.' };
      }
    } catch (err: any) {
      console.error('[UserContext] purchaseTicket error:', err);
      return { success: false, error: err.message };
    }
  };

  const addUserVideo = async (data: { title: string; img?: string; videoUrl?: string }): Promise<boolean> => {
    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then((r) => r.json());

      if (res.success) {
        setUserVideos(res.videos);
        return true;
      }
    } catch (err) {
      console.error('[UserContext] addUserVideo error:', err);
    }
    return false;
  };

  const loginWithPasskey = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'passkey' })
      }).then((r) => r.json());

      if (res.success && res.user) {
        setUser(res.user);
        await refreshAllData();
        return true;
      }
    } catch (err) {
      console.error('[UserContext] loginWithPasskey error:', err);
    }
    return false;
  };

  const loginWithPhone = async (phoneNumber: string, otpCode: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'phone_otp', phoneNumber, otpCode })
      }).then((r) => r.json());

      if (res.success && res.user) {
        setUser(res.user);
        await refreshAllData();
        return true;
      }
    } catch (err) {
      console.error('[UserContext] loginWithPhone error:', err);
    }
    return false;
  };

  const switchProfile = async (targetUserId: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'switch_demo', targetUserId })
      }).then((r) => r.json());

      if (res.success && res.user) {
        setUser(res.user);
        await refreshAllData();
        return true;
      }
    } catch (err) {
      console.error('[UserContext] switchProfile error:', err);
    }
    return false;
  };

  const createTesterProfile = async (data: { fullName: string; handle: string; memberTier?: string; cashlessCredit?: number }): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_tester', ...data })
      }).then((r) => r.json());

      if (res.success && res.user) {
        setUser(res.user);
        await refreshAllData();
        return true;
      }
    } catch (err) {
      console.error('[UserContext] createTesterProfile error:', err);
    }
    return false;
  };

  const updateProfile = async (data: Partial<UserDbModel>): Promise<boolean> => {
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then((r) => r.json());

      if (res.success && res.data) {
        setUser(res.data);
        return true;
      }
    } catch (err) {
      console.error('[UserContext] updateProfile error:', err);
    }
    return false;
  };

  const logoutToGuest = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'guest' })
      }).then((r) => r.json());

      if (res.success && res.user) {
        setUser(res.user);
        await refreshAllData();
        return true;
      }
    } catch (err) {
      console.error('[UserContext] logoutToGuest error:', err);
    }
    return false;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isGuest: !!user.isGuest,
        likedVideoIds,
        savedEventIds,
        tickets,
        transactions,
        userVideos,
        videoStats,
        isLoading,
        toggleLike,
        toggleSave,
        topupBalance,
        purchaseTicket,
        addUserVideo,
        loginWithPasskey,
        loginWithPhone,
        switchProfile,
        createTesterProfile,
        updateProfile,
        logoutToGuest,
        refreshAllData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
};
