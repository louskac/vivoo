'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { mockEvents } from '@/lib/data';
import { Badge } from '@/components/ui/Badge';
import { Volume2, VolumeX, Bookmark, Ticket, MapPin, Calendar } from 'lucide-react';
import { VibeCategory } from '@/lib/types';

export const FeedView: React.FC = () => {
  const { isMuted, toggleMute, savedEventIds, toggleSaveEvent, setSelectedEvent } = useAppStore();
  const [activeVibe, setActiveVibe] = React.useState<VibeCategory>('adrenalin');

  const currentEvent = mockEvents[0]; // Koncert pod živými hvězdami

  const vibes: { id: VibeCategory; label: string }[] = [
    { id: 'adrenalin', label: 'Adrenalin' },
    { id: 'party', label: 'Party' },
    { id: 'klid', label: 'Klid' },
  ];

  const isSaved = savedEventIds.includes(currentEvent.id);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white select-none">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src={currentEvent.videoUrl}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

      {/* Top Header Controls */}
      <div className="absolute top-12 left-4 right-4 z-20 flex items-center justify-between">
        {/* Vibe Pill Switcher */}
        <div className="flex items-center gap-2">
          {vibes.map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => setActiveVibe(vibe.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
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
          className="w-[38px] h-[38px] rounded-full bg-white/20 border border-white/15 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all shadow-none"
          aria-label="Sound toggle"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
        {/* Red HUDBA badge matching Figma point 2 */}
        <Badge text={currentEvent.tag} variant="red" />

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
