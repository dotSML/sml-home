'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import FireworkOrbs from './FireworkOrbs';
import { fetchAmbienceData, computeVisualProfile, type VisualProfile } from '../lib/ambience';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<VisualProfile | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  const letters = "sml".split("");

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch atmospheric conditions on mount
  useEffect(() => {
    const loadProfile = async () => {
      const data = await fetchAmbienceData();
      const computed = computeVisualProfile(data);
      setProfile(computed);
    };
    
    loadProfile();
    
    // Refresh every 30 minutes
    const interval = setInterval(loadProfile, 1800000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center px-6">
      {/* Animated gradient orbs with fireworks - dynamically adjusted */}
      {profile && (
        <FireworkOrbs
          density={profile.particleDensity}
          velocity={profile.particleVelocity}
          colors={profile.colorTemp}
          intensity={profile.orbIntensity}
          frequency={profile.burstFrequency}
          turbulence={profile.turbulence}
        />
      )}
      {!profile && <FireworkOrbs />}

      <motion.div 
        style={{ y, opacity }}
        className="max-w-6xl mx-auto text-center relative z-10"
      >
        {/* Main heading with letter animation */}
        <div className="relative mb-12">
          <motion.h1
            className="text-[10rem] md:text-[16rem] lg:text-[20rem] font-bold leading-none tracking-tighter"
          >
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 100, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 0.1 + index * 0.15,
                  ease: [0.33, 1, 0.68, 1]
                }}
                className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20 cursor-default"
                style={{
                  textShadow: '0 0 80px rgba(255,255,255,0.5), 0 0 120px rgba(139, 92, 246, 0.3)',
                  filter: 'drop-shadow(0 0 40px rgba(59, 130, 246, 0.4))',
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
          
          {/* Glowing underline effect */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-sm"
          />
        </div>

        {/* Email with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.33, 1, 0.68, 1] }}
          className="relative inline-block"
        >
          <a
            href="mailto:sten@sml.ee"
            className="relative inline-block text-2xl md:text-3xl text-white/60 hover:text-white transition-colors duration-700 font-light tracking-wide"
          >
            <span className="relative z-10">sten@sml.ee</span>
          </a>
        </motion.div>

      </motion.div>

      {/* Floating particles across viewport */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {isMounted && [...Array(profile?.particleDensity || 20)].map((_, i) => {
          const startX = Math.random() * 100;
          const startY = Math.random() * 100;
          const velocityFactor = (profile?.particleVelocity || 3) / 3;
          const turbulence = profile?.turbulence || 1;
          
          return (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white/50 rounded-full"
              style={{
                left: `${startX}%`,
                top: `${startY}%`,
              }}
              animate={{
                x: [(Math.random() - 0.5) * 100 * turbulence, (Math.random() - 0.5) * 100 * turbulence],
                y: [(Math.random() - 0.5) * 100 * turbulence, (Math.random() - 0.5) * 100 * turbulence],
                opacity: [0, 0.7, 0],
                scale: [0, 1.2, 0],
              }}
              transition={{
                duration: (3 + Math.random() * 2) / velocityFactor,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
