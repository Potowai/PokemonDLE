import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Zap } from 'lucide-react';
import type { SilhouetteHint } from '../types/pokemon';

interface HintDisplayProps {
  hints: SilhouetteHint[];
  language: 'en' | 'fr';
}

export function HintDisplay({ hints, language }: HintDisplayProps) {
  if (hints.length === 0) {
    return null;
  }

  const getHintIcon = (type: string) => {
    switch (type) {
      case 'type':
        return <Zap className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  const formatHintLabel = (hint: SilhouetteHint) => {
    if (language === 'fr') {
      switch (hint.type) {
        case 'type':
          return `Type : ${hint.value}`;
        case 'generation':
          return `Génération : ${hint.value.replace('Gen ', '')}`;
        case 'color':
          return `Couleur : ${hint.value}`;
        case 'habitat':
          return `Habitat : ${hint.value}`;
        default:
          return hint.label;
      }
    }
    return hint.label;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <h3 className="text-white text-lg font-semibold mb-3 text-center">
        {language === 'fr' ? 'Indices' : 'Hints'}
      </h3>
      <div className="flex flex-wrap gap-3 justify-center">
        <AnimatePresence>
          {hints.map((hint, index) => (
            <motion.div
              key={`${hint.type}-${index}`}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                delay: index * 0.2,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-white/20 rounded-full text-white/90 text-sm font-medium"
            >
              {getHintIcon(hint.type)}
              <span>{formatHintLabel(hint)}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}