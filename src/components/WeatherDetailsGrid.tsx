import React from 'react';
import { 
  Sun, 
  Wind, 
  Droplets, 
  Sunrise, 
  Sunset, 
  Gauge, 
  Eye, 
  Compass,
  Cloud
} from 'lucide-react';
import { WeatherData, UnitSystem } from '../types/weather';
import { formatWindSpeed, getWindDirectionLabel, formatTime } from '../utils/openMeteo';

interface WeatherDetailsGridProps {
  weatherData: WeatherData;
  unit: UnitSystem;
}

export const WeatherDetailsGrid: React.FC<WeatherDetailsGridProps> = ({
  weatherData,
  unit,
}) => {
  const current = weatherData.current;
  const daily = weatherData.daily;
  const hourly = weatherData.hourly;

  const uvMax = daily.uv_index_max?.[0] ?? hourly.uv_index?.[0] ?? 0;
  const windDirDeg = current.wind_direction_10m;
  const windGustKmh = current.wind_gusts_10m;
  const humidity = current.relative_humidity_2m;
  const dewPointC = hourly.dew_point_2m?.[0] ?? (current.temperature_2m - ((100 - humidity) / 5));
  const pressure = current.pressure_msl;
  const visibilityMeters = hourly.visibility?.[0] ?? 10000;
  const cloudCover = current.cloud_cover;

  // Calculate day length in hours & minutes if sunrise/sunset exist
  let dayLengthStr = '--';
  if (daily.sunrise?.[0] && daily.sunset?.[0]) {
    const sr = new Date(daily.sunrise[0]).getTime();
    const ss = new Date(daily.sunset[0]).getTime();
    const diffMs = ss - sr;
    if (diffMs > 0) {
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      dayLengthStr = `${hours}h ${mins}m`;
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-100">
      
      {/* Card 1: UV Index & Sun Protection */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-white">UV Index</h3>
              <p className="text-[11px] text-slate-400">Solar radiation level</p>
            </div>
          </div>
          <span className="text-xl font-serif font-extrabold text-amber-300">{uvMax.toFixed(1)}</span>
        </div>

        {/* UV Scale Meter */}
        <div className="space-y-1">
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 via-orange-500 to-purple-600"
              style={{ width: `${Math.min(100, (uvMax / 12) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0 Low</span>
            <span>6 High</span>
            <span>11+ Very High</span>
          </div>
        </div>

        <p className="text-xs text-slate-300">
          {uvMax >= 8 ? 'Extreme UV. Apply SPF 50+, wear sunglasses & avoid midday sun.' :
           uvMax >= 6 ? 'High UV. Sunscreen SPF 30+ & hat required.' :
           uvMax >= 3 ? 'Moderate UV. Protection suggested during peak hours.' : 'Low UV index. Minimal protection required.'}
        </p>
      </div>

      {/* Card 2: Wind & Gust Compass */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-white">Wind & Gusts</h3>
              <p className="text-[11px] text-slate-400">Atmospheric air velocity</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-serif font-bold text-white">{formatWindSpeed(current.wind_speed_10m, unit)}</div>
            <div className="text-[11px] text-slate-400 font-semibold">{getWindDirectionLabel(windDirDeg)} ({windDirDeg}°)</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 block">Peak Wind Gusts</span>
            <span className="text-sm font-bold text-teal-300">{formatWindSpeed(windGustKmh, unit)}</span>
          </div>

          {/* Compass Graphic */}
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center relative">
            <Compass className="w-8 h-8 text-slate-500 opacity-50" />
            <div
              className="absolute w-1 h-6 bg-teal-400 rounded-full origin-bottom transform transition-transform duration-700"
              style={{ transform: `rotate(${windDirDeg}deg)` }}
            />
          </div>
        </div>
      </div>

      {/* Card 3: Humidity & Dew Point */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-white">Humidity & Dew Point</h3>
              <p className="text-[11px] text-slate-400">Moisture saturation</p>
            </div>
          </div>
          <span className="text-xl font-serif font-extrabold text-sky-300">{humidity}%</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-slate-400 block text-[10px]">Dew Point</span>
            <span className="font-bold text-white text-sm">{Math.round(dewPointC)}°C</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-slate-400 block text-[10px]">Cloud Cover</span>
            <span className="font-bold text-white text-sm">{cloudCover}%</span>
          </div>
        </div>

        <p className="text-xs text-slate-300">
          {humidity > 80 ? 'High humidity. Air feels heavy and muggy.' :
           humidity < 30 ? 'Dry air conditions. Stay hydrated and use skin moisturizer.' : 'Comfortable relative humidity levels.'}
        </p>
      </div>

      {/* Card 4: Sun Progress */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Sunrise className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-white">Sun & Day Progress</h3>
            <p className="text-[11px] text-slate-400">Daylight hours</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 block">Sunrise</span>
            <span className="text-xs font-bold text-amber-300">
              {daily.sunrise?.[0] ? formatTime(daily.sunrise[0]) : '--'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 block">Daylight</span>
            <span className="text-xs font-bold text-white">{dayLengthStr}</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 block">Sunset</span>
            <span className="text-xs font-bold text-amber-400">
              {daily.sunset?.[0] ? formatTime(daily.sunset[0]) : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Card 5: Air Pressure */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-white">Barometric Pressure</h3>
            <p className="text-[11px] text-slate-400">Sea level air pressure</p>
          </div>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <span className="text-2xl font-serif font-bold text-purple-300">{Math.round(pressure)} <span className="text-xs font-sans font-normal text-slate-400">hPa</span></span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {pressure > 1013 ? 'High Pressure' : 'Low Pressure'}
          </span>
        </div>

        <p className="text-xs text-slate-300">
          {pressure > 1020 ? 'High barometric pressure typically brings clear, settled weather.' :
           pressure < 1005 ? 'Falling pressure signals potential rain or stormy weather.' : 'Standard atmospheric pressure.'}
        </p>
      </div>

      {/* Card 6: Optical Visibility */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-white">Visibility & Air Clarity</h3>
            <p className="text-[11px] text-slate-400">Horizontal distance</p>
          </div>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <span className="text-2xl font-serif font-bold text-indigo-300">{(visibilityMeters / 1000).toFixed(1)} <span className="text-xs font-sans font-normal text-slate-400">km</span></span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {visibilityMeters >= 10000 ? 'Clear Sightlines' : 'Reduced Clarity'}
          </span>
        </div>

        <p className="text-xs text-slate-300">
          {visibilityMeters >= 10000 ? 'Optimal clear sightlines for driving and aviation.' : 'Fog or precipitation reducing visual clarity.'}
        </p>
      </div>

    </div>
  );
};
