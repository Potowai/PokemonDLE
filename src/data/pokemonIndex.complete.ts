// Complete Pokemon index for generations 1-5 (#1-649)
import { pokemonNamesEnComplete } from './pokemonNames.en.complete';

export type PokemonIndexEntry = {
  id: number;
  name: string;
  sprite: string;
};

// Generate complete Pokemon index for generations 1-5 (649 Pokemon)
export const pokemonIndexComplete: PokemonIndexEntry[] = Array.from({ length: 649 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    name: pokemonNamesEnComplete[id].toLowerCase(), // Use lowercase for consistency with original format
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  };
});