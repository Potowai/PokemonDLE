import React from 'react';
import { motion } from 'framer-motion';
import type { PokemonDetails } from '../types/pokemon';

interface SilhouetteDisplayProps {
  pokemon: PokemonDetails | null;
  revealed?: boolean;
}

export function SilhouetteDisplay({ pokemon, revealed = false }: SilhouetteDisplayProps) {
  if (!pokemon) {
    return (
      <div className="flex items-center justify-center h-48 w-48 mx-auto mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center h-48 w-48 mx-auto mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
    >
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={revealed ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        <img
          src={pokemon.sprite}
          alt={revealed ? pokemon.name : "Who's that Pokémon?"}
          className={`max-w-full max-h-full object-contain transition-all duration-1000 ${
            revealed ? 'filter-none' : 'brightness-0'
          }`}
          style={{ 
            filter: revealed ? 'none' : 'brightness(0) contrast(1)',
            imageRendering: 'pixelated'
          }}
        />
        {!revealed && (
          <motion.div
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-white/80 text-lg font-bold">
              Who's that Pokémon?
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}