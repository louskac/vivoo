import { create } from 'zustand';
import { TabId, EventItem, VibeCategory, ActiveModal, PurchasedTicket, TicketDetailSpec, DateFilterType, ExpressOrder } from './types';

interface AppStore {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  
  activeModal: ActiveModal;
  setActiveModal: (modal: ActiveModal) => void;

  isMuted: boolean;
  toggleMute: () => void;
  
  savedEventIds: string[];
  toggleSaveEvent: (id: string) => void;
  
  selectedEvent: EventItem | null;
  setSelectedEvent: (event: EventItem | null) => void;

  selectedTicket: TicketDetailSpec | null;
  setSelectedTicket: (ticket: TicketDetailSpec | null) => void;
  
  userBalance: number;
  topupBalance: (amount: number) => void;
  deductBalance: (amount: number) => boolean;
  
  purchasedTickets: PurchasedTicket[];
  addPurchasedTicket: (ticket: PurchasedTicket) => void;

  gridVibeFilter: VibeCategory;
  setGridVibeFilter: (vibe: VibeCategory) => void;
  
  gridCityFilter: string;
  setGridCityFilter: (city: string) => void;
  
  gridDateFilter: DateFilterType;
  setGridDateFilter: (filter: DateFilterType) => void;
  
  gridSearchQuery: string;
  setGridSearchQuery: (query: string) => void;

  // Live Mode Specific States
  activeLiveEventId: string | null;
  setActiveLiveEventId: (eventId: string | null) => void;

  livePollVotes: Record<string, string>; // pollId -> optionId
  voteLivePoll: (pollId: string, optionId: string) => void;

  isLightshowActive: boolean;
  toggleLightshow: () => void;
  setLightshowActive: (active: boolean) => void;

  expressOrders: ExpressOrder[];
  addExpressOrder: (order: ExpressOrder) => void;

  syncFromContext?: (data: { userBalance?: number; savedEventIds?: string[]; tickets?: any[] }) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  activeTab: 'feed',
  setActiveTab: (tab) => {
    console.log('[AppStore] setActiveTab:', tab);
    set({ activeTab: tab });
  },

  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),
  
  isMuted: true,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  
  savedEventIds: ['metronome_festival', 'concert_hvezdy'],
  toggleSaveEvent: (id) => set((state) => {
    const exists = state.savedEventIds.includes(id);
    return {
      savedEventIds: exists
        ? state.savedEventIds.filter((eId) => eId !== id)
        : [...state.savedEventIds, id]
    };
  }),
  
  selectedEvent: null,
  setSelectedEvent: (event) => set({ selectedEvent: event }),

  selectedTicket: null,
  setSelectedTicket: (ticket) => set({
    selectedTicket: ticket,
    activeModal: ticket ? 'ticket_qr' : null
  }),
  
  userBalance: 2360,
  topupBalance: (amount) => set((state) => ({ userBalance: state.userBalance + amount })),
  deductBalance: (amount) => {
    const current = get().userBalance;
    if (current >= amount) {
      set({ userBalance: current - amount });
      return true;
    }
    return false;
  },

  purchasedTickets: [
    {
      id: 'tkt-1',
      eventId: 'ev-1',
      eventTitle: 'Metronome Festival 2026',
      location: 'Výstaviště Praha',
      date: 'So 20. června · 16:00',
      bgImg: '/images/metronome_festival.jpg',
      tier: 'standard',
      quantity: 2,
      totalPrice: 1200,
      qrCode: 'VIVOO-METRONOME-89214'
    }
  ],
  addPurchasedTicket: (ticket) =>
    set((state) => ({ purchasedTickets: [ticket, ...state.purchasedTickets] })),
  
  gridVibeFilter: 'vse',
  setGridVibeFilter: (vibe) => set({ gridVibeFilter: vibe }),
  
  gridCityFilter: 'all',
  setGridCityFilter: (city) => set({ gridCityFilter: city }),
  
  gridDateFilter: 'all',
  setGridDateFilter: (filter: DateFilterType) => set({ gridDateFilter: filter }),
  
  gridSearchQuery: '',
  setGridSearchQuery: (query: string) => set({ gridSearchQuery: query }),

  // Live Mode Implementations
  activeLiveEventId: 'hradec_pardubice', // Real live match: FC Hradec Králové vs FK Pardubice
  setActiveLiveEventId: (eventId) => set({ activeLiveEventId: eventId }),


  livePollVotes: {},
  voteLivePoll: (pollId, optionId) =>
    set((state) => ({
      livePollVotes: { ...state.livePollVotes, [pollId]: optionId }
    })),

  isLightshowActive: false,
  toggleLightshow: () => set((state) => ({ isLightshowActive: !state.isLightshowActive })),
  setLightshowActive: (active) => set({ isLightshowActive: active }),

  expressOrders: [],
  addExpressOrder: (order) =>
    set((state) => ({ expressOrders: [order, ...state.expressOrders] })),

  syncFromContext: (data) =>
    set((state) => ({
      userBalance: data.userBalance !== undefined ? data.userBalance : state.userBalance,
      savedEventIds: data.savedEventIds !== undefined ? data.savedEventIds : state.savedEventIds,
      purchasedTickets: data.tickets !== undefined ? data.tickets : state.purchasedTickets
    }))
}));

