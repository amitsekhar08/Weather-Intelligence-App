import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Bookmark, 
  Star, 
  SlidersHorizontal, 
  X, 
  Loader2,
  Sparkles
} from 'lucide-react';
import { GeoLocation, UnitSystem } from '../types/weather';
import { searchCities } from '../utils/openMeteo';

interface HeaderProps {
  currentCity: GeoLocation | null;
  onSelectCity: (city: GeoLocation) => void;
  unit: UnitSystem;
  onToggleUnit: (unit: UnitSystem) => void;
  favorites: GeoLocation[];
  onToggleFavorite: (city: GeoLocation) => void;
  isFavorite: boolean;
  onFetchCurrentLocation: () => void;
  isLoadingLocation: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSelectCity,
  unit,
  onToggleUnit,
  favorites,
  onToggleFavorite,
  isFavorite,
  onFetchCurrentLocation,
  isLoadingLocation,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const cities = await searchCities(query);
      setResults(cities);
      setIsSearching(false);
      setIsDropdownOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeoLocation) => {
    onSelectCity(city);
    setQuery('');
    setResults([]);
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 text-slate-100 py-3.5 px-4 sm:px-6 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-bold">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Weather Intelligence
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Open-Meteo
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Live Forecast & Smart Activity Recommendations
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onToggleUnit(unit === 'metric' ? 'imperial' : 'metric')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700/60 transition-colors"
            >
              {unit === 'metric' ? '°C, km/h' : '°F, mph'}
            </button>
          </div>
        </div>

        {/* City Search Bar & Location Actions */}
        <div className="flex-1 max-w-xl w-full flex items-center gap-2">
          <div ref={searchRef} className="relative flex-1">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setIsDropdownOpen(true)}
                placeholder="Search city or country (e.g. Tokyo, Paris, New York)..."
                className="w-full bg-slate-800/90 text-slate-100 placeholder-slate-400 text-sm pl-10 pr-9 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all shadow-inner"
              />
              {query ? (
                <button
                  onClick={() => { setQuery(''); setResults([]); }}
                  className="absolute right-3 p-0.5 rounded-md text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : isSearching ? (
                <Loader2 className="absolute right-3 w-4 h-4 text-sky-400 animate-spin" />
              ) : null}
            </div>

            {/* Dropdown Suggestions */}
            {isDropdownOpen && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-700/50 max-h-80 overflow-y-auto">
                {results.map((city) => (
                  <button
                    key={`${city.id}-${city.latitude}-${city.longitude}`}
                    onClick={() => handleSelect(city)}
                    className="w-full px-4 py-3 text-left hover:bg-sky-500/10 flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="font-medium text-sm text-slate-100 group-hover:text-sky-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        {city.name}
                        {city.admin1 && <span className="text-slate-400 text-xs font-normal">, {city.admin1}</span>}
                      </div>
                      <div className="text-xs text-slate-400 ml-5">
                        {city.country ? city.country : 'Unknown Country'}
                        {city.population ? ` • Pop. ${(city.population / 1000).toFixed(0)}k` : ''}
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 text-right">
                      {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                    </div>
                  </button>
                ))}
              </div>
            )}

            {isDropdownOpen && query.length >= 2 && !isSearching && results.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700/80 rounded-xl p-4 text-center text-xs text-slate-400 z-50">
                No matching cities found for &quot;{query}&quot;. Try checking spelling.
              </div>
            )}
          </div>

          {/* Current GPS Button */}
          <button
            onClick={onFetchCurrentLocation}
            disabled={isLoadingLocation}
            title="Use Current GPS Location"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 border border-slate-700/80 transition-colors shrink-0 flex items-center justify-center disabled:opacity-50"
          >
            {isLoadingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </button>

          {/* Bookmark / Favorite City Button */}
          {currentCity && (
            <button
              onClick={() => onToggleFavorite(currentCity)}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              className={`p-2.5 rounded-xl border transition-colors shrink-0 flex items-center justify-center ${
                isFavorite 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' 
                  : 'bg-slate-800 text-slate-400 hover:text-amber-300 border-slate-700/80 hover:bg-slate-700/60'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          )}
        </div>

        {/* Desktop Controls (Unit selector & Favorites count) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => onToggleUnit(unit === 'metric' ? 'imperial' : 'metric')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700/80 transition-all flex items-center gap-2 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Unit: {unit === 'metric' ? '°C, km/h' : '°F, mph'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
