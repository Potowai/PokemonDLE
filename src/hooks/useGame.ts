import { useState, useCallback, useEffect } from 'react';
import { pokemonIndex } from '../data/pokemonIndex';
import { getMockPokemonDetails } from '../services/mockPokemonData';
import { getRandomRegion } from '../data/regionData';
import { MAX_ATTEMPTS, MAX_SILHOUETTE_ATTEMPTS, MAX_REGION_ATTEMPTS } from '../constants/gameConstants';
import type { PokemonDetails, GuessResult, GameStatus, GameMode, SilhouetteHint, Region } from '../types/pokemon';

export function useGame(mode: GameMode = 'classic') {
  const [mysteryPokemon, setMysteryPokemon] = useState<PokemonDetails | null>(null);
  const [mysteryRegion, setMysteryRegion] = useState<Region | null>(null);
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [regionGuesses, setRegionGuesses] = useState<{ region: string; correct: boolean }[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [attemptsLeft, setAttemptsLeft] = useState(
    mode === 'silhouette' ? MAX_SILHOUETTE_ATTEMPTS : 
    mode === 'region' ? MAX_REGION_ATTEMPTS : 
    MAX_ATTEMPTS
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hints, setHints] = useState<SilhouetteHint[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>(mode);

  const selectMysteryPokemon = useCallback(async () => {
    if (gameMode === 'region') {
      // For region mode, select a random region instead
      const selectedRegion = getRandomRegion();
      setMysteryRegion(selectedRegion);
      return;
    }

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
      // Force use of mock data for demo
      const details = await getMockPokemonDetails(selectedPokemon.name);
      setMysteryPokemon(details);
    } catch (error) {
      console.error('Failed to load mystery Pokemon:', error);
      // Retry with a different Pokemon
      selectMysteryPokemon();
    } finally {
      setIsLoading(false);
    }
  }, [gameMode]);

  const generateHint = useCallback((pokemon: PokemonDetails, hintIndex: number): SilhouetteHint | null => {
    const hintTypes = ['type', 'generation', 'color', 'habitat'] as const;
    const hintType = hintTypes[hintIndex];
    
    if (!hintType) return null;
    
    switch (hintType) {
      case 'type':
        return {
          type: 'type',
          value: pokemon.types.join(', '),
          label: `Type: ${pokemon.types.join('/')}`
        };
      case 'generation':
        return {
          type: 'generation',
          value: `Gen ${pokemon.generation}`,
          label: `Generation: ${pokemon.generation}`
        };
      case 'color':
        return {
          type: 'color',
          value: pokemon.color,
          label: `Color: ${pokemon.color}`
        };
      case 'habitat':
        return {
          type: 'habitat',
          value: pokemon.habitat || 'Unknown',
          label: `Habitat: ${pokemon.habitat || 'Unknown'}`
        };
      default:
        return null;
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
      // Force use of mock data for demo
      const guessDetails = await getMockPokemonDetails(pokemonName);
      
      if (guesses.some(g => g.pokemon.id === guessDetails.id)) {
        // Already guessed this Pokemon
        return;
      }

      const newAttemptsLeft = attemptsLeft - 1;
      
      // Check win condition first
      if (guessDetails.id === mysteryPokemon.id) {
        setGameStatus('won');
        setGuesses(prev => [{pokemon: guessDetails, comparison: compareTraits(guessDetails, mysteryPokemon)}, ...prev]);
        setAttemptsLeft(newAttemptsLeft);
        return;
      }

      // For silhouette mode, add hints after incorrect guesses
      if (gameMode === 'silhouette' && newAttemptsLeft > 0) {
        const hintIndex = (gameMode === 'silhouette' ? MAX_SILHOUETTE_ATTEMPTS : MAX_ATTEMPTS) - newAttemptsLeft;
        const newHint = generateHint(mysteryPokemon, hintIndex - 1);
        if (newHint) {
          setHints(prev => [...prev, newHint]);
        }
      }

      // Add guess (for classic mode or silhouette mode)
      if (gameMode === 'classic') {
        const comparison = compareTraits(guessDetails, mysteryPokemon);
        const result: GuessResult = { pokemon: guessDetails, comparison };
        setGuesses(prev => [result, ...prev]);
      } else {
        // For silhouette mode, just add the guess without comparison
        setGuesses(prev => [{pokemon: guessDetails, comparison: compareTraits(guessDetails, mysteryPokemon)}, ...prev]);
      }

      setAttemptsLeft(newAttemptsLeft);

      // Check lose condition
      if (newAttemptsLeft <= 0) {
        setGameStatus('lost');
      }
    } catch (error) {
      console.error('Failed to make guess:', error);
    } finally {
      setIsLoading(false);
    }
  }, [mysteryPokemon, gameStatus, guesses, compareTraits, attemptsLeft, gameMode, generateHint]);

  const makeRegionGuess = useCallback((regionName: string): boolean => {
    if (!mysteryRegion || gameStatus !== 'playing') return false;

    const isCorrect = regionName.toLowerCase() === mysteryRegion.name.toLowerCase();
    const newAttemptsLeft = attemptsLeft - 1;

    // Add guess to region guesses
    setRegionGuesses(prev => [...prev, { region: regionName, correct: isCorrect }]);
    setAttemptsLeft(newAttemptsLeft);

    if (isCorrect) {
      setGameStatus('won');
    } else if (newAttemptsLeft <= 0) {
      setGameStatus('lost');
    }

    return isCorrect;
  }, [mysteryRegion, gameStatus, attemptsLeft]);

  const restartGame = useCallback(() => {
    setGuesses([]);
    setRegionGuesses([]);
    setGameStatus('playing');
    setAttemptsLeft(
      gameMode === 'silhouette' ? MAX_SILHOUETTE_ATTEMPTS : 
      gameMode === 'region' ? MAX_REGION_ATTEMPTS :
      MAX_ATTEMPTS
    );
    setMysteryPokemon(null);
    setMysteryRegion(null);
    setHints([]);
    selectMysteryPokemon();
  }, [selectMysteryPokemon, gameMode]);

  const changeGameMode = useCallback((newMode: GameMode) => {
    setGameMode(newMode);
    setGuesses([]);
    setRegionGuesses([]);
    setGameStatus('playing');
    setAttemptsLeft(
      newMode === 'silhouette' ? MAX_SILHOUETTE_ATTEMPTS : 
      newMode === 'region' ? MAX_REGION_ATTEMPTS :
      MAX_ATTEMPTS
    );
    setMysteryPokemon(null);
    setMysteryRegion(null);
    setHints([]);
    selectMysteryPokemon();
  }, [selectMysteryPokemon]);

  // Initialize game on mount
  useEffect(() => {
    selectMysteryPokemon();
  }, [selectMysteryPokemon]);

  return {
    mysteryPokemon,
    mysteryRegion,
    guesses,
    regionGuesses,
    gameStatus,
    attemptsLeft,
    isLoading,
    makeGuess,
    makeRegionGuess,
    restartGame,
    gameMode,
    changeGameMode,
    hints,
  };
}