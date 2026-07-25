import React from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Wind, 
  Droplets, 
  Sun, 
  Eye, 
  Gauge, 
  Compass,
  ArrowUp,
  ArrowDown,
  Sparkles,
  CloudRain
} from 'lucide-react';
import { WeatherData, GeoLocation, UnitSystem, PlanningIntelligence } from '../types/weather';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { formatTemp, formatWindSpeed, getWindDirectionLabel, formatTime } from '../utils/openMeteo';

interface CurrentWeatherCardProps {
  weatherData: WeatherData;
  location: GeoLocation;
  unit: UnitSystem;
  planning: PlanningIntelligence;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weatherData,
  location,
  unit,
  planning,
}) => {
  const current = weatherData.current;
  const daily = weatherData.daily;
  const isDay = current.is_day === 1;
  const weatherInfo = getWeatherCodeInfo(current.weather_code, isDay);

  const todayMaxC = daily.temperature_2m_max?.[0] ?? current.temperature_2m;
  const todayMinC = daily.temperature_2m_min?.[0] ?? current.temperature_2m;
  const todayRainProb = daily.precipitation_probability_max?.[0] ?? 0;
  const todayUV = daily.uv_index_max?.[0] ?? 0;

  const nowString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br ${weatherInfo.bgGradient} border border-slate-700/60 shadow-2xl text-slate-100 transition-all`}>
      
      {/* Background Decorative Blur Orbs */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left Column: Location Info & Big Temp */}
        <div className="space-y-4 flex-1">
          
          {/* Location Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 border border-slate-700/80 text-sky-300 backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              {location.name}
              {location.admin1 && <span className="text-slate-400">, {location.admin1}</span>}
              {location.country && <span className="text-slate-400">({location.country})</span>}
            </span>

            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${weatherInfo.badgeBg} ${weatherInfo.badgeText} border border-slate-600/30 backdrop-blur-md`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {weatherInfo.label}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-slate-300 bg-slate-800/60 border border-slate-700/50">
              <Calendar className="w-3 h-3 text-slate-400" />
              {nowString}
            </span>
          </div>

          {/* Temperature Display */}
          <div className="flex items-baseline gap-4 pt-1">
            <div className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white drop-shadow-md">
              {formatTemp(current.temperature_2m, unit)}
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-slate-300">
                Feels like <span className="font-semibold text-white">{formatTemp(current.apparent_temperature, unit)}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
                <span className="flex items-center text-rose-300">
                  <ArrowUp className="w-3 h-3 mr-0.5" />
                  {formatTemp(todayMaxC, unit)}
                </span>
                <span className="flex items-center text-sky-300">
                  <ArrowDown className="w-3 h-3 mr-0.5" />
                  {formatTemp(todayMinC, unit)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-300/90 max-w-lg">
            {planning.summary}
          </p>
        </div>

        {/* Right Column: Outdoor Intelligence Score Ring / Card */}
        <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-4">
          
          {/* Outdoor Score Banner */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md flex items-center gap-4 min-w-[240px] shadow-lg">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="5"
                  className={
                    planning.overallOutdoorScore >= 75 ? 'text-emerald-400' :
                    planning.overallOutdoorScore >= 50 ? 'text-amber-400' : 'text-rose-400'
                  }
                  strokeDasharray={163.36}
                  strokeDashoffset={163.36 - (163.36 * planning.overallOutdoorScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-sm font-black text-white">{planning.overallOutdoorScore}</span>
                <span className="text-[10px] text-slate-400 block -mt-1">%</span>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Outdoor Score
              </div>
              <div className="text-base font-bold text-white">
                {planning.overallOutdoorScore >= 80 ? 'Excellent' :
                 planning.overallOutdoorScore >= 60 ? 'Good' :
                 planning.overallOutdoorScore >= 40 ? 'Fair' : 'Poor'}
              </div>
              <p className="text-[11px] text-slate-400">
                Based on temp, rain & wind
              </p>
            </div>
          </div>

          {/* Quick Rain & UV Alert Summary */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md flex items-center justify-between gap-3 flex-1">
            <div className="flex items-center gap-2.5">
              <CloudRain className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">Rain Probability</span>
                <span className="text-sm font-semibold text-slate-100">{todayRainProb}%</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">Max UV Index</span>
                <span className="text-sm font-semibold text-slate-100">{todayUV.toFixed(1)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Metrics Bar */}
      <div className="mt-6 pt-6 border-t border-slate-700/50 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/70 backdrop-blur-sm flex items-center gap-3">
          <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Humidity</div>
            <div className="text-sm font-bold text-white">{current.relative_humidity_2m}%</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/70 backdrop-blur-sm flex items-center gap-3">
          <Wind className="w-4 h-4 text-teal-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Wind</div>
            <div className="text-sm font-bold text-white">
              {formatWindSpeed(current.wind_speed_10m, unit)}
              <span className="text-xs font-normal text-slate-400 ml-1">
                ({getWindDirectionLabel(current.wind_direction_10m)})
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/70 backdrop-blur-sm flex items-center gap-3">
          <Sun className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">UV Index</div>
            <div className="text-sm font-bold text-white">{todayUV.toFixed(1)}</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/70 backdrop-blur-sm flex items-center gap-3">
          <Gauge className="w-4 h-4 text-purple-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Pressure</div>
            <div className="text-sm font-bold text-white">{Math.round(current.pressure_msl)} hPa</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/70 backdrop-blur-sm flex items-center gap-3">
          <Eye className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Visibility</div>
            <div className="text-sm font-bold text-white">
              {(weatherData.hourly.visibility?.[0] ? (weatherData.hourly.visibility[0] / 1000).toFixed(1) : '10')} km
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/70 backdrop-blur-sm flex items-center gap-3">
          <Clock className="w-4 h-4 text-rose-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Sunrise / Sunset</div>
            <div className="text-xs font-bold text-white">
              {daily.sunrise?.[0] ? formatTime(daily.sunrise[0]) : '--'} / {daily.sunset?.[0] ? formatTime(daily.sunset[0]) : '--'}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
