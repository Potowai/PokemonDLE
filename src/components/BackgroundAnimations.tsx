import { motion } from 'framer-motion';
import { BACKGROUND_POKEMON_IDS } from '../constants/gameConstants';
import { getRandomBackgroundSprite } from '../utils/randomPokemon';

interface AnimatedSpriteProps {
  pokemonId: number;
  className: string;
  duration: number;
  delay?: number;
  animations: {
    x: number[];
    y: number[];
    rotate: number[];
  };
}

const AnimatedSprite = ({ pokemonId, className, duration, delay = 0, animations }: AnimatedSpriteProps) => (
  <motion.div
    className={className}
    animate={animations}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
  >
    <img 
      src={getRandomBackgroundSprite(pokemonId)} 
      alt={`Pokemon ${pokemonId}`} 
      className="w-full h-full" 
    />
  </motion.div>
);

export const BackgroundAnimations = () => {
  return (
    <div className="absolute inset-0">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      {/* Animated Pokemon sprites */}
      <AnimatedSprite
        pokemonId={BACKGROUND_POKEMON_IDS[0]} // Pikachu
        className="absolute top-16 left-16 w-16 h-16 opacity-20"
        duration={15}
        animations={{
          x: [0, 100, -50, 0],
          y: [0, -30, 50, 0],
          rotate: [0, 180, 360],
        }}
      />
      
      <AnimatedSprite
        pokemonId={BACKGROUND_POKEMON_IDS[1]} // Charizard
        className="absolute top-32 right-20 w-20 h-20 opacity-15"
        duration={18}
        delay={2}
        animations={{
          x: [0, -80, 40, 0],
          y: [0, 60, -40, 0],
          rotate: [0, -90, 180, 0],
        }}
      />
      
      <AnimatedSprite
        pokemonId={BACKGROUND_POKEMON_IDS[2]} // Blastoise
        className="absolute bottom-40 left-20 w-14 h-14 opacity-25"
        duration={12}
        delay={4}
        animations={{
          x: [0, 70, -30, 0],
          y: [0, -50, 30, 0],
          rotate: [0, 270, 180, 0],
        }}
      />
      
      <AnimatedSprite
        pokemonId={BACKGROUND_POKEMON_IDS[3]} // Venusaur
        className="absolute top-1/2 left-8 w-12 h-12 opacity-20"
        duration={20}
        delay={1}
        animations={{
          x: [0, 90, -20, 0],
          y: [0, -40, 60, 0],
          rotate: [0, 180, -90, 0],
        }}
      />
      
      <AnimatedSprite
        pokemonId={BACKGROUND_POKEMON_IDS[4]} // Gengar
        className="absolute bottom-20 right-32 w-18 h-18 opacity-15"
        duration={16}
        delay={3}
        animations={{
          x: [0, -60, 80, 0],
          y: [0, 40, -60, 0],
          rotate: [0, -180, 90, 0],
        }}
      />
      
      <AnimatedSprite
        pokemonId={BACKGROUND_POKEMON_IDS[5]} // Gyarados
        className="absolute top-20 right-1/3 w-16 h-16 opacity-20"
        duration={14}
        delay={5}
        animations={{
          x: [0, -50, 30, 0],
          y: [0, 70, -20, 0],
          rotate: [0, 90, -180, 0],
        }}
      />
      
      <AnimatedSprite
        pokemonId={BACKGROUND_POKEMON_IDS[6]} // Eevee
        className="absolute bottom-32 left-1/2 w-14 h-14 opacity-25"
        duration={13}
        delay={6}
        animations={{
          x: [0, 40, -70, 0],
          y: [0, -30, 50, 0],
          rotate: [0, -90, 270, 0],
        }}
      />
      
      <AnimatedSprite
        pokemonId={BACKGROUND_POKEMON_IDS[7]} // Mewtwo
        className="absolute top-1/3 right-16 w-12 h-12 opacity-15"
        duration={17}
        delay={7}
        animations={{
          x: [0, -80, 20, 0],
          y: [0, 50, -80, 0],
          rotate: [0, 180, -270, 0],
        }}
      />
    </div>
  );
};