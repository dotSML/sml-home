'use client';

import { motion } from 'framer-motion';

const technologies = [
  { name: 'React 19', color: 'from-cyan-500 to-blue-500' },
  { name: 'Next.js 16', color: 'from-gray-700 to-gray-900' },
  { name: 'TypeScript', color: 'from-blue-600 to-blue-700' },
  { name: 'Three.js', color: 'from-purple-500 to-pink-500' },
  { name: 'Framer Motion', color: 'from-pink-500 to-rose-500' },
  { name: 'Tailwind CSS 4', color: 'from-sky-400 to-cyan-500' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function TechStack() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12"
    >
      {technologies.map((tech, index) => (
        <motion.div
          key={tech.name}
          variants={item}
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          className="group relative overflow-hidden rounded-2xl p-4 backdrop-blur-sm bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
          <p className="relative text-sm font-medium text-white/90 group-hover:text-white transition-colors">
            {tech.name}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
