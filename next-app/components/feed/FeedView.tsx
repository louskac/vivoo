'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { mockEvents } from '@/lib/data';
import { Badge } from '@/components/ui/Badge';
import { Volume2, VolumeX, Bookmark, Ticket, MapPin, Calendar, ChevronUp, ChevronDown } from 'lucide-react';
import { VibeCategory } from '@/lib/types';

export const FeedView: React.FC = () => {
  const { isMuted, toggleMute, savedEventIds, toggleSaveEvent, setSelectedEvent } = useAppStore();
  const [activeVibe, setActiveVibe] = useState<VibeCategory>('vse');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter events by selected category topic
  const filteredEvents = mockEvents.filter((ev) => activeVibe === 'vse' || ev.vibe === activeVibe);
  const currentEvent = filteredEvents[currentIndex % filteredEvents.length] || mockEvents[0];

  const vibes: { id: VibeCategory; label: string }[] = [
    { id: 'vse', label: 'Vše' },
    { id: 'koncerty', label: 'Koncerty' },
    { id: 'festivaly', label: 'Festivaly' },
    { id: 'sport', label: 'Sport' },
    { id: 'party', label: 'Party' },
  ];

  const isSaved = savedEventIds.includes(currentEvent.id);

  const handleNextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredEvents.length);
  };

  const handlePrevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredEvents.length) % filteredEvents.length);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white select-none">
      {/* Background Video */}
      <video
        key={currentEvent.id}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        src={currentEvent.videoUrl}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

      {/* Top Header Controls */}
      <div className="absolute top-12 left-4 right-4 z-20 flex items-center justify-between">
        {/* Vibe Category Topics Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 pr-2">
          {vibes.map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => {
                setActiveVibe(vibe.id);
                setCurrentIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                activeVibe === vibe.id
                  ? 'bg-white text-black shadow-lg scale-105'
                  : 'bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
              }`}
            >
              {vibe.label}
            </button>
          ))}
        </div>

        {/* Mute Button (38px glass circle matching Figma point 1) */}
        <button
          onClick={toggleMute}
          className="w-[38px] h-[38px] shrink-0 rounded-full bg-white/20 border border-white/15 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all shadow-none ml-2"
          aria-label="Sound toggle"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Vertical Swipe Navigation Navigators */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        <button
          onClick={handlePrevVideo}
          className="w-9 h-9 rounded-full bg-black/40 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white active:scale-90 transition-all"
          aria-label="Previous event video"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNextVideo}
          className="w-9 h-9 rounded-full bg-black/40 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white active:scale-90 transition-all"
          aria-label="Next event video"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Right Side Action Buttons (Uložit & Lístek matching Figma point 3) */}
      <div className="absolute right-4 bottom-32 z-20 flex flex-col items-center gap-5">
        {/* Uložit Button */}
        <button
          onClick={() => toggleSaveEvent(currentEvent.id)}
          className="flex flex-col items-center gap-1 text-white group"
        >
          <div className="w-11 h-11 flex items-center justify-center">
            <Bookmark className={`w-7 h-7 stroke-[2.2] ${isSaved ? 'fill-red-500 stroke-red-500' : 'stroke-white'}`} />
          </div>
          <span className="text-[0.72rem] font-semibold text-white drop-shadow">Uložit</span>
        </button>

        {/* Lístek Button */}
        <button
          onClick={() => setSelectedEvent(currentEvent)}
          className="flex flex-col items-center gap-1 text-white group"
        >
          <div className="w-11 h-11 flex items-center justify-center">
            <Ticket className="w-7 h-7 stroke-[2.2] stroke-white" />
          </div>
          <span className="text-[0.72rem] font-semibold text-white drop-shadow">Lístek</span>
        </button>
      </div>

      {/* Bottom Event Meta Details */}
      <div className="absolute left-5 right-20 bottom-24 z-20 flex flex-col items-start gap-2">
        {/* Enigoo Tag & Promoter */}
        <div className="flex items-center gap-2">
          <Badge text={currentEvent.tag} variant="red" />
          <span className="text-[0.68rem] text-white/80 font-bold tracking-wider uppercase bg-black/50 px-2 py-0.5 rounded-md border border-white/10">
            {currentEvent.promoter}
          </span>
        </div>

        {/* Title */}
        <h1
          onClick={() => setSelectedEvent(currentEvent)}
          className="text-2xl font-black text-white leading-tight cursor-pointer hover:underline"
        >
          {currentEvent.title}
        </h1>

        {/* Inline Location & Date */}
        <div className="flex items-center gap-3 text-xs text-white/90 font-medium">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-white/80" />
            {currentEvent.location}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-white/80" />
            {currentEvent.date}
          </span>
        </div>
      </div>
    </div>
  );
};
