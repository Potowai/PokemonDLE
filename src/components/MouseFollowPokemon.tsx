import React, { useState, useEffect, useRef } from 'react';

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
  const [randomSprite] = useState(() => getRandomSprite());
  const imgRef = useRef<HTMLImageElement>(null);
  const positionRef = useRef({ x: -9999, y: -9999 });
  const targetRef = useRef({ x: 0, y: 0 });
  const animationIdRef = useRef<number>();

  // Configuration options
  const CONFIG = {
    smooth: true,
    lerpFactor: 0.100, // Lower value for more lag/inertia
    offsetX: 0,
    offsetY: 0
  };

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX + CONFIG.offsetX;
      targetRef.current.y = e.clientY + CONFIG.offsetY;

      if (!CONFIG.smooth && imgRef.current) {
        // Snap version: move directly
        imgRef.current.style.left = targetRef.current.x + 'px';
        imgRef.current.style.top = targetRef.current.y + 'px';
      }
    };

    const tick = () => {
      if (CONFIG.smooth && imgRef.current) {
        positionRef.current.x = lerp(positionRef.current.x, targetRef.current.x, CONFIG.lerpFactor);
        positionRef.current.y = lerp(positionRef.current.y, targetRef.current.y, CONFIG.lerpFactor);

        imgRef.current.style.left = positionRef.current.x + 'px';
        imgRef.current.style.top = positionRef.current.y + 'px';
      }
      animationIdRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove);
    tick();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [CONFIG.smooth, CONFIG.lerpFactor, CONFIG.offsetX, CONFIG.offsetY]);

  // Floating animation keyframes as a style tag
  // This is safe in React and will only be injected once per mount
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float {
        0% { transform: translate(-50%, calc(-50% + 24px)) translateY(0px); }
        50% { transform: translate(-50%, calc(-50% + 24px)) translateY(-12px); }
        100% { transform: translate(-50%, calc(-50% + 24px)) translateY(0px); }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <img
      ref={imgRef}
      src={randomSprite}
      alt="Following Pokemon"
      style={{
        position: 'fixed',
        width: '100px',
        height: '100px',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 50,
        transform: 'translate(-50%, calc(-50% + 24px))',
        willChange: 'left, top',
        opacity: 0.8,
        filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.25))',
        animation: 'float 2.2s ease-in-out infinite',
        transition: 'filter 0.2s',
      }}
    />
  );
}