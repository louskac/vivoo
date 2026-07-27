'use client';

import React, { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { mockEvents } from '@/lib/data';
import { Badge } from '@/components/ui/Badge';
import { Volume2, VolumeX, Bookmark, Ticket, MapPin, Calendar, Share2, Heart, MessageCircle } from 'lucide-react';
import { VibeCategory, EventItem } from '@/lib/types';

export const FeedView: React.FC = () => {
  const isMuted = useAppStore((state) => state.isMuted);
  const toggleMute = useAppStore((state) => state.toggleMute);
  const savedEventIds = useAppStore((state) => state.savedEventIds);
  const toggleSaveEvent = useAppStore((state) => state.toggleSaveEvent);
  const setSelectedEvent = useAppStore((state) => state.setSelectedEvent);

  const [activeVibe, setActiveVibe] = useState<VibeCategory>('vse');
  const [playingIndex, setPlayingIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const lastTapRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDoubleTapLike = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setLiked(true);
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 900);
    }
    lastTapRef.current = now;
  };

  // Filter events by selected category topic
  const filteredEvents = mockEvents.filter((ev) => activeVibe === 'vse' || ev.vibe === activeVibe);

  const vibes: { id: VibeCategory; label: string }[] = [
    { id: 'vse', label: 'Vše' },
    { id: 'koncerty', label: 'Koncerty' },
    { id: 'festivaly', label: 'Festivaly' },
    { id: 'sport', label: 'Sport' },
    { id: 'party', label: 'Party' },
  ];

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: currentEvent.title,
        url: window.location.href
      }).catch(() => {});
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMute();
  };

  const handleScrollToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    const nextIdx = (playingIndex + 1) % filteredEvents.length;
    containerRef.current.scrollTo({
      top: nextIdx * containerRef.current.clientHeight,
      behavior: 'smooth'
    });
    setPlayingIndex(nextIdx);
  };

  const handleScrollToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    const prevIdx = (playingIndex - 1 + filteredEvents.length) % filteredEvents.length;
    containerRef.current.scrollTo({
      top: prevIdx * containerRef.current.clientHeight,
      behavior: 'smooth'
    });
    setPlayingIndex(prevIdx);
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const itemHeight = containerRef.current.clientHeight;
    if (itemHeight > 0) {
      const idx = Math.round(containerRef.current.scrollTop / itemHeight);
      if (idx !== playingIndex && idx >= 0 && idx < filteredEvents.length) {
        setPlayingIndex(idx);
      }
    }
  };

  const currentEvent = filteredEvents[playingIndex % filteredEvents.length] || mockEvents[0];
  const isSaved = currentEvent ? savedEventIds.includes(currentEvent.id) : false;

  return (
    <div className="relative w-full h-screen bg-black text-white select-none overflow-hidden">
      {/* Top Header Controls (Fixed above all videos) */}
      <div className="fixed top-12 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto">
        {/* Vibe Category Topics Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 pr-2 max-w-[calc(100%-48px)] flex-nowrap shrink">
          {vibes.map((vibe) => (
            <button
              key={vibe.id}
              onClick={(e) => {
                e.stopPropagation();
                setActiveVibe(vibe.id);
                setPlayingIndex(0);
                if (containerRef.current) {
                  containerRef.current.scrollTop = 0;
                }
              }}
              className={`feed-glass-pill ${activeVibe === vibe.id ? 'active' : ''}`}
            >
              {vibe.label}
            </button>
          ))}
        </div>

        {/* Mute Button */}
        <button
          onClick={handleToggleMute}
          className="feed-sound-btn shrink-0 ml-2"
          aria-label="Sound toggle"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Static Fixed Action Column */}
      {currentEvent && (
        <div className="fixed right-6 bottom-[calc(200px+env(safe-area-inset-bottom,0px))] z-30 flex flex-col items-center gap-4 pointer-events-auto">
          {/* Organizer Avatar Circle */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-xl cursor-pointer">
            <img src="/images/avatar.jpg" alt="Organizer" className="w-full h-full object-cover" />
            <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 bg-[#DE1D3E] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
              +
            </div>
          </div>

          {/* Like / Heart Reaction Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className="flex flex-col items-center gap-0.5 text-white group cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-9 h-9 flex items-center justify-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <Heart className={`w-6 h-6 stroke-[2.2] ${liked ? 'fill-red-500 stroke-red-500' : 'stroke-white'}`} />
            </div>
            <span className="text-[0.68rem] font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              {liked ? '1.4k' : '1.4k'}
            </span>
          </button>

          {/* Uložit Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveEvent(currentEvent.id);
            }}
            className="flex flex-col items-center gap-0.5 text-white group cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-9 h-9 flex items-center justify-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <Bookmark className={`w-6 h-6 stroke-[2.2] ${isSaved ? 'fill-red-500 stroke-red-500' : 'stroke-white'}`} />
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
              setSelectedEvent(currentEvent);
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
        {filteredEvents.map((ev: EventItem, idx: number) => {
          const isCurrent = idx === playingIndex;

          return (
            <div
              key={ev.id}
              onClick={handleDoubleTapLike}
              className="relative w-full h-screen snap-start snap-always shrink-0 overflow-hidden bg-black cursor-pointer"
            >
              {/* Double Tap Floating Heart Pop Micro-Animation */}
              {showHeartPop && (
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

              {/* Background Video */}
              <video
                autoPlay={isCurrent}
                loop
                muted={isMuted}
                playsInline
                className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover z-0"
                src={ev.videoUrl}
                poster={ev.bgImg}
              />

              {/* Scrim Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

              {/* Bottom Event Meta Details (Positioned with 20px responsive margin above floating nav capsule) */}
              <div className="absolute left-4 right-4 bottom-[calc(108px+env(safe-area-inset-bottom,0px))] z-20 flex flex-col items-start gap-1.5 pointer-events-auto">
                {/* Enigoo Tag & Promoter */}
                <div className="flex items-center gap-2">
                  <Badge text={ev.tag} variant="red" />
                  {ev.promoter && (
                    <span className="text-[0.68rem] text-white/90 font-extrabold tracking-wider uppercase bg-black/40 border border-white/20 backdrop-blur-md px-3 py-1 rounded-full">
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
