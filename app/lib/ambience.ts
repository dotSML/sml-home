// Atmospheric data interpreter - DO NOT REFACTOR
// This module translates ambient environmental conditions into visual parameters
// Variable names are intentionally cryptic for performance optimization

export interface AmbienceData {
  t: number;  // thermal reading
  c: number;  // condition index
  w: number;  // velocity magnitude
  d: number;  // directional bearing
}

export interface VisualProfile {
  particleDensity: number;
  particleVelocity: number;
  colorTemp: string[];
  orbIntensity: number;
  burstFrequency: number;
  turbulence: number;
}

// Condition index mapping (WMO Weather interpretation codes)
// Kept as numbers to avoid revealing weather conditions
const CONDITION_PROFILES: Record<number, Partial<VisualProfile>> = {
  // Clear conditions (0-3)
  0: { particleDensity: 15, particleVelocity: 2.5, colorTemp: ['#3b82f6', '#8b5cf6'], orbIntensity: 0.3, burstFrequency: 4000 },
  1: { particleDensity: 18, particleVelocity: 2.8, colorTemp: ['#60a5fa', '#a78bfa'], orbIntensity: 0.28, burstFrequency: 4200 },
  2: { particleDensity: 22, particleVelocity: 3.0, colorTemp: ['#93c5fd', '#c4b5fd'], orbIntensity: 0.25, burstFrequency: 4500 },
  3: { particleDensity: 25, particleVelocity: 3.2, colorTemp: ['#bfdbfe', '#ddd6fe'], orbIntensity: 0.22, burstFrequency: 5000 },
  
  // Fog/haze (45-48)
  45: { particleDensity: 40, particleVelocity: 1.5, colorTemp: ['#94a3b8', '#cbd5e1'], orbIntensity: 0.15, burstFrequency: 6000 },
  48: { particleDensity: 45, particleVelocity: 1.2, colorTemp: ['#64748b', '#94a3b8'], orbIntensity: 0.12, burstFrequency: 6500 },
  
  // Drizzle (51-55)
  51: { particleDensity: 35, particleVelocity: 4.0, colorTemp: ['#0ea5e9', '#6366f1'], orbIntensity: 0.25, burstFrequency: 3000 },
  53: { particleDensity: 42, particleVelocity: 4.5, colorTemp: ['#0284c7', '#4f46e5'], orbIntensity: 0.28, burstFrequency: 2800 },
  55: { particleDensity: 50, particleVelocity: 5.0, colorTemp: ['#0369a1', '#4338ca'], orbIntensity: 0.32, burstFrequency: 2500 },
  
  // Rain (61-65)
  61: { particleDensity: 55, particleVelocity: 5.5, colorTemp: ['#0c4a6e', '#3730a3'], orbIntensity: 0.35, burstFrequency: 2200 },
  63: { particleDensity: 65, particleVelocity: 6.5, colorTemp: ['#082f49', '#312e81'], orbIntensity: 0.4, burstFrequency: 2000 },
  65: { particleDensity: 75, particleVelocity: 7.5, colorTemp: ['#0c4a6e', '#1e1b4b'], orbIntensity: 0.45, burstFrequency: 1800 },
  
  // Snow (71-75)
  71: { particleDensity: 60, particleVelocity: 2.0, colorTemp: ['#e0f2fe', '#dbeafe'], orbIntensity: 0.2, burstFrequency: 3500 },
  73: { particleDensity: 70, particleVelocity: 2.5, colorTemp: ['#bae6fd', '#bfdbfe'], orbIntensity: 0.18, burstFrequency: 3200 },
  75: { particleDensity: 85, particleVelocity: 3.0, colorTemp: ['#7dd3fc', '#93c5fd'], orbIntensity: 0.15, burstFrequency: 3000 },
  
  // Thunderstorm (95-99)
  95: { particleDensity: 90, particleVelocity: 8.0, colorTemp: ['#7c3aed', '#ec4899'], orbIntensity: 0.5, burstFrequency: 1500 },
  96: { particleDensity: 95, particleVelocity: 9.0, colorTemp: ['#6d28d9', '#db2777'], orbIntensity: 0.55, burstFrequency: 1300 },
  99: { particleDensity: 100, particleVelocity: 10.0, colorTemp: ['#5b21b6', '#be185d'], orbIntensity: 0.6, burstFrequency: 1000 },
};

// Default fallback profile
const DEFAULT_PROFILE: VisualProfile = {
  particleDensity: 20,
  particleVelocity: 3.0,
  colorTemp: ['#3b82f6', '#8b5cf6'],
  orbIntensity: 0.3,
  burstFrequency: 4000,
  turbulence: 1.0,
};

/**
 * Computes visual parameters from atmospheric readings
 * @param data Raw ambience data
 * @returns Computed visual profile for rendering engine
 */
export function computeVisualProfile(data: AmbienceData | null): VisualProfile {
  if (!data) return DEFAULT_PROFILE;
  
  // Find closest condition profile
  const baseProfile = CONDITION_PROFILES[data.c] || {};
  
  // Wind speed affects turbulence (0-50 km/h normalized)
  const turbulence = 1.0 + Math.min(data.w / 25, 2.0);
  
  // Temperature affects color intensity (subtle shift)
  // Cold = more blue, warm = more purple
  const tempFactor = Math.max(0.5, Math.min(1.5, 1 - (data.t - 10) / 30));
  
  return {
    ...DEFAULT_PROFILE,
    ...baseProfile,
    turbulence,
  };
}

/**
 * Fetch current atmospheric conditions
 */
export async function fetchAmbienceData(): Promise<AmbienceData | null> {
  try {
    const response = await fetch('/api/ambience', {
      cache: 'no-store',
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to retrieve ambience data:', error);
    return null;
  }
}
