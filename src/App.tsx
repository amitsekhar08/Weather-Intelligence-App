import React, { useState, useEffect, useCallback } from 'react';
import { 
  GeoLocation, 
  WeatherData, 
  UnitSystem, 
  PlanningIntelligence 
} from './types/weather';
import { fetchWeatherData } from './utils/openMeteo';
import { calculatePlanningIntelligence } from './utils/recommendations';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { PlanningIntelligenceView } from './components/PlanningIntelligence';
import { HourlyForecastView } from './components/HourlyForecastView';
import { DailyForecastView } from './components/DailyForecastView';
import { WeatherDetailsGrid } from './components/WeatherDetailsGrid';
import { QuickLocations } from './components/QuickLocations';
import { 
  CloudRain, 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  Sparkles,
  Heart
} from 'lucide-react';

const DEFAULT_CITY: GeoLocation = {
  id: 2643743,
  name: 'London',
  latitude: 51.5074,
  longitude: -0.1278,
  country: 'United Kingdom',
  admin1: 'England'
};

export default function App() {
  const [currentCity, setCurrentCity] = useState<GeoLocation>(() => {
    const saved = localStorage.getItem('wi_last_city');
    if (saved) {
      try { return JSON.parse(saved); } catch { return DEFAULT_CITY; }
    }
    return DEFAULT_CITY;
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [planning, setPlanning] = useState<PlanningIntelligence | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [unit, setUnit] = useState<UnitSystem>(() => {
    return (localStorage.getItem('wi_unit') as UnitSystem) || 'metric';
  });

  const [favorites, setFavorites] = useState<GeoLocation[]>(() => {
    const saved = localStorage.getItem('wi_favorites');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  // Save unit preference
  const handleToggleUnit = (newUnit: UnitSystem) => {
    setUnit(newUnit);
    localStorage.setItem('wi_unit', newUnit);
  };

  // Manage Favorites
  const isFavorite = favorites.some(f => f.id === currentCity.id || (f.latitude === currentCity.latitude && f.longitude === currentCity.longitude));

  const handleToggleFavorite = (city: GeoLocation) => {
    let updated: GeoLocation[];
    if (isFavorite) {
      updated = favorites.filter(f => f.id !== city.id && (f.latitude !== city.latitude || f.longitude !== city.longitude));
    } else {
      updated = [...favorites, city];
    }
    setFavorites(updated);
    localStorage.setItem('wi_favorites', JSON.stringify(updated));
  };

  // Fetch Weather Function
  const loadWeather = useCallback(async (city: GeoLocation) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(city.latitude, city.longitude);
      setWeatherData(data);
      const plan = calculatePlanningIntelligence(data);
      setPlanning(plan);
      setCurrentCity(city);
      localStorage.setItem('wi_last_city', JSON.stringify(city));
    } catch (err) {
      console.error('Failed to fetch weather:', err);
      setError('Unable to fetch weather data from Open-Meteo. Please verify internet connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount or city change
  useEffect(() => {
    loadWeather(currentCity);
  }, [loadWeather, currentCity.latitude, currentCity.longitude]);

  // GPS Current Location Handler
  const handleFetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const gpsCity: GeoLocation = {
          id: Date.now(),
          name: 'Your Location',
          latitude,
          longitude,
          country: 'GPS Location',
        };
        await loadWeather(gpsCity);
        setIsLoadingLocation(false);
      },
      (geoErr) => {
        console.warn('Geolocation error:', geoErr);
        setIsLoadingLocation(false);
        alert('Could not determine GPS location. Please use search.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white flex flex-col">
      
      {/* Top Navigation Header */}
      <Header
        currentCity={currentCity}
        onSelectCity={loadWeather}
        unit={unit}
        onToggleUnit={handleToggleUnit}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isFavorite}
        onFetchCurrentLocation={handleFetchCurrentLocation}
        isLoadingLocation={isLoadingLocation}
      />

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Quick Search Chips & Favorites */}
        <QuickLocations
          onSelectCity={loadWeather}
          favorites={favorites}
          onRemoveFavorite={handleToggleFavorite}
          activeCityId={currentCity.id}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin" />
              <CloudRain className="w-6 h-6 text-sky-400 animate-bounce" />
            </div>
            <p className="text-sm text-slate-400 font-medium">Fetching weather intelligence from Open-Meteo...</p>
          </div>
        )}

        {/* Error View */}
        {error && !isLoading && (
          <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-white">Weather Data Fetch Error</h3>
                <p className="text-xs text-rose-300/90">{error}</p>
              </div>
            </div>
            <button
              onClick={() => loadWeather(currentCity)}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Fetch
            </button>
          </div>
        )}

        {/* Loaded Weather Dashboard */}
        {!isLoading && weatherData && planning && (
          <div className="space-y-6">
            
            {/* Primary Current Weather Banner */}
            <CurrentWeatherCard
              weatherData={weatherData}
              location={currentCity}
              unit={unit}
              planning={planning}
            />

            {/* Weather Intelligence & Planning Module */}
            <PlanningIntelligenceView
              planning={planning}
              unit={unit}
            />

            {/* 24-Hour Trend Chart & Hourly Cards */}
            <HourlyForecastView
              hourly={weatherData.hourly}
              unit={unit}
            />

            {/* Detailed Atmospheric Metrics Grid */}
            <WeatherDetailsGrid
              weatherData={weatherData}
              unit={unit}
            />

            {/* 7-Day Forecast */}
            <DailyForecastView
              daily={weatherData.daily}
              unit={unit}
            />

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            Powered by <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="text-sky-400 font-semibold hover:underline">Open-Meteo API</a>
          </p>
          <p className="text-slate-400">
            Weather Intelligence Dashboard • Live Forecasts & Activity Scores
          </p>
        </div>
      </footer>

    </div>
  );
}
