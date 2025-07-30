import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, MapPin } from 'lucide-react';
import type { Region } from '../types/pokemon';
import type { Translation } from '../data/translations';
import { regionsData, searchRegions } from '../data/regionData';

interface RegionGuessProps {
  t: Translation;
  language: 'en' | 'fr';
  attemptsLeft: number;
  onGuess: (regionName: string) => boolean;
  mysteryRegion: Region | null;
  gameStatus: 'playing' | 'won' | 'lost';
  guesses: { region: string; correct: boolean }[];
  onRestart: () => void;
}

export function RegionGuess({ 
  t, 
  language, 
  attemptsLeft, 
  onGuess, 
  mysteryRegion, 
  gameStatus, 
  guesses,
  onRestart 
}: RegionGuessProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Region[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = searchRegions(inputValue);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [inputValue]);

  const handleSubmit = (regionName: string) => {
    if (gameStatus !== 'playing' || !regionName.trim()) return;

    const isCorrect = onGuess(regionName.trim());
    
    if (isCorrect) {
      setFeedback(`${t.correctRegion} ${regionName}!`);
    } else {
      setFeedback(t.wrongRegion);
    }

    setInputValue('');
    setShowSuggestions(false);
    setSelectedIndex(-1);

    // Clear feedback after 3 seconds
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSubmit(inputValue);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSubmit(suggestions[selectedIndex].name);
        } else {
          handleSubmit(inputValue);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (region: Region) => {
    handleSubmit(region.name);
  };

  if (!mysteryRegion) {
    return (
      <div className="text-center text-white/60">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full mx-auto mb-4"
        />
        <span className="text-white/60">Loading region...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Region Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 text-center"
      >
        <div className="relative inline-block">
          <img
            src={mysteryRegion.image}
            alt={gameStatus === 'won' || gameStatus === 'lost' ? mysteryRegion.name : 'Mystery Region'}
            className="max-w-full h-auto max-h-80 rounded-lg shadow-lg border border-white/20"
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              e.currentTarget.src = `https://via.placeholder.com/400x300/374151/9CA3AF?text=${mysteryRegion.name}`;
            }}
          />
          {gameStatus === 'playing' && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 rounded-lg" />
          )}
        </div>
      </motion.div>

      {/* Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <MapPin className="w-6 h-6" />
          {t.regionPrompt}
        </h2>
        <p className="text-white/70">
          {language === 'fr' ? 'Entrez le nom de la région ci-dessous' : 'Enter the region name below'}
        </p>
      </motion.div>

      {/* Input Field */}
      {gameStatus === 'playing' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 relative"
        >
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.enterRegionName}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              autoFocus
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {suggestions.map((region, index) => (
                  <button
                    key={region.id}
                    onClick={() => handleSuggestionClick(region)}
                    className={`w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors ${
                      index === selectedIndex ? 'bg-white/15' : ''
                    }`}
                  >
                    <div className="font-medium">{region.name}</div>
                    <div className="text-sm text-white/60">Generation {region.generation}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Feedback */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`mb-6 p-4 rounded-lg text-center ${
            feedback.includes(t.correctRegion) 
              ? 'bg-green-500/20 border border-green-500/40 text-green-200' 
              : 'bg-red-500/20 border border-red-500/40 text-red-200'
          }`}
        >
          {feedback}
        </motion.div>
      )}

      {/* Previous Guesses */}
      {guesses.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h3 className="text-white text-lg font-semibold mb-3 text-center">
            {language === 'fr' ? 'Vos tentatives' : 'Your Guesses'}
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {guesses.map((guess, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  guess.correct
                    ? 'bg-green-500/20 border border-green-500/40'
                    : 'bg-red-500/20 border border-red-500/40'
                }`}
              >
                <span className="text-white text-sm capitalize">{guess.region}</span>
                {guess.correct ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Game Over */}
      {gameStatus !== 'playing' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className={`p-6 rounded-lg border ${
            gameStatus === 'won'
              ? 'bg-green-500/20 border-green-500/40'
              : 'bg-red-500/20 border-red-500/40'
          }`}>
            <h3 className={`text-2xl font-bold mb-2 ${
              gameStatus === 'won' ? 'text-green-200' : 'text-red-200'
            }`}>
              {gameStatus === 'won' 
                ? (language === 'fr' ? 'Félicitations !' : 'Congratulations!')
                : t.gameOver
              }
            </h3>
            <p className="text-white/80 mb-4">
              {t.theRegionWas} <strong>{mysteryRegion.name}</strong>
            </p>
            {mysteryRegion.description && (
              <p className="text-white/60 text-sm mb-4 italic">
                {mysteryRegion.description}
              </p>
            )}
            <button
              onClick={onRestart}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              {t.playAgain}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}