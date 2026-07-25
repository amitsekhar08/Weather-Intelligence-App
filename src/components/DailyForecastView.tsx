import React, { useState } from 'react';
import { 
  Calendar, 
  CloudRain, 
  Sun, 
  Wind, 
  Sunrise, 
  Sunset, 
  ChevronDown, 
  ChevronUp,
  Droplets
} from 'lucide-react';
import { DailyForecast, UnitSystem } from '../types/weather';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { formatDayName, formatDateShort, formatTemp, formatWindSpeed, formatTime } from '../utils/openMeteo';

interface DailyForecastViewProps {
  daily: DailyForecast;
  unit: UnitSystem;
}

export const DailyForecastView: React.FC<DailyForecastViewProps> = ({
  daily,
  unit,
}) => {
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(0);

  if (!daily || !daily.time || daily.time.length === 0) {
    return null;
  }

  // Calculate week min and max across all 7 days for range bars
  const weekMinC = Math.min(...daily.temperature_2m_min);
  const weekMaxC = Math.max(...daily.temperature_2m_max);
  const tempRangeSpan = Math.max(1, weekMaxC - weekMinC);

  const toggleExpand = (idx: number) => {
    setExpandedDayIndex(expandedDayIndex === idx ? null : idx);
  };

  return (
    <div className="p-5 md:p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4 text-slate-100 shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2 tracking-wide">
            <Calendar className="w-5 h-5 text-indigo-400" />
            7-Day Weather Forecast
          </h2>
          <p className="text-xs text-slate-400">
            Click any day to view detailed solar, rain & wind breakdown
          </p>
        </div>
      </div>

      {/* 7-Day List */}
      <div className="space-y-2.5">
        {daily.time.slice(0, 7).map((dateIso, idx) => {
          const weatherCode = daily.weather_code[idx];
          const info = getWeatherCodeInfo(weatherCode, true);
          const maxTempC = daily.temperature_2m_max[idx];
          const minTempC = daily.temperature_2m_min[idx];
          const rainProb = daily.precipitation_probability_max?.[idx] ?? 0;
          const rainSum = daily.precipitation_sum?.[idx] ?? 0;
          const uvMax = daily.uv_index_max?.[idx] ?? 0;
          const windMax = daily.wind_speed_10m_max?.[idx] ?? 0;
          const isExpanded = expandedDayIndex === idx;

          // Calculate range bar positioning
          const leftPercent = Math.max(0, Math.min(100, ((minTempC - weekMinC) / tempRangeSpan) * 100));
          const widthPercent = Math.max(5, Math.min(100 - leftPercent, ((maxTempC - minTempC) / tempRangeSpan) * 100));

          return (
            <div
              key={dateIso}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded 
                  ? 'bg-slate-800/80 border-indigo-500/40 shadow-lg' 
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70'
              }`}
            >
              {/* Row Bar */}
              <div
                onClick={() => toggleExpand(idx)}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                
                {/* Day Name & Date */}
                <div className="flex items-center gap-3 w-36 shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-700/50 flex items-center justify-center shrink-0">
                    <span className="text-base font-bold">
                      {weatherCode === 0 ? '☀️' : weatherCode < 4 ? '⛅' : weatherCode < 60 ? '🌫️' : weatherCode < 80 ? '🌧️' : '🌩️'}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white font-serif">{formatDayName(dateIso, idx)}</div>
                    <div className="text-[11px] text-slate-400">{formatDateShort(dateIso)}</div>
                  </div>
                </div>

                {/* Weather Condition Label */}
                <div className="hidden md:block w-36 text-xs font-medium text-slate-300">
                  {info.label}
                </div>

                {/* Rain Probability Badge */}
                <div className="w-20 text-xs font-semibold text-sky-300 flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                  <span>{rainProb}%</span>
                </div>

                {/* Visual Temperature Range Bar */}
                <div className="flex-1 w-full sm:w-auto flex items-center gap-3">
                  <span className="text-xs font-mono font-medium text-slate-400 w-10 text-right">
                    {formatTemp(minTempC, unit)}
                  </span>

                  <div className="flex-1 h-2 rounded-full bg-slate-900 overflow-hidden relative">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-amber-400"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-mono font-bold text-white w-10">
                    {formatTemp(maxTempC, unit)}
                  </span>
                </div>

                {/* Expand Toggle */}
                <button className="p-1 text-slate-400 hover:text-slate-200">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

              </div>

              {/* Expanded Details Drawer */}
              {isExpanded && (
                <div className="p-4 border-t border-slate-700/60 bg-slate-900/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-1">
                    <div className="text-slate-400 flex items-center gap-1">
                      <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                      Sunrise / Sunset
                    </div>
                    <div className="font-bold text-white text-xs">
                      {daily.sunrise?.[idx] ? formatTime(daily.sunrise[idx]) : '--'} / {daily.sunset?.[idx] ? formatTime(daily.sunset[idx]) : '--'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-1">
                    <div className="text-slate-400 flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      Max UV Index
                    </div>
                    <div className="font-bold text-white">
                      {uvMax.toFixed(1)} {uvMax >= 6 ? '(High)' : '(Moderate)'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-1">
                    <div className="text-slate-400 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-sky-400" />
                      Expected Rainfall
                    </div>
                    <div className="font-bold text-white">
                      {rainSum.toFixed(1)} mm
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-1">
                    <div className="text-slate-400 flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-teal-400" />
                      Max Wind Velocity
                    </div>
                    <div className="font-bold text-white">
                      {formatWindSpeed(windMax, unit)}
                    </div>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
