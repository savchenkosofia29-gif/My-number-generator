import React from 'react';
import { Volume2, VolumeX, Sparkles, Sliders, Dices } from 'lucide-react';
import { GeneratorConfig } from '../types';

interface RangePresetsProps {
  config: GeneratorConfig;
  onChangeConfig: (newConfig: Partial<GeneratorConfig>) => void;
  isRolling: boolean;
}

const PRESETS = [
  { label: '1 to 100', min: 1, max: 100, isDefault: true },
  { label: '1 to 10', min: 1, max: 10 },
  { label: '1 to 50', min: 1, max: 50 },
  { label: '1 to 1,000', min: 1, max: 1000 },
  { label: '1 to 6 (Dice)', min: 1, max: 6 },
  { label: '0 to 9 (Digit)', min: 0, max: 9 },
  { label: '1 to 2 (Coin)', min: 1, max: 2 },
];

export const RangePresets: React.FC<RangePresetsProps> = ({
  config,
  onChangeConfig,
  isRolling,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      onChangeConfig({ min: val });
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      onChangeConfig({ max: val });
    }
  };

  const handleStep = (field: 'min' | 'max', delta: number) => {
    if (isRolling) return;
    const current = config[field];
    onChangeConfig({ [field]: current + delta });
  };

  return (
    <div id="range-presets-container" className="w-full max-w-xl mx-auto space-y-4">
      {/* Preset Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {PRESETS.map((preset) => {
          const isSelected = config.min === preset.min && config.max === preset.max;
          return (
            <button
              key={preset.label}
              id={`preset-btn-${preset.min}-${preset.max}`}
              type="button"
              disabled={isRolling}
              onClick={() => onChangeConfig({ min: preset.min, max: preset.max })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/30 font-bold'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Min / Max manual inputs and quick toggles */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 items-center">
          {/* Min input */}
          <div className="flex flex-col">
            <label
              htmlFor="input-min-range"
              className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5"
            >
              Minimum
            </label>
            <div className="relative flex items-center">
              <button
                type="button"
                id="btn-decrement-min"
                disabled={isRolling}
                onClick={() => handleStep('min', -1)}
                className="absolute left-1.5 w-7 h-7 flex items-center justify-center text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg text-sm font-bold transition disabled:opacity-40"
              >
                -
              </button>
              <input
                id="input-min-range"
                type="number"
                disabled={isRolling}
                value={config.min}
                onChange={handleMinChange}
                className="w-full text-center py-2 px-9 border border-stone-200 rounded-xl font-mono-num font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50"
              />
              <button
                type="button"
                id="btn-increment-min"
                disabled={isRolling}
                onClick={() => handleStep('min', 1)}
                className="absolute right-1.5 w-7 h-7 flex items-center justify-center text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg text-sm font-bold transition disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          {/* Max input */}
          <div className="flex flex-col">
            <label
              htmlFor="input-max-range"
              className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5"
            >
              Maximum
            </label>
            <div className="relative flex items-center">
              <button
                type="button"
                id="btn-decrement-max"
                disabled={isRolling}
                onClick={() => handleStep('max', -1)}
                className="absolute left-1.5 w-7 h-7 flex items-center justify-center text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg text-sm font-bold transition disabled:opacity-40"
              >
                -
              </button>
              <input
                id="input-max-range"
                type="number"
                disabled={isRolling}
                value={config.max}
                onChange={handleMaxChange}
                className="w-full text-center py-2 px-9 border border-stone-200 rounded-xl font-mono-num font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50"
              />
              <button
                type="button"
                id="btn-increment-max"
                disabled={isRolling}
                onClick={() => handleStep('max', 1)}
                className="absolute right-1.5 w-7 h-7 flex items-center justify-center text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg text-sm font-bold transition disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Quick Range Warning if min >= max */}
        {config.min >= config.max && (
          <p className="text-amber-700 bg-amber-50 border border-amber-200/80 text-xs px-3 py-1.5 rounded-lg mt-3 text-center font-medium">
            Min should be less than Max (will be auto-swapped during roll).
          </p>
        )}

        {/* Advanced Options Bar Toggle */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
          <button
            id="toggle-advanced-btn"
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-stone-700 font-medium hover:text-stone-900 transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-600" />
            <span>{showAdvanced ? 'Hide advanced options' : 'More options (batch, sound)'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              id="toggle-sound-btn"
              type="button"
              title={config.soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              onClick={() => onChangeConfig({ soundEnabled: !config.soundEnabled })}
              className={`p-1.5 rounded-lg border transition ${
                config.soundEnabled
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-stone-50 text-stone-400 border-stone-200 hover:text-stone-600'
              }`}
            >
              {config.soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Advanced Options */}
        {showAdvanced && (
          <div className="mt-3 pt-3 border-t border-stone-100 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Dices className="w-4 h-4 text-stone-500" />
                <span className="text-xs font-semibold text-stone-700">Quantity per roll:</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 5, 10].map((num) => (
                  <button
                    key={num}
                    id={`qty-btn-${num}`}
                    type="button"
                    disabled={isRolling}
                    onClick={() => onChangeConfig({ count: num })}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                      config.count === num
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {config.count > 1 && (
              <div className="flex items-center justify-between bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <span className="text-xs text-stone-700 font-medium">Allow duplicate numbers:</span>
                <button
                  type="button"
                  id="toggle-duplicates-btn"
                  onClick={() => onChangeConfig({ allowDuplicates: !config.allowDuplicates })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                    config.allowDuplicates ? 'bg-amber-600' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-0.75 ${
                      config.allowDuplicates ? 'translate-x-4.5 ml-0.5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-stone-500" />
                <span className="text-xs font-semibold text-stone-700">Roll Animation:</span>
              </div>
              <div className="flex items-center gap-1">
                {(['instant', 'normal', 'suspense'] as const).map((speed) => (
                  <button
                    key={speed}
                    id={`speed-btn-${speed}`}
                    type="button"
                    disabled={isRolling}
                    onClick={() => onChangeConfig({ animationSpeed: speed })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition ${
                      config.animationSpeed === speed
                        ? 'bg-stone-800 text-white font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
