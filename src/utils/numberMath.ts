import { NumberProperties } from '../types';

/**
 * Generate a truly uniform cryptographically-strong random integer within [min, max] inclusive.
 */
export function generateRandomInt(min: number, max: number): number {
  if (min > max) {
    [min, max] = [max, min];
  }
  const range = max - min + 1;
  if (range <= 0) return min;

  // Use crypto API if available
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    const maxUint32 = 0xffffffff;
    // Rejection sampling to prevent modulo bias
    const limit = maxUint32 - (maxUint32 % range);
    let rand: number;
    do {
      window.crypto.getRandomValues(array);
      rand = array[0];
    } while (rand >= limit);
    return min + (rand % range);
  }

  // Fallback to Math.random
  return Math.floor(Math.random() * range) + min;
}

/**
 * Generate multiple random integers with options
 */
export function generateMultipleInts(
  min: number,
  max: number,
  count: number,
  allowDuplicates: boolean
): number[] {
  if (min > max) [min, max] = [max, min];
  const range = max - min + 1;

  if (!allowDuplicates && count > range) {
    count = range; // cannot generate more unique numbers than range
  }

  if (allowDuplicates) {
    const results: number[] = [];
    for (let i = 0; i < count; i++) {
      results.push(generateRandomInt(min, max));
    }
    return results;
  }

  // Unique selection
  const pool = new Set<number>();
  while (pool.size < count) {
    pool.add(generateRandomInt(min, max));
  }
  return Array.from(pool);
}

/**
 * Check if a number is prime
 */
export function isPrimeNumber(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

/**
 * Analyze fun properties of a single integer
 */
export function getNumberProperties(n: number): NumberProperties {
  const isEven = n % 2 === 0;
  const isPrime = isPrimeNumber(n);
  
  let isSquare = false;
  let squareRoot: number | undefined;
  if (n >= 0) {
    const root = Math.round(Math.sqrt(n));
    if (root * root === n) {
      isSquare = true;
      squareRoot = root;
    }
  }

  const factors: number[] = [];
  if (n > 0 && n <= 10000) {
    for (let i = 1; i <= Math.min(n, 100); i++) {
      if (n % i === 0) factors.push(i);
    }
  }

  const tags: string[] = [];
  tags.push(isEven ? 'Even number' : 'Odd number');
  
  if (isPrime) tags.push('Prime number');
  if (isSquare && squareRoot !== undefined) tags.push(`Perfect square (${squareRoot}²)`);
  if (n % 10 === 0) tags.push('Multiple of 10');
  else if (n % 5 === 0) tags.push('Multiple of 5');
  if (n === 100) tags.push('Century maximum');
  if (n === 7) tags.push('Lucky 7');
  if (n === 42) tags.push('Answer to everything');
  if (n === 1) tags.push('Minimum bound');

  return {
    isEven,
    isPrime,
    isSquare,
    squareRoot,
    factors,
    tags,
  };
}

/**
 * Lightweight Web Audio Synthesizer for tactile feedback
 */
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playTickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440 + Math.random() * 120, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Ignore audio failures
  }
}

export function playChimeSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Play warm major harmonic chord (C5 - E5 - G5)
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.03);
      
      const startTime = now + i * 0.03;
      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  } catch {
    // Ignore audio failures
  }
}
