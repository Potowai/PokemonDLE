import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const pokemonSprites = [
  { id: 25, name: "Pikachu" },
  { id: 6, name: "Charizard" },
  { id: 9, name: "Blastoise" },
  { id: 3, name: "Venusaur" },
  { id: 94, name: "Gengar" },
  { id: 130, name: "Gyarados" },
  { id: 133, name: "Eevee" },
  { id: 150, name: "Mewtwo" },
  { id: 131, name: "Lapras" },
  { id: 132, name: "Ditto" },
];

const getRandomSprite = () => {
  const pokemon = pokemonSprites[Math.floor(Math.random() * pokemonSprites.length)];
  const isShiny = Math.random() < 0.5; // 50% chance for shiny
  const spriteType = isShiny ? 'shiny' : '';
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spriteType}${spriteType ? '/' : ''}${pokemon.id}.png`;
  return spriteUrl;
};

export function MouseFollowPokemon() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [randomSprite] = useState(() => getRandomSprite());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed pointer-events-none z-20 w-12 h-12"
      animate={{
        x: mousePosition.x - 6, // Much closer to cursor
        y: mousePosition.y ,
      }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 100,
        mass: 0.8,
      }}
      style={{
        opacity: 0.6,
      }}
    >
      <motion.img
        src={randomSprite}
        alt="Following Pokemon"
        className="w-full h-full"
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}