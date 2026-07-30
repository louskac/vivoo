'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { mockEvents } from '@/lib/data';
import { Badge } from '@/components/ui/Badge';
import { Volume2, VolumeX, Bookmark, Ticket, MapPin, Calendar, Share2, Heart } from 'lucide-react';
import { VibeCategory, EventItem } from '@/lib/types';

interface FeedVideoItemProps {
  ev: EventItem;
  isCurrent: boolean;
  isMuted: boolean;
  activeTab: string;
}

const FeedVideoItem: React.FC<FeedVideoItemProps> = ({ ev, isCurrent, isMuted, activeTab }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;

    if (isCurrent && activeTab === 'feed') {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Ignore autoplay restriction errors
        });
      }
    } else {
      video.pause();
    }
  }, [isCurrent, isMuted, activeTab]);

  return (
    <video
      ref={videoRef}
      loop
      playsInline
      preload="metadata"
      muted={isMuted}
      className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover z-0"
      src={ev.videoUrl}
      poster={ev.bgImg}
    />
  );
};

export interface StreamFeedItem extends EventItem {
  feedKey: string;
}

export const FeedView: React.FC = () => {
  const isMuted = useAppStore((state) => state.isMuted);
  const toggleMute = useAppStore((state) => state.toggleMute);
  const activeTab = useAppStore((state) => state.activeTab);
  const setSelectedEvent = useAppStore((state) => state.setSelectedEvent);

  const { userVideos, likedVideoIds, savedEventIds, videoStats, toggleLike, toggleSave } = useUser();

  const [activeVibe, setActiveVibe] = useState<VibeCategory>('vse');
  const [playingIndex, setPlayingIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [feedStream, setFeedStream] = useState<StreamFeedItem[]>([]);
  const batchCounterRef = useRef<number>(0);
  const lastTapRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const vibes: { id: VibeCategory; label: string }[] = [
    { id: 'vse', label: 'Vše' },
    { id: 'hokej', label: 'Hokej' },
    { id: 'fotbal', label: 'Fotbal' },
    { id: 'koncerty', label: 'Koncerty' },
    { id: 'festivaly', label: 'Festivaly' },
    { id: 'zoo', label: 'ZOO' },
    { id: 'vystaviste', label: 'Výstaviště' },
    { id: 'florbal', label: 'Florbal' },
    { id: 'sport', label: 'Sport' },
    { id: 'divadlo', label: 'Divadlo' },
    { id: 'standup', label: 'Stand-up' },
    { id: 'konference', label: 'Konference' },
  ];

  // Convert community user uploaded videos to feed event items
  const userEventItems: EventItem[] = userVideos.map((uv) => ({
    id: uv.id,
    title: uv.title,
    tag: 'COMMUNITY',
    vibe: 'vse',
    location: 'Česká Republika',
    date: 'Fanouškovský moment',
    lineup: 'Fanouškovská komunita ViVoo',
    videoUrl: uv.videoUrl || '/videos/metronome_festival.mp4',
    bgImg: uv.img || '/images/metronome_festival.jpg',
    priceMin: 0,
    priceMax: 0,
    isFree: true,
    promoter: 'Fanoušek ViVoo'
  }));

  // Combine user videos + mock events
  const combinedSourceEvents = [...userEventItems, ...mockEvents];
  const filteredEvents = combinedSourceEvents.filter(
    (ev) => activeVibe === 'vse' || ev.vibe === activeVibe
  );

  // Helper to build a batch of feed items with unique stream keys
  const createBatch = useCallback((events: EventItem[], iterations: number = 2): StreamFeedItem[] => {
    if (events.length === 0) return [];
    const result: StreamFeedItem[] = [];
    for (let i = 0; i < iterations; i++) {
      batchCounterRef.current += 1;
      const bId = batchCounterRef.current;
      events.forEach((ev, idx) => {
        result.push({
          ...ev,
          feedKey: `${ev.id}-b${bId}-i${idx}`
        });
      });
    }
    return result;
  }, []);

  // Initialize or reset feed stream when category changes
  useEffect(() => {
    batchCounterRef.current = 0;
    const initialBatch = createBatch(filteredEvents, 3);
    setFeedStream(initialBatch);
    setPlayingIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [activeVibe, userVideos.length, createBatch]);

  // Infinite scroll detection: append more batches dynamically when approaching the end
  const appendMoreItemsIfNeeded = useCallback((currentIndex: number) => {
    if (filteredEvents.length === 0) return;
    if (currentIndex >= feedStream.length - 4) {
      const nextBatch = createBatch(filteredEvents, 2);
      setFeedStream((prev) => [...prev, ...nextBatch]);
    }
  }, [feedStream.length, filteredEvents, createBatch]);

  const currentStreamItem = feedStream[playingIndex] || feedStream[0] || (filteredEvents[0] as StreamFeedItem);
  const realEvent = currentStreamItem
    ? mockEvents.find((e) => e.id === currentStreamItem.id) || currentStreamItem
    : mockEvents[0];

  const isLiked = realEvent ? likedVideoIds.includes(realEvent.id) : false;
  const isSaved = realEvent ? savedEventIds.includes(realEvent.id) : false;
  
  const rawLikeCount = realEvent ? (videoStats[realEvent.id]?.likesCount ?? 1420) : 1420;
  const formattedLikeCount = rawLikeCount >= 1000 ? `${(rawLikeCount / 1000).toFixed(1)}k` : `${rawLikeCount}`;

  const handleDoubleTapLike = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (realEvent) {
        toggleLike(realEvent.id);
      }
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 900);
    }
    lastTapRef.current = now;
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share && realEvent) {
      navigator.share({
        title: realEvent.title,
        url: window.location.href
      }).catch(() => {});
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const itemHeight = containerRef.current.clientHeight;
    if (itemHeight > 0) {
      const idx = Math.round(containerRef.current.scrollTop / itemHeight);
      if (idx !== playingIndex && idx >= 0 && idx < feedStream.length) {
        setPlayingIndex(idx);
        appendMoreItemsIfNeeded(idx);
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-black text-white select-none overflow-hidden">
      {/* Top Header Controls (Fixed above all videos) */}
      <div className="fixed top-12 left-4 right-4 z-30 flex items-center pointer-events-auto">
        {/* Vibe Category Topics Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full flex-nowrap shrink">
          {vibes.map((vibe) => (
            <button
              key={vibe.id}
              onClick={(e) => {
                e.stopPropagation();
                setActiveVibe(vibe.id);
              }}
              className={`feed-glass-pill whitespace-nowrap shrink-0 ${activeVibe === vibe.id ? 'active' : ''}`}
            >
              {vibe.label}
            </button>
          ))}
        </div>
      </div>

      {/* Static Fixed Action Column */}
      {realEvent && (
        <div className="fixed right-6 bottom-[calc(290px+env(safe-area-inset-bottom,0px))] z-30 flex flex-col items-center gap-4 pointer-events-auto">
          {/* Like / Heart Reaction Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(realEvent.id);
            }}
            className="flex flex-col items-center gap-0.5 text-white group cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-9 h-9 flex items-center justify-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <Heart className={`w-6 h-6 stroke-[2.2] ${isLiked ? 'fill-red-500 stroke-red-500 text-red-500 animate-pulse' : 'stroke-white'}`} />
            </div>
            <span className="text-[0.68rem] font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              {formattedLikeCount}
            </span>
          </button>

          {/* Uložit Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(realEvent.id);
            }}
            className="flex flex-col items-center gap-0.5 text-white group cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-9 h-9 flex items-center justify-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <Bookmark className={`w-6 h-6 stroke-[2.2] ${isSaved ? 'fill-white stroke-white' : 'stroke-white'}`} />
            </div>
            <span className="text-[0.72rem] font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">Uložit</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-0.5 text-white group cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-9 h-9 flex items-center justify-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <Share2 className="w-6 h-6 stroke-[2.2] stroke-white" />
            </div>
            <span className="text-[0.68rem] font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              {copied ? 'Kopírováno' : 'Sdílet'}
            </span>
          </button>

          {/* Lístek Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEvent(realEvent);
            }}
            className="flex flex-col items-center gap-0.5 text-white group cursor-pointer active:scale-95 transition-transform"
            aria-label="Lístek"
          >
            <div className="w-9 h-9 flex items-center justify-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <Ticket className="w-6 h-6 stroke-[2.2] stroke-white" />
            </div>
            <span className="text-[0.72rem] font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">Lístek</span>
          </button>
        </div>
      )}

      {/* Native Vertical Scroll-Snap Feed Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      >
        {feedStream.map((ev: StreamFeedItem, idx: number) => {
          const isCurrent = idx === playingIndex;

          return (
            <div
              key={ev.feedKey}
              onClick={handleDoubleTapLike}
              className="relative w-full h-screen snap-start snap-always shrink-0 overflow-hidden bg-black cursor-pointer"
            >
              {/* Double Tap Floating Heart Pop Micro-Animation */}
              {showHeartPop && isCurrent && (
                <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center animate-bounce duration-300">
                  <div className="bg-black/40 backdrop-blur-md p-6 rounded-full border border-white/20 animate-ping">
                    <Heart className="w-20 h-20 fill-red-500 text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.9)]" />
                  </div>
                </div>
              )}

              {/* Background Poster Image (Guaranteed fallback layer) */}
              <img
                src={ev.bgImg}
                alt={ev.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Controlled Background Video */}
              <FeedVideoItem
                ev={ev}
                isCurrent={isCurrent}
                isMuted={isMuted}
                activeTab={activeTab}
              />

              {/* Scrim Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

              {/* Bottom Event Meta Details */}
              <div className="absolute left-4 right-4 bottom-[calc(108px+env(safe-area-inset-bottom,0px))] z-20 flex flex-col items-start gap-1.5 pointer-events-auto">
                {/* Enigoo Tag & Promoter */}
                <div className="flex items-center gap-2 flex-wrap max-w-full">
                  <Badge text={ev.tag} variant="red" />
                  {ev.promoter && (
                    <span className="text-[0.68rem] text-white/90 font-extrabold tracking-wider uppercase bg-black/40 border border-white/20 backdrop-blur-md px-3 py-1 rounded-full truncate max-w-full">
                      {ev.promoter}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(ev);
                  }}
                  className="text-2xl font-black text-white leading-tight cursor-pointer hover:underline drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                >
                  {ev.title}
                </h1>

                {/* Clean Location & Datetime Row */}
                <div className="flex items-center gap-x-2 gap-y-0.5 text-[0.75rem] text-white/95 font-medium flex-wrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  <span className="flex items-center gap-1 shrink-0">
                    <MapPin className="w-3.5 h-3.5 stroke-[1.8] text-white shrink-0" />
                    {ev.location}
                  </span>
                  <span className="text-white/60">•</span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar className="w-3.5 h-3.5 stroke-[1.8] text-white shrink-0" />
                    {ev.date}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
