'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { FeedView } from '@/components/feed/FeedView';
import { DiscoverGrid } from '@/components/discover/DiscoverGrid';
import { ProfileView } from '@/components/profile/ProfileView';
import { EventDetailModal } from '@/components/detail/EventDetailModal';
import { FloatingNavCapsule } from '@/components/ui/FloatingNavCapsule';

export default function Home() {
  const { activeTab } = useAppStore();

  return (
    <main className="relative min-h-screen bg-[#0A0B0E] text-white">
      {/* Screen Views */}
      {activeTab === 'feed' && <FeedView />}
      {activeTab === 'discover' && <DiscoverGrid />}
      {activeTab === 'tickets' && <DiscoverGrid />}
      {activeTab === 'profile' && <ProfileView />}

      {/* Global Event Detail Modal */}
      <EventDetailModal />

      {/* Global Floating Navigation Capsule */}
      <FloatingNavCapsule />
    </main>
  );
}
