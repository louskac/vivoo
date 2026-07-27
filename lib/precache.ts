'use client';

import { useEffect } from 'react';
import { mockEvents } from './data';

/**
 * Precaches key application images and assets in browser cache
 * to ensure 0ms latency when opening tickets, detail sheets, and modals.
 */
export const usePrecacheAppAssets = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlsToPrecache = [
      '/images/avatar.jpg',
      '/images/metronome_festival.jpg',
      '/images/xindl_live.jpg',
      '/images/prague_derby.jpg',
      '/images/beats_for_love.jpg',
      '/images/ballet.jpg',
      '/images/basketball.jpg',
      ...mockEvents.map((ev) => ev.bgImg)
    ];

    const uniqueUrls = Array.from(new Set(urlsToPrecache));

    uniqueUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);
};
