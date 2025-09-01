// Complete Pokemon list for generations 1-5 (649 Pokemon)
import { pokemonIndexComplete } from './pokemonIndex.complete';

export const pokemonIndex = pokemonIndexComplete;

export type PokemonIndexEntry = {
  id: number;
  name: string;
  sprite: string;
};