'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { TabId } from '@/lib/types';
import { Home, LayoutGrid, Ticket, User } from 'lucide-react';

export const FloatingNavCapsule: React.FC = () => {
  const { activeTab, setActiveTab, selectedEvent } = useAppStore();

  // Hide bottom nav capsule if an event detail modal is active (matching Figma spec)
  if (selectedEvent) return null;

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'feed', label: 'Feed', icon: <Home className="w-5 h-5" /> },
    { id: 'discover', label: 'Prozkoumat', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'tickets', label: 'Lístky', icon: <Ticket className="w-5 h-5" /> },
    { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[360px]">
      <nav className="glass-capsule rounded-full p-1.5 flex items-center justify-between shadow-2xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-white/15 text-white shadow-inner font-semibold scale-105'
                  : 'text-neutral-400 hover:text-white'
              }`}
              aria-label={tab.label}
            >
              {tab.icon}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
