import { create } from 'zustand';
import { TabId, EventItem, VibeCategory, ActiveModal, PurchasedTicket, TicketDetailSpec } from './types';
import { mockEvents } from './data';

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
  
  gridSearchQuery: string;
  setGridSearchQuery: (query: string) => void;

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
  
  gridSearchQuery: '',
  setGridSearchQuery: (query: string) => set({ gridSearchQuery: query }),

  syncFromContext: (data) =>
    set((state) => ({
      userBalance: data.userBalance !== undefined ? data.userBalance : state.userBalance,
      savedEventIds: data.savedEventIds !== undefined ? data.savedEventIds : state.savedEventIds,
      purchasedTickets: data.tickets !== undefined ? data.tickets : state.purchasedTickets
    }))
}));
