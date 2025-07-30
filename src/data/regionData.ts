import type { Region } from '../types/pokemon';

// Pokémon regions data with images
export const regionsData: Region[] = [
  {
    id: 1,
    name: 'Kanto',
    image: 'https://archives.bulbagarden.net/media/upload/6/69/Kanto_LGPE.png',
    generation: 1,
    description: 'The region where the Pokémon journey began, home to Pallet Town and many iconic Pokémon.'
  },
  {
    id: 2,
    name: 'Johto',
    image: 'https://archives.bulbagarden.net/media/upload/e/e9/Johto_HGSS.png',
    generation: 2,
    description: 'Known for its traditional culture and the legendary Pokémon Ho-Oh and Lugia.'
  },
  {
    id: 3,
    name: 'Hoenn',
    image: 'https://archives.bulbagarden.net/media/upload/5/5a/Hoenn_ORAS.png',
    generation: 3,
    description: 'A region with diverse landscapes including tropical areas and volcanic terrain.'
  },
  {
    id: 4,
    name: 'Sinnoh',
    image: 'https://archives.bulbagarden.net/media/upload/d/d8/Sinnoh_BDSP.png',
    generation: 4,
    description: 'A region known for its mountainous terrain and legendary Creation Trio.'
  },
  {
    id: 5,
    name: 'Unova',
    image: 'https://archives.bulbagarden.net/media/upload/4/42/Unova_BW.png',
    generation: 5,
    description: 'A modern region inspired by New York, featuring many diverse cities.'
  },
  {
    id: 6,
    name: 'Kalos',
    image: 'https://archives.bulbagarden.net/media/upload/d/d4/Kalos_XY.png',
    generation: 6,
    description: 'A region known for its beauty and elegance, inspired by France.'
  }
];

// Get a random region for the game
export function getRandomRegion(): Region {
  const randomIndex = Math.floor(Math.random() * regionsData.length);
  return regionsData[randomIndex];
}

// Search regions by name (for autocomplete)
export function searchRegions(query: string): Region[] {
  if (!query.trim()) return regionsData;
  
  const lowercaseQuery = query.toLowerCase();
  return regionsData.filter(region => 
    region.name.toLowerCase().includes(lowercaseQuery)
  );
}