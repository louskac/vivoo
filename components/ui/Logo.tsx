import React from 'react';

interface LogoProps {
  className?: string;
  height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', height = 32 }) => {
  return (
    <img
      src="/images/logo.png"
      alt="ViVoo"
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      className={`object-contain select-none ${className}`}
    />
  );
};
