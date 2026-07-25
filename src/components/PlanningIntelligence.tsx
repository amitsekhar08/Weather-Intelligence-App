import React, { useState } from 'react';
import { 
  Sparkles, 
  Shirt, 
  Umbrella, 
  Sun, 
  Wind, 
  AlertTriangle, 
  CheckCircle2, 
  Footprints, 
  Bike, 
  Utensils, 
  Camera, 
  Flower2, 
  Clock, 
  ChevronRight,
  Info,
  ShieldAlert
} from 'lucide-react';
import { PlanningIntelligence as PlanningType, UnitSystem } from '../types/weather';
import { celsiusToFahrenheit } from '../utils/openMeteo';

interface PlanningIntelligenceProps {
  planning: PlanningType;
  unit: UnitSystem;
}

export const PlanningIntelligenceView: React.FC<PlanningIntelligenceProps> = ({
  planning,
  unit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints': return <Footprints className="w-5 h-5 text-sky-400" />;
      case 'Bike': return <Bike className="w-5 h-5 text-teal-400" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-amber-400" />;
      case 'Camera': return <Camera className="w-5 h-5 text-purple-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'Flower2': return <Flower2 className="w-5 h-5 text-emerald-400" />;
      default: return <Sparkles className="w-5 h-5 text-sky-400" />;
    }
  };

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'Excellent':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Excellent</span>;
      case 'Good':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">Good</span>;
      case 'Fair':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Fair</span>;
      case 'Poor':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Poor</span>;
    }
  };

  const filteredActivities = selectedCategory === 'all' 
    ? planning.activities 
    : planning.activities.filter(a => a.category === selectedCategory);

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2 tracking-wide">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Weather Intelligence & Planning
          </h2>
          <p className="text-xs text-slate-400">
            Tailored clothing guides, smart activity scores, and daily walking windows
          </p>
        </div>
      </div>

      {/* Smart Alerts & Weather Advisories */}
      {planning.alerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {planning.alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-start gap-3 backdrop-blur-md transition-all ${
                alert.type === 'alert'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                  : alert.type === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  : 'bg-sky-500/10 border-sky-500/30 text-sky-200'
              }`}
            >
              {alert.type === 'alert' ? (
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : alert.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold text-sm text-white">{alert.title}</div>
                <div className="text-xs text-slate-300 leading-relaxed">{alert.message}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid: Clothing Guide & Best Walking Window */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Clothing Guide Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-white">What to Wear Today</h3>
                <p className="text-xs text-slate-400">Based on real-time thermal comfort</p>
              </div>
            </div>

            {planning.umbrellaNeeded && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                <Umbrella className="w-3.5 h-3.5" /> Umbrella Needed
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-200 text-sm font-medium leading-relaxed italic font-serif">
            &quot;{planning.clothingSuggestion}&quot;
          </div>
        </div>

        {/* Optimal Outdoor Window Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-white">Best Outdoor Window</h3>
              <p className="text-xs text-slate-400">Ideal 2-hour window for walks & activities</p>
            </div>
          </div>

          {planning.bestWalkingWindow ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-sky-500/10 to-indigo-500/10 border border-indigo-500/30 flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{planning.bestWalkingWindow.start} – {planning.bestWalkingWindow.end}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-normal">
                    {unit === 'imperial' ? `${celsiusToFahrenheit(planning.bestWalkingWindow.temp)}°F` : `${planning.bestWalkingWindow.temp}°C`}
                  </span>
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  {planning.bestWalkingWindow.description}
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-800/50 text-xs text-slate-400">
              No specific dry window detected in the coming hours.
            </div>
          )}
        </div>

      </div>

      {/* Activity Suitability Matrix */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-serif font-bold text-base text-white flex items-center gap-2 tracking-wide">
            Outdoor Activity Suitability
          </h3>

          {/* Filter Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {['all', 'sports', 'leisure', 'lifestyle'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-medium capitalize transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all hover:scale-[1.01] shadow-lg flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 group-hover:border-indigo-500/40 transition-colors">
                    {getActivityIcon(act.icon)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{act.name}</h4>
                    <span className="text-[10px] text-slate-400 capitalize">{act.category}</span>
                  </div>
                </div>

                {getRatingBadge(act.rating)}
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Score</span>
                  <span className="font-bold text-white">{act.score}/100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      act.score >= 80 ? 'bg-emerald-400' :
                      act.score >= 60 ? 'bg-sky-400' :
                      act.score >= 40 ? 'bg-amber-400' : 'bg-rose-400'
                    }`}
                    style={{ width: `${act.score}%` }}
                  />
                </div>
              </div>

              {/* Reason & Pro Tip */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <p className="text-xs text-slate-300 font-medium">
                  {act.reason}
                </p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-sky-400 shrink-0" />
                  {act.tip}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
