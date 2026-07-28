'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { TabId } from '@/lib/types';
import { Home, LayoutGrid, Ticket, User } from 'lucide-react';

export const FloatingNavCapsule: React.FC = () => {
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const selectedEvent = useAppStore((state) => state.selectedEvent);
  const activeModal = useAppStore((state) => state.activeModal);

  const navRef = useRef<HTMLElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState<number | null>(null);
  const [dragWidth, setDragWidth] = useState(80);
  const [shiftX, setShiftX] = useState(0);

  // Measure actual active button position directly from the DOM for 100% alignment
  const [activeBounds, setActiveBounds] = useState<{ left: number; width: number }>({ left: 11.5, width: 80 });

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'feed', label: 'Feed', icon: <Home className="w-5 h-5" /> },
    { id: 'discover', label: 'Prozkoumat', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'tickets', label: 'Lístky', icon: <Ticket className="w-5 h-5" /> },
    { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> },
  ];

  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === activeTab));

  const updateActiveBounds = useCallback(() => {
    if (!navRef.current) return;
    const buttons = navRef.current.querySelectorAll<HTMLButtonElement>('.capsule-nav-item');
    const activeBtn = buttons[activeIndex];
    if (activeBtn) {
      const btnLeft = activeBtn.offsetLeft;
      const btnWidth = activeBtn.offsetWidth;
      const hWidth = Math.min(80, Math.max(60, btnWidth - 6));
      const hLeft = btnLeft + (btnWidth - hWidth) / 2;
      setActiveBounds({ left: hLeft, width: hWidth });
    }
  }, [activeIndex]);

  useEffect(() => {
    updateActiveBounds();
  }, [activeTab, activeIndex, updateActiveBounds]);

  useEffect(() => {
    const handleResize = () => updateActiveBounds();
    window.addEventListener('resize', handleResize);

    const el = navRef.current;
    if (!el) return;

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => updateActiveBounds());
      ro.observe(el);
      return () => {
        ro.disconnect();
        window.removeEventListener('resize', handleResize);
      };
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [updateActiveBounds]);

  const updateHighlightPos = (pointerX: number, currContainerWidth: number) => {
    const pX = 8;
    const iWidth = Math.max(0, currContainerWidth - pX * 2);
    const sWidth = iWidth / tabs.length;
    const hWidth = Math.min(80, Math.max(60, sWidth - 6));

    const minCenterX = pX + hWidth / 2;
    const maxCenterX = currContainerWidth - pX - hWidth / 2;

    let targetX = 0;
    let stretchedWidth = hWidth;
    let shift = 0;

    if (pointerX < minCenterX) {
      const overflow = minCenterX - pointerX;
      stretchedWidth = hWidth + overflow * 0.45;
      targetX = pX - overflow * 0.15;
      targetX = Math.max(2, targetX);
      shift = -overflow * 0.2;
    } else if (pointerX > maxCenterX) {
      const overflow = pointerX - maxCenterX;
      stretchedWidth = hWidth + overflow * 0.45;
      targetX = currContainerWidth - pX - hWidth + overflow * 0.15;
      targetX = Math.min(currContainerWidth - stretchedWidth - 2, targetX);
      shift = overflow * 0.2;
    } else {
      stretchedWidth = hWidth;
      targetX = pointerX - hWidth / 2;
      shift = 0;
    }

    setDragX(targetX);
    setDragWidth(stretchedWidth);
    setShiftX(shift);

    // Live update active tab based on drag position proximity
    const closestIdx = Math.max(
      0,
      Math.min(tabs.length - 1, Math.floor((pointerX - pX) / sWidth))
    );
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
    const iWidth = Math.max(0, nav.offsetWidth - 16);
    const sWidth = iWidth / tabs.length;
    const closestIdx = Math.max(
      0,
      Math.min(tabs.length - 1, Math.floor((pointerX - 8) / sWidth))
    );

    setDragX(null);
    setDragWidth(activeBounds.width);
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
    const iWidth = Math.max(0, nav.offsetWidth - 16);
    const sWidth = iWidth / tabs.length;
    const closestIdx = Math.max(
      0,
      Math.min(tabs.length - 1, Math.floor((pointerX - 8) / sWidth))
    );
    setDragX(null);
    setDragWidth(activeBounds.width);
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
    const iWidth = Math.max(0, nav.offsetWidth - 16);
    const sWidth = iWidth / tabs.length;
    const closestIdx = Math.max(
      0,
      Math.min(tabs.length - 1, Math.floor((pointerX - 8) / sWidth))
    );
    setDragX(null);
    setDragWidth(activeBounds.width);
    setShiftX(0);
    if (tabs[closestIdx]) {
      setActiveTab(tabs[closestIdx].id);
    }
  };

  if (selectedEvent || activeModal) return null;

  const currentX = isDragging && dragX !== null ? dragX : activeBounds.left;
  const activeWidth = isDragging ? dragWidth : activeBounds.width;

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
          width: `${activeWidth}px`,
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

