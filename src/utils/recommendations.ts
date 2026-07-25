import { WeatherData, PlanningIntelligence, ActivityRecommendation } from '../types/weather';

export function calculatePlanningIntelligence(data: WeatherData): PlanningIntelligence {
  const current = data.current;
  const hourly = data.hourly;
  const daily = data.daily;

  const currentTemp = current.temperature_2m;
  const currentRainProb = hourly.precipitation_probability?.[0] ?? 0;
  const currentWind = current.wind_speed_10m;
  const currentUV = hourly.uv_index?.[0] ?? daily.uv_index_max?.[0] ?? 0;
  const maxUVToday = daily.uv_index_max?.[0] ?? 0;
  const maxRainProbToday = daily.precipitation_probability_max?.[0] ?? 0;
  const rainSumToday = daily.precipitation_sum?.[0] ?? 0;
  const windGustMax = daily.wind_gusts_10m_max?.[0] ?? current.wind_gusts_10m ?? 0;
  const weatherCode = current.weather_code;

  // 1. Calculate overall outdoor score (0 - 100)
  let score = 100;

  // Temperature penalty (Ideal range 18-25°C)
  if (currentTemp < 18) {
    score -= Math.min(40, (18 - currentTemp) * 2.5);
  } else if (currentTemp > 25) {
    score -= Math.min(40, (currentTemp - 25) * 3);
  }

  // Rain penalty
  if (maxRainProbToday > 20) {
    score -= (maxRainProbToday - 20) * 0.5;
  }
  if (rainSumToday > 0) {
    score -= Math.min(30, rainSumToday * 5);
  }

  // Wind penalty
  if (currentWind > 15) {
    score -= Math.min(25, (currentWind - 15) * 1.2);
  }

  // Severe weather penalty
  if ([95, 96, 99].includes(weatherCode)) {
    score -= 60; // Thunderstorm
  } else if ([63, 65, 73, 75].includes(weatherCode)) {
    score -= 40; // Heavy rain or snow
  } else if ([45, 48].includes(weatherCode)) {
    score -= 25; // Fog
  }

  const overallOutdoorScore = Math.max(5, Math.min(100, Math.round(score)));

  // 2. Summary text
  let summary = '';
  if (overallOutdoorScore >= 80) {
    summary = 'Exceptional weather for outdoor activities today! Clear, mild conditions ahead.';
  } else if (overallOutdoorScore >= 60) {
    summary = 'Favorable weather overall with moderate comfort. Good for casual outdoor plans.';
  } else if (overallOutdoorScore >= 40) {
    summary = 'Fair conditions with minor weather cautions. Check forecast details before heading out.';
  } else {
    summary = 'Unfavorable outdoor weather today. Indoor plans or protective gear strongly recommended.';
  }

  // 3. Clothing suggestion
  let clothingSuggestion = '';
  let clothingIcon = 'Shirt';

  if (currentTemp < 0) {
    clothingSuggestion = 'Heavy insulated winter coat, thermal inner layers, gloves, beanie & scarf';
    clothingIcon = 'Jacket';
  } else if (currentTemp < 10) {
    clothingSuggestion = 'Warm coat or fleece jacket, warm sweater, and long pants';
    clothingIcon = 'Jacket';
  } else if (currentTemp < 18) {
    clothingSuggestion = 'Light jacket, pullover hoodie, or cardigan with long trousers';
    clothingIcon = 'Shirt';
  } else if (currentTemp <= 25) {
    clothingSuggestion = 'Breathable T-shirt, jeans or light chinos, and comfortable sneakers';
    clothingIcon = 'Shirt';
  } else {
    clothingSuggestion = 'Lightweight linen or cotton shirt, shorts, sunglasses & sun hat';
    clothingIcon = 'Sun';
  }

  // 4. Umbrella alert
  const umbrellaNeeded = rainSumToday > 0.5 || maxRainProbToday > 40 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96].includes(weatherCode);

  // 5. UV warning
  let uvWarning: string | null = null;
  if (maxUVToday >= 8) {
    uvWarning = `Very High UV Index (${maxUVToday.toFixed(1)}) — High risk of harm. Apply SPF 50+ sunscreen, wear UV sunglasses & stay in shade during peak hours (11:00 - 15:00).`;
  } else if (maxUVToday >= 6) {
    uvWarning = `High UV Index (${maxUVToday.toFixed(1)}) — Sun protection required. Wear SPF 30+ sunscreen, hat, and sunglasses.`;
  }

  // 6. Wind warning
  let windWarning: string | null = null;
  if (windGustMax >= 50) {
    windWarning = `High Wind Advisory: Gusts up to ${Math.round(windGustMax)} km/h. Secure loose outdoor furniture and exercise caution while driving.`;
  } else if (currentWind >= 30) {
    windWarning = `Breezy conditions with winds at ${Math.round(currentWind)} km/h.`;
  }

  // 7. Find best 2-hour walking window today
  let bestWalkingWindow: PlanningIntelligence['bestWalkingWindow'] = null;
  if (hourly.time && hourly.time.length >= 12) {
    const nowIso = new Date().toISOString().slice(0, 13);
    let startIndex = hourly.time.findIndex(t => t.startsWith(nowIso));
    if (startIndex === -1) startIndex = 0;

    let bestScore = -1;
    let bestStartIdx = startIndex;

    for (let i = startIndex; i < Math.min(startIndex + 14, hourly.time.length - 2); i++) {
      const temp1 = hourly.temperature_2m[i];
      const temp2 = hourly.temperature_2m[i + 1];
      const rainProb1 = hourly.precipitation_probability?.[i] ?? 0;
      const rainProb2 = hourly.precipitation_probability?.[i + 1] ?? 0;
      const wind1 = hourly.wind_speed_10m?.[i] ?? 0;
      const uv1 = hourly.uv_index?.[i] ?? 0;

      const avgTemp = (temp1 + temp2) / 2;
      const maxRainProb = Math.max(rainProb1, rainProb2);

      let windowScore = 100 - maxRainProb - (wind1 * 1.2) - (uv1 > 7 ? 20 : 0);
      if (avgTemp >= 16 && avgTemp <= 24) windowScore += 20;

      if (windowScore > bestScore) {
        bestScore = windowScore;
        bestStartIdx = i;
      }
    }

    if (bestStartIdx < hourly.time.length - 1) {
      const startTime = new Date(hourly.time[bestStartIdx]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const endTime = new Date(hourly.time[bestStartIdx + 2] || hourly.time[bestStartIdx + 1]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const avgTemp = Math.round((hourly.temperature_2m[bestStartIdx] + hourly.temperature_2m[bestStartIdx + 1]) / 2);
      const rainProb = hourly.precipitation_probability?.[bestStartIdx] ?? 0;

      bestWalkingWindow = {
        start: startTime,
        end: endTime,
        temp: avgTemp,
        description: rainProb < 20 ? 'Optimal dry conditions with comfortable temperature' : `Low rain probability (${rainProb}%)`,
      };
    }
  }

  // 8. Calculate specific activity suitability scores
  const activities: ActivityRecommendation[] = [
    calcRunningScore(currentTemp, currentRainProb, currentWind, weatherCode),
    calcCyclingScore(currentTemp, currentWind, currentRainProb, weatherCode),
    calcOutdoorDiningScore(currentTemp, currentRainProb, currentWind, maxUVToday, weatherCode),
    calcPhotographyScore(current.cloud_cover, currentRainProb, hourly.visibility?.[0] ?? 10000, weatherCode),
    calcStargazingScore(current.cloud_cover, current.relative_humidity_2m, current.is_day, weatherCode),
    calcGardeningScore(currentTemp, rainSumToday, currentWind, weatherCode),
    calcCarWashScore(rainSumToday, daily.precipitation_probability_max?.[1] ?? 0, current.cloud_cover),
  ];

  // 9. Alerts list
  const alerts: PlanningIntelligence['alerts'] = [];
  if (umbrellaNeeded) {
    alerts.push({
      type: 'warning',
      title: 'Umbrella Recommended',
      message: maxRainProbToday > 50 
        ? `High chance of rain today (${maxRainProbToday}%). Keep an umbrella handy!` 
        : 'Rain or drizzle expected today. Carry waterproof clothing.',
    });
  }
  if (uvWarning) {
    alerts.push({
      type: 'alert',
      title: 'Sun Protection Notice',
      message: uvWarning,
    });
  }
  if (windWarning) {
    alerts.push({
      type: 'info',
      title: 'Wind Alert',
      message: windWarning,
    });
  }
  if (currentTemp < 2) {
    alerts.push({
      type: 'alert',
      title: 'Frost / Ice Caution',
      message: 'Near-freezing temperatures! Be mindful of black ice on roads and slippery walkways.',
    });
  } else if (currentTemp > 32) {
    alerts.push({
      type: 'alert',
      title: 'Extreme Heat Caution',
      message: 'High temperatures! Stay hydrated, seek air conditioning, and limit strenuous outdoor work.',
    });
  }

  return {
    overallOutdoorScore,
    summary,
    clothingSuggestion,
    clothingIcon,
    umbrellaNeeded,
    uvWarning,
    windWarning,
    bestWalkingWindow,
    activities,
    alerts,
  };
}

// Activity scoring helpers
function getRating(score: number): ActivityRecommendation['rating'] {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

function calcRunningScore(temp: number, rainProb: number, wind: number, code: number): ActivityRecommendation {
  let score = 100;
  if (temp < 8) score -= (8 - temp) * 3;
  else if (temp > 22) score -= (temp - 22) * 4;
  else if (temp >= 10 && temp <= 16) score += 10; // ideal temp range for running

  score -= rainProb * 0.6;
  score -= wind * 0.8;
  if ([95, 96, 99].includes(code)) score -= 70;

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  return {
    id: 'running',
    name: 'Running & Jogging',
    category: 'sports',
    icon: 'Footprints',
    score: finalScore,
    rating: getRating(finalScore),
    reason: temp < 8 ? 'Chilly air — wear thermal layers' : temp > 22 ? 'Warm weather — stay well hydrated' : 'Comfortable temperature for cardiovascular effort',
    tip: finalScore > 75 ? 'Great time for a long run!' : 'Pace yourself and bring water.',
  };
}

function calcCyclingScore(temp: number, wind: number, rainProb: number, code: number): ActivityRecommendation {
  let score = 100;
  if (temp < 10) score -= (10 - temp) * 4;
  if (temp > 28) score -= (temp - 28) * 3;
  
  // Wind is very impactful for cycling
  if (wind > 15) score -= (wind - 15) * 2;
  score -= rainProb * 0.7;
  if ([95, 96, 99].includes(code)) score -= 80;

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  return {
    id: 'cycling',
    name: 'Cycling & Biking',
    category: 'sports',
    icon: 'Bike',
    score: finalScore,
    rating: getRating(finalScore),
    reason: wind > 20 ? `Strong headwinds (${Math.round(wind)} km/h)` : rainProb > 30 ? 'Slippery roads likely' : 'Favorable wind and road conditions',
    tip: wind > 20 ? 'Choose sheltered routes or bike paths with windbreaks.' : 'Ideal conditions for a ride.',
  };
}

function calcOutdoorDiningScore(temp: number, rainProb: number, wind: number, uv: number, code: number): ActivityRecommendation {
  let score = 100;
  if (temp < 18) score -= (18 - temp) * 5;
  if (temp > 28) score -= (temp - 28) * 4;
  if (temp >= 20 && temp <= 25) score += 10;

  score -= rainProb * 0.9;
  if (wind > 15) score -= (wind - 15) * 2.5;
  if ([95, 96, 99, 63, 65].includes(code)) score = 0;

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  return {
    id: 'dining',
    name: 'Outdoor Dining & Patio',
    category: 'leisure',
    icon: 'Utensils',
    score: finalScore,
    rating: getRating(finalScore),
    reason: temp < 18 ? 'Cool breeze — patio heaters required' : rainProb > 20 ? 'Chance of rain shower' : 'Warm, pleasant terrace conditions',
    tip: uv > 6 ? 'Seek patio umbrellas or shaded seating.' : 'Perfect for alfresco meals.',
  };
}

function calcPhotographyScore(cloudCover: number, rainProb: number, visibility: number, code: number): ActivityRecommendation {
  let score = 70;
  // Golden hour / dramatic skies often benefit from partial clouds (30-60%)
  if (cloudCover >= 20 && cloudCover <= 60) score += 25;
  if (visibility > 10000) score += 10;

  score -= rainProb * 0.5;
  if ([45, 48].includes(code)) score = 85; // Fog can be very atmospheric for photography!

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  return {
    id: 'photography',
    name: 'Landscape Photography',
    category: 'leisure',
    icon: 'Camera',
    score: finalScore,
    rating: getRating(finalScore),
    reason: cloudCover >= 20 && cloudCover <= 60 ? 'Soft diffuse lighting with dramatic cloud textures' : 'Clear lighting conditions',
    tip: 'Capture golden hour light during sunrise or sunset.',
  };
}

function calcStargazingScore(cloudCover: number, humidity: number, isDay: number, code: number): ActivityRecommendation {
  let score = 100;
  if (isDay === 1) score -= 40; // Daytime penalty
  score -= cloudCover * 0.8;
  if (humidity > 85) score -= 20; // Haze/dew
  if ([45, 48, 61, 63, 65].includes(code)) score = 0;

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  return {
    id: 'stargazing',
    name: 'Stargazing & Astronomy',
    category: 'leisure',
    icon: 'Sparkles',
    score: finalScore,
    rating: getRating(finalScore),
    reason: cloudCover < 15 ? 'Crystal clear sky for dark-sky viewing' : `Cloud coverage around ${cloudCover}%`,
    tip: isDay === 1 ? 'Wait until 1-2 hours after sunset for dark skies.' : 'Find an spot away from city lights.',
  };
}

function calcGardeningScore(temp: number, rainSum: number, wind: number, code: number): ActivityRecommendation {
  let score = 85;
  if (temp < 10 || temp > 30) score -= 30;
  if (wind > 25) score -= 25;
  if (rainSum > 10) score -= 40; // Muddy soil

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  return {
    id: 'gardening',
    name: 'Gardening & Lawn Care',
    category: 'lifestyle',
    icon: 'Flower2',
    score: finalScore,
    rating: getRating(finalScore),
    reason: rainSum > 5 ? 'Soil is thoroughly moist' : temp >= 15 && temp <= 25 ? 'Mild temperatures ideal for plant care' : 'Moderate gardening weather',
    tip: 'Best time to water plants is early morning or late afternoon.',
  };
}

function calcCarWashScore(rainToday: number, rainTomorrowProb: number, cloudCover: number): ActivityRecommendation {
  let score = 100;
  if (rainToday > 0.2) score -= 60;
  if (rainTomorrowProb > 40) score -= 50;
  if (cloudCover < 30) score += 10;

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  return {
    id: 'carwash',
    name: 'Car Wash Suitability',
    category: 'lifestyle',
    icon: 'Sparkle',
    score: finalScore,
    rating: getRating(finalScore),
    reason: rainTomorrowProb > 40 ? 'Rain likely tomorrow — wash might not last long' : rainToday > 0 ? 'Wet conditions today' : 'Dry conditions expected today and tomorrow',
    tip: 'Wash in shade to avoid water spots drying too fast in direct sun.',
  };
}
