import React, { useState } from "react";
import TeamLogo from "@/components/ui/TeamLogo";

interface PlayerCardProps {
  name: string;
  position: string;
  flag: string;
  fotmobId?: number;
  fps: string;
  yieldVal: string;
  accentColor: string;
  teamName?: string;
}

export default function PlayerCard({
  name,
  position,
  flag,
  fotmobId,
  fps,
  yieldVal,
  accentColor,
  teamName
}: PlayerCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const getPositionCzech = (pos: string) => {
    switch (pos?.toUpperCase()) {
      case "GK": return "BRANKÁŘ";
      case "DEF": return "OBRÁNCE";
      case "MID": return "ZÁLOŽNÍK";
      case "FWD": return "ÚTOČNÍK";
      default: return pos || "HRÁČ";
    }
  };

  const isInvalidId = !fotmobId || fotmobId === 0;
  const photoUrl = isInvalidId || imgError
    ? `/api/player-avatar?name=${encodeURIComponent(name)}`
    : `https://images.fotmob.com/image_resources/playerimages/${fotmobId}.png`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "140px",
        position: "relative",
        borderRadius: "20px",
        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(18, 20, 30, 0.92) 100%)",
        borderTop: "1px solid rgba(255, 255, 255, 0.70)",
        borderLeft: "1px solid rgba(255, 255, 255, 0.35)",
        borderRight: "1px solid rgba(255, 255, 255, 0.25)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        boxShadow: hovered
          ? `0 16px 36px rgba(0,0,0,0.8), 0 0 20px ${accentColor}88, inset 0 1px 1.5px rgba(255,255,255,0.5)`
          : `0 10px 24px rgba(0,0,0,0.65), inset 0 1px 1.5px rgba(255,255,255,0.4)`,
        padding: "9px 10px",
        transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease",
        transform: hovered ? "scale(1.05) translateY(-2px)" : "scale(1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        zIndex: 10,
        fontFamily: "var(--font-outfit, system-ui)",
        overflow: "hidden"
      }}
    >
      {/* Background Accent Glow */}
      <div style={{
        position: "absolute",
        top: "-15px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accentColor}66 0%, transparent 70%)`,
        filter: "blur(10px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Top Header: Team Crest + Flag + Position Badge */}
      <div style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 2
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {teamName && <TeamLogo teamName={teamName} className="w-3.5 h-3.5 shrink-0" />}
          {flag && (
            <span style={{ display: "inline-flex", borderRadius: "50%", overflow: "hidden", width: "12px", height: "12px", border: "0.5px solid rgba(255,255,255,0.4)", boxShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
              <img src={flag} alt="vlajka" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </span>
          )}
        </div>
        <span style={{
          fontSize: "8px",
          fontWeight: 900,
          background: accentColor === "#DE1D3E" ? "#DE1D3E" : "rgba(255,255,255,0.18)",
          color: "#ffffff",
          padding: "1.5px 5.5px",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.25)",
          letterSpacing: "0.4px"
        }}>
          {getPositionCzech(position)}
        </span>
      </div>

      {/* Circular Player Photo Avatar */}
      <div style={{
        width: "46px",
        height: "46px",
        borderRadius: "50%",
        overflow: "hidden",
        border: `2px solid ${accentColor}`,
        boxShadow: `0 0 12px ${accentColor}88`,
        position: "relative",
        zIndex: 2,
        background: "rgba(0,0,0,0.4)"
      }}>
        <img
          src={photoUrl}
          alt={name}
          onError={() => setImgError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Player Name & Team */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", zIndex: 2, width: "100%" }}>
        <span style={{
          fontSize: "12.5px",
          fontWeight: 900,
          color: "#ffffff",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "100%",
          letterSpacing: "-0.2px",
          textShadow: "0 1px 4px rgba(0,0,0,0.8)"
        }}>
          {name}
        </span>
        {teamName && (
          <span style={{
            fontSize: "9.5px",
            fontWeight: 700,
            color: "rgba(255,255,255,0.75)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%"
          }}>
            {teamName}
          </span>
        )}
      </div>

      {/* Goal & xG Pill Footer */}
      <div style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "4.5px 8px",
        borderRadius: "12px",
        background: "rgba(0, 0, 0, 0.55)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        zIndex: 2,
        fontSize: "9.5px",
        fontFamily: "monospace"
      }}>
        <span style={{ fontWeight: 900, color: "#DE1D3E" }}>{yieldVal}</span>
        <span style={{ fontWeight: 800, color: "rgba(255,255,255,0.85)" }}>{fps}</span>
      </div>
    </div>
  );
}
