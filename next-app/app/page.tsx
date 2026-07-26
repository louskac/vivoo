'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { FeedView } from '@/components/feed/FeedView';
import { DiscoverGrid } from '@/components/discover/DiscoverGrid';
import { TicketsView } from '@/components/tickets/TicketsView';
import { ProfileView } from '@/components/profile/ProfileView';
import { EventDetailModal } from '@/components/detail/EventDetailModal';
import { FloatingNavCapsule } from '@/components/ui/FloatingNavCapsule';

export default function Home() {
  const { activeTab } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#0A0B0E] text-white">
      {/* Screen Views (Display Toggled for Instant 0ms Navigation) */}
      <div className={activeTab === 'feed' ? 'block' : 'hidden'}>
        <FeedView />
      </div>
      <div className={activeTab === 'discover' ? 'block' : 'hidden'}>
        <DiscoverGrid />
      </div>
      <div className={activeTab === 'tickets' ? 'block' : 'hidden'}>
        <TicketsView />
      </div>
      <div className={activeTab === 'profile' ? 'block' : 'hidden'}>
        <ProfileView />
      </div>

      {/* Global Event Detail Modal */}
      <EventDetailModal />

      {/* Global Floating Navigation Capsule */}
      <FloatingNavCapsule />
    </main>
  );
}
