import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { translations, getAppYear } from './data/translations';
import { Confetti } from './components/Confetti';
import { SadConfetti } from './components/SadConfetti';
import { BackgroundAnimations } from './components/BackgroundAnimations';
import { GameHeader } from './components/GameHeader';
import PokemonSearch from './components/PokemonSearch';
import ComparisonTable from './components/ComparisonTable';
import { GameResult } from './components/GameResult';
import { MouseFollowPokemon } from './components/MouseFollowPokemon';
import { GameModeSelector } from './components/GameModeSelector';
import { SilhouetteDisplay } from './components/SilhouetteDisplay';
import { HintDisplay } from './components/HintDisplay';
import { RegionGuess } from './components/RegionGuess';
import { useGame } from './hooks/useGame';
import type { PokemonIndexEntry } from './data/pokemonIndex';
import { FusionGuess } from './components/FusionGuess';


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
    hints
  } = useGame();

  // Ref for results section
  const resultsRef = useRef<HTMLDivElement>(null);

  // Scroll to results and show confetti when user wins
  useEffect(() => {
    if (gameStatus === 'won' && resultsRef.current) {
      setTimeout(() => {
        const el = resultsRef.current;
        if (!el) return;
        if (window.innerWidth < 768) {
          el.style.scrollMarginTop = '80px';
          // Wait a bit longer to ensure all traits are rendered
          setTimeout(() => {
            if (!el) return;
            // Check for non-standard scrollIntoViewIfNeeded method (Safari/WebKit)
            const elementWithScrollMethod = el as HTMLElement & { scrollIntoViewIfNeeded?: (centerIfNeeded?: boolean) => void };
            if (typeof elementWithScrollMethod.scrollIntoViewIfNeeded === 'function') {
              elementWithScrollMethod.scrollIntoViewIfNeeded(true);
            } else {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            // Extra scroll after a short delay to ensure visibility if keyboard or overlays are present
            setTimeout(() => {
              const el2 = resultsRef.current;
              if (el2) el2.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 400);
          }, 400);
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
  }, [gameStatus]);

  const handlePokemonSelect = (pokemon: PokemonIndexEntry) => {
    if (gameStatus === 'playing' && !isLoading) {
      makeGuess(pokemon.name);
    }
  };

  // Get current translations
  const t = translations[language];

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900">
      
      {/* Background Effects */}
      <BackgroundAnimations />

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
            t={t}
            restartGame={restartGame}
            gameMode={gameMode}
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
                    <h2 className="text-2xl font-bold mb-2">{t.credits}</h2>
                    <p className="mb-4" style={{ whiteSpace: 'pre-line' }}>{t.creditsText(getAppYear())}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading && !mysteryPokemon && !mysteryRegion && (
            <div className="text-center text-white/60">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full mx-auto mb-4"
              />
              <span className="text-white/60">
                {gameMode === 'region' ? 
                  (language === 'fr' ? 'Chargement de la région...' : 'Loading region...') :
                  t.loading
                }
              </span>
            </div>
          )}

          {(mysteryPokemon || mysteryRegion) && (
            <>
              <GameModeSelector
                currentMode={gameMode}
                onModeChange={changeGameMode}
                language={language}
                disabled={gameStatus === 'playing' && (guesses.length > 0 || hints.length > 0 || regionGuesses.length > 0)}
              />
              
              {gameMode === 'region' && mysteryRegion && (
                <RegionGuess
                  t={t}
                  language={language}
                  attemptsLeft={attemptsLeft}
                  onGuess={makeRegionGuess}
                  mysteryRegion={mysteryRegion}
                  gameStatus={gameStatus}
                  guesses={regionGuesses}
                  onRestart={restartGame}
                />
              )}

              {gameMode === 'fusion' && (
                <FusionGuess
                  t={t}
                  language={language}
                  attemptsLeft={attemptsLeft}
                  restartGame={restartGame}
                />
              )}

              {gameMode === 'silhouette' && mysteryPokemon && (
                <>
                  <SilhouetteDisplay 
                    pokemon={mysteryPokemon}
                    revealed={gameStatus === 'won' || gameStatus === 'lost'}
                  />
                  <HintDisplay hints={hints} language={language} />
                  {/* Sad confetti for lose */}
                  <SadConfetti trigger={gameStatus === 'lost'} />
                </>
              )}

              {/* Only show PokemonSearch for non-fusion and non-region modes */}
              {gameMode !== 'fusion' && gameMode !== 'region' && (
                <div className="mb-8">
                  <PokemonSearch 
                    onPokemonSelect={handlePokemonSelect}
                    disabled={gameStatus !== 'playing' || isLoading}
                    placeholder={
                      gameStatus !== 'playing' ? t.searchPlaceholderOver :
                      isLoading ? t.searchPlaceholderLoading :
                      t.searchPlaceholder
                    }
                    guessed={guesses.map(g => g.pokemon.id)}
                    language={language}
                  />
                </div>
              )}

              {/* Show comparison table only for classic mode or when there are guesses */}
              {(gameMode === 'classic' || guesses.length > 0) && gameMode !== 'region' && (
                <div ref={resultsRef} className="relative">
                  <Confetti trigger={gameStatus === 'won'} />
                  <motion.div
                    layout
                    className="backdrop-blur-lg border rounded-2xl p-6 mb-8 shadow-2xl bg-white/5 border-white/20"
                  >
                    {gameMode === 'classic' ? (
                      <ComparisonTable guesses={guesses} language={language} mysteryPokemon={mysteryPokemon!} />
                    ) : (
                      <div className="text-center">
                        <h3 className="text-white text-lg font-semibold mb-4">
                          {language === 'fr' ? 'Vos tentatives' : 'Your Guesses'}
                        </h3>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {guesses.map((guess) => {
                            const isCorrect = guess.pokemon.id === mysteryPokemon?.id;
                            return (
                              <div key={guess.pokemon.id} className="flex items-center gap-2 bg-white/10 rounded-lg p-2 relative">
                                <img 
                                  src={guess.pokemon.sprite} 
                                  alt={guess.pokemon.name}
                                  className="w-8 h-8"
                                />
                                <span className="text-white text-sm capitalize">{guess.pokemon.name}</span>
                                {isCorrect ? (
                                  <span className="absolute -top-2 -right-2">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <circle cx="16" cy="16" r="15" fill="#fff" fillOpacity="0.8" />
                                      <path d="M10 17 L15 22 L22 10" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" fill="none" />
                                    </svg>
                                  </span>
                                ) : (
                                  <span className="absolute -top-2 -right-2">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <circle cx="16" cy="16" r="15" fill="#fff" fillOpacity="0.8" />
                                      <path d="M10 10 L22 22 M22 10 L10 22" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {gameStatus === 'lost' && (
                          <div className="mt-6 text-center">
                            <span className="text-3xl font-bold text-red-500 drop-shadow-lg">
                              {language === 'fr' ? 'Vous avez perdu !' : 'You lose!'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>
              )}

              {/* Only show GameResult for non-region modes */}
              {gameMode !== 'region' && (
                <GameResult 
                  gameStatus={gameStatus}
                  mysteryPokemon={mysteryPokemon!}
                  attemptsUsed={(gameMode === 'silhouette' ? 4 : 8) - attemptsLeft}
                  onRestart={restartGame}
                  t={t}
                />
              )}

              
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