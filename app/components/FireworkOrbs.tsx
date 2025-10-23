'use client';

import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

interface FireworkOrbsProps {
  density?: number;
  velocity?: number;
  colors?: string[];
  intensity?: number;
  frequency?: number;
  turbulence?: number;
}

// Simple noise function for organic movement
class NoiseGenerator {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  // 2D noise function for continuous, non-repeating patterns
  noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    const u = this.fade(x);
    const v = this.fade(y);
    
    const a = this.p[X] + Y;
    const b = this.p[X + 1] + Y;
    
    return this.lerp(v,
      this.lerp(u, this.grad2D(this.p[a], x, y), this.grad2D(this.p[b], x - 1, y)),
      this.lerp(u, this.grad2D(this.p[a + 1], x, y - 1), this.grad2D(this.p[b + 1], x - 1, y - 1))
    ) * 2;
  }
  
  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  
  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }
  
  private grad2D(hash: number, x: number, y: number): number {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
  
  private p = Array.from({ length: 512 }, (_, i) => {
    const hash = Math.sin(this.seed + i) * 10000;
    return Math.floor((hash - Math.floor(hash)) * 256);
  });
}

// Organic orb that uses real-time noise for movement
function OrganicOrb({ 
  config, 
  color, 
  intensity,
}: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);
  
  const noiseGenX = useRef(new NoiseGenerator(config.seed * 1000));
  const noiseGenY = useRef(new NoiseGenerator(config.seed * 2000 + 500));
  const noiseGenScale = useRef(new NoiseGenerator(config.seed * 3000 + 1000));
  const noiseGenRotate = useRef(new NoiseGenerator(config.seed * 4000 + 1500));
  
  const timeRef = useRef(0);
  const velocityX = useRef(0);
  const velocityY = useRef(0);
  
  // Secondary time offset for 2D noise - creates evolving patterns
  const offsetX = useRef(Math.random() * 1000);
  const offsetY = useRef(Math.random() * 1000);
  
  useAnimationFrame((time, delta) => {
    timeRef.current += delta / 1000;
    const t = timeRef.current;
    
    // Use 2D noise with time as one dimension and offset as another
    // This creates continuously evolving, non-repeating patterns
    const noiseX = noiseGenX.current.noise2D(t * config.speed * 0.3, offsetX.current);
    const noiseY = noiseGenY.current.noise2D(t * config.speed * 0.25, offsetY.current);
    const noiseScale = noiseGenScale.current.noise2D(t * config.speed * 0.2, offsetX.current + 100);
    const noiseRotate = noiseGenRotate.current.noise2D(t * config.speed * 0.15, offsetY.current + 100);
    
    // Secondary layer of noise for more organic movement
    const noiseX2 = noiseGenX.current.noise2D(t * config.speed * 0.15 + 50, offsetX.current + 50);
    const noiseY2 = noiseGenY.current.noise2D(t * config.speed * 0.12 + 50, offsetY.current + 50);
    
    // Combine noise layers for complex, organic motion
    const combinedNoiseX = noiseX * 0.7 + noiseX2 * 0.3;
    const combinedNoiseY = noiseY * 0.7 + noiseY2 * 0.3;
    
    // Apply physics-like acceleration
    const targetX = combinedNoiseX * config.amplitude;
    const targetY = combinedNoiseY * config.amplitude;
    
    velocityX.current += (targetX - x.get()) * 0.002;
    velocityY.current += (targetY - y.get()) * 0.002;
    
    // Apply damping
    velocityX.current *= 0.95;
    velocityY.current *= 0.95;
    
    // Update position - purely noise-based, no mouse influence
    const newX = x.get() + velocityX.current;
    const newY = y.get() + velocityY.current;
    
    x.set(newX);
    y.set(newY);
    
    // Organic scale pulsing with variation
    scale.set(0.85 + noiseScale * 0.15);
    
    // Subtle rotation that evolves over time
    rotate.set(noiseRotate * 5);
    
    // Slowly drift the offset values to create ultra-long-term pattern evolution
    offsetX.current += 0.001 * config.speed;
    offsetY.current += 0.0008 * config.speed;
  });
  
  const style: any = {
    background: `radial-gradient(circle, ${color}${Math.round(intensity * config.intensity).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
    x,
    y,
    scale,
    rotate,
    width: config.size,
    height: config.size,
  };
  
  if ('top' in config) style.top = config.top;
  if ('bottom' in config) style.bottom = config.bottom;
  if ('left' in config) style.left = config.left;
  if ('right' in config) style.right = config.right;
  
  return (
    <motion.div
      style={style}
      className="absolute rounded-full blur-3xl transition-colors duration-1000"
    />
  );
}

export default function FireworkOrbs({
  density = 20,
  velocity = 3.0,
  colors = ['#3b82f6', '#8b5cf6'],
  intensity = 0.3,
  frequency = 4000,
  turbulence = 1.0,
}: FireworkOrbsProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  // Calculate number of orbs based on density (density 15-100 -> 6-12 orbs)
  const orbCount = Math.min(12, Math.max(6, Math.floor(density / 10) + 2));
  
  // Generate unique orb configurations with varying organic properties
  // Weather affects speed and amplitude through turbulence
  const orbs = Array.from({ length: orbCount }, (_, i) => {
    const seed = (i + 1) * 0.1;
    const baseSpeed = 0.5 + (i % 3) * 0.3; // Vary between 0.5-1.1
    const baseAmplitude = 110 + (i % 4) * 30; // Vary between 110-200
    
    // Apply turbulence to speed and amplitude
    const weatherSpeed = baseSpeed * (0.8 + turbulence * 0.4); // More turbulence = faster
    const weatherAmplitude = baseAmplitude * turbulence; // More turbulence = wider movement
    
    // Position orbs around the viewport
    const angle = (i / orbCount) * Math.PI * 2;
    const distance = 30 + (i % 3) * 15;
    const centerX = 50 + Math.cos(angle) * distance;
    const centerY = 50 + Math.sin(angle) * distance;
    
    // Determine positioning
    let position: any = {};
    if (centerY < 40) {
      position.top = `${Math.max(-10, centerY - 30)}%`;
    } else {
      position.bottom = `${Math.max(-10, 100 - centerY - 30)}%`;
    }
    
    if (centerX < 50) {
      position.left = `${Math.max(-10, centerX - 30)}%`;
    } else {
      position.right = `${Math.max(-10, 100 - centerX - 30)}%`;
    }
    
    return {
      ...position,
      size: `${24 + (i % 5) * 3}rem`, // Vary size 24-36rem
      colorIdx: i % colors.length,
      intensity: 55 + (i % 6) * 8, // Vary intensity 55-95
      seed,
      speed: weatherSpeed,
      amplitude: weatherAmplitude,
    };
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate particle bursts with organic timing - affected by weather density
  useEffect(() => {
    if (!isMounted) return;
    
    const scheduleNextBurst = () => {
      // Organic timing - varies between bursts, affected by turbulence
      const variance = Math.random() * 0.6 + 0.7; // 0.7 to 1.3x frequency
      const nextBurst = frequency * variance / turbulence; // More turbulence = more frequent
      
      setTimeout(() => {
        const newParticles: Particle[] = [];
        // More density = more bursts (1-4 bursts based on density)
        const burstCount = Math.floor(Math.random() * Math.ceil(density / 30)) + 1;
        
        for (let i = 0; i < burstCount; i++) {
          // Scale particle count with density (density 15-100 -> 2-15 particles)
          const particleCount = Math.floor(Math.random() * (density / 7)) + 2;
          const baseX = Math.random() * 100;
          const baseY = Math.random() * 100;
          
          for (let j = 0; j < particleCount; j++) {
            newParticles.push({
              id: Date.now() + i * 1000 + j + Math.random() * 100,
              x: baseX,
              y: baseY,
              delay: i * (0.3 + Math.random() * 0.4), // Organic delays
            });
          }
        }
        
        setParticles(prev => [...prev, ...newParticles]);
        
        // Clear old particles with varying lifespans
        setTimeout(() => {
          setParticles(prev => prev.filter(p => !newParticles.includes(p)));
        }, 2000 + Math.random() * 1500);
        
        scheduleNextBurst();
      }, nextBurst);
    };
    
    scheduleNextBurst();
  }, [density, frequency, turbulence, isMounted]);

  return (
    <>
      {/* Organic orbs with real-time noise-based movement */}
      {orbs.map((orb, idx) => {
        const color = colors[orb.colorIdx] || colors[0];
        
        return (
          <OrganicOrb
            key={idx}
            config={orb}
            color={color}
            intensity={intensity}
          />
        );
      })}

      {/* Organic firework particles with varied trajectories */}
      {isMounted && particles.map((particle) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * (180 * velocity / 3);
        const curvature = (Math.random() - 0.5) * 50; // Add curve to path
        
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        const midX = endX * 0.5 + curvature;
        const midY = endY * 0.5 + Math.sin(angle * 2) * 30;
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = 1.8 + Math.random() * 1.4;
        const size = 15 + Math.random() * 10;
        
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full blur-2xl"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: `radial-gradient(circle, ${color}${Math.round(intensity * 130).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
            }}
            initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 0.4, 0],
              x: [0, midX, endX],
              y: [0, midY, endY],
              opacity: [0, 1, 0.6, 0],
            }}
            transition={{
              duration: duration / (velocity / 3),
              delay: particle.delay,
              ease: [0.25, 0.1, 0.25, 1], // Custom organic easing
              times: [0, 0.2, 0.7, 1],
            }}
          />
        );
      })}
    </>
  );
}
