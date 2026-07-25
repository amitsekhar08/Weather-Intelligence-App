export interface WeatherCodeInfo {
  code: number;
  label: string;
  iconName: 'Sun' | 'SunMedium' | 'Cloud' | 'CloudSun' | 'CloudRain' | 'CloudDrizzle' | 'CloudLightning' | 'CloudSnow' | 'CloudFog' | 'Wind';
  category: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy';
  bgGradient: string;
  cardBg: string;
  badgeBg: string;
  badgeText: string;
}

export function getWeatherCodeInfo(code: number, isDay: boolean = true): WeatherCodeInfo {
  switch (code) {
    case 0:
      return {
        code,
        label: 'Clear Sky',
        iconName: isDay ? 'Sun' : 'SunMedium',
        category: 'sunny',
        bgGradient: isDay 
          ? 'from-amber-500/20 via-sky-500/10 to-blue-500/10' 
          : 'from-indigo-950/40 via-slate-900/40 to-blue-950/40',
        cardBg: isDay ? 'bg-amber-500/10 border-amber-500/20' : 'bg-indigo-950/20 border-indigo-800/30',
        badgeBg: 'bg-amber-500/15',
        badgeText: 'text-amber-700 dark:text-amber-300',
      };
    case 1:
      return {
        code,
        label: 'Mainly Clear',
        iconName: 'CloudSun',
        category: 'sunny',
        bgGradient: 'from-sky-400/20 via-blue-500/10 to-indigo-500/10',
        cardBg: 'bg-sky-500/10 border-sky-500/20',
        badgeBg: 'bg-sky-500/15',
        badgeText: 'text-sky-700 dark:text-sky-300',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        iconName: 'CloudSun',
        category: 'cloudy',
        bgGradient: 'from-sky-500/15 via-slate-500/10 to-indigo-500/10',
        cardBg: 'bg-slate-500/10 border-slate-500/20',
        badgeBg: 'bg-slate-500/15',
        badgeText: 'text-slate-700 dark:text-slate-300',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        iconName: 'Cloud',
        category: 'cloudy',
        bgGradient: 'from-slate-600/20 via-slate-500/15 to-zinc-600/15',
        cardBg: 'bg-slate-600/10 border-slate-600/20',
        badgeBg: 'bg-slate-600/20',
        badgeText: 'text-slate-800 dark:text-slate-200',
      };
    case 45:
    case 48:
      return {
        code,
        label: code === 48 ? 'Depositing Rime Fog' : 'Foggy',
        iconName: 'CloudFog',
        category: 'foggy',
        bgGradient: 'from-slate-500/20 via-zinc-400/15 to-slate-600/15',
        cardBg: 'bg-slate-400/10 border-slate-400/20',
        badgeBg: 'bg-slate-400/20',
        badgeText: 'text-slate-700 dark:text-slate-300',
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: code === 55 ? 'Dense Drizzle' : 'Light Drizzle',
        iconName: 'CloudDrizzle',
        category: 'rainy',
        bgGradient: 'from-cyan-500/20 via-blue-500/15 to-slate-600/15',
        cardBg: 'bg-cyan-500/10 border-cyan-500/20',
        badgeBg: 'bg-cyan-500/20',
        badgeText: 'text-cyan-700 dark:text-cyan-300',
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        iconName: 'CloudDrizzle',
        category: 'rainy',
        bgGradient: 'from-teal-500/20 via-cyan-600/15 to-slate-700/15',
        cardBg: 'bg-teal-500/10 border-teal-500/20',
        badgeBg: 'bg-teal-500/20',
        badgeText: 'text-teal-700 dark:text-teal-300',
      };
    case 61:
      return {
        code,
        label: 'Slight Rain',
        iconName: 'CloudRain',
        category: 'rainy',
        bgGradient: 'from-blue-600/20 via-sky-600/15 to-slate-700/15',
        cardBg: 'bg-blue-500/10 border-blue-500/20',
        badgeBg: 'bg-blue-500/20',
        badgeText: 'text-blue-700 dark:text-blue-300',
      };
    case 63:
      return {
        code,
        label: 'Moderate Rain',
        iconName: 'CloudRain',
        category: 'rainy',
        bgGradient: 'from-blue-700/25 via-indigo-700/20 to-slate-800/20',
        cardBg: 'bg-blue-600/15 border-blue-600/25',
        badgeBg: 'bg-blue-600/25',
        badgeText: 'text-blue-800 dark:text-blue-200',
      };
    case 65:
      return {
        code,
        label: 'Heavy Rain',
        iconName: 'CloudRain',
        category: 'rainy',
        bgGradient: 'from-blue-900/30 via-indigo-900/25 to-slate-900/25',
        cardBg: 'bg-blue-800/15 border-blue-800/30',
        badgeBg: 'bg-blue-800/25',
        badgeText: 'text-blue-900 dark:text-blue-100',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        iconName: 'CloudRain',
        category: 'rainy',
        bgGradient: 'from-indigo-800/25 via-cyan-800/20 to-slate-800/20',
        cardBg: 'bg-indigo-700/15 border-indigo-700/25',
        badgeBg: 'bg-indigo-700/25',
        badgeText: 'text-indigo-800 dark:text-indigo-200',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        code,
        label: code === 75 ? 'Heavy Snow' : code === 73 ? 'Moderate Snow' : 'Light Snow',
        iconName: 'CloudSnow',
        category: 'snowy',
        bgGradient: 'from-sky-200/30 via-blue-100/20 to-slate-200/20',
        cardBg: 'bg-sky-400/10 border-sky-400/20',
        badgeBg: 'bg-sky-400/20',
        badgeText: 'text-sky-800 dark:text-sky-200',
      };
    case 80:
    case 81:
    case 82:
      return {
        code,
        label: code === 82 ? 'Violent Rain Showers' : 'Rain Showers',
        iconName: 'CloudRain',
        category: 'rainy',
        bgGradient: 'from-blue-600/25 via-teal-600/20 to-slate-800/20',
        cardBg: 'bg-blue-500/15 border-blue-500/25',
        badgeBg: 'bg-blue-500/20',
        badgeText: 'text-blue-800 dark:text-blue-200',
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        iconName: 'CloudSnow',
        category: 'snowy',
        bgGradient: 'from-indigo-300/30 via-sky-300/20 to-slate-300/20',
        cardBg: 'bg-sky-300/15 border-sky-300/25',
        badgeBg: 'bg-sky-300/25',
        badgeText: 'text-sky-900 dark:text-sky-100',
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        iconName: 'CloudLightning',
        category: 'stormy',
        bgGradient: 'from-purple-900/30 via-indigo-950/30 to-slate-900/30',
        cardBg: 'bg-purple-900/20 border-purple-700/30',
        badgeBg: 'bg-purple-800/30',
        badgeText: 'text-purple-700 dark:text-purple-200',
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Thunderstorm with Hail',
        iconName: 'CloudLightning',
        category: 'stormy',
        bgGradient: 'from-violet-950/40 via-purple-900/35 to-slate-950/40',
        cardBg: 'bg-violet-900/25 border-violet-700/40',
        badgeBg: 'bg-violet-800/35',
        badgeText: 'text-violet-700 dark:text-violet-200',
      };
    default:
      return {
        code,
        label: 'Variable Conditions',
        iconName: 'CloudSun',
        category: 'cloudy',
        bgGradient: 'from-slate-500/20 via-sky-500/10 to-indigo-500/10',
        cardBg: 'bg-slate-500/10 border-slate-500/20',
        badgeBg: 'bg-slate-500/15',
        badgeText: 'text-slate-700 dark:text-slate-300',
      };
  }
}
