# Weather Intelligence

**Weather Intelligence** is a real-time weather forecasting and smart activity planning application built with React, TypeScript, Tailwind CSS, and Recharts. It leverages open weather data and predictive intelligence to present live weather metrics, 24-hour hourly trend charts, 7-day extended forecasts, barometric & UV details, and custom activity recommendations.

---

## Key Features

- **Global City Search & Geocoding**: Search cities worldwide with instantaneous auto-suggestions and quick access to popular world capitals or saved favorite locations.
- **Current Weather Overview**: Live temperature, weather condition iconography, high/low daily range, feels-like thermal temperature, and humidity saturation.
- **24-Hour Hourly Trends**: Interactive Recharts area chart visualizing hourly projections for temperature, precipitation probability, and wind speeds over the next 24 hours.
- **7-Day Extended Forecast**: Comprehensive daily forecast list with relative high/low temperature distribution bars and expandable daily weather metrics.
- **Weather Details Grid**: Detailed environmental metrics cards covering UV Index, Wind & Gust Compass, Humidity & Dew Point, Sunrise/Sunset Daylight Progress, Barometric Pressure, and Optical Visibility.
- **Weather Intelligence & Activity Planning**: Smart recommendation engine offering real-time clothing recommendations, optimal 2-hour outdoor windows, and suitability ratings for outdoor activities (running, cycling, hiking, outdoor dining, and photography).
- **Unit Toggling & Saved Favorites**: Seamless switching between Metric (°C / km/h) and Imperial (°F / mph) units, with local state persistence for pinned favorite locations.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Charts & Visualization**: Recharts
- **Icons**: Lucide React
- **Animations**: Motion (`motion/react`)
- **AI / GenAI Integration**: `@google/genai`

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

1. Clone or download the repository.
2. Install the required dependencies:
   ```bash
   npm install
   ```

### Development

To start the local development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your web browser.

### Build & Production

To compile the application for production:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## Project Structure

```text
├── src/
│   ├── components/         # Visual sub-components (HourlyForecast, DailyForecast, PlanningIntelligence, etc.)
│   ├── types.ts            # Global TypeScript definitions and data interfaces
│   ├── App.tsx             # Main dashboard container & state controller
│   ├── main.tsx            # Vite React entry point
│   └── index.css           # Global Tailwind CSS configuration
├── metadata.json           # Application name, description, and permissions
├── package.json            # Project dependencies & build scripts
└── vite.config.ts          # Vite build configuration
```

---

## License

This project is licensed under the MIT License.
