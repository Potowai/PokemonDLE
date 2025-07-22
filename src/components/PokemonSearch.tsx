import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Fuse from 'fuse.js';
import { Input } from './ui/input';
import { pokemonIndex, type PokemonIndexEntry } from '../data/pokemonIndex';
import { motion, AnimatePresence } from 'framer-motion';

interface PokemonSearchProps {
  onPokemonSelect: (pokemon: PokemonIndexEntry) => void;
  disabled?: boolean;
  placeholder?: string;
}

const fuseOptions = {
  keys: ['name'],
  threshold: 0.4,
  includeScore: true,
};

const fuse = new Fuse(pokemonIndex, fuseOptions);

export function PokemonSearch({ onPokemonSelect, disabled = false, placeholder = "Search for a Pokémon..." }: PokemonSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PokemonIndexEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = fuse.search(query, { limit: 8 });
      setResults(searchResults.map(result => result.item));
      setSelectedIndex(-1);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelect = (pokemon: PokemonIndexEntry) => {
    onPokemonSelect(pokemon);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 z-10 pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          className="pl-10"
          disabled={disabled}
        />
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl overflow-hidden"
          >
            {results.map((pokemon, index) => (
              <motion.button
                key={pokemon.id}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 dark:hover:bg-white/10 transition-colors ${
                  index === selectedIndex ? 'bg-white/10 dark:bg-white/10' : ''
                }`}
                onClick={() => handleSelect(pokemon)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="w-8 h-8 flex-shrink-0"
                  loading="lazy"
                />
                <div className="text-left">
                  <div className="font-medium text-white capitalize">
                    {pokemon.name}
                  </div>
                  <div className="text-xs text-white/60 dark:text-white/60">
                    #{pokemon.id.toString().padStart(3, '0')} • Gen {pokemon.generation}
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}