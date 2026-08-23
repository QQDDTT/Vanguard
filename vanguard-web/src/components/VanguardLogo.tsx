import React from 'react';

interface VanguardLogoProps {
  size?: number;
  className?: string;
}

export const VanguardLogo: React.FC<VanguardLogoProps> = ({ size = 32, className = '' }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 512 512" 
      width={size} 
      height={size} 
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        <linearGradient id="uiBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="50%" stop-color="#090d16"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>

        <linearGradient id="uiBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
          <stop offset="50%" stop-color="#6366f1" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#10b981" stop-opacity="0.6"/>
        </linearGradient>

        <linearGradient id="uiVLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7dd3fc"/>
          <stop offset="30%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>

        <linearGradient id="uiVRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#818cf8"/>
          <stop offset="40%" stop-color="#6366f1"/>
          <stop offset="100%" stop-color="#2563eb"/>
        </linearGradient>

        <linearGradient id="uiCorePrismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#34d399"/>
          <stop offset="50%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#6366f1"/>
        </linearGradient>

        <radialGradient id="uiShieldGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3"/>
          <stop offset="60%" stop-color="#6366f1" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <rect x="16" y="16" width="480" height="480" rx="108" fill="url(#uiBgGrad)" stroke="url(#uiBorderGrad)" stroke-width="6"/>
      <circle cx="256" cy="240" r="180" fill="url(#uiShieldGlow)"/>

      <path d="M 256 70 L 390 125 C 390 260, 330 365, 256 420 C 182 365, 122 260, 122 125 Z" 
            fill="none" 
            stroke="#38bdf8" 
            stroke-opacity="0.25" 
            stroke-width="4" 
            stroke-dasharray="6 4"/>

      <path d="M 256 92 L 370 140 C 370 250, 318 340, 256 390 C 194 340, 142 250, 142 140 Z" 
            fill="#0f172a" 
            fill-opacity="0.5" 
            stroke="rgba(255,255,255,0.08)" 
            stroke-width="2"/>

      <g>
        <path d="M 256 368 L 146 150 L 204 150 L 256 278 Z" fill="url(#uiVLeftGrad)"/>
        <path d="M 256 368 L 366 150 L 308 150 L 256 278 Z" fill="url(#uiVRightGrad)"/>
        <polygon points="256,118 290,158 256,198 222,158" fill="url(#uiCorePrismGrad)" stroke="#ffffff" stroke-width="2" stroke-opacity="0.9"/>
        <polygon points="256,330 266,370 256,392 246,370" fill="#ffffff" fill-opacity="0.95"/>
      </g>
    </svg>
  );
};
