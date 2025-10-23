'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const codeSnippets = [
  {
    language: 'TypeScript',
    code: `const engineer = {
  name: "Sten",
  email: "sten@sml.ee",
  skills: ["React", "Node.js"],
  passion: "Building cool stuff"
};`,
  },
  {
    language: 'React',
    code: `function Innovation() {
  return (
    <div className="future">
      <h1>Web 3.0</h1>
    </div>
  );
}`,
  },
  {
    language: 'Next.js',
    code: `export default function App() {
  const magic = useAwesomeness();
  return <Future />;
}`,
  },
];

export default function CodeBlock() {
  const [currentSnippet, setCurrentSnippet] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-white/10 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex gap-2">
          {codeSnippets.map((snippet, index) => (
            <button
              key={index}
              onClick={() => setCurrentSnippet(index)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                currentSnippet === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
              }`}
            >
              {snippet.language}
            </button>
          ))}
        </div>
      </div>
      <motion.pre
        key={currentSnippet}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-sm md:text-base font-mono text-green-400 overflow-x-auto"
      >
        <code>{codeSnippets[currentSnippet].code}</code>
      </motion.pre>
    </motion.div>
  );
}
