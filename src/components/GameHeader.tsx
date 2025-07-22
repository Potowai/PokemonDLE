import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, Clock } from 'lucide-react';
import type { GameStatus } from '../types/pokemon';

interface GameHeaderProps {
  attemptsLeft: number;
  gameStatus: GameStatus;
}

export function GameHeader({ attemptsLeft, gameStatus }: GameHeaderProps) {
  const getStatusIcon = () => {
    switch (gameStatus) {
      case 'won':
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 'lost':
        return <Clock className="w-6 h-6 text-red-400" />;
      default:
        return <Zap className="w-6 h-6 text-blue-400" />;
    }
  };

  const getStatusText = () => {
    switch (gameStatus) {
      case 'won':
        return 'Congratulations! 🎉';
      case 'lost':
        return 'Game Over! 😔';
      default:
        return 'PokéTraits';
    }
  };

  const getStatusColor = () => {
    switch (gameStatus) {
      case 'won':
        return 'text-yellow-400';
      case 'lost':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: gameStatus === 'playing' ? [0, 10, -10, 0] : 0 }}
          transition={{ duration: 2, repeat: gameStatus === 'playing' ? Infinity : 0 }}
        >
          {getStatusIcon()}
        </motion.div>
        <h1 className={`text-4xl font-bold text-white`}>
          PokemonDLE
        </h1>
      </div>
      
      <p className="text-white/80 text-lg mb-2">
        Guess the mystery Pokémon from Gen 1-5!
      </p>
      
      {gameStatus === 'playing' && (
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full"
          animate={{ scale: attemptsLeft <= 2 ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.5, repeat: attemptsLeft <= 2 ? Infinity : 0 }}
        >
          <span className={`font-semibold ${attemptsLeft <= 2 ? 'text-red-400' : 'text-white'}`}>
            {attemptsLeft} attempts left
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}