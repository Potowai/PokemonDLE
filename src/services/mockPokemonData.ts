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
  'charmander': {
    id: 4,
    name: 'charmander',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    generation: 1,
    types: ['fire'],
    color: 'red',
    habitat: 'mountain',
    height: 6,
    weight: 85,
    evolutionStage: 1,
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

// Cache for fetched Pokemon to avoid repeated API calls
const pokemonCache: Record<string, PokemonDetails> = {};

function parseGeneration(genString: string): number {
  const map: Record<string, number> = {
    'generation-i': 1,
    'generation-ii': 2,
    'generation-iii': 3,
    'generation-iv': 4,
    'generation-v': 5,
    'generation-vi': 6,
    'generation-vii': 7,
    'generation-viii': 8,
    'generation-ix': 9,
  };
  return map[genString] || 1;
}

async function getEvolutionStage(speciesUrl: string, pokemonName: string): Promise<number> {
  try {
    const speciesRes = await fetch(speciesUrl);
    const speciesData = await speciesRes.json();

    const evolutionChainUrl = speciesData.evolution_chain.url;
    const chainRes = await fetch(evolutionChainUrl);
    const chainData = await chainRes.json();

    let chain = chainData.chain;
    let stage = 1;

    // BFS to find the pokemon and its depth
    if (chain.species.name === pokemonName) return 1;

    if (chain.evolves_to.length > 0) {
      for (const firstEvo of chain.evolves_to) {
        if (firstEvo.species.name === pokemonName) return 2;
        if (firstEvo.evolves_to.length > 0) {
          for (const secondEvo of firstEvo.evolves_to) {
            if (secondEvo.species.name === pokemonName) return 3;
          }
        }
      }
    }

    return 1; // Default to 1 if not found (shouldn't happen)
  } catch (e) {
    console.error('Error fetching evolution stage:', e);
    return 1;
  }
}

export async function getMockPokemonDetails(name: string): Promise<PokemonDetails> {
  const lowerName = name.toLowerCase();

  // 1. Check local hardcoded mock data
  if (mockPokemonData[lowerName]) {
    return mockPokemonData[lowerName];
  }

  // 2. Check runtime cache
  if (pokemonCache[lowerName]) {
    return pokemonCache[lowerName];
  }

  // 3. Fetch from PokeAPI
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${lowerName}`);
    if (!response.ok) {
      throw new Error(`Pokemon ${name} not found`);
    }
    const data = await response.json();

    // Fetch species data for color, habitat, generation
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();

    // Calculate evolution stage
    // Note: This might be slow. For a better UX, we might want to optimize or cache this.
    // For now, we'll do a simplified check or fetch the chain.
    // Let's try to infer from 'evolves_from_species' first for speed, 
    // but for accuracy we need the chain.
    // Optimization: If evolves_from_species is null, it's stage 1.
    // If it has a parent, we need to check if that parent has a parent.

    let evolutionStage = 1;
    if (speciesData.evolves_from_species) {
      evolutionStage = 2;
      // Check if the parent also has a parent
      const parentResponse = await fetch(speciesData.evolves_from_species.url);
      const parentData = await parentResponse.json();
      if (parentData.evolves_from_species) {
        evolutionStage = 3;
      }
    }

    const details: PokemonDetails = {
      id: data.id,
      name: data.name,
      sprite: data.sprites.front_default || data.sprites.other['official-artwork'].front_default,
      generation: parseGeneration(speciesData.generation.name),
      types: data.types.map((t: any) => t.type.name),
      color: speciesData.color.name,
      habitat: speciesData.habitat ? speciesData.habitat.name : 'unknown',
      height: data.height,
      weight: data.weight,
      evolutionStage: evolutionStage,
    };

    // Save to cache
    pokemonCache[lowerName] = details;
    return details;

  } catch (error) {
    console.error(`Failed to fetch Pokemon ${name}:`, error);
    throw error;
  }
}