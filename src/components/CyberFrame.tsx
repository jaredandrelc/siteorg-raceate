import React from 'react';

interface CyberFrameProps {
  status: 'challenge' | 'error' | 'success';
  shakeKey: number;
  children: React.ReactNode;
}

export const CyberFrame: React.FC<CyberFrameProps> = ({
  status,
  shakeKey,
  children,
}) => {
  const isError = status === 'error';
  const isSuccess = status === 'success';

  const borderColor = isError
    ? '#FF2A4B'
    : isSuccess
      ? '#00FF9D'
      : '#00F0FF';

  const cornerAccent = isError
    ? '#FF2A4B'
    : isSuccess
      ? '#00FF9D'
      : '#FCEE09';

  const stripClass = isError
    ? 'cyber-hazard-strip-red'
    : isSuccess
      ? 'cyber-hazard-strip-emerald'
      : 'cyber-hazard-strip';

  const glowShadow = isError
    ? '0 0 48px rgba(255, 42, 75, 0.38), inset 0 0 28px rgba(255, 42, 75, 0.14)'
    : isSuccess
      ? '0 0 42px rgba(0, 255, 157, 0.25), inset 0 0 24px rgba(0, 255, 157, 0.08)'
      : '0 0 38px rgba(0, 240, 255, 0.16), inset 0 0 24px rgba(0, 240, 255, 0.05)';

  return (
    <div
      key={`frame-shake-${shakeKey}`}
      className={`relative w-full max-w-2xl mx-auto ${
        shakeKey > 0 && isError ? 'animate-cyber-shake' : ''
      }`}
    >
      {/* Exterior vertical power rails */}
      <div
        aria-hidden="true"
        className="hidden sm:block absolute -left-2.5 top-12 bottom-12 w-1.5 transition-colors duration-200"
        style={{ backgroundColor: cornerAccent, opacity: 0.85 }}
      />
      <div
        aria-hidden="true"
        className="hidden sm:block absolute -right-2.5 top-12 bottom-12 w-1.5 transition-colors duration-200"
        style={{ backgroundColor: cornerAccent, opacity: 0.85 }}
      />

      {/* Outer chamfered border shell (1px crisp chamfered frame via background + inner inset) */}
      <div
        className="relative cyber-chamfer p-[1.5px] transition-all duration-200"
        style={{
          backgroundColor: borderColor,
          boxShadow: glowShadow,
        }}
      >
        {/* Inner chamfered terminal container */}
        <div className="relative cyber-chamfer bg-[#0C101B] overflow-hidden">
          {/* Top hazard warning bar */}
          <div className="flex items-center justify-between h-3.5 w-full border-b border-white/10">
            <div className={`h-full w-24 sm:w-40 ${stripClass}`} />
            <div
              className="flex-1 h-full flex items-center justify-center gap-1.5 px-3"
              style={{
                background: isError
                  ? 'rgba(255, 42, 75, 0.2)'
                  : isSuccess
                    ? 'rgba(0, 255, 157, 0.16)'
                    : 'rgba(0, 240, 255, 0.1)',
              }}
            >
              {/* Diegetic SVG micro-equalizer bars */}
              <svg
                width="48"
                height="6"
                viewBox="0 0 48 6"
                fill="none"
                aria-hidden="true"
                className="opacity-70"
              >
                <rect x="0" y="1" width="10" height="4" fill={cornerAccent} />
                <rect x="14" y="1" width="6" height="4" fill={borderColor} />
                <rect x="24" y="1" width="14" height="4" fill={borderColor} />
                <rect x="42" y="1" width="6" height="4" fill={cornerAccent} />
              </svg>
            </div>
            <div className={`h-full w-20 sm:w-28 ${stripClass}`} />
          </div>

          {/* Sweeping scanner highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-20 animate-cyber-scan-sweep"
            style={{
              background: isError
                ? 'linear-gradient(180deg, transparent 0%, rgba(255, 42, 75, 0.12) 50%, transparent 100%)'
                : isSuccess
                  ? 'linear-gradient(180deg, transparent 0%, rgba(0, 255, 157, 0.11) 50%, transparent 100%)'
                  : 'linear-gradient(180deg, transparent 0%, rgba(0, 240, 255, 0.08) 50%, transparent 100%)',
            }}
          />

          {/* Red error impact flash */}
          {shakeKey > 0 && isError && (
            <div
              key={`flash-${shakeKey}`}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[#FF2A4B] animate-cyber-red-flash z-20"
            />
          )}

          {/* Inner terminal body */}
          <div className="relative z-10 px-5 py-6 sm:px-9 sm:py-8">
            {children}
          </div>

          {/* Bottom hazard accent strip */}
          <div className="flex items-center justify-between h-3 w-full border-t border-white/10">
            <div className={`h-full w-20 sm:w-28 ${stripClass}`} />
            <div
              className="flex-1 h-full"
              style={{
                background: isError
                  ? 'rgba(255, 42, 75, 0.28)'
                  : isSuccess
                    ? 'rgba(0, 255, 157, 0.22)'
                    : 'rgba(252, 238, 9, 0.14)',
              }}
            />
            <div className={`h-full w-24 sm:w-36 ${stripClass}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
