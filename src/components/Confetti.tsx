import React, { useEffect } from 'react';

// Simple confetti animation using CSS and a few divs
const COLORS = ['#FFD700', '#FF69B4', '#00CFFF', '#7CFC00', '#FF6347', '#FFB347'];
const NUM_CONFETTI = 32;

function randomBetween(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

export const Confetti: React.FC<{ trigger: boolean }> = ({ trigger }) => {
  useEffect(() => {
    // Optionally, could reset animation here if needed
  }, [trigger]);

  if (!trigger) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {Array.from({ length: NUM_CONFETTI }).map((_, i) => {
        const left = i % 2 === 0 ? '-40px' : 'calc(100% + 40px)';
        const anim = i % 2 === 0 ? 'confetti-left' : 'confetti-right';
        const color = COLORS[i % COLORS.length];
        const delay = randomBetween(0, 0.7).toFixed(2);
        const style = {
          left,
          top: `${randomBetween(10, 80)}%`,
          background: color,
          animationDelay: `${delay}s`,
        } as React.CSSProperties;
        return (
          <div
            key={i}
            className={`w-3 h-3 rounded-full absolute animate-${anim}`}
            style={style}
          />
        );
      })}
    </div>
  );
};

// Add this to your global CSS (e.g., index.css):
// @keyframes confetti-left {
//   0% { transform: translateX(0) scale(1); opacity: 1; }
//   80% { opacity: 1; }
//   100% { transform: translateX(120vw) scale(0.7); opacity: 0; }
// }
// @keyframes confetti-right {
//   0% { transform: translateX(0) scale(1); opacity: 1; }
//   80% { opacity: 1; }
//   100% { transform: translateX(-120vw) scale(0.7); opacity: 0; }
// }
// .animate-confetti-left { animation: confetti-left 1.6s cubic-bezier(.6,.1,.4,1) forwards; }
// .animate-confetti-right { animation: confetti-right 1.6s cubic-bezier(.6,.1,.4,1) forwards; }
