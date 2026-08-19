import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Sparkles, Hash, ArrowRight } from 'lucide-react';
import { getNumberProperties } from '../utils/numberMath';

interface RollDisplayProps {
  currentNumbers: number[];
  isRolling: boolean;
  min: number;
  max: number;
  onRoll: () => void;
  hasRolledOnce: boolean;
}

export const RollDisplay: React.FC<RollDisplayProps> = ({
  currentNumbers,
  isRolling,
  min,
  max,
  onRoll,
  hasRolledOnce,
}) => {
  const [copied, setCopied] = useState(false);

  const isMultiple = currentNumbers.length > 1;
  const singleNumber = currentNumbers.length > 0 ? currentNumbers[0] : null;
  const properties = singleNumber !== null && !isMultiple ? getNumberProperties(singleNumber) : null;

  const handleCopy = () => {
    if (currentNumbers.length === 0) return;
    const textToCopy = isMultiple ? currentNumbers.join(', ') : String(currentNumbers[0]);
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div id="main-roll-display" className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Central Interactive Display Card */}
      <div className="relative w-full bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col items-center justify-center min-h-[300px] sm:min-h-[360px] text-center overflow-hidden">
        
        {/* Subtle background decoration watermark */}
        <div className="absolute top-4 left-6 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-stone-600 select-none">
          <Hash className="w-3.5 h-3.5 text-amber-500" />
          <span>RANGE: {min} – {max}</span>
        </div>

        {/* Copy Button in top right */}
        {hasRolledOnce && (
          <button
            id="copy-roll-btn"
            type="button"
            onClick={handleCopy}
            title="Copy to clipboard"
            className="absolute top-4 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 hover:text-stone-900 transition active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}

        {/* Main Number Display Area */}
        <div className="my-auto py-4 flex flex-col items-center justify-center w-full">
          {!hasRolledOnce ? (
            <div className="flex flex-col items-center justify-center py-6 text-stone-400">
              <div className="w-20 h-20 rounded-2xl bg-amber-50/80 border border-amber-100/80 flex items-center justify-center text-amber-600 mb-4 shadow-xs">
                <Sparkles className="w-10 h-10" />
              </div>
              <p className="text-sm font-medium text-stone-500">Ready to pick a random number</p>
              <p className="text-xs text-stone-400 mt-1">Press Generate or hit Spacebar</p>
            </div>
          ) : isMultiple ? (
            /* Multi-number results grid */
            <div className="w-full flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-2">
              {currentNumbers.map((num, idx) => (
                <motion.div
                  key={`${idx}-${num}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                  className="px-4 sm:px-6 py-3 sm:py-4 bg-stone-50 hover:bg-amber-50/60 border border-stone-200 hover:border-amber-300 rounded-2xl flex flex-col items-center justify-center shadow-xs transition-colors min-w-[72px]"
                >
                  <span className="text-xs text-stone-600 font-medium font-mono-num mb-0.5">
                    #{idx + 1}
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono-num text-stone-900 tracking-tight">
                    {num}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Single Large Number Result */
            <div className="flex flex-col items-center justify-center">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={singleNumber ?? 'initial'}
                  initial={{ scale: 0.85, opacity: 0.6, y: -10 }}
                  animate={{ scale: isRolling ? [1, 1.04, 1] : 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 10 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="relative select-all font-display font-black text-7xl sm:text-9xl text-stone-900 tracking-tighter tabular-nums leading-none py-2"
                >
                  {singleNumber}
                </motion.div>
              </AnimatePresence>

              {/* Number facts/tags */}
              {properties && !isRolling && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-wrap items-center justify-center gap-1.5 mt-3 max-w-sm"
                >
                  {properties.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Primary Call-to-Action Roll Button */}
        <div className="w-full pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="generate-number-btn"
            type="button"
            disabled={isRolling}
            onClick={onRoll}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-display font-bold text-base text-white tracking-wide shadow-md transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer select-none active:scale-98 ${
              isRolling
                ? 'bg-amber-700 opacity-90 cursor-wait'
                : 'bg-stone-900 hover:bg-stone-800 hover:shadow-lg focus:ring-4 focus:ring-stone-300'
            }`}
          >
            <Sparkles className={`w-5 h-5 ${isRolling ? 'animate-spin text-amber-300' : 'text-amber-400'}`} />
            <span>{isRolling ? 'Picking Number...' : hasRolledOnce ? 'Roll Again' : 'Generate Number'}</span>
            {!isRolling && <ArrowRight className="w-4 h-4 text-stone-400 ml-0.5" />}
          </button>
        </div>

        {/* Keyboard hint */}
        <p className="text-[11px] text-stone-600 mt-3 select-none">
          Tip: Press <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-stone-800 font-mono text-[10px]">Space</kbd> or <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-stone-800 font-mono text-[10px]">Enter</kbd> to roll instantly
        </p>
      </div>
    </div>
  );
};
