'use client';

import { motion } from 'framer-motion';
import { Github, Mail, Linkedin, Twitter } from 'lucide-react';

const socialLinks = [
  { icon: Mail, href: 'mailto:sten@sml.ee', label: 'Email', color: 'hover:bg-blue-500/20 hover:border-blue-500/50' },
  { icon: Github, href: '#', label: 'GitHub', color: 'hover:bg-purple-500/20 hover:border-purple-500/50' },
  { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-400/20 hover:border-blue-400/50' },
  { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500/20 hover:border-sky-500/50' },
];

export default function SocialLinks() {
  return (
    <div className="flex gap-3">
      {socialLinks.map((link, index) => (
        <motion.a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 ${link.color} transition-all duration-300 group relative overflow-hidden`}
          aria-label={link.label}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <link.icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors relative z-10" />
        </motion.a>
      ))}
    </div>
  );
}
