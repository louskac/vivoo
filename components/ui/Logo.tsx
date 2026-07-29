import React from 'react';

interface LogoProps {
  className?: string;
  height?: number | string;
  variant?: 'full' | 'icon';
}

export const Logo: React.FC<LogoProps> = ({ className = '', height = 32, variant = 'full' }) => {
  const src = variant === 'icon' ? '/images/logo_icon.png' : '/images/logo.png';
  return (
    <img
      src={src}
      alt="ViVoo"
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      className={`object-contain select-none inline-block ${className}`}
    />
  );
};
