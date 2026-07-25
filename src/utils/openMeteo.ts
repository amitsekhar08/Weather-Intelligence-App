import { GeoLocation, WeatherData, UnitSystem } from '../types/weather';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  try {
    const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.statusText}`);
    }
    const data = await response.json();
    return (data.results as GeoLocation[]) || [];
  } catch (error) {
    console.error('Error fetching geocoding data:', error);
    return [];
  }
}

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m'
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'cloud_cover',
      'visibility',
      'wind_speed_10m',
      'uv_index'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'rain_sum',
      'showers_sum',
      'snowfall_sum',
      'precipitation_hours',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'wind_direction_10m_dominant'
    ].join(','),
    timezone: 'auto'
  });

  const url = `${FORECAST_API_URL}?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Forecast API error: ${response.statusText}`);
  }
  const data: WeatherData = await response.json();
  return data;
}

// Formatters & Unit Converters
export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}

export function formatTemp(tempC: number, unit: UnitSystem): string {
  if (tempC === undefined || tempC === null) return '--°';
  if (unit === 'imperial') {
    return `${celsiusToFahrenheit(tempC)}°F`;
  }
  return `${Math.round(tempC)}°C`;
}

export function formatWindSpeed(speedKmh: number, unit: UnitSystem): string {
  if (unit === 'imperial') {
    return `${kmhToMph(speedKmh)} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

export function getWindDirectionLabel(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index] || 'N';
}

export function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return isoString;
  }
}

export function formatDayName(isoDateString: string, index: number): string {
  if (index === 0) return 'Today';
  try {
    const date = new Date(isoDateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return isoDateString;
  }
}

export function formatDateShort(isoDateString: string): string {
  try {
    const date = new Date(isoDateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return isoDateString;
  }
}
