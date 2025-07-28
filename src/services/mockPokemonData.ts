import type { PokemonDetails } from '../types/pokemon';

// Mock data for demonstration purposes
export const mockPokemonData: Record<string, PokemonDetails> = {
  'pikachu': {
    id: 25,
    name: 'pikachu',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    generation: 1,
    types: ['electric'],
    color: 'yellow',
    habitat: 'forest',
    height: 4,
    weight: 60,
    evolutionStage: 2,
  },
  'charizard': {
    id: 6,
    name: 'charizard',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
    generation: 1,
    types: ['fire', 'flying'],
    color: 'red',
    habitat: 'mountain',
    height: 17,
    weight: 905,
    evolutionStage: 3,
  },
  'blastoise': {
    id: 9,
    name: 'blastoise',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png',
    generation: 1,
    types: ['water'],
    color: 'blue',
    habitat: 'waters-edge',
    height: 16,
    weight: 855,
    evolutionStage: 3,
  },
  'venusaur': {
    id: 3,
    name: 'venusaur',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
    generation: 1,
    types: ['grass', 'poison'],
    color: 'green',
    habitat: 'grassland',
    height: 20,
    weight: 1000,
    evolutionStage: 3,
  },
  'gengar': {
    id: 94,
    name: 'gengar',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',
    generation: 1,
    types: ['ghost', 'poison'],
    color: 'purple',
    habitat: 'urban',
    height: 15,
    weight: 405,
    evolutionStage: 3,
  },
  'gyarados': {
    id: 130,
    name: 'gyarados',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png',
    generation: 1,
    types: ['water', 'flying'],
    color: 'blue',
    habitat: 'waters-edge',
    height: 65,
    weight: 2350,
    evolutionStage: 2,
  },
  'eevee': {
    id: 133,
    name: 'eevee',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png',
    generation: 1,
    types: ['normal'],
    color: 'brown',
    habitat: 'urban',
    height: 3,
    weight: 65,
    evolutionStage: 1,
  },
  'mewtwo': {
    id: 150,
    name: 'mewtwo',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
    generation: 1,
    types: ['psychic'],
    color: 'purple',
    habitat: 'rare',
    height: 20,
    weight: 1220,
    evolutionStage: 1,
  },
  'mew': {
    id: 151,
    name: 'mew',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png',
    generation: 1,
    types: ['psychic'],
    color: 'pink',
    habitat: 'rare',
    height: 4,
    weight: 40,
    evolutionStage: 1,
  },
  'lugia': {
    id: 249,
    name: 'lugia',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png',
    generation: 2,
    types: ['psychic', 'flying'],
    color: 'white',
    habitat: 'rare',
    height: 52,
    weight: 2160,
    evolutionStage: 1,
  }
};

export function getMockPokemonDetails(name: string): Promise<PokemonDetails> {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const pokemon = mockPokemonData[name.toLowerCase()];
      if (pokemon) {
        resolve(pokemon);
      } else {
        reject(new Error(`Pokemon ${name} not found in mock data`));
      }
    }, 100);
  });
}