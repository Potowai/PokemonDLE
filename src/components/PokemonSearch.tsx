import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  KeyboardEvent as ReactKeyboardEvent,
  useId,
} from 'react';
import Fuse from 'fuse.js';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Input } from './ui/input';
import { pokemonIndex, type PokemonIndexEntry } from '../data/pokemonIndex';
import { pokemonNamesFr } from '../data/pokemonNames.fr';

/** Component props */
export interface PokemonSearchProps {
  onPokemonSelect: (pokemon: PokemonIndexEntry) => void;
  disabled?: boolean;
  placeholder?: string;
  limit?: number;                 // how many results to show
  guessed?: Array<number | string>; // ids or names already chosen
  language?: 'en' | 'fr';
}

/** Utility: get display name by language */
const getDisplayName = (p: PokemonIndexEntry, lang: 'en' | 'fr') => {
  if (lang === 'fr') return pokemonNamesFr[p.id] || p.name;
  return p.name;
};

/** Build a searchable collection that includes FR names so Fuse can match them too */
const makeSearchCollection = (lang: 'en' | 'fr') =>
  pokemonIndex.map((p) => ({
    ...p,
    altName: pokemonNamesFr[p.id] || '',
    // Optionally normalise diacritics here if needed
  }));

function PokemonSearch({
  onPokemonSelect,
  disabled = false,
  placeholder = 'Search for a Pokémon...',
  limit = 8,
  guessed = [],
  language = 'en',
}: PokemonSearchProps) {
  // -------------------- State --------------------
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PokemonIndexEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  // -------------------- Refs ---------------------
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId(); // React 18 id helper

  // -------------------- Data / Fuse --------------
  const searchedCollection = useMemo(() => makeSearchCollection(language), [language]);

  const fuse = useMemo(() => {
    return new Fuse(searchedCollection, {
      keys: language === 'fr' ? ['altName', 'name'] : ['name', 'altName'],
      threshold: 0.4,
      includeScore: true,
      ignoreLocation: true,
    });
  }, [searchedCollection, language]);

  // Convert guessed array into a Set for fast lookup (case-insensitive for names)
  const guessedSet = useMemo(() => {
    const s = new Set<string | number>();
    guessed.forEach((g) => {
      if (typeof g === 'string') s.add(g.toLowerCase());
      else s.add(g);
    });
    return s;
  }, [guessed]);

  // -------------------- Effects ------------------
  // Global keydown to auto-focus when user types a letter outside inputs
  useEffect(() => {
    function handleGlobalKeydown(e: KeyboardEvent) {
      const active = document.activeElement as HTMLElement | null;
      const isInputLike = !!active && (
        active.tagName === 'INPUT' ||
        active.tagName === 'TEXTAREA' ||
        active.tagName === 'SELECT' ||
        active.isContentEditable
      );
      if (!isInputLike && /^[a-zA-Z]$/.test(e.key)) {
        inputRef.current?.focus();
        setQuery(e.key);
        setIsOpen(true);
        e.preventDefault();
      }
    }

    window.addEventListener('keydown', handleGlobalKeydown);
    return () => window.removeEventListener('keydown', handleGlobalKeydown);
  }, []);

  // Run search whenever query changes
  useEffect(() => {
    if (query.trim()) {
      const rawResults = fuse.search(query, { limit: limit + guessed.length }).map((r) => r.item);
      // Filter out already guessed Pokémon (by id, english name, or french name)
      const filtered = rawResults.filter((p) => {
        if (guessedSet.has(p.id)) return false;
        if (guessedSet.has(p.name.toLowerCase())) return false;
        const frName = pokemonNamesFr[p.id]?.toLowerCase();
        if (frName && guessedSet.has(frName)) return false;
        return true;
      });

      const sliced = filtered.slice(0, limit);
      setResults(sliced);
      setHighlighted(sliced.length ? 0 : -1);
      setIsOpen(true);
    } else {
      setResults([]);
      setHighlighted(-1);
      setIsOpen(false);
    }
  }, [query, fuse, limit, guessed.length, guessedSet]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHighlighted(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // -------------------- Handlers -----------------
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
        break;
      case 'Enter':
        if (highlighted >= 0 && results[highlighted]) {
          e.preventDefault();
          select(results[highlighted]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlighted(-1);
        break;
    }
  };

  const select = (pokemon: PokemonIndexEntry) => {
    onPokemonSelect(pokemon);
    setQuery('');
    setIsOpen(false);
    setHighlighted(-1);
    inputRef.current?.blur();
  };

  // -------------------- Render -------------------
  return (
    <div ref={rootRef} className="relative w-full max-w-md mx-auto">
      <div
        className="relative"
        role="combobox"
        aria-expanded={isOpen}
        aria-owns={listboxId}
        aria-haspopup="listbox"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5 pointer-events-none z-10 drop-shadow" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={highlighted >= 0 ? `${listboxId}-item-${highlighted}` : undefined}
          className="pl-10"
          disabled={disabled}
        />
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.ul
            id={listboxId}
            role="listbox"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="absolute z-50 w-full mt-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl overflow-hidden max-h-80 overflow-y-auto"
          >
            {results.map((pokemon, index) => {
              const isActive = index === highlighted;
              return (
                <motion.li
                  key={pokemon.id}
                  id={`${listboxId}-item-${index}`}
                  role="option"
                  aria-selected={isActive}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer hover:bg-white/10 ${
                    isActive ? 'bg-white/10' : ''
                  }`}
                  onMouseEnter={() => setHighlighted(index)}
                  onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                  onClick={() => select(pokemon)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img
                    src={pokemon.sprite}
                    alt={getDisplayName(pokemon, language)}
                    className="w-8 h-8 flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="text-left">
                    <div className="font-medium text-white capitalize">
                      {getDisplayName(pokemon, language)}
                    </div>
                    <div className="text-xs text-white/60">
                      #{pokemon.id.toString().padStart(3, '0')}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PokemonSearch;
