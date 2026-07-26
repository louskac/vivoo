import { create } from 'zustand';
import { TabId, EventItem, VibeCategory } from './types';
import { mockEvents } from './data';

interface AppStore {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  
  isMuted: boolean;
  toggleMute: () => void;
  
  savedEventIds: string[];
  toggleSaveEvent: (id: string) => void;
  
  selectedEvent: EventItem | null;
  setSelectedEvent: (event: EventItem | null) => void;
  
  userBalance: number;
  topupBalance: (amount: number) => void;
  
  gridVibeFilter: VibeCategory;
  setGridVibeFilter: (vibe: VibeCategory) => void;
  
  gridCityFilter: string;
  setGridCityFilter: (city: string) => void;
  
  gridSearchQuery: string;
  setGridSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeTab: 'feed',
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  isMuted: true,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  
  savedEventIds: ['ev-1'],
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
  
  userBalance: 2360,
  topupBalance: (amount) => set((state) => ({ userBalance: state.userBalance + amount })),
  
  gridVibeFilter: 'all',
  setGridVibeFilter: (vibe) => set({ gridVibeFilter: vibe }),
  
  gridCityFilter: 'all',
  setGridCityFilter: (city) => set({ gridCityFilter: city }),
  
  gridSearchQuery: '',
  setGridSearchQuery: (query) => set({ gridSearchQuery: query })
}));
