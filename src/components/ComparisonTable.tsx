import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import type { GuessResult } from '../types/pokemon';

// Type color mappings for gradients
const typeColors: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

// Type icon URLs
const typeIcons: Record<string, string> = {
  normal: 'https://archives.bulbagarden.net/media/upload/thumb/a/ae/Normal_icon.png/20px-Normal_icon.png',
  fire: 'https://archives.bulbagarden.net/media/upload/thumb/5/5e/Fire_icon.png/20px-Fire_icon.png',
  fighting: 'https://archives.bulbagarden.net/media/upload/thumb/7/7d/Fighting_icon.png/20px-Fighting_icon.png',
  water: 'https://archives.bulbagarden.net/media/upload/thumb/7/7f/Water_icon.png/20px-Water_icon.png',
  flying: 'https://archives.bulbagarden.net/media/upload/thumb/f/f0/Flying_icon.png/20px-Flying_icon.png',
  grass: 'https://archives.bulbagarden.net/media/upload/thumb/c/cb/Grass_icon.png/20px-Grass_icon.png',
  poison: 'https://archives.bulbagarden.net/media/upload/thumb/8/84/Poison_icon.png/20px-Poison_icon.png',
  electric: 'https://archives.bulbagarden.net/media/upload/thumb/a/af/Electric_icon.png/20px-Electric_icon.png',
  ground: 'https://archives.bulbagarden.net/media/upload/thumb/5/58/Ground_icon.png/20px-Ground_icon.png',
  psychic: 'https://archives.bulbagarden.net/media/upload/thumb/a/a6/Psychic_icon.png/20px-Psychic_icon.png',
  rock: 'https://archives.bulbagarden.net/media/upload/thumb/f/ff/Rock_icon.png/20px-Rock_icon.png',
  ice: 'https://archives.bulbagarden.net/media/upload/thumb/8/83/Ice_icon.png/20px-Ice_icon.png',
  bug: 'https://archives.bulbagarden.net/media/upload/thumb/7/79/Bug_icon.png/20px-Bug_icon.png',
  dragon: 'https://archives.bulbagarden.net/media/upload/thumb/9/91/Dragon_icon.png/20px-Dragon_icon.png',
  ghost: 'https://archives.bulbagarden.net/media/upload/thumb/8/82/Ghost_icon.png/20px-Ghost_icon.png',
  dark: 'https://archives.bulbagarden.net/media/upload/thumb/3/33/Dark_icon.png/20px-Dark_icon.png',
  steel: 'https://archives.bulbagarden.net/media/upload/thumb/b/b8/Steel_icon.png/20px-Steel_icon.png',
  fairy: 'https://archives.bulbagarden.net/media/upload/thumb/5/5a/Fairy_icon.png/20px-Fairy_icon.png',
  stellar: 'https://archives.bulbagarden.net/media/upload/thumb/9/9f/Stellar_icon.png/20px-Stellar_icon.png',
  '???': 'https://archives.bulbagarden.net/media/upload/e/e3/None.png',
};

const TypeTag = ({ type }: { type: string }) => {
  const typeColor = typeColors[type] || '#5A5A5A';
  const iconUrl = typeIcons[type];
  
  return (
    <span
      style={{
        backgroundColor: '#5A5A5A',
        padding: '2px 2px 2px 4px',
        margin: '2px',
        borderRadius: '15px',
        display: 'inline-flex',
        whiteSpace: 'nowrap',
        backgroundImage: `linear-gradient(105deg, ${typeColor} 30px, #5A5A5A 31px, #5A5A5A)`,
        alignItems: 'center',
      }}
    >
      {iconUrl && (
        <img
          src={iconUrl}
          alt={`${type} type`}
          width="20"
          height="20"
          style={{ display: 'block' }}
        />
      )}
      <span
        style={{
          margin: '0 5px 0 10px',
          display: 'inline-block',
          minWidth: '50px',
          textAlign: 'center',
          color: '#FFF',
          textTransform: 'capitalize',
        }}
      >
        {type}
      </span>
    </span>
  );
};

