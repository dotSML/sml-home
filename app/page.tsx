'use client';

import EnhancedScene3D from './components/EnhancedScene3D';
import AnimatedBackground from './components/AnimatedBackground';
import Hero from './components/Hero';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black">
      {/* Animated gradient background */}
      <AnimatedBackground />
      
      {/* Enhanced 3D Scene Background */}
      <EnhancedScene3D />
      
      {/* Subtle grain texture */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20 pointer-events-none mix-blend-overlay" />
      
      {/* Content */}
      <main className="relative z-10">
        <Hero />
      </main>
    </div>
  );
}
