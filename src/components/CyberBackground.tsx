import React from 'react';

interface CyberBackgroundProps {
  status: 'challenge' | 'error' | 'success';
}

export const CyberBackground: React.FC<CyberBackgroundProps> = ({ status }) => {
  const accentStroke =
    status === 'error'
      ? '#FF2A4B'
      : status === 'success'
        ? '#00FF9D'
        : '#00F0FF';

  const secondaryStroke =
    status === 'error'
      ? '#FF6B81'
      : status === 'success'
        ? '#00F0FF'
        : '#FCEE09';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      {/* Ambient radial depth */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background:
            status === 'error'
              ? 'radial-gradient(circle at 50% 42%, rgba(255, 42, 75, 0.16) 0%, rgba(11, 15, 26, 0.72) 48%, #06070B 100%)'
              : status === 'success'
                ? 'radial-gradient(circle at 50% 42%, rgba(0, 255, 157, 0.14) 0%, rgba(11, 15, 26, 0.72) 48%, #06070B 100%)'
                : 'radial-gradient(circle at 50% 42%, rgba(0, 240, 255, 0.12) 0%, rgba(11, 15, 26, 0.78) 48%, #06070B 100%)',
        }}
      />

      {/* Lower horizon perspective cyber-grid */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[46vh] opacity-35"
        viewBox="0 0 1440 420"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentStroke} stopOpacity="0" />
            <stop offset="45%" stopColor={accentStroke} stopOpacity="0.32" />
            <stop offset="100%" stopColor={accentStroke} stopOpacity="0.65" />
          </linearGradient>
        </defs>
        {/* Perspective receding rays */}
        <g stroke="url(#gridFade)" strokeWidth="1">
          <line x1="720" y1="0" x2="-360" y2="420" />
          <line x1="720" y1="0" x2="-120" y2="420" />
          <line x1="720" y1="0" x2="120" y2="420" />
          <line x1="720" y1="0" x2="360" y2="420" />
          <line x1="720" y1="0" x2="540" y2="420" />
          <line x1="720" y1="0" x2="720" y2="420" />
          <line x1="720" y1="0" x2="900" y2="420" />
          <line x1="720" y1="0" x2="1080" y2="420" />
          <line x1="720" y1="0" x2="1320" y2="420" />
          <line x1="720" y1="0" x2="1560" y2="420" />
          <line x1="720" y1="0" x2="1800" y2="420" />
        </g>
        {/* Horizontal depth lines */}
        <g stroke={accentStroke} strokeOpacity="0.22" strokeWidth="1">
          <line x1="0" y1="70" x2="1440" y2="70" />
          <line x1="0" y1="125" x2="1440" y2="125" />
          <line x1="0" y1="190" x2="1440" y2="190" />
          <line x1="0" y1="265" x2="1440" y2="265" />
          <line x1="0" y1="350" x2="1440" y2="350" />
        </g>
      </svg>

      {/* Left flank PCB circuit geometry (visible on wider screens) */}
      <svg
        className="hidden md:block absolute top-14 left-0 w-72 h-[540px] opacity-35"
        viewBox="0 0 280 540"
        fill="none"
      >
        <path
          d="M0 40 H96 L128 72 H210"
          stroke={accentStroke}
          strokeWidth="1.5"
        />
        <path
          d="M0 95 H65 L92 122 H165 L190 97 H245"
          stroke={secondaryStroke}
          strokeWidth="1.2"
          strokeOpacity="0.7"
        />
        <path
          d="M0 240 H54 L88 274 V355 L118 385 H188"
          stroke={accentStroke}
          strokeWidth="1.4"
        />
        <path
          d="M0 430 H102 L134 462 H225"
          stroke={secondaryStroke}
          strokeWidth="1"
          strokeOpacity="0.55"
        />
        <circle cx="214" cy="72" r="4" stroke={accentStroke} strokeWidth="1.5" />
        <circle cx="248" cy="97" r="3" fill={secondaryStroke} />
        <circle cx="192" cy="385" r="4" stroke={accentStroke} strokeWidth="1.5" />
        <rect
          x="74"
          y="295"
          width="28"
          height="42"
          stroke={accentStroke}
          strokeOpacity="0.5"
        />
      </svg>

      {/* Right flank PCB circuit geometry */}
      <svg
        className="hidden md:block absolute top-14 right-0 w-72 h-[540px] opacity-35"
        viewBox="0 0 280 540"
        fill="none"
      >
        <path
          d="M280 60 H184 L152 92 H70"
          stroke={accentStroke}
          strokeWidth="1.5"
        />
        <path
          d="M280 120 H210 L176 154 H96 L72 130 H28"
          stroke={secondaryStroke}
          strokeWidth="1.2"
          strokeOpacity="0.7"
        />
        <path
          d="M280 265 H218 L184 299 V372 L150 406 H76"
          stroke={accentStroke}
          strokeWidth="1.4"
        />
        <path
          d="M280 455 H172 L140 487 H52"
          stroke={secondaryStroke}
          strokeWidth="1"
          strokeOpacity="0.55"
        />
        <circle cx="66" cy="92" r="4" stroke={accentStroke} strokeWidth="1.5" />
        <circle cx="24" cy="130" r="3" fill={secondaryStroke} />
        <circle cx="72" cy="406" r="4" stroke={accentStroke} strokeWidth="1.5" />
        <polygon
          points="182,190 202,190 212,208 202,226 182,226 172,208"
          stroke={secondaryStroke}
          strokeOpacity="0.5"
          strokeWidth="1.2"
        />
      </svg>

      {/* Viewport corner HUD optical brackets */}
      <svg
        className="absolute top-3 left-3 w-10 h-10 opacity-70"
        viewBox="0 0 40 40"
        fill="none"
      >
        <path d="M2 24 V2 H24" stroke={secondaryStroke} strokeWidth="2" />
        <rect x="6" y="6" width="5" height="5" fill={accentStroke} />
      </svg>
      <svg
        className="absolute top-3 right-3 w-10 h-10 opacity-70"
        viewBox="0 0 40 40"
        fill="none"
      >
        <path d="M16 2 H38 V24" stroke={secondaryStroke} strokeWidth="2" />
        <rect x="29" y="6" width="5" height="5" fill={accentStroke} />
      </svg>
      <svg
        className="absolute bottom-3 left-3 w-10 h-10 opacity-70"
        viewBox="0 0 40 40"
        fill="none"
      >
        <path d="M2 16 V38 H24" stroke={secondaryStroke} strokeWidth="2" />
        <rect x="6" y="29" width="5" height="5" fill={accentStroke} />
      </svg>
      <svg
        className="absolute bottom-3 right-3 w-10 h-10 opacity-70"
        viewBox="0 0 40 40"
        fill="none"
      >
        <path d="M16 38 H38 V16" stroke={secondaryStroke} strokeWidth="2" />
        <rect x="29" y="29" width="5" height="5" fill={accentStroke} />
      </svg>

      {/* Subtle scanline texture */}
      <div className="absolute inset-0 cyber-scanlines opacity-75" />
    </div>
  );
};
