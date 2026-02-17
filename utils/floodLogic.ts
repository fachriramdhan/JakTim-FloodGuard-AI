import { FloodStatus, FloodRule, WeatherHourly } from '../types';

/**
 * Calculates how many consecutive hours it has been raining ending at the current hour.
 */
export const calculateRainDuration = (hourly: WeatherHourly, currentHourIndex: number): number => {
  let duration = 0;
  // Look backwards from current hour
  for (let i = currentHourIndex; i >= 0; i--) {
    const precip = hourly.precipitation[i];
    // Threshold for "raining": 0.5mm
    if (precip >= 0.5) {
      duration++;
    } else {
      // Rain stopped
      break;
    }
  }
  return duration;
};

/**
 * Determines the flood status based on duration, rules, and dependencies.
 */
export const determineStatus = (
  rainDuration: number,
  isRainingNow: boolean,
  rule: FloodRule,
  dependencyStatus?: FloodStatus // The status of the referenced kelurahan
): FloodStatus => {
  
  // If it's not raining now, reset to AMAN (assuming flood recedes quickly for this logic, 
  // or simply that the "threat" is gone). 
  if (!isRainingNow) {
    return FloodStatus.AMAN;
  }

  // Check Dependency first
  if (rule.dependency) {
    // If dependency exists but is NOT flooding, this area is safe regardless of rain duration
    // (Based on logic: "Banjir jika... DAN [Dependecy] banjir")
    if (dependencyStatus !== FloodStatus.BANJIR) {
      // Even if raining hard here, if dependency isn't flooded, we might be Waspada at worst
      // but strictly speaking, the rule says "AND", so it can't flood yet.
      // We'll return WASPADA if raining, AMAN otherwise.
      return FloodStatus.WASPADA; 
    }
  }

  // Main Logic
  if (rainDuration >= rule.durationThreshold) {
    return FloodStatus.BANJIR;
  } else if (rainDuration >= rule.durationThreshold - 1) {
    // Less than 1 hour remaining
    return FloodStatus.SIAGA;
  } else {
    // Raining, but not near threshold yet
    return FloodStatus.WASPADA;
  }
};
