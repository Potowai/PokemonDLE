import PokemonSearch from './PokemonSearch';
import { pokemonNamesFrGen1 } from '../data/pokemonNames.fr.gen1';
import { pokemonIndexGen1 } from '../data/pokemonIndex.gen1';
import { useFusionGame } from '../hooks/useFusionGame';
import { getFusionImageUrl, isPokemonInFusion } from '../utils/fusion';
import type { Translation } from '../data/translations';

interface FusionGuessProps {
  t: Translation;
  language: 'en' | 'fr';
  attemptsLeft: number;
  restartGame: () => void;
}

export function FusionGuess({ t, language, attemptsLeft, restartGame }: FusionGuessProps) {
  const fusionGame = useFusionGame(attemptsLeft, restartGame);
  const { fusionIds, guesses, status, showAnswer, guessHistory, setGuess, submitGuess, restart } = fusionGame;

  const fusionImgUrl = getFusionImageUrl(fusionIds[0], fusionIds[1]);
  const answerNamesEn = [
    pokemonIndexGen1.find(p => p.id === fusionIds[0])?.name,
    pokemonIndexGen1.find(p => p.id === fusionIds[1])?.name
  ];
  const answerNamesFr = [pokemonNamesFrGen1[fusionIds[0]], pokemonNamesFrGen1[fusionIds[1]]];

  function handleGuessSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submitGuess();
  }

  function handleSelect(idx: 0 | 1, pokemon: { id: number; name: string }) {
    setGuess(idx, pokemon);
  }

  return (
    <div className="max-w-md mx-auto text-center py-8">
      <h2 className="text-2xl font-bold mb-4 text-white">{t.fusionPrompt || 'Guess the Pokémon Fusion!'}</h2>
      <img src={fusionImgUrl} alt="Pokémon Fusion" className="mx-auto mb-6 w-48 h-48 bg-white/10 rounded-xl border border-white/20" />
      <form onSubmit={handleGuessSubmit} className="flex flex-col gap-6 items-center mb-4">
        <div className="flex gap-6 justify-center">
          <div className="relative w-48">
            <PokemonSearch
              onPokemonSelect={p => handleSelect(0, p)}
              disabled={status !== 'playing'}
              placeholder={t.fusionGuess1 ?? (language === 'fr' ? 'Premier Pokémon' : 'First Pokémon')}
              language={language}
              limit={12}
              guessed={guesses.filter(Boolean).map(g => g!.id)}
              pokemonList={pokemonIndexGen1}
            />
            {guesses[0] && (
              <div className="flex flex-col items-center mt-2">
                <img src={pokemonIndexGen1.find(p => p.id === guesses[0]?.id)?.sprite} alt={guesses[0]?.name} className="w-12 h-12" />
              </div>
            )}
            {guesses[0] && status !== 'playing' && !isPokemonInFusion(guesses[0].id, fusionIds) && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="15" fill="#fff" fillOpacity="0.8" />
                  <path d="M10 10 L22 22 M22 10 L10 22" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            )}
          </div>
          <div className="relative w-48">
            <PokemonSearch
              onPokemonSelect={p => handleSelect(1, p)}
              disabled={status !== 'playing'}
              placeholder={t.fusionGuess2 ?? (language === 'fr' ? 'Deuxième Pokémon' : 'Second Pokémon')}
              language={language}
              limit={12}
              guessed={guesses.filter(Boolean).map(g => g!.id).concat(guesses[0]?.id ? [guesses[0].id] : [])}
              pokemonList={pokemonIndexGen1.filter(p => guesses[0] ? p.id !== guesses[0].id : true)}
            />
            {guesses[1] && (
              <div className="flex flex-col items-center mt-2">
                <img src={pokemonIndexGen1.find(p => p.id === guesses[1]?.id)?.sprite} alt={guesses[1]?.name} className="w-12 h-12" />
              </div>
            )}
            {guesses[1] && status !== 'playing' && !isPokemonInFusion(guesses[1].id, fusionIds) && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="15" fill="#fff" fillOpacity="0.8" />
                  <path d="M10 10 L22 22 M22 10 L10 22" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="mt-2 px-6 py-2 rounded-lg bg-blue-500 text-white font-bold shadow hover:bg-blue-600 transition"
          disabled={status !== 'playing' || attemptsLeft <= 0}
        >{t.fusionSubmit || 'Guess'}</button>
      </form>
      {/* Guess history below inputs */}
      {guessHistory.length > 0 && (
        <div className="flex flex-col gap-2 items-center mt-4">
          {guessHistory.map((pair, i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                {pair[0] && (
                  <span className="px-2 py-1 rounded bg-white/10 text-white text-sm font-medium border border-white/20">
                    {pair[0].name}
                  </span>
                )}
                {pair[0] && !isPokemonInFusion(pair[0].id, fusionIds) && (
                  <span className="text-red-500 text-xl font-bold">✗</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {pair[1] && (
                  <span className="px-2 py-1 rounded bg-white/10 text-white text-sm font-medium border border-white/20">
                    {pair[1].name}
                  </span>
                )}
                {pair[1] && !isPokemonInFusion(pair[1].id, fusionIds) && (
                  <span className="text-red-500 text-xl font-bold">✗</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mb-4 text-white/80">
        {status === 'playing' && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
            <span className="font-semibold text-white">{t.attemptsLeft ? t.attemptsLeft(attemptsLeft) : `${attemptsLeft} attempts left`}</span>
          </div>
        )}
        {status === 'won' && <span className="text-green-400 font-bold">{t.fusionWin || 'Correct! You found both Pokémon!'}</span>}
        {status === 'lost' && <span className="text-red-400 font-bold">{t.fusionLose || 'You lose! The fusion was:'}</span>}
      </div>
      {showAnswer && (
        <div className="mt-4 text-white">
          <div className="font-bold">
            {answerNamesEn[0]} & {answerNamesEn[1]}
            <br />
            <span className="text-sm text-white/70">({answerNamesFr[0]} & {answerNamesFr[1]})</span>
          </div>
          <button onClick={restart} className="mt-4 px-6 py-2 rounded-lg bg-blue-500 text-white font-bold shadow hover:bg-blue-600 transition">{t.playAgain || 'Play Again'}</button>
        </div>
      )}
    </div>
  );
}
