import type { PokemonDetails } from '../types/pokemon';

const cache = new Map<string, PokemonDetails>();

// Helper function to determine evolution stage
function getEvolutionStage(speciesData: any): number {
  // This is a simplified approach - in a real app you'd need the full evolution chain
  // For now, we'll use some heuristics based on common patterns
  const name = speciesData.name.toLowerCase();
  
  // Known first stage starters and common Pokemon
  const firstStage = [
    'bulbasaur', 'charmander', 'squirtle', 'caterpie', 'weedle', 'pidgey', 'rattata', 'spearow',
    'ekans', 'pichu', 'cleffa', 'igglybuff', 'togepi', 'natu', 'mareep', 'azurill', 'wynaut',
    'budew', 'chingling', 'bonsly', 'mime-jr', 'happiny', 'munchlax', 'riolu', 'mantyke',
    'snivy', 'tepig', 'oshawott', 'patrat', 'lillipup', 'purrloin', 'pansage', 'pansear', 'panpour'
  ];
  
  // Known third stage evolutions
  const thirdStage = [
    'venusaur', 'charizard', 'blastoise', 'butterfree', 'beedrill', 'pidgeot', 'raticate', 'fearow',
    'arbok', 'raichu', 'sandslash', 'nidoqueen', 'nidoking', 'clefable', 'ninetales', 'jigglypuff',
    'vileplume', 'parasect', 'venomoth', 'dugtrio', 'persian', 'golduck', 'primeape', 'arcanine',
    'poliwrath', 'alakazam', 'machamp', 'victreebel', 'tentacruel', 'golem', 'rapidash', 'slowbro',
    'magnezone', 'farfetchd', 'dodrio', 'dewgong', 'muk', 'cloyster', 'gengar', 'hypno', 'kingler',
    'electrode', 'exeggutor', 'marowak', 'hitmonlee', 'hitmonchan', 'lickitung', 'weezing', 'rhydon',
    'chansey', 'tangela', 'kangaskhan', 'seaking', 'starmie', 'mr-mime', 'scyther', 'jynx', 'electabuzz',
    'magmar', 'pinsir', 'tauros', 'gyarados', 'lapras', 'ditto', 'vaporeon', 'jolteon', 'flareon',
    'porygon', 'omastar', 'kabutops', 'aerodactyl', 'snorlax', 'articuno', 'zapdos', 'moltres',
    'dragonite', 'mewtwo', 'mew', 'serperior', 'emboar', 'samurott'
  ];
  
  if (firstStage.includes(name)) return 1;
  if (thirdStage.includes(name)) return 3;
  
  // Default to stage 2 for unknowns (middle evolution)
  return 2;
}

export async function fetchPokemonDetails(name: string): Promise<PokemonDetails> {
  if (cache.has(name)) {
    return cache.get(name)!;
  }

  try {
    // 8% chance for shiny sprite in game
    const isShiny = Math.random() < 0.08;
    const spriteType = isShiny ? 'shiny' : 'front_default';
    
    // Fetch basic pokemon data
    const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    const pokemon = await pokemonResponse.json();

    // Fetch species data for generation, color, and habitat
    const speciesResponse = await fetch(pokemon.species.url);
    const species = await speciesResponse.json();

    const details: PokemonDetails = {
      id: pokemon.id,
      name: pokemon.name,
      sprite: isShiny ? pokemon.sprites.front_shiny || pokemon.sprites.front_default : pokemon.sprites.front_default,
      generation: species.generation.url.split('/').slice(-2, -1)[0],
      types: pokemon.types.map((type: any) => type.type.name),
      color: species.color.name,
      habitat: species.habitat?.name || null,
      height: pokemon.height, // decimeters
      weight: pokemon.weight, // hectograms
      evolutionStage: getEvolutionStage(species),
    };

    cache.set(name, details);
    return details;
  } catch (error) {
    console.error(`Failed to fetch Pokemon details for ${name}:`, error);
    throw error;
  }
}