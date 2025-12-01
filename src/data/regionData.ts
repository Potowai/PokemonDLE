import type { Region } from '../types/pokemon';

// Pokémon regions data with images
export const regionsData: Region[] = [
  {
    id: 1,
    name: 'Kanto',
    image: 'https://static.wikia.nocookie.net/pokemon/images/4/4c/Kanto_HGSS.png',
    generation: 1,
    description: 'The region where the Pokémon journey began, home to Pallet Town and many iconic Pokémon.',
    names: {
      en: 'Kanto',
      fr: 'Kanto'
    }
  },
  {
    id: 2,
    name: 'Johto',
    image: 'https://static.wikia.nocookie.net/pokemon/images/6/64/Johto_HGSS.png',
    generation: 2,
    description: 'Known for its traditional culture and the legendary Pokémon Ho-Oh and Lugia.',
    names: {
      en: 'Johto',
      fr: 'Johto'
    }
  },
  {
    id: 3,
    name: 'Hoenn',
    image: 'https://static.wikia.nocookie.net/pokemon/images/5/56/Hoenn_ORAS.png',
    generation: 3,
    description: 'A region with diverse landscapes including tropical areas and volcanic terrain.',
    names: {
      en: 'Hoenn',
      fr: 'Hoenn'
    }
  },
  {
    id: 4,
    name: 'Sinnoh',
    image: 'https://static.wikia.nocookie.net/pokemon/images/7/74/Sinnoh_BDSP.png',
    generation: 4,
    description: 'A region known for its mountainous terrain and legendary Creation Trio.',
    names: {
      en: 'Sinnoh',
      fr: 'Sinnoh'
    }
  },
  {
    id: 5,
    name: 'Unova',
    image: 'https://static.wikia.nocookie.net/pokemon/images/f/f2/Unova_B2W2.png',
    generation: 5,
    description: 'A modern region inspired by New York, featuring many diverse cities.',
    names: {
      en: 'Unova',
      fr: 'Unys'
    }
  },
  {
    id: 6,
    name: 'Kalos',
    image: 'https://static.wikia.nocookie.net/pokemon/images/8/8a/Kalos_XY.png',
    generation: 6,
    description: 'A region known for its beauty and elegance, inspired by France.',
    names: {
      en: 'Kalos',
      fr: 'Kalos'
    }
  }
];

// Get a random region for the game
export function getRandomRegion(): Region {
  const randomIndex = Math.floor(Math.random() * regionsData.length);
  return regionsData[randomIndex];
}

// Search regions by name (for autocomplete)
export function searchRegions(query: string, language: 'en' | 'fr' = 'en'): Region[] {
  if (!query.trim()) return regionsData;

  const lowercaseQuery = query.toLowerCase();
  return regionsData.filter(region => {
    const name = region.names ? region.names[language] : region.name;
    return name.toLowerCase().includes(lowercaseQuery);
  });
}