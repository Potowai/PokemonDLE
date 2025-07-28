// First 649 Pokemon from Gen 1-5 (using only mock data available for demo)
export const pokemonIndex = [
  { id: 3, name: "venusaur", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png" },
  { id: 6, name: "charizard", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png" },
  { id: 9, name: "blastoise", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png" },
  { id: 25, name: "pikachu", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
  { id: 94, name: "gengar", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png" },
  { id: 130, name: "gyarados", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png" },
  { id: 133, name: "eevee", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png" },
  { id: 150, name: "mewtwo", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png" },
  { id: 151, name: "mew", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png" },
  { id: 249, name: "lugia", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png" }
];

export type PokemonIndexEntry = {
  id: number;
  name: string;
  sprite: string;
};