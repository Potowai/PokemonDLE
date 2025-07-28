import React, { useEffect } from 'react';

// Sad confetti animation using blue/gray colors and downward motion
const SAD_COLORS = ['#6B7280', '#60A5FA', '#A7F3D0', '#F87171', '#64748B', '#CBD5E1'];
const NUM_CONFETTI = 32;

function randomBetween(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

export const SadConfetti: React.FC<{ trigger: boolean }> = ({ trigger }) => {
  useEffect(() => {
    // Optionally, could reset animation here if needed
  }, [trigger]);

  if (!trigger) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {Array.from({ length: NUM_CONFETTI }).map((_, i) => {
        const left = `${randomBetween(5, 95)}%`;
        const color = SAD_COLORS[i % SAD_COLORS.length];
        const delay = randomBetween(0, 0.7).toFixed(2);
        const style = {
          left,
          top: '-40px',
          background: color,
          animationDelay: `${delay}s`,
        } as React.CSSProperties;
        return (
          <div
            key={i}
            className="w-3 h-3 rounded-full absolute animate-sad-confetti"
            style={style}
          />
        );
      })}
    </div>
  );
};

// Add this to your global CSS (e.g., index.css):
// @keyframes sad-confetti {
//   0% { transform: translateY(0) scale(1); opacity: 1; }
//   80% { opacity: 1; }
//   100% { transform: translateY(80vh) scale(0.7); opacity: 0; }
// }
// .animate-sad-confetti { animation: sad-confetti 1.6s cubic-bezier(.6,.1,.4,1) forwards; }
