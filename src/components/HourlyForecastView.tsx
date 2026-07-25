import React, { useState } from 'react';
import { 
  Clock, 
  Thermometer, 
  CloudRain, 
  Wind, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { HourlyForecast, UnitSystem } from '../types/weather';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { formatTemp, celsiusToFahrenheit, formatWindSpeed } from '../utils/openMeteo';

interface HourlyForecastViewProps {
  hourly: HourlyForecast;
  unit: UnitSystem;
}

export const HourlyForecastView: React.FC<HourlyForecastViewProps> = ({
  hourly,
  unit,
}) => {
  const [metricTab, setMetricTab] = useState<'temp' | 'rain' | 'wind'>('temp');

  if (!hourly || !hourly.time || hourly.time.length === 0) {
    return null;
  }

  // Build 24-hour chart dataset
  const chartData = hourly.time.slice(0, 24).map((timeIso, index) => {
    const timeLabel = new Date(timeIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const rawTempC = hourly.temperature_2m[index];
    const displayTemp = unit === 'imperial' ? celsiusToFahrenheit(rawTempC) : Math.round(rawTempC);
    const rainProb = hourly.precipitation_probability?.[index] ?? 0;
    const windKmh = hourly.wind_speed_10m?.[index] ?? 0;
    const weatherCode = hourly.weather_code?.[index] ?? 0;

    return {
      timeIso,
      timeLabel,
      temp: displayTemp,
      rawTempC,
      rainProb,
      windKmh,
      weatherCode,
    };
  });

  return (
    <div className="p-5 md:p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-5 text-slate-100 shadow-2xl">
      
      {/* Header & Metric Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2 tracking-wide">
            <Clock className="w-5 h-5 text-indigo-400" />
            24-Hour Weather Trends
          </h2>
          <p className="text-xs text-slate-400">
            Hourly temperature, rain probability, and wind velocity
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-full border border-slate-700/60 text-xs font-semibold">
          <button
            onClick={() => setMetricTab('temp')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              metricTab === 'temp'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            Temp
          </button>

          <button
            onClick={() => setMetricTab('rain')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              metricTab === 'rain'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            Rain %
          </button>

          <button
            onClick={() => setMetricTab('wind')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              metricTab === 'wind'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Wind
          </button>
        </div>
      </div>

      {/* Interactive Recharts Area Chart */}
      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
            <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs space-y-1">
                      <div className="font-bold text-indigo-300 font-serif">{data.timeLabel}</div>
                      <div className="text-slate-200">
                        Temp: <span className="font-bold">{formatTemp(data.rawTempC, unit)}</span>
                      </div>
                      <div className="text-slate-200">
                        Rain Prob: <span className="font-bold">{data.rainProb}%</span>
                      </div>
                      <div className="text-slate-200">
                        Wind: <span className="font-bold">{formatWindSpeed(data.windKmh, unit)}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {metricTab === 'temp' && (
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tempGradient)"
                name="Temperature"
              />
            )}

            {metricTab === 'rain' && (
              <Area
                type="monotone"
                dataKey="rainProb"
                stroke="#0284c7"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#rainGradient)"
                name="Rain Chance %"
              />
            )}

            {metricTab === 'wind' && (
              <Area
                type="monotone"
                dataKey="windKmh"
                stroke="#2dd4bf"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#windGradient)"
                name="Wind Velocity"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly Horizontal Cards Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
        {chartData.map((item, idx) => {
          const info = getWeatherCodeInfo(item.weatherCode, true);
          return (
            <div
              key={idx}
              className="flex-none w-20 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-center justify-between text-center space-y-2 hover:bg-slate-800 transition-colors"
            >
              <span className="text-[11px] font-medium text-slate-400">{item.timeLabel}</span>

              <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center my-0.5">
                <span className="text-xs font-bold text-sky-300">
                  {item.weatherCode === 0 ? '☀️' : item.weatherCode < 4 ? '⛅' : item.weatherCode < 60 ? '🌫️' : item.weatherCode < 80 ? '🌧️' : '🌩️'}
                </span>
              </div>

              <span className="text-sm font-bold text-white">
                {formatTemp(item.rawTempC, unit)}
              </span>

              <div className="text-[10px] text-sky-400 font-semibold flex items-center gap-0.5">
                <CloudRain className="w-3 h-3 shrink-0" />
                {item.rainProb}%
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
