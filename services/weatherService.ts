import { WeatherResponse } from '../types';

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherResponse> => {
  // Added relativehumidity_2m and apparent_temperature
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=precipitation,weathercode,temperature_2m,relativehumidity_2m,apparent_temperature&current_weather=true&timezone=Asia%2FJakarta&forecast_days=1`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return await response.json();
  } catch (error) {
    console.error('Weather API Error:', error);
    throw error;
  }
};

export const getWeatherDescription = (code: number): { label: string; icon: string } => {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return { label: 'Cerah', icon: '☀️' };
  if (code >= 1 && code <= 3) return { label: 'Berawan', icon: '☁️' };
  if (code >= 45 && code <= 48) return { label: 'Kabut', icon: '🌫️' };
  if (code >= 51 && code <= 55) return { label: 'Gerimis', icon: '🌧️' };
  if (code >= 61 && code <= 65) return { label: 'Hujan', icon: '🌧️' };
  if (code >= 80 && code <= 82) return { label: 'Hujan Lebat', icon: '⛈️' };
  if (code >= 95) return { label: 'Badai Petir', icon: '⚡' };
  return { label: 'Unknown', icon: '❓' };
};