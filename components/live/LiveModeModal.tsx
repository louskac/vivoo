'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { MOCK_EVENTS } from '@/lib/data';
import { ExpressOrderItem, MatchPlayer, LiveTimelineItem, LivePoll, LivePollOption, VenuePOI, ExpressOrder } from '@/lib/types';
import { TacticalPitchView } from './TacticalPitchView';


import TeamLogo from '@/components/ui/TeamLogo';
import { getDynamicMatchColors } from '@/lib/team-colors';
import { Badge } from '@/components/ui/Badge';
import {
  ChevronLeft,
  Radio,
  Clock,
  Zap,
  Beer,
  MapPin,
  Sparkles,
  CheckCircle2,
  Plus,
  Minus,
  ShoppingBag,
  Award,
  AlertCircle,
  Wallet,
  Coffee,
  Utensils,
  Shirt,
  Tag,
  Trophy,
  Activity,
  Users,
  Target,
  Gift,
  Flame,
  Check,
  DoorClosed
} from 'lucide-react';

export const LiveModeModal: React.FC = () => {
  const activeModal = useAppStore((state) => state.activeModal);
  const setActiveModal = useAppStore((state) => state.setActiveModal);
  const activeLiveEventId = useAppStore((state) => state.activeLiveEventId);
  const setActiveLiveEventId = useAppStore((state) => state.setActiveLiveEventId);
  const toggleLightshow = useAppStore((state) => state.toggleLightshow);
  const livePollVotes = useAppStore((state) => state.livePollVotes);
  const voteLivePoll = useAppStore((state) => state.voteLivePoll);
  const expressOrders = useAppStore((state) => state.expressOrders);
  const addExpressOrder = useAppStore((state) => state.addExpressOrder);

  const { user } = useUser();
  const deductBalance = useAppStore((state) => state.deductBalance);

  const [activeTab, setActiveTab] = useState<'match' | 'timeline' | 'pulse' | 'bar' | 'map'>('match');
  const [selectedLineupTeam, setSelectedLineupTeam] = useState<'home' | 'away'>('home');
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);
  const [isRaffleEntered, setIsRaffleEntered] = useState(false);

  if (activeModal !== 'live_mode') return null;

  const currentEvent = MOCK_EVENTS.find((e) => e.id === (activeLiveEventId || 'derby')) || MOCK_EVENTS[1];
  const liveConfig = currentEvent.liveConfig;

  if (!liveConfig) return null;

  const isSports = liveConfig.eventCategoryType === 'sports';

  const getItemIcon = (item: ExpressOrderItem) => {
    if (item.category === 'pivo') return <Beer className="w-5 h-5 text-white" />;
    if (item.category === 'nealko') return <Coffee className="w-5 h-5 text-white" />;
    if (item.category === 'snack') return <Utensils className="w-5 h-5 text-white" />;
    if (item.category === 'merch') return <Shirt className="w-5 h-5 text-white" />;
    return <Tag className="w-5 h-5 text-white" />;
  };

  const handleQuantityChange = (item: ExpressOrderItem, delta: number) => {
    const current = cartItems[item.id] || 0;
    const next = Math.max(0, current + delta);
    setCartItems((prev) => {
      const copy = { ...prev };
      if (next === 0) delete copy[item.id];
      else copy[item.id] = next;
      return copy;
    });
  };

  const cartTotalAmount = Object.entries(cartItems).reduce((sum, [itemId, qty]) => {
    const menuItem = liveConfig.expressMenu.find((m: ExpressOrderItem) => m.id === itemId);
    return sum + (menuItem ? menuItem.price * qty : 0);
  }, 0);

  const handleCheckoutExpressOrder = async () => {
    if (cartTotalAmount === 0) return;
    setIsOrdering(true);
    setOrderError(null);

    const itemsToOrder = Object.entries(cartItems).map(([itemId, quantity]) => {
      const item = liveConfig.expressMenu.find((m: ExpressOrderItem) => m.id === itemId)!;
      return { item, quantity };
    });


    try {
      const res = await fetch('/api/live/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: currentEvent.id,
          items: itemsToOrder,
          totalAmount: cartTotalAmount
        })
      }).then((r) => r.json());

      if (res.success) {
        deductBalance(cartTotalAmount);
        addExpressOrder({
          id: res.order.id,
          items: itemsToOrder,
          totalAmount: cartTotalAmount,
          pickupCode: res.order.pickupCode,
          status: 'ready',
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        setCartItems({});
        setOrderSuccessMsg(`Objednávka připravena. Kód pro Express Bar: ${res.order.pickupCode}`);
        setTimeout(() => setOrderSuccessMsg(null), 6000);
      } else {
        setOrderError(res.error || 'Nákup se nezdařil.');
      }
    } catch (err: any) {
      setOrderError(err.message);
    } finally {
      setIsOrdering(false);
    }
  };

  const handlePollVote = async (pollId: string, optionId: string) => {
    voteLivePoll(pollId, optionId);
    if (pollId === 'poll-derby-mvp') {
      setIsRaffleEntered(true);
    }
    try {
      await fetch('/api/live/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: currentEvent.id, pollId, optionId })
      });
    } catch (err) {
      console.error('Failed to register vote:', err);
    }
  };

  const momentum = liveConfig.matchMomentum;

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0B0E] overflow-y-auto pb-32 text-white animate-fade-in max-w-md mx-auto custom-scrollbar">
      
      {/* 1. Hero Section */}
      <div className="relative w-full min-h-[240px] flex flex-col justify-between p-5 pt-8 pb-4">
        <img
          src={currentEvent.bgImg}
          alt={currentEvent.title}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Dark Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0A0B0E] z-0" />

        {/* Header Controls */}
        <div className="relative z-10 flex items-center justify-between gap-3 w-full mb-6">
          <button
            onClick={() => setActiveModal(null)}
            className="w-10 h-10 rounded-full bg-black/60 border border-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer shadow-lg shrink-0"
            aria-label="Close"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* NFC Credit Badge */}
          <div
            onClick={() => setActiveModal('topup')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md cursor-pointer hover:bg-white/20 transition-all shadow-lg shrink-0"
          >
            <Wallet className="w-4 h-4 text-white shrink-0" />
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">NFC Kredit</span>
              <span className="text-xs font-black text-white mt-0.5">{user.cashlessCredit} Kč</span>
            </div>
          </div>
        </div>

        {/* Hero Bottom Content */}
        <div className="relative z-10 flex flex-col items-start gap-2 w-full mt-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge text={liveConfig.statusBadge || 'ŽIVĚ'} variant="red" />
            <span className="text-xs font-medium text-neutral-300 drop-shadow-sm">{currentEvent.location}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight drop-shadow-md break-words max-w-full">
            {currentEvent.title}
          </h1>
          {liveConfig.statusHeader && (
            <p className="text-xs text-neutral-400 font-medium opacity-90 drop-shadow-sm">
              {liveConfig.statusHeader}
            </p>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 flex flex-col gap-5 bg-[#0A0B0E]">

        {/* Liquid Glass Segmented Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            ...(isSports ? [{ id: 'match', label: 'Zápas', icon: <Activity className="w-3.5 h-3.5" /> }] : []),
            { id: 'timeline', label: 'Program', icon: <Clock className="w-3.5 h-3.5" /> },
            { id: 'pulse', label: 'Atmosféra', icon: <Zap className="w-3.5 h-3.5" /> },
            { id: 'bar', label: 'Express Bar', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
            { id: 'map', label: 'Radar', icon: <MapPin className="w-3.5 h-3.5" /> }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
                  isActive
                    ? 'bg-white text-black border-white shadow-lg'
                    : 'bg-white/[0.06] text-neutral-400 border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB: MATCH (STATS, MOMENTUM & LINEUPS) */}
        {activeTab === 'match' && isSports && (() => {
          const homeTeamName = momentum?.homeTeamName || currentEvent.title.split(' vs ')[0] || 'FC Hradec Králové';
          const awayTeamName = momentum?.awayTeamName || currentEvent.title.split(' vs ')[1]?.split(' – ')[0] || 'FK Pardubice';
          const { homeColor, awayColor } = getDynamicMatchColors(homeTeamName, awayTeamName);

          return (
          <div className="flex flex-col gap-5 animate-fade-in">
            
            {/* Score & Possession Momentum Card */}
            <div className="glass-panel p-5.5 rounded-3xl border border-white/20 bg-gradient-to-b from-[#161822]/90 via-[#0e1017]/95 to-[#090a0e] flex flex-col gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
              {/* Background Ambient Glow */}
              <div 
                className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
                style={{ backgroundColor: homeColor }}
              />

              {/* Clean Header Bar - NO OVERLAPPING TEXT */}
              <div className="flex items-center justify-between gap-2 z-10 relative pb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: homeColor }} />
                  <span className="text-[11px] font-mono font-extrabold text-neutral-300 uppercase tracking-wider">
                    FORTUNA:LIGA • DERBY
                  </span>
                </div>
                <Badge text={liveConfig.statusBadge || 'ŽIVĚ'} variant="red" />
              </div>

              {/* Hero Broadcast Scoreboard with Vector Team Crests */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 my-1 relative z-10">
                {/* Home Team */}
                <div className="flex flex-col items-center gap-2 text-center">
                  <TeamLogo teamName={homeTeamName} logoUrl={momentum?.homeTeamLogo} className="w-14 h-14" />
                  <span className="text-xs font-black text-white leading-tight max-w-[105px]">
                    {homeTeamName}
                  </span>
                </div>

                {/* Score Pill Display */}
                <div className="flex flex-col items-center gap-1">
                  <div className="px-5 py-2.5 rounded-2xl bg-black/80 border border-white/20 backdrop-blur-xl shadow-2xl flex items-center gap-3 border-t-white/30">
                    <span className="text-4xl font-black text-white tracking-tight drop-shadow-md font-mono">
                      {momentum?.homeScore ?? 2}
                    </span>
                    <span className="text-2xl font-black animate-pulse" style={{ color: homeColor }}>:</span>
                    <span className="text-4xl font-black text-neutral-300 tracking-tight drop-shadow-md font-mono">
                      {momentum?.awayScore ?? 1}
                    </span>
                  </div>
                  <span className="text-[9.5px] font-mono text-neutral-400 font-bold tracking-wider uppercase">90' Konec Utkání</span>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center gap-2 text-center">
                  <TeamLogo teamName={awayTeamName} logoUrl={momentum?.awayTeamLogo} className="w-14 h-14" />
                  <span className="text-xs font-black text-white leading-tight max-w-[105px]">
                    {awayTeamName}
                  </span>
                </div>
              </div>

              {/* Possession TV Bar */}
              <div className="flex flex-col gap-2 pt-2.5 border-t border-white/10 relative z-10">
                <div className="flex items-center justify-between text-xs font-extrabold tracking-wide">
                  <span className="flex items-center gap-1.5" style={{ color: homeColor }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: homeColor, boxShadow: `0 0 8px ${homeColor}` }} />
                    Držení míče {momentum?.homePossessionPct ?? 54}%
                  </span>
                  <span className="flex items-center gap-1.5" style={{ color: awayColor }}>
                    {momentum?.awayPossessionPct ?? 46}%
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: awayColor, boxShadow: `0 0 8px ${awayColor}` }} />
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-black/60 p-0.5 border border-white/10 flex overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${momentum?.homePossessionPct ?? 54}%`, backgroundColor: homeColor, boxShadow: `0 0 10px ${homeColor}aa` }}
                  />
                  <div
                    className="h-full rounded-full transition-all duration-700 ml-1"
                    style={{ width: `${momentum?.awayPossessionPct ?? 46}%`, backgroundColor: awayColor, boxShadow: `0 0 10px ${awayColor}aa` }}
                  />
                </div>
              </div>

              {/* Key Match Stats Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-2.5 border-t border-white/10 text-center relative z-10">
                <div className="flex flex-col p-3 rounded-2xl glass-panel border border-white/10 hover:border-white/20 transition-all">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Střely na bránu</span>
                  <div className="flex items-center justify-center gap-1.5 my-1">
                    <span className="text-base font-black text-white">{momentum?.homeShotsOnTarget ?? 7}</span>
                    <span className="text-xs font-bold text-neutral-500">:</span>
                    <span className="text-base font-black text-neutral-400">{momentum?.awayShotsOnTarget ?? 4}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full flex overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: '63%', backgroundColor: homeColor }} />
                    <div className="h-full rounded-full ml-0.5" style={{ width: '37%', backgroundColor: awayColor }} />
                  </div>
                </div>

                <div className="flex flex-col p-3 rounded-2xl glass-panel border border-white/10 hover:border-white/20 transition-all">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Útoky</span>
                  <div className="flex items-center justify-center gap-1.5 my-1">
                    <span className="text-base font-black text-white">{momentum?.homeDangerousAttacks ?? 42}</span>
                    <span className="text-xs font-bold text-neutral-500">:</span>
                    <span className="text-base font-black text-neutral-400">{momentum?.awayDangerousAttacks ?? 31}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full flex overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: '57%', backgroundColor: homeColor }} />
                    <div className="h-full rounded-full ml-0.5" style={{ width: '43%', backgroundColor: awayColor }} />
                  </div>
                </div>

                <div className="flex flex-col p-3 rounded-2xl glass-panel border border-white/10 hover:border-white/20 transition-all">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Rohové kopy</span>
                  <div className="flex items-center justify-center gap-1.5 my-1">
                    <span className="text-base font-black text-white">6</span>
                    <span className="text-xs font-bold text-neutral-500">:</span>
                    <span className="text-base font-black text-neutral-400">4</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full flex overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: '60%', backgroundColor: homeColor }} />
                    <div className="h-full rounded-full ml-0.5" style={{ width: '40%', backgroundColor: awayColor }} />
                  </div>
                </div>
              </div>

              {/* Match Momentum Bi-Directional Graph Curve */}
              <div className="flex flex-col gap-2 pt-2.5 border-t border-white/10 relative z-10">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4" style={{ color: homeColor }} />
                    Tlakové Momentum Zápasu
                  </span>
                  <div className="flex items-center gap-3 text-[10px] font-bold">
                    <span className="flex items-center gap-1" style={{ color: homeColor }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: homeColor }} />
                      Domácí
                    </span>
                    <span className="flex items-center gap-1" style={{ color: awayColor }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: awayColor }} />
                      Hosté
                    </span>
                  </div>
                </div>

                {/* Bi-directional Sofascore/Livesport Graph */}
                <div className="relative w-full h-20 rounded-2xl glass-panel border border-white/10 p-2 flex items-center justify-between gap-1 overflow-hidden bg-black/50">
                  {/* Center 0 Axis */}
                  <div className="absolute inset-x-0 top-1/2 h-px bg-white/15 pointer-events-none" />

                  {(momentum?.momentumGraph || [35, 60, -25, 45, 80, -40, 85, -20, 30, 65, -55, 75, 40, -15, 60, 90, -30, 20]).map((val: number, idx: number) => {
                    const isHome = val >= 0;
                    const heightPct = Math.min(Math.abs(val), 95);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center justify-center h-full relative z-10">
                        <div className="w-full flex flex-col h-full justify-center items-center">
                          {/* Top half (Home team pressure) */}
                          <div className="w-full flex-1 flex items-end justify-center">
                            {isHome && (
                              <div
                                className="w-full max-w-[8px] rounded-t-sm transition-all"
                                style={{ height: `${heightPct}%`, backgroundColor: homeColor, boxShadow: `0 0 6px ${homeColor}aa` }}
                              />
                            )}
                          </div>
                          {/* Bottom half (Away team pressure) */}
                          <div className="w-full flex-1 flex items-start justify-center">
                            {!isHome && (
                              <div
                                className="w-full max-w-[8px] rounded-b-sm opacity-90 transition-all"
                                style={{ height: `${heightPct}%`, backgroundColor: awayColor, boxShadow: `0 0 6px ${awayColor}aa` }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Livesport Tactical Pitch Component with Player Avatars & Ratings */}
            <TacticalPitchView
              homeTeamName={currentEvent.title.split(' vs ')[0] || 'FC Hradec Králové'}
              awayTeamName={currentEvent.title.split(' vs ')[1]?.split(' – ')[0] || 'FK Pardubice'}
              homeLineup={liveConfig.homeLineup || []}
              awayLineup={liveConfig.awayLineup || []}
              onVoteMvp={(playerId) => {
                if (liveConfig.polls?.[0]) {
                  voteLivePoll(liveConfig.polls[0].id, 'opt-buren');
                }
              }}
            />
          </div>
          );
        })()}

        {/* TAB 1: PROGRAM / TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Status Hero Card */}
            <div className="glass-panel p-4.5 rounded-3xl border border-white/15 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#DE1D3E] tracking-wider block">Aktuální Průběh</span>
                <span className="text-base font-extrabold text-white mt-0.5 block">{liveConfig.statusHeader}</span>
              </div>
              <div className="w-3.5 h-3.5 rounded-full bg-[#DE1D3E] shadow-[0_0_12px_rgba(222,29,62,0.9)] animate-pulse shrink-0" />
            </div>

            {/* Timeline Events List */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Harmonogram</h3>
              
              <div className="relative pl-6 flex flex-col gap-3.5 border-l border-white/15">
                {liveConfig.timeline.map((item: LiveTimelineItem) => {
                  const isLive = item.status === 'live';
                  const isPast = item.status === 'past';
                  return (
                    <div key={item.id} className="relative">
                      {/* Dot Indicator */}
                      <div
                        className={`absolute -left-[31px] top-4 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                          isLive
                            ? 'bg-[#DE1D3E] border-white shadow-[0_0_12px_rgba(222,29,62,0.9)] scale-125'
                            : isPast
                            ? 'bg-neutral-600 border-neutral-800'
                            : 'bg-neutral-900 border-neutral-700'
                        }`}
                      />

                      <div
                        className={`glass-panel p-4 rounded-3xl border transition-all ${
                          isLive
                            ? 'bg-white/[0.08] border-[#DE1D3E]/60 shadow-[0_0_20px_rgba(222,29,62,0.2)]'
                            : isPast
                            ? 'bg-white/[0.02] border-white/5 opacity-60'
                            : 'bg-white/[0.04] border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-[#DE1D3E]">{item.time}</span>
                          {item.badge && <Badge text={item.badge} variant={isLive ? 'red' : 'dark'} />}
                        </div>
                        <h4 className="text-sm font-extrabold text-white mt-1">{item.title}</h4>
                        {item.subtitle && (
                          <p className="text-xs text-neutral-400 font-medium mt-0.5">{item.subtitle}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATMOSFÉRA / PULSE, MVP & PREDICTORS (Masterpiece Layout) */}
        {activeTab === 'pulse' && (
          <div className="flex flex-col gap-4 animate-fade-in">

            {/* Signed Jersey Raffle & MVP Vote Card */}
            {liveConfig.jerseyRaffle && (
              <div
                className="p-5 rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-[#151722]/90 to-[#0A0B10] flex flex-col gap-3.5 shadow-2xl relative overflow-hidden"
                style={{ borderTop: '1px solid rgba(255, 255, 255, 0.3)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-transparent border border-white/20 flex items-center justify-center text-white shrink-0 shadow-lg">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base font-extrabold text-white leading-tight">Vyhraj Podepsaný Dres MVP</h3>
                  </div>
                  <span className="text-[9.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white shadow-sm shrink-0 whitespace-nowrap">
                    SOUTĚŽ
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                  Hlasujte pro Hráče Utkání a budete automaticky zařazeni do losování o originální podepsaný dres <strong className="text-white font-bold">{liveConfig.jerseyRaffle.playerName} (#{liveConfig.jerseyRaffle.playerNumber})</strong>.
                </p>

                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-medium">Stav zapojení:</span>
                  {isRaffleEntered ? (
                    <span className="flex items-center gap-1.5 font-extrabold text-white">
                      <Check className="w-4 h-4 text-white" />
                      Zařazeno do losování!
                    </span>
                  ) : (
                    <span className="font-extrabold text-neutral-200">Hlasujte níže pro zařazení</span>
                  )}
                </div>
              </div>
            )}

            {/* MVP Hráč Utkání Voting */}
            {liveConfig.polls.map((poll: LivePoll) => {
              const votedOptId = livePollVotes[poll.id];
              return (
                <div
                  key={poll.id}
                  className="p-5 rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 via-[#141620]/90 to-[#0A0B0E] flex flex-col gap-4 shadow-xl"
                  style={{ borderTop: '1px solid rgba(255, 255, 255, 0.25)' }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-extrabold text-white leading-snug flex-1 min-w-0">{poll.question}</h4>
                    <span className="text-xs font-mono font-bold text-neutral-300 px-3 py-1 rounded-full bg-white/10 border border-white/15 shrink-0 whitespace-nowrap">
                      {poll.totalVotes} hlasů
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {poll.options.map((opt: LivePollOption) => {
                      const isVoted = votedOptId === opt.id;
                      const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handlePollVote(poll.id, opt.id)}
                          className={`relative overflow-hidden p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                            isVoted
                              ? 'bg-white/15 border-white/40 text-white shadow-lg'
                              : 'bg-white/[0.04] border-white/10 hover:border-white/25 text-neutral-200'
                          }`}
                        >
                          {/* Sleek Liquid Glass Progress fill */}
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-white/20 via-white/15 to-white/5 border-r border-white/30 transition-all duration-500 pointer-events-none"
                            style={{ width: `${pct}%` }}
                          />

                          <div className="relative z-10 flex items-center justify-between text-xs font-extrabold gap-3">
                            <span className="flex items-center gap-2 text-white truncate min-w-0">
                              {isVoted && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                              <span className="truncate">{opt.label}</span>
                            </span>
                            <span className="font-mono text-white font-black text-sm shrink-0">{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Next Goal Team Predictor */}
            {liveConfig.nextGoalTeamPoll && (
              <div
                className="p-5 rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 via-[#141620]/90 to-[#0A0B0E] flex flex-col gap-4 shadow-xl"
                style={{ borderTop: '1px solid rgba(255, 255, 255, 0.25)' }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Target className="w-4 h-4 text-white shrink-0" />
                    <h4 className="text-sm font-extrabold text-white leading-snug truncate">{liveConfig.nextGoalTeamPoll.question}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-300 px-3 py-1 rounded-full bg-white/10 border border-white/15 shrink-0 whitespace-nowrap">
                    {liveConfig.nextGoalTeamPoll.totalVotes} tipů
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {liveConfig.nextGoalTeamPoll.options.map((opt: LivePollOption) => {
                    const votedOptId = livePollVotes[liveConfig.nextGoalTeamPoll!.id];
                    const isVoted = votedOptId === opt.id;
                    const pct = liveConfig.nextGoalTeamPoll!.totalVotes > 0 ? Math.round((opt.votes / liveConfig.nextGoalTeamPoll!.totalVotes) * 100) : 0;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handlePollVote(liveConfig.nextGoalTeamPoll!.id, opt.id)}
                        className={`relative overflow-hidden p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                          isVoted
                            ? 'bg-white/15 border-white/40 text-white shadow-lg'
                            : 'bg-white/[0.04] border-white/10 hover:border-white/25 text-neutral-200'
                        }`}
                      >
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-white/20 via-white/15 to-white/5 border-r border-white/30 transition-all duration-500 pointer-events-none"
                          style={{ width: `${pct}%` }}
                        />

                        <div className="relative z-10 flex items-center justify-between text-xs font-extrabold gap-3">
                          <span className="flex items-center gap-2 text-white truncate min-w-0">
                            {isVoted && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                            <span className="truncate">{opt.label}</span>
                          </span>
                          <span className="font-mono text-white font-black text-sm shrink-0">{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Specific Player Scorer Predictor */}
            {liveConfig.nextGoalScorerPoll && (
              <div
                className="p-5 rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 via-[#141620]/90 to-[#0A0B0E] flex flex-col gap-4 shadow-xl"
                style={{ borderTop: '1px solid rgba(255, 255, 255, 0.25)' }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Trophy className="w-4 h-4 text-white shrink-0" />
                    <h4 className="text-sm font-extrabold text-white leading-snug truncate">{liveConfig.nextGoalScorerPoll.question}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-300 px-3 py-1 rounded-full bg-white/10 border border-white/15 shrink-0 whitespace-nowrap">
                    {liveConfig.nextGoalScorerPoll.totalVotes} tipů
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {liveConfig.nextGoalScorerPoll.options.map((opt: LivePollOption) => {
                    const votedOptId = livePollVotes[liveConfig.nextGoalScorerPoll!.id];
                    const isVoted = votedOptId === opt.id;
                    const pct = liveConfig.nextGoalScorerPoll!.totalVotes > 0 ? Math.round((opt.votes / liveConfig.nextGoalScorerPoll!.totalVotes) * 100) : 0;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handlePollVote(liveConfig.nextGoalScorerPoll!.id, opt.id)}
                        className={`relative overflow-hidden p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                          isVoted
                            ? 'bg-white/15 border-white/40 text-white shadow-lg'
                            : 'bg-white/[0.04] border-white/10 hover:border-white/25 text-neutral-200'
                        }`}
                      >
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-white/20 via-white/15 to-white/5 border-r border-white/30 transition-all duration-500 pointer-events-none"
                          style={{ width: `${pct}%` }}
                        />

                        <div className="relative z-10 flex items-center justify-between text-xs font-extrabold gap-3">
                          <span className="flex items-center gap-2 text-white truncate min-w-0">
                            {isVoted && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                            <span className="truncate">{opt.label}</span>
                          </span>
                          <span className="font-mono text-white font-black text-sm shrink-0">{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Strobe Lightshow Sync Card */}
            <div
              className="p-5 rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 via-[#141620]/90 to-[#0A0B0E] flex flex-col gap-3.5 shadow-xl"
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.25)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-transparent border border-white/20 flex items-center justify-center text-white shrink-0 shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-extrabold text-white">Světelný Stroboskop</h3>
                </div>
                <span className="text-[9.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white shadow-sm shrink-0 whitespace-nowrap">
                  SYNCHRO
                </span>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                Obrazovka telefonu se synchronizuje se světelnou choreografií v aréně při vstřelení gólu.
              </p>

              <button
                onClick={toggleLightshow}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#DE1D3E] via-red-600 to-[#B91C1C] hover:from-red-600 hover:to-red-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer border border-white/20 mt-1"
              >
                <Sparkles className="w-4 h-4" />
                <span>Spustit Světelnou Show</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: EXPRESS BAR */}
        {activeTab === 'bar' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Active Orders Banner */}
            {expressOrders.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Aktivní Objednávky</h3>
                {expressOrders.map((order: ExpressOrder) => (
                  <div key={order.id} className="glass-panel p-4 rounded-2xl border border-emerald-500/40 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase text-emerald-400">EXPRESS BAR KÓD</span>
                      <span className="text-xl font-black text-white tracking-widest">{order.pickupCode}</span>
                      <span className="text-xs text-neutral-300 mt-0.5">{order.items.map((i: any) => `${i.quantity}x ${i.item.name}`).join(', ')}</span>
                    </div>
                    <Badge text="PŘIPRAVENO" variant="gold" />
                  </div>
                ))}
              </div>
            )}

            {/* Express Menu List (Liquid Glass Facelift) */}
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">Express Bar Menu</h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono font-black text-white backdrop-blur-md">
                  Zůstatek: {user.cashlessCredit} Kč
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {liveConfig.expressMenu.map((menuItem: ExpressOrderItem) => {
                  const qty = cartItems[menuItem.id] || 0;
                  const isSelected = qty > 0;
                  const categoryLabel = menuItem.category === 'pivo' ? 'PIVO' : menuItem.category === 'nealko' ? 'NEALKO' : menuItem.category === 'snack' ? 'JÍDLO' : 'MERCH';

                  return (
                    <div
                      key={menuItem.id}
                      className={`p-4 rounded-3xl border transition-all duration-300 relative overflow-hidden flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#DE1D3E]/15 border-[#DE1D3E] shadow-[0_0_25px_rgba(222,29,62,0.25)]'
                          : 'bg-gradient-to-br from-white/10 via-[#141620]/90 to-[#0A0B0E] border-white/15 hover:border-white/30 shadow-xl'
                      }`}
                      style={{
                        borderTop: isSelected ? undefined : '1px solid rgba(255, 255, 255, 0.25)'
                      }}
                    >
                      {/* Left: Glass Icon Avatar Box + Details */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-transparent border border-white/20 flex items-center justify-center text-white shrink-0 shadow-lg relative">
                          {getItemIcon(menuItem)}
                        </div>

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-white truncate leading-tight">
                              {menuItem.name}
                            </h4>
                            <span className="text-[8.5px] font-black uppercase text-neutral-300 bg-white/10 px-1.5 py-0.5 rounded-md border border-white/15 shrink-0">
                              {categoryLabel}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono font-black text-[11px] border border-white/15">
                              {menuItem.price} Kč
                            </span>
                            {menuItem.volumeOrSize && <span className="font-semibold text-neutral-400">• {menuItem.volumeOrSize}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Right: Quantity Modifier Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        {qty > 0 && (
                          <button
                            onClick={() => handleQuantityChange(menuItem, -1)}
                            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        )}

                        {qty > 0 && (
                          <span className="w-6 text-center text-base font-mono font-black text-white drop-shadow">
                            {qty}
                          </span>
                        )}

                        <button
                          onClick={() => handleQuantityChange(menuItem, 1)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-black shadow-lg transition-all active:scale-95 cursor-pointer ${
                            isSelected
                              ? 'bg-[#DE1D3E] hover:bg-red-600 shadow-red-600/40'
                              : 'bg-gradient-to-r from-[#DE1D3E] to-[#B91C1C] hover:from-red-600 hover:to-red-800 shadow-red-600/30'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>



            {/* Alerts */}
            {orderError && (
              <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {orderError}
              </div>
            )}
            {orderSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {orderSuccessMsg}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: RADAR / VENUE MAP (Rich Informative Radar) */}
        {activeTab === 'map' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Interactive Stadium Radar Blueprint */}
            <div className="relative w-full rounded-3xl bg-gradient-to-b from-white/10 via-[#121420]/90 to-[#0A0B0F] border border-white/20 overflow-hidden flex flex-col p-4 shadow-xl">
              {/* Top Header */}
              <div className="flex items-center justify-between mb-3 z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black uppercase text-white tracking-wider">Živý Radar Arény</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">Aktualizace: živě</span>
              </div>

              {/* Arena Blueprint Pitch Box */}
              <div className="relative w-full h-[155px] rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-950/30 via-[#0E151A] to-emerald-950/30 flex items-center justify-center overflow-hidden shadow-inner">
                {/* Pitch Grid Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:14px_14px] opacity-20 pointer-events-none" />

                {/* Center Pitch Circle */}
                <div className="w-24 h-24 rounded-full border border-emerald-500/30 flex items-center justify-center">
                  <span className="text-[9.5px] font-black uppercase text-emerald-400/70 tracking-widest">PÓDIUM / HŘIŠTĚ</span>
                </div>

                {/* Live Pins with Color Spectrum */}
                <div className="absolute top-2.5 left-3 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md text-[10px] font-extrabold text-white border border-amber-500/40 shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>WC B • 4 min</span>
                </div>

                <div className="absolute bottom-2.5 right-3 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md text-[10px] font-extrabold text-white border border-emerald-500/40 shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Express Bar • 2 min</span>
                </div>

                <div className="absolute top-2.5 right-3 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md text-[10px] font-extrabold text-white border border-rose-500/40 shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  <span>FanShop • 10 min</span>
                </div>
              </div>

              {/* Status Legend Bar */}
              <div className="flex items-center justify-around mt-3 text-[10px] font-bold text-neutral-400 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Volno (&lt;3 min)
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Střední (4-7 min)
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Vytíženo (8+ min)
                </span>
              </div>
            </div>

            {/* POI Queue List with Walking Distance Metrics */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black uppercase tracking-wider text-white">Délka Front & Vzdálenost</h3>
                <span className="text-xs text-neutral-400 font-medium">Podle vzdálenosti</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {liveConfig.pois.map((poi: VenuePOI) => {
                  const isLow = poi.queueLevel === 'low';
                  const isMed = poi.queueLevel === 'med';

                  // Informative walking metrics & color pill
                  const walkDist = isLow ? '45m • 1 min chůze' : isMed ? '110m • 2 min chůze' : '180m • 3 min chůze';
                  const statusStyle = isLow
                    ? { dot: 'bg-emerald-400', pill: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', border: 'border-l-4 border-l-emerald-500' }
                    : isMed
                    ? { dot: 'bg-amber-400', pill: 'bg-amber-500/15 text-amber-400 border-amber-500/30', border: 'border-l-4 border-l-amber-500' }
                    : { dot: 'bg-rose-400', pill: 'bg-rose-500/15 text-rose-400 border-rose-500/30', border: 'border-l-4 border-l-rose-500' };

                  const getPoiIcon = (cat: string) => {
                    if (cat === 'bar') return <Beer className="w-4.5 h-4.5 text-white" />;
                    if (cat === 'wc') return <DoorClosed className="w-4.5 h-4.5 text-white" />;
                    if (cat === 'merch') return <Shirt className="w-4.5 h-4.5 text-white" />;
                    return <MapPin className="w-4.5 h-4.5 text-white" />;
                  };

                  return (
                    <div
                      key={poi.id}
                      onClick={() => alert(`Spouštím navigaci k: ${poi.name} (${poi.locationDetail})`)}
                      className={`p-3.5 rounded-2xl bg-gradient-to-r from-white/10 via-[#141620] to-[#0D0E15] border border-white/15 hover:border-white/30 flex items-center justify-between gap-3 transition-all cursor-pointer shadow-lg active:scale-[0.99] ${statusStyle.border}`}
                    >
                      {/* Left: Icon + Title & Distance Subtext */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-md">
                          {getPoiIcon(poi.category)}
                        </div>

                        <div className="flex flex-col min-w-0">
                          <h4 className="text-sm font-extrabold text-white truncate leading-tight">
                            {poi.name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mt-0.5 truncate">
                            <span>{poi.locationDetail}</span>
                            <span>•</span>
                            <span className="text-neutral-300 font-semibold">{walkDist}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Live Queue Wait Time Pill */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className={`px-3 py-1.5 rounded-full border text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm ${statusStyle.pill}`}>
                          <span className={`w-2 h-2 rounded-full animate-pulse ${statusStyle.dot}`} />
                          <span>~{poi.waitTimeMinutes} min</span>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-neutral-400 rotate-180" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Single Fixed Bottom Purchase Bar for Express Bar */}
      {activeTab === 'bar' && cartTotalAmount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 h-[84px] bg-[#0A0B0E]/95 backdrop-blur-2xl border-t border-white/15 px-6 flex items-center justify-between z-[90] max-w-md mx-auto shadow-[0_-10px_30px_rgba(0,0,0,0.8)] animate-fade-in">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              Celkem za občerstvení ({Object.values(cartItems).reduce((a, b) => a + b, 0)} {Object.values(cartItems).reduce((a, b) => a + b, 0) === 1 ? 'položka' : 'položek'})
            </span>
            <span className="text-xl font-mono font-black text-white mt-0.5">
              {cartTotalAmount.toLocaleString()} Kč
            </span>
          </div>

          <button
            disabled={isOrdering}
            onClick={handleCheckoutExpressOrder}
            className="bg-gradient-to-r from-[#DE1D3E] via-red-600 to-[#B91C1C] text-white px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/30 hover:from-red-600 hover:to-red-800 active:scale-95 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isOrdering ? 'Objednávám...' : 'Zaplatit z NFC'}</span>
          </button>
        </div>
      )}

    </div>
  );
};
