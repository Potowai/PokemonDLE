import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, Clock } from 'lucide-react';
import { InfoIcon } from './icons/Info';
import type { GameStatus } from '../types/pokemon';

interface GameHeaderProps {
  attemptsLeft: number;
  gameStatus: GameStatus;
  onInfoClick?: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  t: {
    guessPrompt: string;
    attemptsLeft: (n: number) => string;
    loading: string;
    credits: string;
    creditsText: (year: number) => string;
    gameOver: string;
    finished: string;
    searchPlaceholder: string;
    searchPlaceholderLoading: string;
    searchPlaceholderOver: string;
    playAgain: string;
    share: string;
  };
  restartGame?: () => void;
}

export function GameHeader({ attemptsLeft, gameStatus, onInfoClick, language, onLanguageChange, t, restartGame }: GameHeaderProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 max-w-full px-2">
        <motion.div
          animate={{ rotate: gameStatus === 'playing' ? [0, 10, -10, 0] : 0 }}
          transition={{ duration: 2, repeat: gameStatus === 'playing' ? Infinity : 0 }}
        >
          {getStatusIcon()}
        </motion.div>
        <h1
          className="text-2xl sm:text-4xl font-bold text-white flex flex-wrap items-center gap-2 max-w-full overflow-x-auto"
          style={{ wordBreak: 'break-word' }}
        >
          <span
            className="cursor-pointer hover:underline truncate max-w-[60vw] sm:max-w-none"
            onClick={restartGame}
            tabIndex={0}
            role="button"
            aria-label="Restart game"
          >
            PokemonDLE
          </span>
          <button
            type="button"
            aria-label="Show info / credits"
            onClick={typeof onInfoClick === 'function' ? onInfoClick : undefined}
            className="ml-1 sm:ml-2 text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full p-1 flex items-center justify-center"
            style={{ width: 28, height: 28 }}
          >
            <InfoIcon width={22} height={22} />
          </button>
          <select
            value={language}
            onChange={e => onLanguageChange(e.target.value)}
            className="ml-1 sm:ml-3 px-2 py-1 rounded bg-white text-gray-900 text-sm sm:text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Select language"
            style={{ minWidth: 80 }}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </h1>
      </div>
      
      <p className="text-white/80 text-lg mb-2">
        {t.guessPrompt}
      </p>
      
      {gameStatus === 'playing' && (
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full"
          animate={{ scale: attemptsLeft <= 2 ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.5, repeat: attemptsLeft <= 2 ? Infinity : 0 }}
        >
          <span className={`font-semibold ${attemptsLeft <= 2 ? 'text-red-400' : 'text-white'}`}>
            {t.attemptsLeft(attemptsLeft)}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}