import { useState, useRef, useEffect } from 'react';
import { Confetti } from './components/Confetti';
// Helper function for demo
function getAppYear() {
  return new Date().getFullYear();
}
import { motion } from 'framer-motion';
import { GameHeader } from './components/GameHeader';
import PokemonSearch from './components/PokemonSearch';
import { ComparisonTable } from './components/ComparisonTable';
import { GameResult } from './components/GameResult';
import { MouseFollowPokemon } from './components/MouseFollowPokemon';
import { useGame } from './hooks/useGame';
import type { PokemonIndexEntry } from './data/pokemonIndex';


function App() {
  // New state for showing credits modal
  const [showCredits, setShowCredits] = useState(false);
  // Language state
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  // Demo: log when credits modal is toggled
  function handleToggleCredits() {
    setShowCredits(v => {
      const next = !v;
      console.log('Credits modal now', next ? 'open' : 'closed');
      return next;
    });
  }
  const { 
    mysteryPokemon, 
    guesses, 
    gameStatus, 
    attemptsLeft, 
    isLoading, 
    makeGuess, 
    restartGame 
  } = useGame();

  // Ref for results section
  const resultsRef = useRef<HTMLDivElement>(null);

  // Scroll to results and show confetti when user wins
  useEffect(() => {
    if (gameStatus === 'won' && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [gameStatus]);

  const handlePokemonSelect = (pokemon: PokemonIndexEntry) => {
    if (gameStatus === 'playing' && !isLoading) {
      makeGuess(pokemon.name);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900">
      
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        {/* Helper function for random sprites */}
        {(() => {
          const getRandomBackgroundSprite = (id: number) => {
            const isShiny = Math.random() < 0.05; // 5% chance for shiny in background
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${isShiny ? 'shiny/' : ''}${id}.png`;
          };
          
          return (
            <>
        {/* Animated Pokemon sprites */}
        <motion.div
          className="absolute top-16 left-16 w-16 h-16 opacity-20"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -30, 50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img src={getRandomBackgroundSprite(25)} alt="Pikachu" className="w-full h-full" />
        </motion.div>
        
        <motion.div
          className="absolute top-32 right-20 w-20 h-20 opacity-15"
          animate={{
            x: [0, -80, 40, 0],
            y: [0, 60, -40, 0],
            rotate: [0, -90, 180, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <img src={getRandomBackgroundSprite(6)} alt="Charizard" className="w-full h-full" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-40 left-20 w-14 h-14 opacity-25"
          animate={{
            x: [0, 70, -30, 0],
            y: [0, -50, 30, 0],
            rotate: [0, 270, 180, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        >
          <img src={getRandomBackgroundSprite(9)} alt="Blastoise" className="w-full h-full" />
        </motion.div>
        
        <motion.div
          className="absolute top-1/2 left-8 w-12 h-12 opacity-20"
          animate={{
            x: [0, 90, -20, 0],
            y: [0, -40, 60, 0],
            rotate: [0, 180, -90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <img src={getRandomBackgroundSprite(3)} alt="Venusaur" className="w-full h-full" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-20 right-32 w-18 h-18 opacity-15"
          animate={{
            x: [0, -60, 80, 0],
            y: [0, 40, -60, 0],
            rotate: [0, -180, 90, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        >
          <img src={getRandomBackgroundSprite(94)} alt="Gengar" className="w-full h-full" />
        </motion.div>
        
        <motion.div
          className="absolute top-20 right-1/3 w-16 h-16 opacity-20"
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 70, -20, 0],
            rotate: [0, 90, -180, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        >
          <img src={getRandomBackgroundSprite(130)} alt="Gyarados" className="w-full h-full" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-32 left-1/2 w-14 h-14 opacity-25"
          animate={{
            x: [0, 40, -70, 0],
            y: [0, -30, 50, 0],
            rotate: [0, -90, 270, 0],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
        >
          <img src={getRandomBackgroundSprite(133)} alt="Eevee" className="w-full h-full" />
        </motion.div>
        
        <motion.div
          className="absolute top-1/3 right-16 w-12 h-12 opacity-15"
          animate={{
            x: [0, -80, 20, 0],
            y: [0, 50, -80, 0],
            rotate: [0, 180, -270, 0],
          }}
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 7
          }}
        >
          <img src={getRandomBackgroundSprite(150)} alt="Mewtwo" className="w-full h-full" />
        </motion.div>
            </>
          );
        })()}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <GameHeader 
            attemptsLeft={attemptsLeft} 
            gameStatus={gameStatus} 
            onInfoClick={handleToggleCredits}
            language={language}
            onLanguageChange={(lang: string) => setLanguage(lang as 'en' | 'fr')}
          />

          {/* Info button is now in the header. */}
          {showCredits && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="max-w-md w-full animate-fade-in">
                <div className="relative">
                  <button
                    className="absolute top-2 right-2 text-gray-300 hover:text-white text-xl z-10"
                    onClick={handleToggleCredits}
                    aria-label="Close credits"
                  >×</button>
                </div>
                <div className="mt-2">
                  <div className="rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-bold mb-2">Credits</h2>
                    <p className="mb-4">PokemonDLE by Potowai, {getAppYear()}<br/>MIT License</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading && !mysteryPokemon && (
            <div className="text-center text-white/60">
              <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full mx-auto mb-4"
              />
              <span className="text-white/60">
          Loading mystery Pokémon...
              </span>
            </div>
          )}

          {mysteryPokemon && (
            <>
              <div className="mb-8">
          <PokemonSearch 
            onPokemonSelect={handlePokemonSelect}
            disabled={gameStatus !== 'playing' || isLoading}
            placeholder={
              gameStatus !== 'playing' ? 
              (language === 'fr' ? "Partie terminée" : "Game Over") : 
              isLoading ? 
              (language === 'fr' ? "Chargement..." : "Loading...") : 
              (language === 'fr' ? "Rechercher un Pokémon..." : "Search for a Pokémon...")
            }
            guessed={guesses.map(g => g.pokemon.id)}
            language={language}
          />
              </div>


              {/* Confetti and scroll target for results */}
              <div ref={resultsRef} className="relative">
          <Confetti trigger={gameStatus === 'won'} />
          <motion.div
            layout
            className="backdrop-blur-lg border rounded-2xl p-6 mb-8 shadow-2xl bg-white/5 border-white/20"
          >
            <ComparisonTable guesses={guesses} />
          </motion.div>
              </div>

              <GameResult 
          gameStatus={gameStatus}
          mysteryPokemon={mysteryPokemon}
          attemptsUsed={8 - attemptsLeft}
          onRestart={restartGame}
              />
            </>
          )}
        </motion.div>
      </div>

      {/* Static decorative elements for additional depth */}
      <div className="fixed top-10 left-10 w-20 h-20 bg-blue-500/3 rounded-full blur-2xl"></div>
      <div className="fixed bottom-20 right-20 w-32 h-32 bg-purple-500/3 rounded-full blur-2xl"></div>
      <div className="fixed top-1/2 right-10 w-16 h-16 bg-pink-500/3 rounded-full blur-2xl"></div>
      
      {/* Mouse following Pokemon (desktop only) */}
      {/* Hide on mobile using a media query check */}
      {typeof window === 'undefined' || window.matchMedia('(pointer: fine)').matches ? <MouseFollowPokemon /> : null}
    </div>
  );
}

export default App;