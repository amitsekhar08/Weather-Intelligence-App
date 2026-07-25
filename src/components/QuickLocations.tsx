import React from 'react';
import { MapPin, Star, Trash2, Globe2 } from 'lucide-react';
import { GeoLocation } from '../types/weather';

interface QuickLocationsProps {
  onSelectCity: (city: GeoLocation) => void;
  favorites: GeoLocation[];
  onRemoveFavorite: (city: GeoLocation) => void;
  activeCityId: number | undefined;
}

const POPULAR_CITIES: GeoLocation[] = [
  { id: 2643743, name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom', admin1: 'England' },
  { id: 5128581, name: 'New York', latitude: 40.7128, longitude: -74.0060, country: 'United States', admin1: 'New York' },
  { id: 1850147, name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan', admin1: 'Tokyo' },
  { id: 2988507, name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France', admin1: 'Île-de-France' },
  { id: 2147714, name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia', admin1: 'New South Wales' },
  { id: 292223, name: 'Dubai', latitude: 25.2048, longitude: 55.2708, country: 'United Arab Emirates', admin1: 'Dubai' },
  { id: 1880252, name: 'Singapore', latitude: 1.3521, longitude: 103.8198, country: 'Singapore', admin1: 'Singapore' },
  { id: 1273294, name: 'Delhi', latitude: 28.6139, longitude: 77.2090, country: 'India', admin1: 'Delhi' },
];

export const QuickLocations: React.FC<QuickLocationsProps> = ({
  onSelectCity,
  favorites,
  onRemoveFavorite,
  activeCityId,
}) => {
  return (
    <div className="space-y-4">
      
      {/* Saved Favorites Section */}
      {favorites.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-indigo-300">
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
              Your Pinned Locations ({favorites.length})
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {favorites.map((city) => {
              const isActive = activeCityId === city.id;
              return (
                <div
                  key={`fav-${city.id}`}
                  className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/30 border-indigo-500/60 text-indigo-200'
                      : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-700/80 text-slate-200'
                  }`}
                  onClick={() => onSelectCity(city)}
                >
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{city.name}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(city);
                    }}
                    title="Remove from favorites"
                    className="p-1 rounded text-slate-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Popular World Capitals */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
          Popular World Cities
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {POPULAR_CITIES.map((city) => {
            const isActive = activeCityId === city.id;
            return (
              <button
                key={`pop-${city.id}`}
                onClick={() => onSelectCity(city)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-700/60 hover:text-white'
                }`}
              >
                <span>{city.name}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
