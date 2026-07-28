'use client';

import React, { useState } from 'react';
import { MatchPlayer } from '@/lib/types';
import { X, Award, Box } from 'lucide-react';
import TerrainMatchView from './TerrainMatchView';
import TeamLogo from '@/components/ui/TeamLogo';
import { getDynamicMatchColors } from '@/lib/team-colors';

interface TacticalPitchViewProps {
  homeTeamName: string;
  awayTeamName: string;
  homeLineup: MatchPlayer[];
  awayLineup: MatchPlayer[];
  onVoteMvp?: (playerId: string) => void;
}

export const TacticalPitchView: React.FC<TacticalPitchViewProps> = ({
  homeTeamName,
  awayTeamName,
  homeLineup,
  awayLineup,
  onVoteMvp
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<MatchPlayer | null>(null);
  const [viewMode, setViewMode] = useState<'pitch' | '3d' | 'list'>('pitch');
  const [activeListTeam, setActiveListTeam] = useState<'home' | 'away'>('home');

  const { homeColor, awayColor } = getDynamicMatchColors(homeTeamName, awayTeamName);

  const getRatingBadgeColor = (rating?: number) => {
    if (!rating) return 'bg-neutral-600';
    if (rating >= 7.5) return 'bg-[#2563EB] text-white'; // Livesport blue
    if (rating >= 7.0) return 'bg-[#16A34A] text-white'; // Livesport green
    if (rating >= 6.5) return 'bg-[#D97706] text-white'; // Orange/Amber
    return 'bg-[#DC2626] text-white'; // Red
  };

  const getPositionCzech = (pos: string) => {
    switch (pos?.toUpperCase()) {
      case "GK": return "BRANKÁŘ";
      case "DEF": return "OBRÁNCE";
      case "MID": return "ZÁLOŽNÍK";
      case "FWD": return "ÚTOČNÍK";
      default: return pos || "HRÁČ";
    }
  };

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* Header View Switcher */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          Vizualizace Zápasu
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode('pitch')}
            className={`fast-filter-pill !h-8 !px-3.5 !text-xs ${viewMode === 'pitch' ? 'active' : ''}`}
          >
            Trávník
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`fast-filter-pill !h-8 !px-3.5 !text-xs gap-1 ${viewMode === '3d' ? 'active' : ''}`}
          >
            <Box className="w-3 h-3" />
            <span>3D Terén</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`fast-filter-pill !h-8 !px-3.5 !text-xs ${viewMode === 'list' ? 'active' : ''}`}
          >
            Seznam
          </button>
        </div>
      </div>

      {/* VIEW 1: 3D TERÉN (NO PLAYER LIST BELOW!) */}
      {viewMode === '3d' && (
        <TerrainMatchView
          homeTeam={homeTeamName}
          awayTeam={awayTeamName}
          homeScore={2}
          awayScore={1}
        />
      )}

      {/* VIEW 2: LIVESPORT-STYLE 2D PITCH (NO PLAYER LIST BELOW!) */}
      {viewMode === 'pitch' && (
        <div className="relative w-full h-[640px] rounded-3xl bg-gradient-to-b from-[#0b381a] via-[#0f4a23] to-[#0b381a] border border-emerald-500/30 shadow-2xl overflow-hidden">
          
          {/* Turf Stripes Pattern */}
          <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(0deg,transparent,transparent_40px,rgba(0,0,0,0.3)_40px,rgba(0,0,0,0.3)_80px)] pointer-events-none" />

          {/* Pitch Markings */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute inset-3 border border-white/50 rounded-2xl" />
            <div className="absolute top-1/2 left-3 right-3 border-t border-white/50 -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-white/50 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-48 h-24 border-b border-x border-white/50 rounded-b-xl" />
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-10 border-b border-x border-white/50 rounded-b-lg" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-48 h-24 border-t border-x border-white/50 rounded-t-xl" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-24 h-10 border-t border-x border-white/50 rounded-t-lg" />
          </div>

          {/* Top Team Header Tag */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
            <span className="text-[10px] font-extrabold uppercase text-white bg-[#0A0B0E]/85 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5">
              <TeamLogo teamName={homeTeamName} className="w-3.5 h-3.5" />
              <span>{homeTeamName}</span>
            </span>
          </div>

          {/* Bottom Team Header Tag */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
            <span className="text-[10px] font-extrabold uppercase text-white bg-[#0A0B0E]/85 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5">
              <TeamLogo teamName={awayTeamName} className="w-3.5 h-3.5" />
              <span>{awayTeamName}</span>
            </span>
          </div>

          {/* Render Home Lineup Nodes */}
          {homeLineup.map((player) => (
            <div
              key={player.id}
              onClick={() => setSelectedPlayer(player)}
              style={{ left: `${player.xPct || 50}%`, top: `${player.yPct || 20}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-10"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-9 h-9 rounded-full border border-white/90 shadow-lg overflow-hidden bg-neutral-900 group-hover:scale-110 transition-transform">
                  <img
                    src={player.avatarUrl || `/api/player-avatar?name=${encodeURIComponent(player.name)}`}
                    alt={player.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `/api/player-avatar?name=${encodeURIComponent(player.name)}`;
                    }}
                  />
                </div>
                {player.rating && (
                  <span
                    className={`absolute -top-1 -right-2.5 px-1 py-0.2 rounded-md text-[8.5px] font-mono font-black shadow-md border border-black/30 ${getRatingBadgeColor(
                      player.rating
                    )}`}
                  >
                    {player.rating.toFixed(1)}
                  </span>
                )}
                {player.goals && (
                  <span className="absolute -bottom-1 -left-2 text-[10px] drop-shadow-md">⚽</span>
                )}
                {player.yellowCards && (
                  <span className="absolute -bottom-0.5 -right-1.5 w-2 h-3 bg-amber-400 rounded-sm border border-black/50 shadow-sm" />
                )}
              </div>

              <div className="mt-1 px-1.5 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-white/15 flex items-center gap-1 shadow-md max-w-[85px]">
                <span className="text-[8.5px] font-mono font-bold text-neutral-400">{player.number}</span>
                <span className="text-[9.5px] font-black text-white truncate leading-tight">
                  {player.lastName || player.name.split(' ').pop()}
                </span>
              </div>
            </div>
          ))}

          {/* Render Away Lineup Nodes */}
          {awayLineup.map((player) => (
            <div
              key={player.id}
              onClick={() => setSelectedPlayer(player)}
              style={{ left: `${player.xPct || 50}%`, top: `${player.yPct || 80}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-10"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-9 h-9 rounded-full border border-white/90 shadow-lg overflow-hidden bg-neutral-900 group-hover:scale-110 transition-transform">
                  <img
                    src={player.avatarUrl || `/api/player-avatar?name=${encodeURIComponent(player.name)}`}
                    alt={player.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `/api/player-avatar?name=${encodeURIComponent(player.name)}`;
                    }}
                  />
                </div>
                {player.rating && (
                  <span
                    className={`absolute -top-1 -right-2.5 px-1 py-0.2 rounded-md text-[8.5px] font-mono font-black shadow-md border border-black/30 ${getRatingBadgeColor(
                      player.rating
                    )}`}
                  >
                    {player.rating.toFixed(1)}
                  </span>
                )}
                {player.goals && (
                  <span className="absolute -bottom-1 -left-2 text-[10px] drop-shadow-md">⚽</span>
                )}
                {player.yellowCards && (
                  <span className="absolute -bottom-0.5 -right-1.5 w-2 h-3 bg-amber-400 rounded-sm border border-black/50 shadow-sm" />
                )}
              </div>

              <div className="mt-1 px-1.5 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-white/15 flex items-center gap-1 shadow-md max-w-[85px]">
                <span className="text-[8.5px] font-mono font-bold text-neutral-400">{player.number}</span>
                <span className="text-[9.5px] font-black text-white truncate leading-tight">
                  {player.lastName || player.name.split(' ').pop()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 3: REDESIGNED LIQUID GLASS PLAYER LINEUP LIST */}
      {viewMode === 'list' && (
        <div className="flex flex-col gap-3 animate-fade-in">
          {/* Dynamic Team Selector Tabs */}
          <div className="flex items-center gap-2 py-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveListTeam('home')}
              className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 border transition-all cursor-pointer ${
                activeListTeam === 'home'
                  ? 'bg-gradient-to-r from-white/20 to-white/10 text-white border-white/40 shadow-lg'
                  : 'bg-black/40 text-neutral-400 border-white/10 hover:border-white/20'
              }`}
              style={{
                borderColor: activeListTeam === 'home' ? homeColor : undefined,
                boxShadow: activeListTeam === 'home' ? `0 0 12px ${homeColor}66` : undefined
              }}
            >
              <TeamLogo teamName={homeTeamName} className="w-4 h-4 shrink-0" />
              <span>{homeTeamName}</span>
            </button>
            <button
              onClick={() => setActiveListTeam('away')}
              className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 border transition-all cursor-pointer ${
                activeListTeam === 'away'
                  ? 'bg-gradient-to-r from-white/20 to-white/10 text-white border-white/40 shadow-lg'
                  : 'bg-black/40 text-neutral-400 border-white/10 hover:border-white/20'
              }`}
              style={{
                borderColor: activeListTeam === 'away' ? awayColor : undefined,
                boxShadow: activeListTeam === 'away' ? `0 0 12px ${awayColor}66` : undefined
              }}
            >
              <TeamLogo teamName={awayTeamName} className="w-4 h-4 shrink-0" />
              <span>{awayTeamName}</span>
            </button>
          </div>

          {/* Player Cards List (No Overflow, Clean Flex & Truncate) */}
          <div className="grid grid-cols-1 gap-2.5">
            {(activeListTeam === 'home' ? homeLineup : awayLineup).map((player) => (
              <div
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                className="glass-panel p-3.5 rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-[#0e1017]/90 to-black/80 flex items-center justify-between gap-3 cursor-pointer hover:border-white/30 transition-all shadow-xl overflow-hidden"
              >
                {/* Left Side: Avatar + Name + Number + Czech Position */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden shrink-0 shadow-md bg-black/40">
                    <img 
                      src={player.avatarUrl || `/api/player-avatar?name=${encodeURIComponent(player.name)}`} 
                      alt={player.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `/api/player-avatar?name=${encodeURIComponent(player.name)}`;
                      }}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-white truncate leading-tight">
                        {player.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-neutral-400 shrink-0">
                        #{player.number}
                      </span>
                    </div>
                    <span className="text-[9.5px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5 truncate">
                      {getPositionCzech(player.position)}
                    </span>
                  </div>
                </div>

                {/* Right Side: Badges & Rating (Never Offscreen) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {player.isCaptain && (
                    <span className="text-[8.5px] font-black text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded-lg border border-amber-500/40">
                      KAPITÁN
                    </span>
                  )}
                  {player.goals && (
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-extrabold text-[9.5px] border border-emerald-500/40 flex items-center gap-1">
                      <span>⚽</span>
                      <span>{player.goals}x GÓL</span>
                    </span>
                  )}
                  {player.yellowCards && (
                    <span className="w-2.5 h-3.5 bg-amber-400 rounded-sm shadow-sm border border-black/40" />
                  )}
                  {player.rating && (
                    <span className={`px-2 py-0.5 rounded-xl text-xs font-mono font-black shadow-md border border-white/20 ${getRatingBadgeColor(player.rating)}`}>
                      {player.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Player Detail Modal Popup */}
      {selectedPlayer && (
        <div
          onClick={() => setSelectedPlayer(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs bg-[#0A0B0E]/95 border border-white/15 rounded-3xl p-6 flex flex-col gap-4 text-white shadow-2xl relative backdrop-blur-2xl cursor-default"
          >
            <button
              onClick={() => setSelectedPlayer(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 border border-white/15 text-white flex items-center justify-center hover:bg-black/80 transition-all cursor-pointer z-10"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3.5 pt-1">
              <div className="w-14 h-14 rounded-full border-2 border-white/80 overflow-hidden shadow-xl shrink-0">
                <img 
                  src={selectedPlayer.avatarUrl || `/api/player-avatar?name=${encodeURIComponent(selectedPlayer.name)}`} 
                  alt={selectedPlayer.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `/api/player-avatar?name=${encodeURIComponent(selectedPlayer.name)}`;
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-neutral-400 font-bold">#{selectedPlayer.number} • {getPositionCzech(selectedPlayer.position)}</span>
                <h3 className="text-base font-extrabold text-white leading-tight">{selectedPlayer.name}</h3>
                {selectedPlayer.rating && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-mono font-black ${getRatingBadgeColor(selectedPlayer.rating)}`}>
                      Známka: {selectedPlayer.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-white/10 text-xs">
              <div className="p-3 rounded-2xl glass-panel border border-white/10 flex flex-col">
                <span className="text-neutral-400 text-[10px] font-semibold">Góly v zápase</span>
                <span className="font-black text-white text-base mt-0.5">{selectedPlayer.goals || 0}</span>
              </div>
              <div className="p-3 rounded-2xl glass-panel border border-white/10 flex flex-col">
                <span className="text-neutral-400 text-[10px] font-semibold">Asistence</span>
                <span className="font-black text-white text-base mt-0.5">{selectedPlayer.assists || 0}</span>
              </div>
            </div>

            {/* Action CTA */}
            {onVoteMvp && (
              <button
                onClick={() => {
                  onVoteMvp(selectedPlayer.id);
                  setSelectedPlayer(null);
                }}
                className="w-full py-3.5 rounded-full bg-[#DE1D3E] hover:bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer mt-1"
              >
                <Award className="w-4 h-4" />
                Hlasovat pro Hráče Utkání
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
