'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { FeedView } from '@/components/feed/FeedView';
import { DiscoverGrid } from '@/components/discover/DiscoverGrid';
import { TicketsView } from '@/components/tickets/TicketsView';
import { ProfileView } from '@/components/profile/ProfileView';
import { EventDetailModal } from '@/components/detail/EventDetailModal';
import { CheckoutModal } from '@/components/detail/CheckoutModal';
import { TopUpModal } from '@/components/profile/TopUpModal';
import { SavedEventsModal } from '@/components/profile/SavedEventsModal';
import { RewardsModal } from '@/components/profile/RewardsModal';
import { MyVideosModal } from '@/components/profile/MyVideosModal';
import { TicketQrModal } from '@/components/detail/TicketQrModal';
import { TicketTransferModal } from '@/components/detail/TicketTransferModal';
import { TicketClaimModal } from '@/components/detail/TicketClaimModal';
import { CitySelectorModal } from '@/components/discover/CitySelectorModal';
import { DateSelectorModal } from '@/components/discover/DateSelectorModal';
import { TransactionHistoryModal } from '@/components/profile/TransactionHistoryModal';
import { SettingsModal } from '@/components/profile/SettingsModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { LiveAmbientBanner } from '@/components/live/LiveAmbientBanner';
import { LiveModeModal } from '@/components/live/LiveModeModal';
import { LightshowOverlay } from '@/components/live/LightshowOverlay';
import { FloatingNavCapsule } from '@/components/ui/FloatingNavCapsule';
import { CreatorStudioModal } from '@/components/creator/CreatorStudioModal';
import { UgcUploadModal } from '@/components/ugc/UgcUploadModal';
import { usePrecacheAppAssets } from '@/lib/precache';

export default function Home() {
  const activeTab = useAppStore((state) => state.activeTab);
  usePrecacheAppAssets();

  React.useEffect(() => {
    (window as any).useAppStore = useAppStore;
  }, []);

  return (
    <main className="relative min-h-screen bg-[#0A0B0E] text-white">
      {/* Context-Aware Live Ambient Top Banner */}
      <LiveAmbientBanner />

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

      {/* Global Interactive Overlays */}
      <CheckoutModal />
      <TopUpModal />
      <SavedEventsModal />
      <RewardsModal />
      <MyVideosModal />
      <TicketQrModal />
      <TicketTransferModal />
      <TicketClaimModal />
      <CitySelectorModal />
      <DateSelectorModal />
      <TransactionHistoryModal />
      <SettingsModal />
      <AuthModal />
      <EditProfileModal />

      {/* Live Event Mode Overlay & Strobe Lightshow */}
      <LiveModeModal />
      <LightshowOverlay />

      {/* Pitch Deck MVP Feature Modals */}
      <CreatorStudioModal />
      <UgcUploadModal />

      {/* Global Floating Navigation Capsule */}
      <FloatingNavCapsule />
    </main>
  );
}


