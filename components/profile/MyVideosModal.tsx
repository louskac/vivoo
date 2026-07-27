'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { X, Video, Eye, Heart, Plus } from 'lucide-react';

export const MyVideosModal: React.FC = () => {
  const { activeModal, setActiveModal } = useAppStore();

  if (activeModal !== 'my_videos') return null;

  const userVideos = [
    { id: 'v-1', title: 'Metronome Open Air Crowd', views: '2.4k', likes: '318', img: '/images/metronome_festival.jpg' },
    { id: 'v-2', title: 'Xindl X Live Front Row', views: '5.1k', likes: '890', img: '/images/xindl_live.jpg' },
    { id: 'v-3', title: 'Derby Atmosphere Smoke', views: '1.2k', likes: '142', img: '/images/prague_derby.jpg' },
    { id: 'v-4', title: 'Beats For Love Main Stage', views: '8.9k', likes: '1.5k', img: '/images/beats_for_love.jpg' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#0F1117] border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-6 text-white shadow-2xl relative animate-slide-up">
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
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

          <button className="bg-[#DE1D3E] text-white p-2.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg shadow-red-600/30 hover:bg-red-600 active:scale-95 transition-all">
            <Plus className="w-4 h-4" />
            Přidat
          </button>
        </div>

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
