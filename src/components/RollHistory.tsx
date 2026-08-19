import React, { useState } from 'react';
import { History, Trash2, Copy, Check, BarChart2 } from 'lucide-react';
import { RollResult } from '../types';

interface RollHistoryProps {
  history: RollResult[];
  onClearHistory: () => void;
}

export const RollHistory: React.FC<RollHistoryProps> = ({
  history,
  onClearHistory,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (history.length === 0) {
    return null;
  }

  // Calculate quick stats across history
  const allGeneratedNumbers = history.flatMap((h) => h.numbers);
  const totalRolls = history.length;
  const average =
    allGeneratedNumbers.length > 0
      ? (allGeneratedNumbers.reduce((a, b) => a + b, 0) / allGeneratedNumbers.length).toFixed(1)
      : '0';
  const minRolled = allGeneratedNumbers.length > 0 ? Math.min(...allGeneratedNumbers) : 0;
  const maxRolled = allGeneratedNumbers.length > 0 ? Math.max(...allGeneratedNumbers) : 0;

  const handleCopyAll = () => {
    const text = history
      .map((h) => `${h.numbers.join(', ')} (Range: ${h.min}-${h.max})`)
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  };

  const handleCopySingle = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div id="roll-history-container" className="w-full max-w-xl mx-auto mt-6 bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
        <div className="flex items-center gap-2 text-stone-800">
          <History className="w-4 h-4 text-amber-600" />
          <h2 className="text-sm font-bold tracking-tight">Recent Roll History</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono-num font-semibold">
            {history.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="copy-all-history-btn"
            type="button"
            onClick={handleCopyAll}
            title="Copy all rolls"
            className="flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200 transition cursor-pointer"
          >
            {copiedAll ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copiedAll ? 'Copied' : 'Export'}</span>
          </button>
          
          <button
            id="clear-history-btn"
            type="button"
            onClick={onClearHistory}
            title="Clear roll history"
            className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg border border-red-200/60 transition cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-4 gap-2 my-3 p-2.5 bg-stone-50 rounded-xl border border-stone-100 text-center">
        <div>
          <div className="text-[10px] uppercase font-semibold text-stone-600">Total Rolls</div>
          <div className="text-sm font-bold font-mono-num text-stone-800">{totalRolls}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-semibold text-stone-600">Average</div>
          <div className="text-sm font-bold font-mono-num text-stone-800">{average}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-semibold text-stone-600">Min Rolled</div>
          <div className="text-sm font-bold font-mono-num text-stone-800">{minRolled}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-semibold text-stone-600">Max Rolled</div>
          <div className="text-sm font-bold font-mono-num text-stone-800">{maxRolled}</div>
        </div>
      </div>

      {/* Rolls List */}
      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 divide-y divide-stone-50">
        {history.map((item, index) => {
          const numbersText = item.numbers.join(', ');
          const isLatest = index === 0;
          return (
            <div
              key={item.id}
              className={`flex items-center justify-between py-2 px-2.5 rounded-lg transition ${
                isLatest ? 'bg-amber-50/70 border border-amber-200/50' : 'hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono-num font-bold text-stone-600 w-5">
                  #{history.length - index}
                </span>
                <span className="text-base font-extrabold font-mono-num text-stone-900">
                  {numbersText}
                </span>
                <span className="text-[11px] text-stone-600 hidden sm:inline">
                  (range {item.min}–{item.max})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-stone-600 font-mono-num">
                  {formatTime(item.timestamp)}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopySingle(item.id, numbersText)}
                  title="Copy number"
                  className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded transition"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
