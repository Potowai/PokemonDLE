import { useState, useEffect } from 'react';
import { getRandomFusionIds } from '../utils/randomPokemon';
import { isFusionGuessCorrect } from '../utils/fusion';
import { getMockPokemonDetails } from '../services/mockPokemonData';
import type { PokemonDetails } from '../types/pokemon';

export type FusionGameStatus = 'playing' | 'won' | 'lost';
export type FusionGuessInput = { id: number; name: string; sprite?: string };
export type FusionGuessResult = PokemonDetails;
export type FusionGuessPair = [FusionGuessResult | null, FusionGuessResult | null];

export interface UseFusionGameReturn {
  fusionIds: [number, number];
  guesses: [FusionGuessInput | null, FusionGuessInput | null];
  status: FusionGameStatus;
  showAnswer: boolean;
  guessHistory: FusionGuessPair[];
  setGuess: (index: 0 | 1, pokemon: FusionGuessInput) => void;
  submitGuess: () => Promise<void>;
  restart: () => void;
  isLoading: boolean;
  attempts: number;
}

export const useFusionGame = (initialAttempts: number, onRestart: () => void, onGuess?: () => void): UseFusionGameReturn => {
  const [fusionIds, setFusionIds] = useState<[number, number]>(() => getRandomFusionIds());
  const [guesses, setGuesses] = useState<[FusionGuessInput | null, FusionGuessInput | null]>([null, null]);
  const [status, setStatus] = useState<FusionGameStatus>('playing');
  const [showAnswer, setShowAnswer] = useState(false);
  const [guessHistory, setGuessHistory] = useState<FusionGuessPair[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(initialAttempts);

  // Update answer visibility when game ends
  useEffect(() => {
    if (status === 'won' || status === 'lost') {
      setShowAnswer(true);
    }

    // Log the correct fusion answer to the console for debugging
    console.log(`Fusion answer: ids = ${fusionIds[0]}, ${fusionIds[1]}`);
  }, [fusionIds, status]);

  const setGuess = (index: 0 | 1, pokemon: FusionGuessInput) => {
    setGuesses(prev => {
      const newGuesses = [...prev] as [FusionGuessInput | null, FusionGuessInput | null];
      newGuesses[index] = pokemon;
      return newGuesses;
    });
  };

  const submitGuess = async () => {
    if (status !== 'playing' || !guesses[0] || !guesses[1]) return;

    try {
      setIsLoading(true);
      // Fetch full details for both guesses
      const [p1, p2] = await Promise.all([
        getMockPokemonDetails(guesses[0].name),
        getMockPokemonDetails(guesses[1].name)
      ]);

      const fullGuesses: FusionGuessPair = [p1, p2];

      // Add to history
      setGuessHistory(prev => [...prev, fullGuesses]);

      const guessIds: [number, number] = [guesses[0].id, guesses[1].id];

      const isCorrect = isFusionGuessCorrect(guessIds, fusionIds);
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);

      // Call parent onGuess if provided
      if (onGuess) {
        onGuess();
      }

      if (isCorrect) {
        setStatus('won');
      } else if (newAttempts <= 0) {
        setStatus('lost');
      }
    } catch (error) {
      console.error('Failed to submit fusion guess:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const restart = () => {
    setFusionIds(getRandomFusionIds());
    setGuesses([null, null]);
    setStatus('playing');
    setShowAnswer(false);
    setGuessHistory([]);
    setAttempts(initialAttempts);
    onRestart();
  };

  return {
    fusionIds,
    guesses,
    status,
    showAnswer,
    guessHistory,
    setGuess,
    submitGuess,
    restart,
    isLoading,
    attempts,
  };
};