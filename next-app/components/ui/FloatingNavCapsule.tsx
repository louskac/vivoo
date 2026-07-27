'use client';

import React, { useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { TabId } from '@/lib/types';
import { Home, LayoutGrid, Ticket, User } from 'lucide-react';

export const FloatingNavCapsule: React.FC = () => {
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const selectedEvent = useAppStore((state) => state.selectedEvent);

  const navRef = useRef<HTMLElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState<number | null>(null);
  const [dragWidth, setDragWidth] = useState(84);
  const [shiftX, setShiftX] = useState(0);

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'feed', label: 'Feed', icon: <Home className="w-5 h-5" /> },
    { id: 'discover', label: 'Prozkoumat', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'tickets', label: 'Lístky', icon: <Ticket className="w-5 h-5" /> },
    { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> },
  ];

  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === activeTab));

  const updateHighlightPos = (pointerX: number, containerWidth: number) => {
    const highlightWidth = 84;
    const minCenterX = 8 + highlightWidth / 2;
    const maxCenterX = containerWidth - 8 - highlightWidth / 2;

    let targetX = 0;
    let stretchedWidth = highlightWidth;
    let shift = 0;

    if (pointerX < minCenterX) {
      const overflow = minCenterX - pointerX;
      stretchedWidth = highlightWidth + overflow * 0.45;
      targetX = 8 - overflow * 0.15;
      targetX = Math.max(2, targetX);
      shift = -overflow * 0.2;
    } else if (pointerX > maxCenterX) {
      const overflow = pointerX - maxCenterX;
      stretchedWidth = highlightWidth + overflow * 0.45;
      targetX = containerWidth - 8 - highlightWidth + overflow * 0.15;
      targetX = Math.min(containerWidth - stretchedWidth - 2, targetX);
      shift = overflow * 0.2;
    } else {
      stretchedWidth = highlightWidth;
      targetX = pointerX - highlightWidth / 2;
      shift = 0;
    }

    setDragX(targetX);
    setDragWidth(stretchedWidth);
    setShiftX(shift);

    // Live update active tab based on drag position proximity
    const itemWidth = containerWidth / tabs.length;
    const closestIdx = Math.max(0, Math.min(tabs.length - 1, Math.floor(pointerX / itemWidth)));
    if (tabs[closestIdx] && tabs[closestIdx].id !== activeTab) {
      setActiveTab(tabs[closestIdx].id);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const nav = navRef.current;
    if (!nav) return;

    setIsDragging(true);
    try {
      nav.setPointerCapture(e.pointerId);
    } catch (_) {}

    const rect = nav.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    updateHighlightPos(pointerX, nav.offsetWidth);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDragging) return;
    const nav = navRef.current;
    if (!nav) return;

    const rect = nav.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    updateHighlightPos(pointerX, nav.offsetWidth);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDragging) return;
    const nav = navRef.current;
    if (!nav) return;

    setIsDragging(false);
    try {
      nav.releasePointerCapture(e.pointerId);
    } catch (_) {}

    const rect = nav.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;

    const itemWidth = nav.offsetWidth / tabs.length;
    const closestIdx = Math.max(0, Math.min(tabs.length - 1, Math.floor(pointerX / itemWidth)));

    setDragX(null);
    setDragWidth(84);
    setShiftX(0);

    if (tabs[closestIdx]) {
      setActiveTab(tabs[closestIdx].id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    const nav = navRef.current;
    if (!nav) return;
    setIsDragging(true);
    const rect = nav.getBoundingClientRect();
    updateHighlightPos(e.clientX - rect.left, nav.offsetWidth);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDragging) return;
    const nav = navRef.current;
    if (!nav) return;
    const rect = nav.getBoundingClientRect();
    updateHighlightPos(e.clientX - rect.left, nav.offsetWidth);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDragging) return;
    const nav = navRef.current;
    if (!nav) return;
    setIsDragging(false);
    const rect = nav.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const itemWidth = nav.offsetWidth / tabs.length;
    const closestIdx = Math.max(0, Math.min(tabs.length - 1, Math.floor(pointerX / itemWidth)));
    setDragX(null);
    setDragWidth(84);
    setShiftX(0);
    if (tabs[closestIdx]) {
      setActiveTab(tabs[closestIdx].id);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    const nav = navRef.current;
    if (!nav || !e.touches[0]) return;
    setIsDragging(true);
    const rect = nav.getBoundingClientRect();
    updateHighlightPos(e.touches[0].clientX - rect.left, nav.offsetWidth);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (!isDragging) return;
    const nav = navRef.current;
    if (!nav || !e.touches[0]) return;
    const rect = nav.getBoundingClientRect();
    updateHighlightPos(e.touches[0].clientX - rect.left, nav.offsetWidth);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    if (!isDragging) return;
    const nav = navRef.current;
    if (!nav || !e.changedTouches[0]) return;
    setIsDragging(false);
    const rect = nav.getBoundingClientRect();
    const pointerX = e.changedTouches[0].clientX - rect.left;
    const itemWidth = nav.offsetWidth / tabs.length;
    const closestIdx = Math.max(0, Math.min(tabs.length - 1, Math.floor(pointerX / itemWidth)));
    setDragX(null);
    setDragWidth(84);
    setShiftX(0);
    if (tabs[closestIdx]) {
      setActiveTab(tabs[closestIdx].id);
    }
  };

  if (selectedEvent) return null;

  const defaultStep = 88;
  const currentX = isDragging && dragX !== null ? dragX : activeIndex * defaultStep;

  return (
    <nav
      ref={navRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`bottom-nav-capsule pointer-events-auto ${isDragging ? 'is-dragging' : ''}`}
      style={{
        transform: `translateX(-50%) translate3d(${shiftX}px, 0, 0)`
      }}
    >
      {/* Sliding Concave Liquid Glass Highlight Slot */}
      <div
        className="capsule-nav-highlight"
        style={{
          width: `${dragWidth}px`,
          transform: `translate3d(${currentX}px, 0, 0)`,
          transition: isDragging
            ? 'none'
            : 'transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      />

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab(tab.id);
            }}
            className={`capsule-nav-item ${isActive ? 'active' : ''}`}
            aria-label={tab.label}
          >
            {tab.icon}
          </button>
        );
      })}
    </nav>
  );
};
