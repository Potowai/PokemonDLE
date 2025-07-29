// Game constants
export const MAX_ATTEMPTS = 8;
export const MAX_SILHOUETTE_ATTEMPTS = 4;
export const MAX_FUSION_ATTEMPTS = 6;

// Pokemon ID ranges
export const POKEMON_ID_RANGES = {
  GEN1_MIN: 1,
  GEN1_MAX: 151,
  ALL_MIN: 1,
  ALL_MAX: 649 // Gen 1-5
} as const;

// Game modes
export const GAME_MODES = {
  CLASSIC: 'classic',
  SILHOUETTE: 'silhouette', 
  FUSION: 'fusion'
} as const;

// Animation constants
export const BACKGROUND_POKEMON_IDS = [25, 6, 9, 3, 94, 130, 133, 150] as const;