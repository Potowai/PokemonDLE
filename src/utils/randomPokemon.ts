import { POKEMON_ID_RANGES } from '../constants/gameConstants';

/**
 * Generate a random Pokemon ID within the specified range
 */
export const getRandomPokemonId = (
  min: number = POKEMON_ID_RANGES.ALL_MIN, 
  max: number = POKEMON_ID_RANGES.ALL_MAX
): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate a random Gen 1 Pokemon ID
 */
export const getRandomGen1Id = (): number => {
  return getRandomPokemonId(POKEMON_ID_RANGES.GEN1_MIN, POKEMON_ID_RANGES.GEN1_MAX);
};

/**
 * Generate two different random Pokemon IDs for fusion
 */
export const getRandomFusionIds = (): [number, number] => {
  const id1 = getRandomGen1Id();
  let id2 = getRandomGen1Id();
  
  // Ensure they are different
  while (id2 === id1) {
    id2 = getRandomGen1Id();
  }
  
  return [id1, id2];
};

/**
 * Get random background sprite URL with optional shiny variant
 */
export const getRandomBackgroundSprite = (id: number, shinyChance: number = 0.05): string => {
  const isShiny = Math.random() < shinyChance;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${isShiny ? 'shiny/' : ''}${id}.png`;
};