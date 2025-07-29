export interface Translation {
  guessPrompt: string;
  silhouettePrompt: string;
  attemptsLeft: (n: number) => string;
  loading: string;
  credits: string;
  creditsText: (year: number) => string;
  gameOver: string;
  finished: string;
  searchPlaceholder: string;
  searchPlaceholderLoading: string;
  searchPlaceholderOver: string;
  playAgain: string;
  share: string;
  mysteryWas: string;
  generation: string;
  type: string;
  color: string;
  evolution: string;
  stage1: string;
  stage2: string;
  stage3: string;
  habitat: string;
  unknown: string;
  heightWeight: string;
  fusionGuess: string;
  correctParts: string;
  wrongParts: string;
  part: string;
  noGuesses: string;
  yourGuess: string;
  checkGuess: string;
  swapParts: string;
  resetPuzzle: string;
  giveUp: string;
  solution: string;
  tryAgain: string;
}

export const translations: Record<'en' | 'fr', Translation> = {
  en: {
    guessPrompt: 'Guess the mystery Pokémon from Gen 1-5!',
    silhouettePrompt: "Who's that Pokémon? Guess from the silhouette!",
    attemptsLeft: (n: number) => `${n} attempts left`,
    loading: 'Loading mystery Pokémon...',
    credits: 'Credits',
    creditsText: (year: number) => `PokemonDLE by Potowai, ${year}\nMIT License`,
    gameOver: 'Game Over',
    finished: 'Game Over',
    searchPlaceholder: 'Search for a Pokémon...',
    searchPlaceholderLoading: 'Loading...',
    searchPlaceholderOver: 'Game Over',
    playAgain: 'Play Again',
    share: 'Share',
    mysteryWas: 'The mystery Pokémon was:',
    generation: 'Generation',
    type: 'Type',
    color: 'Color',
    evolution: 'Evolution',
    stage1: '1st Stage',
    stage2: '2nd Stage',
    stage3: '3rd Stage',
    habitat: 'Habitat',
    unknown: 'Unknown',
    heightWeight: 'Height / Weight',
    fusionGuess: 'Guess the Fusion!',
    correctParts: 'Correct Parts',
    wrongParts: 'Wrong Parts',
    part: 'Part',
    noGuesses: 'No guesses yet.',
    yourGuess: 'Your Guess',
    checkGuess: 'Check Guess',
    swapParts: 'Swap Parts',
    resetPuzzle: 'Reset Puzzle',
    giveUp: 'Give Up',
    solution: 'The solution is:',
    tryAgain: 'Try Again',
  },
  fr: {
    guessPrompt: 'Devinez le Pokémon mystère de la Gén 1-5 !',
    silhouettePrompt: 'Qui est ce Pokémon ? Devinez depuis la silhouette !',
    attemptsLeft: (n: number) => `${n} essais restants`,
    loading: 'Chargement du Pokémon mystère...',
    credits: 'Crédits',
    creditsText: (year: number) => `PokemonDLE par Potowai, ${year}\nLicence MIT`,
    gameOver: 'Partie terminée',
    finished: 'Partie terminée',
    searchPlaceholder: 'Rechercher un Pokémon...',
    searchPlaceholderLoading: 'Chargement...',
    searchPlaceholderOver: 'Partie terminée',
    playAgain: 'Rejouer',
    share: 'Partager',
    mysteryWas: 'Le Pokémon mystère était :',
    generation: 'Génération',
    type: 'Type',
    color: 'Couleur',
    evolution: 'Évolution',
    stage1: '1ère étape',
    stage2: '2ème étape',
    stage3: '3ème étape',
    habitat: 'Habitat',
    unknown: 'Inconnu',
    heightWeight: 'Taille / Poids',
    fusionGuess: 'Devinez la Fusion !',
    correctParts: 'Parts Correctes',
    wrongParts: 'Parts Incorrectes',
    part: 'Partie',
    noGuesses: 'Pas encore de suppositions.',
    yourGuess: 'Votre Supposition',
    checkGuess: 'Vérifier la Supposition',
    swapParts: 'Échanger les Parties',
    resetPuzzle: 'Réinitialiser le Puzzle',
    giveUp: 'Abandonner',
    solution: 'La solution est :',
    tryAgain: 'Réessayer',
  }
};

export const getAppYear = (): number => new Date().getFullYear();