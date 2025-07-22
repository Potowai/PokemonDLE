import { useState, useCallback, useEffect } from 'react';
import { pokemonIndex } from '../data/pokemonIndex';
import { fetchPokemonDetails } from '../services/pokemonApi';
import type { PokemonDetails, GuessResult, GameStatus } from '../types/pokemon';

const MAX_ATTEMPTS = 8;

export function useGame() {
  const [mysteryPokemon, setMysteryPokemon] = useState<PokemonDetails | null>(null);
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [isLoading, setIsLoading] = useState(false);

  const selectMysteryPokemon = useCallback(async () => {
    // Check for dev override
    const forceId = import.meta.env.VITE_FORCE_POKEMON;
    let selectedPokemon;
    if (forceId) {
      selectedPokemon = pokemonIndex.find(p => String(p.id) === String(forceId));
    }
    if (!selectedPokemon) {
      const randomIndex = Math.floor(Math.random() * pokemonIndex.length);
      selectedPokemon = pokemonIndex[randomIndex];
    }
    try {
      setIsLoading(true);
      const details = await fetchPokemonDetails(selectedPokemon.name);
      setMysteryPokemon(details);
    } catch (error) {
      console.error('Failed to load mystery Pokemon:', error);
      // Retry with a different Pokemon
      selectMysteryPokemon();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const compareTraits = useCallback((guess: PokemonDetails, mystery: PokemonDetails) => {
    return {
      generation: guess.generation === mystery.generation ? 'correct' : 'incorrect',
      type1: guess.types[0] === mystery.types[0] ? 'correct' : 'incorrect',
      type2: 
        (!guess.types[1] && !mystery.types[1]) ? 'correct' :
        (!guess.types[1] || !mystery.types[1]) ? 'missing' :
        (guess.types[1] === mystery.types[1] || guess.types[1] === mystery.types[0] || guess.types[0] === mystery.types[1]) ? 'correct' : 'incorrect',
      color: guess.color === mystery.color ? 'correct' : 'incorrect',
      habitat: guess.habitat === mystery.habitat ? 'correct' : 'incorrect',
      height: 
        guess.height === mystery.height ? 'correct' :
        guess.height > mystery.height ? 'higher' : 'lower',
      weight: 
        guess.weight === mystery.weight ? 'correct' :
        guess.weight > mystery.weight ? 'heavier' : 'lighter',
      evolutionStage: guess.evolutionStage === mystery.evolutionStage ? 'correct' : 'incorrect',
    } as const;
  }, []);

  const makeGuess = useCallback(async (pokemonName: string) => {
    if (!mysteryPokemon || gameStatus !== 'playing') return;

    try {
      setIsLoading(true);
      const guessDetails = await fetchPokemonDetails(pokemonName);
      
      if (guesses.some(g => g.pokemon.id === guessDetails.id)) {
        // Already guessed this Pokemon
        return;
      }

      const comparison = compareTraits(guessDetails, mysteryPokemon);
      const result: GuessResult = { pokemon: guessDetails, comparison };

      setGuesses(prev => [result, ...prev]);
      setAttemptsLeft(prev => prev - 1);

      // Check win condition
      if (guessDetails.id === mysteryPokemon.id) {
        setGameStatus('won');
      } else if (attemptsLeft - 1 <= 0) {
        setGameStatus('lost');
      }
    } catch (error) {
      console.error('Failed to make guess:', error);
    } finally {
      setIsLoading(false);
    }
  }, [mysteryPokemon, gameStatus, guesses, compareTraits, attemptsLeft]);

  const restartGame = useCallback(() => {
    setGuesses([]);
    setGameStatus('playing');
    setAttemptsLeft(MAX_ATTEMPTS);
    setMysteryPokemon(null);
    selectMysteryPokemon();
  }, [selectMysteryPokemon]);

  // Initialize game on mount
  useEffect(() => {
    selectMysteryPokemon();
  }, [selectMysteryPokemon]);

  return {
    mysteryPokemon,
    guesses,
    gameStatus,
    attemptsLeft,
    isLoading,
    makeGuess,
    restartGame,
  };
}