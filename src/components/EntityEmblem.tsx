import React from 'react';

interface EntityEmblemProps {
  status: 'challenge' | 'error' | 'success';
}

export const EntityEmblem: React.FC<EntityEmblemProps> = ({ status }) => {
  const primary =
    status === 'error'
      ? '#FF2A4B'
      : status === 'success'
        ? '#00FF9D'
        : '#00F0FF';

  const secondary =
    status === 'error'
      ? '#FF8FA3'
      : status === 'success'
        ? '#00F0FF'
        : '#FCEE09';

  return (
    <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 mx-auto">
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full overflow-visible"
        aria-hidden="true"
      >
        {/* Outer rotating segmented targeting ring */}
        <g className="animate-emblem-spin">
          <circle
            cx="60"
            cy="60"
            r="53"
            fill="none"
            stroke={primary}
            strokeWidth="1.5"
            strokeDasharray="18 8 4 8"
            strokeOpacity="0.8"
          />
          <path
            d="M60 2 L64 9 H56 Z"
            fill={secondary}
          />
          <path
            d="M60 118 L64 111 H56 Z"
            fill={secondary}
          />
        </g>

        {/* Inner counter-rotating octagonal ring */}
        <g className="animate-emblem-spin-reverse">
          <polygon
            points="60,16 91,29 104,60 91,91 60,104 29,91 16,60 29,29"
            fill="none"
            stroke={secondary}
            strokeWidth="1.25"
            strokeDasharray="10 6"
            strokeOpacity="0.75"
          />
        </g>

        {/* Core hexagonal housing */}
        <polygon
          points="60,26 89,43 89,77 60,94 31,77 31,43"
          fill="#0B101C"
          stroke={primary}
          strokeWidth="2"
        />

        {/* Inner state glyph */}
        {status === 'success' ? (
          <g>
            <circle
              cx="60"
              cy="60"
              r="18"
              fill="rgba(0, 255, 157, 0.14)"
              stroke="#00FF9D"
              strokeWidth="1.5"
            />
            <path
              d="M50 60.5 L57 67.5 L71.5 52.5"
              fill="none"
              stroke="#00FF9D"
              strokeWidth="3.2"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </g>
        ) : status === 'error' ? (
          <g>
            <polygon
              points="60,40 78,73 42,73"
              fill="rgba(255, 42, 75, 0.18)"
              stroke="#FF2A4B"
              strokeWidth="2"
            />
            <line
              x1="60"
              y1="50"
              x2="60"
              y2="61"
              stroke="#FF8FA3"
              strokeWidth="2.8"
              strokeLinecap="square"
            />
            <rect x="58.5" y="65" width="3" height="3" fill="#FF8FA3" />
          </g>
        ) : (
          <g>
            {/* Geometric Entity Eye / Signal Core */}
            <path
              d="M39 60 Q60 41 81 60 Q60 79 39 60 Z"
              fill="rgba(0, 240, 255, 0.1)"
              stroke="#00F0FF"
              strokeWidth="1.8"
            />
            <circle
              cx="60"
              cy="60"
              r="8.5"
              fill="none"
              stroke="#FCEE09"
              strokeWidth="2"
            />
            <circle cx="60" cy="60" r="3" fill="#FCEE09" />
            {/* Side reticle ticks */}
            <line x1="34" y1="60" x2="39" y2="60" stroke="#FCEE09" strokeWidth="1.5" />
            <line x1="81" y1="60" x2="86" y2="60" stroke="#FCEE09" strokeWidth="1.5" />
          </g>
        )}
      </svg>
    </div>
  );
};
