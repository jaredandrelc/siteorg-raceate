import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { CyberBackground } from './components/CyberBackground';
import { CyberFrame } from './components/CyberFrame';
import { EntityEmblem } from './components/EntityEmblem';
import {
  HintCategory,
  SUCCESS_MESSAGE,
  TARGET_EVENT_TITLE,
  ValidationResult,
  validateEventTitle,
} from './utils/answerValidator';
import { playErrorSound, playSuccessSound } from './utils/cyberAudio';

type AppStatus = 'challenge' | 'error' | 'success';

const HINT_TAG_LABELS: Record<HintCategory, string> = {
  empty: 'INPUT',
  capitalization: 'CASING',
  spacing: 'SPACING',
  symbols: 'SYMBOLS',
  spelling: 'SPELLING',
  incomplete: 'LENGTH',
};

export default function App() {
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<AppStatus>('challenge');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const [muted, setMuted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.dataset.state = status;
  }, [status]);

  useEffect(() => {
    if (status !== 'success') {
      inputRef.current?.focus();
    }
  }, [status]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = validateEventTitle(answer);
    const nextAttempt = attempts + 1;
    setAttempts(nextAttempt);
    setValidation(result);

    if (result.isSuccess) {
      setStatus('success');
      playSuccessSound(muted);
    } else {
      setStatus('error');
      setShakeKey((prev) => prev + 1);
      playErrorSound(muted);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
    if (status === 'error') {
      setStatus('challenge');
    }
  };

  const handleClear = () => {
    setAnswer('');
    setStatus('challenge');
    setValidation(null);
    inputRef.current?.focus();
  };

  const handleReset = () => {
    setAnswer('');
    setStatus('challenge');
    setValidation(null);
    setAttempts(0);
    setShakeKey(0);
  };

  const formattedAttempts = String(attempts).padStart(2, '0');
  const charCount = String(answer.length).padStart(2, '0');

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-10 overflow-x-hidden">
      <CyberBackground status={status} />

      <main className="relative z-10 w-full max-w-2xl">
        <CyberFrame status={status} shakeKey={shakeKey}>
          {/* Top diegetic terminal bar */}
          <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-white/10">
            <div className="flex items-center gap-3 min-w-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="shrink-0"
              >
                <polygon
                  points="10,1 18,5.5 18,14.5 10,19 2,14.5 2,5.5"
                  stroke={
                    status === 'error'
                      ? '#FF2A4B'
                      : status === 'success'
                        ? '#00FF9D'
                        : '#FCEE09'
                  }
                  strokeWidth="1.6"
                />
                <circle
                  cx="10"
                  cy="10"
                  r="3"
                  fill={
                    status === 'error'
                      ? '#FF2A4B'
                      : status === 'success'
                        ? '#00FF9D'
                        : '#00F0FF'
                  }
                />
              </svg>
              <span className="font-cyber-mono text-[11px] sm:text-sm tracking-[0.08em] sm:tracking-[0.16em] uppercase text-slate-300 whitespace-nowrap">
                Checkpoint Terminal
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <span
                className="font-cyber-mono text-[11px] sm:text-xs tracking-wider uppercase text-slate-400 whitespace-nowrap"
                aria-label={`Attempts made: ${attempts}`}
              >
                Try {formattedAttempts}
              </span>

              <button
                type="button"
                onClick={() => setMuted((prev) => !prev)}
                aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center border border-white/15 bg-[#111827]/80 text-slate-300 hover:text-[#FCEE09] hover:border-[#FCEE09]/60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00F0FF] cursor-pointer cyber-chamfer-sm"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {status === 'success' ? (
            <section
              aria-live="polite"
              className="flex flex-col items-center text-center py-4 sm:py-6"
              data-testid="success-panel"
            >
              <EntityEmblem status="success" />

              <div className="mt-5 inline-flex items-center gap-2 text-[#00FF9D] font-cyber-mono text-xs sm:text-sm tracking-[0.2em] uppercase">
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Clearance Granted</span>
              </div>

              <h1
                className="mt-3 text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight max-w-xl"
                style={{ textWrap: 'balance' }}
              >
                {SUCCESS_MESSAGE}
              </h1>

              <div className="mt-6 w-full bg-[#071614]/90 border border-[#00FF9D]/45 px-4 py-4 sm:px-6 cyber-chamfer-sm">
                <p className="font-cyber-mono text-xs uppercase tracking-[0.18em] text-[#00FF9D]/80 mb-1.5">
                  Verified Event Title
                </p>
                <p className="font-cyber-mono text-sm sm:text-base text-white break-words">
                  {TARGET_EVENT_TITLE}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 font-cyber-mono text-xs uppercase tracking-widest text-slate-400">
                <span>Attempts: {formattedAttempts}</span>
                <span aria-hidden="true">/</span>
                <span>Match: Exact</span>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="mt-8 min-h-[48px] px-7 py-3 inline-flex items-center justify-center gap-2.5 bg-[#00FF9D] text-[#06070B] font-bold text-sm sm:text-base uppercase tracking-wider hover:bg-[#3bffb3] active:scale-[0.99] transition-all cursor-pointer cyber-btn-chamfer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FF9D] whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Reset Challenge</span>
              </button>
            </section>
          ) : (
            <section className="flex flex-col">
              <EntityEmblem status={status} />

              <div className="mt-5 text-center">
                <p
                  className={`font-cyber-mono text-xs tracking-[0.2em] uppercase mb-2 transition-colors ${
                    status === 'error' ? 'text-[#FF5C77]' : 'text-[#00F0FF]'
                  }`}
                >
                  Identity Verification Prompt
                </p>
                <h1
                  className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight"
                  style={{ textWrap: 'balance' }}
                >
                  What is the title of the event?
                </h1>
                <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
                  Exact match required — capitalization, symbols, and single spaces must match character for character.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="event-title-input"
                      className="font-cyber-mono text-xs uppercase tracking-[0.16em] text-slate-300"
                    >
                      Event Title Input
                    </label>
                    <span className="font-cyber-mono text-xs text-slate-400">
                      {charCount} CHARS
                    </span>
                  </div>

                  <div
                    className={`relative flex items-center transition-colors duration-150 cyber-chamfer-sm border ${
                      status === 'error'
                        ? 'bg-[#1D0A10] border-[#FF2A4B] ring-1 ring-[#FF2A4B]/60'
                        : 'bg-[#070A12] border-[#00F0FF]/45 focus-within:border-[#FCEE09] focus-within:ring-1 focus-within:ring-[#FCEE09]/50'
                    }`}
                  >
                    <input
                      ref={inputRef}
                      id="event-title-input"
                      name="eventTitle"
                      type="text"
                      value={answer}
                      onChange={handleInputChange}
                      placeholder="Enter exact event title..."
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      aria-invalid={status === 'error'}
                      aria-describedby={
                        status === 'error' ? 'validation-feedback' : undefined
                      }
                      className={`w-full min-h-[52px] bg-transparent pl-3.5 sm:pl-4 py-3.5 font-cyber-mono text-base sm:text-lg text-white placeholder:text-sm sm:placeholder:text-base placeholder:text-slate-500 focus:outline-none ${
                        answer.length > 0 ? 'pr-12' : 'pr-3.5 sm:pr-4'
                      }`}
                    />

                    {answer.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClear}
                        aria-label="Clear answer"
                        className="absolute right-1 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FCEE09]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Red error feedback & vague hints */}
                {status === 'error' && validation && (
                  <div
                    id="validation-feedback"
                    role="alert"
                    aria-live="assertive"
                    data-testid="error-panel"
                    className="bg-[#1A080D]/95 border border-[#FF2A4B]/75 px-4 py-4 sm:px-5 cyber-chamfer-sm"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className="w-5 h-5 text-[#FF2A4B] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm sm:text-base uppercase tracking-wider text-[#FF5C77]">
                          {validation.summary}
                        </p>

                        <ul className="mt-2.5 space-y-2">
                          {validation.hints.map((hint, idx) => (
                            <li
                              key={`${hint.category}-${idx}`}
                              className="flex items-start gap-2.5 text-sm text-rose-100 leading-snug"
                            >
                              <span className="font-cyber-mono text-[11px] font-bold uppercase tracking-wider text-[#FF2A4B] border border-[#FF2A4B]/50 bg-[#FF2A4B]/10 px-1.5 py-0.5 shrink-0 mt-0.5">
                                {HINT_TAG_LABELS[hint.category]}
                              </span>
                              <span>{hint.message}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full min-h-[52px] px-6 py-3.5 inline-flex items-center justify-center gap-2.5 font-bold text-base uppercase tracking-[0.14em] transition-all cursor-pointer cyber-btn-chamfer focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap ${
                    status === 'error'
                      ? 'bg-[#FF2A4B] text-white hover:bg-[#ff4260] active:scale-[0.99] focus-visible:outline-[#FF2A4B]'
                      : 'bg-[#FCEE09] text-[#06070B] hover:bg-[#fff44f] active:scale-[0.99] focus-visible:outline-[#FCEE09]'
                  }`}
                >
                  <span>Verify Title</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              </form>
            </section>
          )}
        </CyberFrame>
      </main>
    </div>
  );
}
