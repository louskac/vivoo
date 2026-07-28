'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { X, Video, Eye, Heart, Plus, UploadCloud } from 'lucide-react';

export const MyVideosModal: React.FC = () => {
  const { activeModal, setActiveModal } = useAppStore();
  const { userVideos, addUserVideo } = useUser();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  if (activeModal !== 'my_videos') return null;

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await addUserVideo({
      title: newTitle.trim(),
      img: '/images/metronome_festival.jpg',
      videoUrl: '/videos/metronome_festival.mp4'
    });

    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div
      onClick={() => {
        setIsAdding(false);
        setActiveModal(null);
      }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0A0B0E]/95 border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-6 text-white shadow-2xl relative animate-slide-up backdrop-blur-2xl cursor-default"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAdding(false);
            setActiveModal(null);
          }}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 active:scale-90 transition-all cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white">Moje videa</h2>
              <p className="text-xs text-neutral-400">Vaše nahrané momentky z akcí ({userVideos.length})</p>
            </div>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-[#DE1D3E] text-white px-3.5 py-2 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg shadow-red-600/30 hover:bg-red-600 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {isAdding ? 'Zrušit' : 'Přidat'}
          </button>
        </div>

        {/* Add Video Form */}
        {isAdding && (
          <form onSubmit={handleAddSubmit} className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3 animate-fade-in">
            <h4 className="text-xs font-bold text-[#DE1D3E] uppercase tracking-wider">Nahrát nové video</h4>
            <input
              type="text"
              placeholder="Název momentky / akce..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-white/30"
              required
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#DE1D3E] text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-red-600 active:scale-95 transition-all cursor-pointer shadow"
            >
              <UploadCloud className="w-4 h-4" />
              Zveřejnit video moment
            </button>
          </form>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-2 gap-3">
          {userVideos.map((vid) => (
            <div key={vid.id} className="relative aspect-[9/14] rounded-2xl overflow-hidden border border-white/10 group cursor-pointer">
              <img src={vid.img} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1">
                <h4 className="text-xs font-bold text-white line-clamp-1">{vid.title}</h4>
                <div className="flex items-center gap-3 text-[10px] text-neutral-300">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-neutral-400" />
                    {vid.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                    {vid.likes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

