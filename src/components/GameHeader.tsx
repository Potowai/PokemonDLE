import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { InfoIcon } from './icons/Info';
import type { GameStatus, GameMode } from '../types/pokemon';
import type { Translation } from '../data/translations';

interface GameHeaderProps {
  attemptsLeft: number;
  gameStatus: GameStatus;
  onInfoClick?: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  t: Translation;
  restartGame?: () => void;
  gameMode?: GameMode;
}

export function GameHeader({ attemptsLeft, gameStatus, onInfoClick, language, onLanguageChange, t, restartGame, gameMode = 'classic' }: GameHeaderProps) {

  // Always show Zap icon, animate only during 'playing'
  const statusIcon = <Zap className="w-6 h-6 text-blue-400" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-6"
    >
      {/* Top Row: Title and Controls */}
      <div className="flex flex-col items-center justify-center relative mb-4">

        {/* Title Section */}
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            animate={{ rotate: gameStatus === 'playing' ? [0, 10, -10, 0] : 0 }}
            transition={{ duration: 2, repeat: gameStatus === 'playing' ? Infinity : 0 }}
          >
            {statusIcon}
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            <span
              className="cursor-pointer hover:text-blue-400 transition-colors"
              onClick={restartGame}
              role="button"
              tabIndex={0}
            >
              PokemonDLE
            </span>
          </h1>
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={e => onLanguageChange(e.target.value)}
            className="bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Select language"
          >
            <option value="en" className="text-gray-900">English</option>
            <option value="fr" className="text-gray-900">Français</option>
          </select>

          <button
            type="button"
            aria-label="Show info / credits"
            onClick={onInfoClick}
            className="text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full"
          >
            <InfoIcon width={20} height={20} />
          </button>
        </div>
      </div>

      <p className="text-white/80 text-base sm:text-lg mb-4 max-w-md mx-auto leading-relaxed">
        {gameMode === 'silhouette' ? t.silhouettePrompt : t.guessPrompt}
      </p>

      {gameStatus === 'playing' && (
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full"
          animate={{ scale: attemptsLeft <= 2 ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.5, repeat: attemptsLeft <= 2 ? Infinity : 0 }}
        >
          <span className={`text-sm font-semibold ${attemptsLeft <= 2 ? 'text-red-300' : 'text-blue-100'}`}>
            {t.attemptsLeft(attemptsLeft)}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}