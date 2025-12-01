import React from 'react';
import { motion } from 'framer-motion';
import { Search, HelpCircle, MapPin } from 'lucide-react';
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
      icon: <Search className="w-4 h-4" />,
      title: language === 'fr' ? 'Classique' : 'Classic',
    },
    {
      id: 'silhouette' as GameMode,
      icon: <HelpCircle className="w-4 h-4" />,
      title: language === 'fr' ? 'Silhouette' : "Who's That Pokémon",
    },
    {
      id: 'region' as GameMode,
      icon: <MapPin className="w-4 h-4" />,
      title: language === 'fr' ? 'Région' : 'Region Guess',
    },
    {
      id: 'fusion' as GameMode,
      icon: <Search className="w-4 h-4" />,
      title: language === 'fr' ? 'Fusion' : 'Fusion Guess',
    },
  ];

  return (
    <div className="mb-8">
      <div className="border-b border-white/20">
        <div className="flex overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center">
          <div className="flex space-x-6 min-w-max pb-px">
            {modes.map((mode) => {
              const isActive = currentMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => !disabled && onModeChange(mode.id)}
                  disabled={disabled}
                  className={`
                    group relative flex items-center gap-2 py-4 text-sm font-medium transition-colors whitespace-nowrap
                    ${isActive ? 'text-blue-400' : 'text-white/60 hover:text-white/90'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {mode.icon}
                  <span>{mode.title}</span>

                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}

                  {/* Hover effect for non-active tabs */}
                  {!isActive && !disabled && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}