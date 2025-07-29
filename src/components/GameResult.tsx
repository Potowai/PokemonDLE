import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { RotateCcw, Share2 } from 'lucide-react';
import { useToaster } from './ui/toaster';
import type { GameStatus, PokemonDetails } from '../types/pokemon';

interface GameResultProps {
  gameStatus: GameStatus;
  mysteryPokemon: PokemonDetails | null;
  attemptsUsed: number;
  onRestart: () => void;
  t: {
    playAgain: string;
    share: string;
    mysteryWas: string;
    generation: string;
    type: string;
    color: string;
    evolution: string;
    stage1: string;
    stage2: string;
    stage3: string;
    habitat: string;
    unknown: string;
    heightWeight: string;
  };
}

export function GameResult({ gameStatus, mysteryPokemon, attemptsUsed, onRestart, t }: GameResultProps) {
  const showToast = useToaster();

  if (gameStatus === 'playing' || !mysteryPokemon) {
    return null;
  }

  const handleShare = async () => {
    // Discord-friendly message
    const resultText = gameStatus === 'won'
      ? `🎉 I guessed **${mysteryPokemon.name}** in ${attemptsUsed} attempts on PokéTraits!\n${window.location.href}`
      : `😔 I couldn't guess **${mysteryPokemon.name}** on PokéTraits...\n${window.location.href}\nTry it yourself!`;

    try {
      await navigator.clipboard.writeText(resultText);
      showToast('Result copied! Paste it anywhere you like.');
    } catch {
      showToast('Failed to copy result.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="text-center py-8"
    >
      <div className="mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring", bounce: 0.5 }}
          className="inline-block"
        >
          <img
            src={mysteryPokemon.sprite}
            alt={mysteryPokemon.name}
            className="w-32 h-32 mx-auto mb-4"
          />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-white mb-2">
          {t.mysteryWas || 'The mystery Pokémon was:'}
        </h2>
        <h3 className="text-3xl font-bold text-blue-400 capitalize mb-4">
          {mysteryPokemon.name}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto mb-6 text-sm">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3">
            <div className="text-white/60">{t.generation || 'Generation'}</div>
            <div className="text-white font-semibold">{mysteryPokemon.generation}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3">
            <div className="text-white/60">{t.type || 'Type'}</div>
            <div className="text-white font-semibold capitalize">
              {mysteryPokemon.types.join(' / ')}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3">
            <div className="text-white/60">{t.color || 'Color'}</div>
            <div className="text-white font-semibold capitalize">{mysteryPokemon.color}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3">
            <div className="text-white/60">{t.evolution || 'Evolution'}</div>
            <div className="text-white font-semibold">
              {mysteryPokemon.evolutionStage === 1 ? (t.stage1 || '1st Stage') : mysteryPokemon.evolutionStage === 2 ? (t.stage2 || '2nd Stage') : (t.stage3 || '3rd Stage')}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto mb-6 text-sm">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3">
            <div className="text-white/60">{t.habitat || 'Habitat'}</div>
            <div className="text-white font-semibold capitalize">
              {mysteryPokemon.habitat || (t.unknown || 'Unknown')}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3">
            <div className="text-white/60">{t.heightWeight || 'Height / Weight'}</div>
            <div className="text-white font-semibold">
              {(mysteryPokemon.height / 10).toFixed(1)}m / {(mysteryPokemon.weight / 10).toFixed(1)}kg
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={onRestart} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            {t.playAgain}
          </Button>
          <Button onClick={handleShare} variant="outline" className="gap-2" title="Copy result for Discord">
            <Share2 className="w-4 h-4" />
            {t.share}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}