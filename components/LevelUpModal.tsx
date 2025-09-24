
import React from 'react';
import { Level } from '../types';
import { SparklesIcon } from './icons';

interface LevelUpModalProps {
  level: Level;
  onClose: () => void;
}

export default function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-purple-300 via-rose-300 to-amber-300 p-8 rounded-3xl shadow-2xl text-center text-white max-w-sm w-full relative transform transition-all duration-500 animate-jump-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white p-4 rounded-full shadow-lg">
            <SparklesIcon className="w-10 h-10 text-amber-500 animate-spin-slow" />
        </div>
        <p className="font-semibold mt-8">LEVEL UP!</p>
        <h2 className="font-display text-4xl my-3">{level.title}</h2>
        <p className="leading-relaxed mb-6">{level.message}</p>
        <button
          onClick={onClose}
          className="bg-white/80 text-purple-600 font-bold py-2 px-6 rounded-full hover:bg-white transition-transform transform hover:scale-105"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}

// Add keyframes for animation in index.html if possible, or rely on Tailwind's defaults.
// For now, let's create a small style tag in the component if needed.
// However, it's better to keep styling consistent with Tailwind.
// Let's add custom animations to tailwind.config.js if we had one.
// Since we don't, we can add a style tag or just use default animations.
// Let's add it to the className.
// Add this to tailwind config:
/*
keyframes: {
  'jump-in': {
    '0%': { transform: 'scale(0.5) translateY(50px)', opacity: '0' },
    '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
  },
},
animation: {
  'jump-in': 'jump-in 0.5s ease-out forwards',
  'spin-slow': 'spin 3s linear infinite',
},
*/
// Since we cannot use tailwind.config.js, we will just rely on simple class names without custom animation.
// A simple fade-in and scale should suffice from default Tailwind.

