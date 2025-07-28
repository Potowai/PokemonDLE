export interface PokemonDetails {
  id: number;
  name: string;
  sprite: string;
  generation: number;
  types: string[];
  color: string;
  habitat: string | null;
  height: number; // in decimeters
  weight: number; // in hectograms
  evolutionStage: number; // 1, 2, or 3
}

export interface GuessResult {
  pokemon: PokemonDetails;
  comparison: {
    generation: 'correct' | 'incorrect';
    type1: 'correct' | 'incorrect';
    type2: 'correct' | 'incorrect' | 'missing';
    color: 'correct' | 'incorrect';
    habitat: 'correct' | 'incorrect';
    height: 'correct' | 'higher' | 'lower';
    weight: 'correct' | 'heavier' | 'lighter';
    evolutionStage: 'correct' | 'incorrect';
  };
}

export type GameStatus = 'playing' | 'won' | 'lost';

export type GameMode = 'classic' | 'silhouette' | 'fusion';

export interface SilhouetteHint {
  type: 'type' | 'generation' | 'color' | 'habitat';
  value: string;
  label: string;
}