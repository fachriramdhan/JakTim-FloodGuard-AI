export interface WeatherHourly {
  time: string[];
  precipitation: number[];
  weathercode: number[];
  temperature_2m: number[];
  relativehumidity_2m: number[];
  apparent_temperature: number[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  hourly: WeatherHourly;
  current_weather?: {
    temperature: number;
    weathercode: number;
    windspeed: number;
    time: string;
  };
}

export enum RiskLevel {
  RENDAH = 'Rendah',
  SEDANG = 'Sedang',
  TINGGI = 'Tinggi',
  SANGAT_TINGGI = 'Sangat Tinggi',
}

export enum FloodStatus {
  AMAN = 'AMAN',         // Not raining or rain stopped
  WASPADA = 'WASPADA',   // Raining, but duration < threshold - 1
  SIAGA = 'SIAGA',       // Raining, duration is within 1 hour of threshold
  BANJIR = 'BANJIR',     // Raining, duration >= threshold
}

export interface FloodRule {
  durationThreshold: number; // in hours
  dependency?: string; // Name of another Kelurahan that must also be flooded
  baseRisk: RiskLevel;
}

export interface KelurahanData {
  name: string;
  district: string; // Kecamatan
  rules: FloodRule;
  lat: number;
  lon: number;
}

export interface ForecastData {
  hour: string;
  temp: number;
  precip: number;
  code: number;
  humidity?: number;
  feelsLike?: number;
}

// Result attached to the card
export interface CalculatedFloodStatus {
  status: FloodStatus;
  currentRainDuration: number;
  isRainingNow: boolean;
  dependencyMet: boolean;
}
