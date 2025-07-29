/**
 * Generate fusion image URL from two Pokemon IDs
 */
export const getFusionImageUrl = (headId: number, bodyId: number): string => {
  return `https://images.alexonsager.net/pokemon/fused/${bodyId}/${bodyId}.${headId}.png`;
};

/**
 * Check if two fusion guesses match the correct answer (in any order)
 */
export const isFusionGuessCorrect = (
  guessIds: [number, number], 
  correctIds: [number, number]
): boolean => {
  return (
    (guessIds[0] === correctIds[0] && guessIds[1] === correctIds[1]) ||
    (guessIds[0] === correctIds[1] && guessIds[1] === correctIds[0])
  );
};

/**
 * Check if a Pokemon ID is part of the fusion solution
 */
export const isPokemonInFusion = (pokemonId: number, fusionIds: [number, number]): boolean => {
  return fusionIds.includes(pokemonId);
};