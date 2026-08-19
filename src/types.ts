export interface RollResult {
  id: string;
  numbers: number[];
  min: number;
  max: number;
  timestamp: number;
  isMultiple: boolean;
}

export interface NumberProperties {
  isEven: boolean;
  isPrime: boolean;
  isSquare: boolean;
  squareRoot?: number;
  factors: number[];
  tags: string[];
}

export interface GeneratorConfig {
  min: number;
  max: number;
  count: number;
  allowDuplicates: boolean;
  soundEnabled: boolean;
  animationSpeed: 'instant' | 'normal' | 'suspense';
}
