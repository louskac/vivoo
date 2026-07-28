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
  Check
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
    if (item.category === 'pivo') return <Beer className="w-5 h-5 text-amber-400" />;
    if (item.category === 'nealko') return <Coffee className="w-5 h-5 text-blue-400" />;
    if (item.category === 'snack') return <Utensils className="w-5 h-5 text-orange-400" />;
    if (item.category === 'merch') return <Shirt className="w-5 h-5 text-purple-400" />;
    return <Tag className="w-5 h-5 text-neutral-400" />;
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/20 backdrop-blur-md cursor-pointer hover:bg-black/80 transition-colors shadow-lg shrink-0"
          >
            <Wallet className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">NFC Kredit</span>
              <span className="text-xs font-black text-emerald-400">{user.cashlessCredit} Kč</span>
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
            { id: 'bar', label: 'Express Bar', icon: <Beer className="w-3.5 h-3.5" /> },
            { id: 'map', label: 'Radar', icon: <MapPin className="w-3.5 h-3.5" /> }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`fast-filter-pill gap-1.5 ${isActive ? 'active' : ''}`}
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

        {/* TAB 2: ATMOSFÉRA / PULSE, MVP & PREDICTORS */}
        {activeTab === 'pulse' && (
          <div className="flex flex-col gap-4 animate-fade-in">

            {/* Signed Jersey Raffle & MVP Vote Card */}
            {liveConfig.jerseyRaffle && (
              <div className="glass-panel p-5 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-neutral-900/90 to-neutral-950 flex flex-col gap-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Gift className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-extrabold text-white">Vyhraj Podepsaný Dres MVP</h3>
                  </div>
                  <Badge text="SOUTĚŽ" variant="gold" />
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  Hlasujte pro Hráče Utkání a budete automaticky zařazeni do losování o originální podepsaný dres <strong className="text-amber-300">{liveConfig.jerseyRaffle.playerName} (#{liveConfig.jerseyRaffle.playerNumber})</strong>.
                </p>

                <div className="glass-panel p-3.5 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-medium">Stav zapojení:</span>
                  {isRaffleEntered ? (
                    <span className="flex items-center gap-1 font-bold text-emerald-400">
                      <Check className="w-4 h-4" />
                      Zařazeno do losování!
                    </span>
                  ) : (
                    <span className="font-bold text-amber-400">Hlasujte níže pro zařazení</span>
                  )}
                </div>
              </div>
            )}

            {/* MVP Hráč Utkání Voting */}
            {liveConfig.polls.map((poll: LivePoll) => {
              const votedOptId = livePollVotes[poll.id];
              return (
                <div key={poll.id} className="glass-panel p-4.5 rounded-3xl border border-white/15 flex flex-col gap-3.5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-white">{poll.question}</h4>
                    <span className="text-[11px] font-semibold text-neutral-400">{poll.totalVotes} hlasů</span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {poll.options.map((opt: LivePollOption) => {
                      const isVoted = votedOptId === opt.id;
                      const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handlePollVote(poll.id, opt.id)}
                          className={`relative overflow-hidden p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            isVoted
                              ? 'bg-[#DE1D3E]/20 border-[#DE1D3E] text-white shadow-[0_0_15px_rgba(222,29,62,0.25)]'
                              : 'glass-panel border-white/10 hover:border-white/20 text-neutral-200'
                          }`}
                        >
                          {/* Progress fill */}
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-600 to-[#DE1D3E] opacity-35 shadow-[0_0_12px_rgba(222,29,62,0.4)] transition-all duration-500 pointer-events-none"
                            style={{ width: `${pct}%` }}
                          />

                          <div className="relative z-10 flex items-center justify-between text-xs font-extrabold">
                            <span className="flex items-center gap-2">
                              {isVoted && <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />}
                              {opt.label}
                            </span>
                            <span className="font-mono text-red-400 font-black text-sm">{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {liveConfig.nextGoalTeamPoll && (
              <div className="glass-panel p-4.5 rounded-3xl border border-white/15 flex flex-col gap-3.5 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#DE1D3E]" />
                    <h4 className="text-sm font-extrabold text-white">{liveConfig.nextGoalTeamPoll.question}</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-400">{liveConfig.nextGoalTeamPoll.totalVotes} tipů</span>
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
                        className={`relative overflow-hidden p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isVoted
                            ? 'bg-[#DE1D3E]/20 border-[#DE1D3E] text-white shadow-[0_0_15px_rgba(222,29,62,0.25)]'
                            : 'glass-panel border-white/10 hover:border-white/20 text-neutral-200'
                        }`}
                      >
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-600 to-[#DE1D3E] opacity-35 shadow-[0_0_12px_rgba(222,29,62,0.4)] transition-all duration-500 pointer-events-none"
                          style={{ width: `${pct}%` }}
                        />

                        <div className="relative z-10 flex items-center justify-between text-xs font-extrabold">
                          <span className="flex items-center gap-2">
                            {isVoted && <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />}
                            {opt.label}
                          </span>
                          <span className="font-mono text-red-400 font-black text-sm">{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Specific Player Scorer Predictor */}
            {liveConfig.nextGoalScorerPoll && (
              <div className="glass-panel p-4.5 rounded-3xl border border-white/15 flex flex-col gap-3.5 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-extrabold text-white">{liveConfig.nextGoalScorerPoll.question}</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-400">{liveConfig.nextGoalScorerPoll.totalVotes} tipů</span>
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
                        className={`relative overflow-hidden p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isVoted
                            ? 'bg-[#DE1D3E]/20 border-[#DE1D3E] text-white shadow-[0_0_15px_rgba(222,29,62,0.25)]'
                            : 'glass-panel border-white/10 hover:border-white/20 text-neutral-200'
                        }`}
                      >
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-600 to-[#DE1D3E] opacity-35 shadow-[0_0_12px_rgba(222,29,62,0.4)] transition-all duration-500 pointer-events-none"
                          style={{ width: `${pct}%` }}
                        />

                        <div className="relative z-10 flex items-center justify-between text-xs font-extrabold">
                          <span className="flex items-center gap-2">
                            {isVoted && <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />}
                            {opt.label}
                          </span>
                          <span className="font-mono text-red-400 font-black text-sm">{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Strobe Lightshow Sync Card */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-red-400" />
                  <h3 className="text-base font-extrabold text-white">Světelný Stroboskop</h3>
                </div>
                <Badge text="SYNCHRO" variant="dark" />
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Obrazovka telefonu se synchronizuje se světelnou choreografií v aréně při vstřelení gólu.
              </p>
              <button
                onClick={toggleLightshow}
                className="w-full py-3 rounded-full bg-[#DE1D3E] hover:bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Spustit Světelnou Show
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

            {/* Express Menu List */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Express Bar Menu</h3>
                <span className="text-xs text-emerald-400 font-bold">Zůstatek: {user.cashlessCredit} Kč</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {liveConfig.expressMenu.map((menuItem: ExpressOrderItem) => {
                  const qty = cartItems[menuItem.id] || 0;
                  return (
                    <div
                      key={menuItem.id}
                      className="glass-panel p-4 rounded-3xl border border-white/10 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="feed-action-icon-box shrink-0">
                          {getItemIcon(menuItem)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h4 className="text-sm font-extrabold text-white truncate">{menuItem.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-neutral-400">
                            <span className="font-bold text-white">{menuItem.price} Kč</span>
                            {menuItem.volumeOrSize && <span>• {menuItem.volumeOrSize}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Modifier */}
                      <div className="flex items-center gap-2 shrink-0">
                        {qty > 0 && (
                          <button
                            onClick={() => handleQuantityChange(menuItem, -1)}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        )}
                        {qty > 0 && <span className="w-5 text-center text-sm font-black text-white">{qty}</span>}
                        <button
                          onClick={() => handleQuantityChange(menuItem, 1)}
                          className="w-8 h-8 rounded-full bg-[#DE1D3E] hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-all active:scale-95"
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
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {orderError}
              </div>
            )}
            {orderSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {orderSuccessMsg}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: RADAR / VENUE MAP */}
        {activeTab === 'map' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Blueprint Card */}
            <div className="relative w-full h-[180px] rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden flex flex-col items-center justify-center p-4">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
              
              <div className="w-[85%] h-[70%] rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/20 flex items-center justify-center relative">
                <span className="text-xs font-black uppercase text-emerald-400/70 tracking-widest">HŘIŠTĚ / PÓDIUM</span>
                
                <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-[9px] font-bold text-blue-200 border border-blue-400/30">
                  WC Sektor B
                </div>
                <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-[9px] font-bold text-emerald-200 border border-emerald-400/30">
                  Express Bar 1
                </div>
              </div>

              <span className="text-[10px] font-semibold text-neutral-400 mt-2">Plán Arény & Živé Fronty</span>
            </div>

            {/* POI Queue List */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Délka Front v Aréně</h3>

              <div className="flex flex-col gap-2.5">
                {liveConfig.pois.map((poi: VenuePOI) => {
                  const isLow = poi.queueLevel === 'low';
                  const isMed = poi.queueLevel === 'med';
                  const queueText = isLow ? 'Nízká fronta' : isMed ? 'Střední fronta' : 'Vysoká fronta';
                  const badgeVariant = isLow ? 'dark' : isMed ? 'gold' : 'red';

                  return (
                    <div key={poi.id} className="glass-panel p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3">
                      <div className="flex flex-col min-w-0">
                        <h4 className="text-sm font-extrabold text-white truncate">{poi.name}</h4>
                        <span className="text-xs text-neutral-400">{poi.locationDetail}</span>
                      </div>

                      <div className="flex flex-col items-end shrink-0 gap-1">
                        <Badge text={queueText} variant={badgeVariant} />
                        <span className="text-xs font-bold text-neutral-300">~{poi.waitTimeMinutes} min čekání</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Sticky Fixed Bottom Purchase Bar for Express Bar */}
      {activeTab === 'bar' && cartTotalAmount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 h-[80px] bg-[#0A0B0E]/95 backdrop-blur-xl border-t border-white/10 px-5 flex items-center justify-between z-50 max-w-md mx-auto">
          <div>
            <span className="text-[0.68rem] text-neutral-400 block uppercase tracking-wider font-bold">Celkem za nápoje</span>
            <span className="text-xl font-black text-white">{cartTotalAmount.toLocaleString()} Kč</span>
          </div>
          <button
            disabled={isOrdering}
            onClick={handleCheckoutExpressOrder}
            className="bg-[#DE1D3E] text-white px-7 py-3 rounded-full text-sm font-bold shadow-lg shadow-red-600/30 hover:bg-red-600 active:scale-95 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            {isOrdering ? 'Objednávám...' : 'Zaplatit z NFC'}
          </button>
        </div>
      )}

    </div>
  );
};
