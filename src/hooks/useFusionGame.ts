import { useState, useEffect } from 'react';
import { getRandomFusionIds } from '../utils/randomPokemon';
import { isFusionGuessCorrect } from '../utils/fusion';

export type FusionGameStatus = 'playing' | 'won' | 'lost';
export type FusionGuess = { id: number; name: string };
export type FusionGuessPair = [FusionGuess | null, FusionGuess | null];

export interface UseFusionGameReturn {
  fusionIds: [number, number];
  guesses: FusionGuessPair;
  status: FusionGameStatus;
  showAnswer: boolean;
  guessHistory: FusionGuessPair[];
  setGuess: (index: 0 | 1, pokemon: FusionGuess) => void;
  submitGuess: () => void;
  restart: () => void;
}

export const useFusionGame = (attemptsLeft: number, onRestart: () => void): UseFusionGameReturn => {
  const [fusionIds, setFusionIds] = useState<[number, number]>(() => getRandomFusionIds());
  const [guesses, setGuesses] = useState<FusionGuessPair>([null, null]);
  const [status, setStatus] = useState<FusionGameStatus>('playing');
  const [showAnswer, setShowAnswer] = useState(false);
  const [guessHistory, setGuessHistory] = useState<FusionGuessPair[]>([]);

  // Update answer visibility when game ends
  useEffect(() => {
    if (status === 'won' || status === 'lost') {
      setShowAnswer(true);
    }
    
    // Log the correct fusion answer to the console for debugging
    console.log(`Fusion answer: ids = ${fusionIds[0]}, ${fusionIds[1]}`);
  }, [fusionIds, status]);

  const setGuess = (index: 0 | 1, pokemon: FusionGuess) => {
    setGuesses(prev => {
      const newGuesses = [...prev] as FusionGuessPair;
      newGuesses[index] = pokemon;
      return newGuesses;
    });
  };

  const submitGuess = () => {
    if (status !== 'playing' || !guesses[0] || !guesses[1]) return;

    // Add to history
    setGuessHistory(prev => [...prev, guesses]);

    const guessIds: [number, number] = [guesses[0].id, guesses[1].id];
    
    if (isFusionGuessCorrect(guessIds, fusionIds)) {
      setStatus('won');
    } else if (attemptsLeft <= 1) {
      setStatus('lost');
    }
    // Note: attemptsLeft is managed by parent component
  };

  const restart = () => {
    setFusionIds(getRandomFusionIds());
    setGuesses([null, null]);
    setStatus('playing');
    setShowAnswer(false);
    setGuessHistory([]);
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
  };
};