interface ComparisonTableProps {
  guesses: GuessResult[];
  language: 'en' | 'fr';
  mysteryPokemon: any;
}

const ComparisonIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'correct':
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    case 'incorrect':
      return <XCircle className="w-5 h-5 text-red-400" />;
    case 'higher':
      return <ArrowDown className="w-5 h-5 text-yellow-400" />;
    case 'lower':
      return <ArrowUp className="w-5 h-5 text-yellow-400" />;
    case 'heavier':
      return <ArrowDown className="w-5 h-5 text-yellow-400" />;
    case 'lighter':
      return <ArrowUp className="w-5 h-5 text-yellow-400" />;
    case 'missing':
      return <Minus className="w-5 h-5 text-gray-400" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'correct':
      return 'bg-green-500/20 border-green-500/30';
    case 'incorrect':
      return 'bg-red-500/20 border-red-500/30';
    case 'higher':
    case 'lower':
    case 'heavier':
    case 'lighter':
      return 'bg-yellow-500/20 border-yellow-500/30';
    case 'missing':
      return 'bg-gray-500/20 border-gray-500/30';
    default:
      return 'bg-white/5 border-white/20';
  }
};

function ComparisonTable({ guesses, language, mysteryPokemon }: ComparisonTableProps) {
  const t = {
    en: {
      empty: 'Make your first guess to see the comparison table!',
      pokemon: 'Pokémon',
      gen: 'Gen',
      type1: 'Type 1',
      type2: 'Type 2',
      color: 'Color',
      habitat: 'Habitat',
      evolution: 'Evolution',
      height: 'Height',
      weight: 'Weight',
    },
    fr: {
      empty: 'Faites votre première proposition pour voir le tableau de comparaison !',
      pokemon: 'Pokémon',
      gen: 'Gén',
      type1: 'Type 1',
      type2: 'Type 2',
      color: 'Couleur',
      habitat: 'Habitat',
      evolution: 'Évolution',
      height: 'Taille',
      weight: 'Poids',
    }
  };
  if (guesses.length === 0) {
    return (
      <div className="text-center text-white/60 dark:text-white/60 py-8">
        <p>{t[language].empty}</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block w-full overflow-x-auto">
        <div className="min-w-full">
          {/* Headers */}
          <div className="grid grid-cols-9 gap-2 mb-4 text-xs font-medium text-white/80 uppercase tracking-wider">
            <div className="text-center">{t[language].pokemon}</div>
            <div className="text-center">{t[language].gen}</div>
            <div className="text-center">{t[language].type1}</div>
            <div className="text-center">{t[language].type2}</div>
            <div className="text-center">{t[language].color}</div>
            <div className="text-center">{t[language].habitat}</div>
            <div className="text-center">{t[language].evolution}</div>
            <div className="text-center">{t[language].height}</div>
            <div className="text-center">{t[language].weight}</div>
          </div>

          {/* Guesses */}
          <div className="space-y-2">
            {guesses.map((guess, index) => (
              <motion.div
                key={`${guess.pokemon.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-9 gap-2"
              >
                {/* Pokemon */}
                <div className="flex flex-col items-center p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
                  <img
                    src={guess.pokemon.sprite}
                    alt={guess.pokemon.name}
                    className="w-8 h-8 mb-1"
                  />
                  <span className="text-xs text-white/90 capitalize text-center">
                    {guess.pokemon.name}
                  </span>
                </div>

                {/* Generation */}
                <div className={`flex flex-col items-center justify-center p-3 backdrop-blur-md border rounded-lg ${guess.pokemon.generation === mysteryPokemon.generation ? getStatusColor(guess.comparison.generation) : 'bg-yellow-500/20 border-yellow-500/30'}`}>
                  {/* Generation arrow logic */}
                  {guess.pokemon.generation === mysteryPokemon.generation ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : guess.pokemon.generation < mysteryPokemon.generation ? (
                    <ArrowUp className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <ArrowDown className="w-5 h-5 text-yellow-400" />
                  )}
                  <span className="text-xs text-white/90 mt-1">{guess.pokemon.generation}</span>
                </div>

                {/* Type 1 */}
                <div className={`flex flex-col items-center justify-center p-3 backdrop-blur-md border rounded-lg ${getStatusColor(guess.comparison.type1)}`}>
                  <ComparisonIcon status={guess.comparison.type1} />
                  <div className="mt-1">
                    <TypeTag type={guess.pokemon.types[0]} />
                  </div>
                </div>

                {/* Type 2 */}
                <div className={`flex flex-col items-center justify-center p-3 backdrop-blur-md border rounded-lg ${getStatusColor(guess.comparison.type2)}`}>
                  <ComparisonIcon status={guess.comparison.type2} />
                  <div className="mt-1">
                    {guess.pokemon.types[1] ? (
                      <TypeTag type={guess.pokemon.types[1]} />
                    ) : (
                      <span className="text-xs text-white/60">None</span>
                    )}
                  </div>
                </div>

                {/* Color */}
                <div className={`flex flex-col items-center justify-center p-3 backdrop-blur-md border rounded-lg ${getStatusColor(guess.comparison.color)}`}>
                  <ComparisonIcon status={guess.comparison.color} />
                  <span className="text-xs text-white/90 mt-1 capitalize">{guess.pokemon.color}</span>
                </div>

                {/* Habitat */}
                <div className={`flex flex-col items-center justify-center p-3 backdrop-blur-md border rounded-lg ${getStatusColor(guess.comparison.habitat)}`}>
                  <ComparisonIcon status={guess.comparison.habitat} />
                  <span className="text-xs text-white/90 mt-1 capitalize">
                    {guess.pokemon.habitat || 'Unknown'}
                  </span>
                </div>

                {/* Evolution Stage */}
                <div className={`flex flex-col items-center justify-center p-3 backdrop-blur-md border rounded-lg ${getStatusColor(guess.comparison.evolutionStage)}`}>
                  <ComparisonIcon status={guess.comparison.evolutionStage} />
                  <span className="text-xs text-white/90 mt-1">
                    {guess.pokemon.evolutionStage === 1 ? '1st' : guess.pokemon.evolutionStage === 2 ? '2nd' : '3rd'}
                  </span>
                </div>

                {/* Height */}
                <div className={`flex flex-col items-center justify-center p-3 backdrop-blur-md border rounded-lg ${getStatusColor(guess.comparison.height)}`}>
                  <ComparisonIcon status={guess.comparison.height} />
                  <span className="text-xs text-white/90 mt-1">
                    {(guess.pokemon.height / 10).toFixed(1)}m
                  </span>
                </div>

                {/* Weight */}
                <div className={`flex flex-col items-center justify-center p-3 backdrop-blur-md border rounded-lg ${getStatusColor(guess.comparison.weight)}`}>
                  <ComparisonIcon status={guess.comparison.weight} />
                  <span className="text-xs text-white/90 mt-1">
                    {(guess.pokemon.weight / 10).toFixed(1)}kg
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {guesses.map((guess, index) => (
          <motion.div
            key={`${guess.pokemon.name}-${index}-mobile`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4"
          >
            {/* Pokemon Header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/20">
              <img
                src={guess.pokemon.sprite}
                alt={guess.pokemon.name}
                className="w-12 h-12"
              />
              <div>
                <h3 className="text-lg font-semibold text-white capitalize">
                  {guess.pokemon.name}
                </h3>
                <p className="text-sm text-white/60">
                  #{guess.pokemon.id.toString().padStart(3, '0')}
                </p>
              </div>
            </div>

            {/* Traits Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Generation */}
              <div className={`flex items-center gap-2 p-3 backdrop-blur-md border rounded-lg ${getStatusColor(guess.comparison.generation)}`}>
                <ComparisonIcon status={guess.comparison.generation} />
                <div>
                  <div className="text-xs text-white/60 uppercase">Gen</div>
                  <div className="text-sm text-white font-medium">{guess.pokemon.generation}</div>
                </div>
              </div>

              {/* Color */}
              <div className={`flex items-center gap-2 p-3 backdrop-blur-md border rounded-lg ${getStatusColor(guess.comparison.color)}`}>
                <ComparisonIcon status={guess.comparison.color} />
                <div>
                  <div className="text-xs text-white/60 uppercase">Color</div>
                  <div className="text-sm text-white font-medium capitalize">{guess.pokemon.color}</div>
                </div>
              </div>

              {/* Evolution Stage */}
              <div className={`flex items-center gap-2 p-3 backdrop-blur-md border rounded-lg ${getStatusColor(guess.comparison.evolutionStage)}`}>
                <ComparisonIcon status={guess.comparison.evolutionStage} />
                <div>
                  <div className="text-xs text-white/60 uppercase">Evolution</div>
                  <div className="text-sm text-white font-medium">
                    {guess.pokemon.evolutionStage === 1 ? '1st Stage' : guess.pokemon.evolutionStage === 2 ? '2nd Stage' : '3rd Stage'}
                  </div>
                </div>
              </div>

              {/* Habitat */}
              <div className={`flex items-center gap-2 p-3 backdrop-blur-md border rounded-lg ${getStatusColor(guess.comparison.habitat)}`}>
                <ComparisonIcon status={guess.comparison.habitat} />
                <div>
                  <div className="text-xs text-white/60 uppercase">Habitat</div>
                  <div className="text-sm text-white font-medium capitalize">
                    {guess.pokemon.habitat || 'Unknown'}
                  </div>
                </div>
              </div>
            </div>

            {/* Height and Weight Row */}
            <div className="grid grid-cols-2 gap-3 mb-3">

              {/* Height */}
              <div className={`flex items-center gap-2 p-3 backdrop-blur-md border rounded-lg ${getStatusColor(guess.comparison.height)}`}>
                <ComparisonIcon status={guess.comparison.height} />
                <div>
                  <div className="text-xs text-white/60 uppercase">Height</div>
                  <div className="text-sm text-white font-medium">
                    {(guess.pokemon.height / 10).toFixed(1)}m
                  </div>
                </div>
              </div>

              {/* Weight */}
              <div className={`flex items-center gap-2 p-3 backdrop-blur-md border rounded-lg ${getStatusColor(guess.comparison.weight)}`}>
                <ComparisonIcon status={guess.comparison.weight} />
                <div>
                  <div className="text-xs text-white/60 uppercase">Weight</div>
                  <div className="text-sm text-white font-medium">
                    {(guess.pokemon.weight / 10).toFixed(1)}kg
                  </div>
                </div>
              </div>
            </div>

            {/* Types Row */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
              {/* Type 1 */}
              <div className={`flex items-center gap-2 p-3 backdrop-blur-md border rounded-lg ${getStatusColor(guess.comparison.type1)}`}>
                <ComparisonIcon status={guess.comparison.type1} />
                <div className="flex-1">
                  <div className="text-xs text-white/60 uppercase mb-1">Type 1</div>
                  <div className="text-sm text-white font-medium capitalize">{guess.pokemon.types[0]}</div>
                </div>
              </div>

              {/* Type 2 */}
              <div className={`flex items-center gap-2 p-3 backdrop-blur-md border rounded-lg ${getStatusColor(guess.comparison.type2)}`}>
                <ComparisonIcon status={guess.comparison.type2} />
                <div className="flex-1">
                  <div className="text-xs text-white/60 uppercase mb-1">Type 2</div>
                  {guess.pokemon.types[1] ? (
                    <div className="text-sm text-white font-medium capitalize">{guess.pokemon.types[1]}</div>
                  ) : (
                    <span className="text-xs text-white/60">None</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

export default ComparisonTable;