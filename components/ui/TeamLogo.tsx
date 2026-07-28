"use client";

import React, { useState } from 'react';

interface TeamLogoProps {
  teamName: string;
  className?: string;
  logoUrl?: string;
}

export default function TeamLogo({ teamName, className = "w-12 h-12", logoUrl }: TeamLogoProps) {
  const [hasError, setHasError] = useState(false);

  const src = !hasError
    ? (logoUrl || `/api/team-logo?team=${encodeURIComponent(teamName || 'FC')}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(teamName || 'FC')}&background=1e293b&color=fff&bold=true`;

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <img
        src={src}
        alt={teamName}
        onError={() => setHasError(true)}
        className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-300"
      />
    </div>
  );
}
