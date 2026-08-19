import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Dice5, ShieldCheck, Keyboard } from 'lucide-react';
import { GeneratorConfig, RollResult } from './types';
import {
  generateRandomInt,
  generateMultipleInts,
  playTickSound,
  playChimeSound,
} from './utils/numberMath';
import { RollDisplay } from './components/RollDisplay';
import { RangePresets } from './components/RangePresets';
import { RollHistory } from './components/RollHistory';

const STORAGE_KEY = 'rng_app_history_v1';
const CONFIG_KEY = 'rng_app_config_v1';

const DEFAULT_CONFIG: GeneratorConfig = {
  min: 1,
  max: 100,
  count: 1,
  allowDuplicates: false,
  soundEnabled: true,
  animationSpeed: 'normal',
};

export default function App() {
  const [config, setConfig] = useState<GeneratorConfig>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_KEY);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_CONFIG;
  });

  const [currentNumbers, setCurrentNumbers] = useState<number[]>([42]);
  const [hasRolledOnce, setHasRolledOnce] = useState<boolean>(false);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const [history, setHistory] = useState<RollResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const rollTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  // Persist config
  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const handleConfigChange = (newConfig: Partial<GeneratorConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const executeRoll = useCallback(() => {
    if (isRolling) return;

    // Clear any previous running timeouts
    rollTimeoutRef.current.forEach(clearTimeout);
    rollTimeoutRef.current = [];

    let actualMin = config.min;
    let actualMax = config.max;
    if (actualMin > actualMax) {
      const temp = actualMin;
      actualMin = actualMax;
      actualMax = temp;
    }

    const count = Math.max(1, Math.min(config.count, 50));
    const finalNumbers = generateMultipleInts(
      actualMin,
      actualMax,
      count,
      config.allowDuplicates
    );

    if (config.animationSpeed === 'instant') {
      if (config.soundEnabled) playChimeSound();
      setCurrentNumbers(finalNumbers);
      setHasRolledOnce(true);
      const newEntry: RollResult = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        numbers: finalNumbers,
        min: actualMin,
        max: actualMax,
        timestamp: Date.now(),
        isMultiple: count > 1,
      };
      setHistory((prev) => [newEntry, ...prev.slice(0, 49)]);
      return;
    }

    // Animated rolling effect
    setIsRolling(true);
    const steps = config.animationSpeed === 'suspense' ? 16 : 9;
    const baseInterval = config.animationSpeed === 'suspense' ? 70 : 50;

    for (let i = 0; i < steps; i++) {
      // Non-linear easing for natural slowing down ticker
      const delay = Math.round(baseInterval * Math.pow(1.15, i) * (i + 1) * 0.4);
      const isFinalStep = i === steps - 1;

      const timer = setTimeout(() => {
        if (isFinalStep) {
          setCurrentNumbers(finalNumbers);
          setIsRolling(false);
          setHasRolledOnce(true);
          if (config.soundEnabled) playChimeSound();

          const newEntry: RollResult = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            numbers: finalNumbers,
            min: actualMin,
            max: actualMax,
            timestamp: Date.now(),
            isMultiple: count > 1,
          };
          setHistory((prev) => [newEntry, ...prev.slice(0, 49)]);
        } else {
          // intermediate random numbers during rolling
          const tempNums = generateMultipleInts(
            actualMin,
            actualMax,
            count,
            config.allowDuplicates
          );
          setCurrentNumbers(tempNums);
          if (config.soundEnabled) playTickSound();
        }
      }, delay);

      rollTimeoutRef.current.push(timer);
    }
  }, [config, isRolling]);

  // Keyboard shortcut listener (Space or Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        executeRoll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeRoll]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      rollTimeoutRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-stone-200/80 py-4 px-4 sm:px-8 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-xs">
              <Dice5 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-display font-extrabold text-stone-900 leading-tight">
                Random Number Generator
              </h1>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">
                Generate true random numbers between 1 and 100
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Crypto RNG</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-10 flex flex-col items-center justify-center">
        {/* Core Generator Module */}
        <div className="w-full space-y-5">
          {/* Main Hero Roll Display */}
          <RollDisplay
            currentNumbers={currentNumbers}
            isRolling={isRolling}
            min={config.min}
            max={config.max}
            onRoll={executeRoll}
            hasRolledOnce={hasRolledOnce}
          />

          {/* Range Selection & Configurations */}
          <RangePresets
            config={config}
            onChangeConfig={handleConfigChange}
            isRolling={isRolling}
          />

          {/* Roll History */}
          <RollHistory history={history} onClearHistory={handleClearHistory} />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-stone-200/80 py-4 px-4 sm:px-8 text-center text-xs text-stone-600">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Keyboard className="w-3.5 h-3.5 text-stone-600" />
            <span>Shortcuts: Press <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded font-mono text-[10px] text-stone-700 font-semibold">Space</kbd> to roll quickly</span>
          </div>
          <div>
            <span>Default Range: 1 to 100 • Uniform Distribution</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
