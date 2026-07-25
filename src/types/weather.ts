export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

export type UnitSystem = 'metric' | 'imperial';

export interface CurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  is_day: string;
  precipitation: string;
  rain: string;
  showers: string;
  snowfall: string;
  weather_code: string;
  cloud_cover: string;
  pressure_msl: string;
  surface_pressure: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
  wind_gusts_10m: string;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  dew_point_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  surface_pressure: number[];
  cloud_cover: number[];
  visibility: number[];
  wind_speed_10m: number[];
  uv_index: number[];
}

export interface DailyForecast {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  wind_direction_10m_dominant: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: CurrentUnits;
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
}

export interface ActivityRecommendation {
  id: string;
  name: string;
  category: 'sports' | 'leisure' | 'travel' | 'lifestyle';
  icon: string;
  score: number; // 0 to 100
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  reason: string;
  tip: string;
}

export interface PlanningIntelligence {
  overallOutdoorScore: number;
  summary: string;
  clothingSuggestion: string;
  clothingIcon: string;
  umbrellaNeeded: boolean;
  uvWarning: string | null;
  windWarning: string | null;
  bestWalkingWindow: {
    start: string;
    end: string;
    temp: number;
    description: string;
  } | null;
  activities: ActivityRecommendation[];
  alerts: Array<{
    type: 'info' | 'warning' | 'alert' | 'success';
    title: string;
    message: string;
  }>;
}
