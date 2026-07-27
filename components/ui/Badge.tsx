import React from 'react';

interface BadgeProps {
  text: string;
  variant?: 'red' | 'gold' | 'dark';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ text, variant = 'red', className = '' }) => {
  let variantClass = 'badge-red';
  if (variant === 'gold' || text === 'VIP') variantClass = 'badge-gold';
  if (variant === 'dark' || text === 'EARLY BIRD' || text === 'LIMITED') variantClass = 'badge-dark';

  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-[12px] text-[0.68rem] font-bold tracking-wide uppercase transition-all ${variantClass} ${className}`}
    >
      {text}
    </span>
  );
};
