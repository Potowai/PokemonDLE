import React from 'react';
import { motion } from 'framer-motion';
import { Search, HelpCircle } from 'lucide-react';
import type { GameMode } from '../types/pokemon';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  language: 'en' | 'fr';
  disabled?: boolean;
}

export function GameModeSelector({ currentMode, onModeChange, language, disabled = false }: GameModeSelectorProps) {
  const modes = [
    {
      id: 'classic' as GameMode,
      icon: <Search className="w-5 h-5" />,
      title: language === 'fr' ? 'Classique' : 'Classic',
      description: language === 'fr' ? 'Devinez par comparaison' : 'Guess by comparison',
    },
    {
      id: 'silhouette' as GameMode,
      icon: <HelpCircle className="w-5 h-5" />,
      title: language === 'fr' ? 'Silhouette' : "Who's That Pokémon",
      description: language === 'fr' ? 'Devinez la silhouette' : 'Guess the silhouette',
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {modes.map((mode) => (
          <motion.button
            key={mode.id}
            onClick={() => !disabled && onModeChange(mode.id)}
            disabled={disabled}
            className={`
              relative px-6 py-3 rounded-xl border transition-all duration-200 flex items-center gap-3 min-w-[200px]
              ${currentMode === mode.id 
                ? 'bg-white/20 border-white/40 text-white shadow-lg' 
                : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            <div className="flex-shrink-0">
              {mode.icon}
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">{mode.title}</div>
              <div className="text-xs opacity-80">{mode.description}</div>
            </div>
            {currentMode === mode.id && (
              <motion.div
                layoutId="activeMode"
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-white/30"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}