'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function InteractiveText() {
  const [isHovered, setIsHovered] = useState(false);
  
  const text = "Full Stack Engineer";
  const letters = text.split('');

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 1, y: 0 }}
            animate={
              isHovered
                ? {
                    y: [0, -10, 0],
                    transition: {
                      duration: 0.5,
                      delay: index * 0.03,
                      repeat: 0,
                    },
                  }
                : { y: 0 }
            }
            className="inline-block"
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </h2>
    </div>
  );
}
