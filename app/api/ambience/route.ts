// Fetch atmospheric conditions for coordinate enhancement
export async function GET() {
  // Coordinates: 58.3639° N, 25.5900° E (obfuscated)
  const phi = 58.3639;
  const lambda = 25.5900;
  
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${phi}&longitude=${lambda}&current=temperature_2m,weathercode,windspeed_10m,winddirection_10m&timezone=Europe/Tallinn`,
      { next: { revalidate: 1800 } } // Cache for 30 minutes
    );
    
    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch ambience data' }, { status: 500 });
    }
    
    const data = await response.json();
    
    // Obfuscate the response
    return Response.json({
      t: data.current.temperature_2m,
      c: data.current.weathercode,
      w: data.current.windspeed_10m,
      d: data.current.winddirection_10m,
    });
  } catch (error) {
    console.error('Ambience fetch error:', error);
    return Response.json({ error: 'Ambience service unavailable' }, { status: 500 });
  }
}
