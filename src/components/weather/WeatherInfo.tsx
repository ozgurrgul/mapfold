import { useEffect, useState } from "react";
import { MapPosition } from "@/types/map";
import { Thermometer, Wind, Droplets, Eye, Gauge } from "lucide-react";

const weatherCodes: { [key: number]: string } = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with heavy hail",
};

const directions = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
];

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  icon: string;
}

interface WeatherInfoProps {
  position?: MapPosition;
  className?: string;
}

export const WeatherInfo: React.FC<WeatherInfoProps> = ({
  position,
  className = "",
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!position) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${position.lat}&longitude=${position.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,visibility,weather_code&timezone=auto`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        const current = data.current;

        // Map weather codes to descriptions (WMO codes)
        const getWeatherDescription = (code: number): string => {
          return weatherCodes[code] || "Unknown";
        };

        setWeather({
          temperature: Math.round(current.temperature_2m),
          description: getWeatherDescription(current.weather_code),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
          windDirection: current.wind_direction_10m,
          pressure: Math.round(current.surface_pressure),
          visibility: Math.round((current.visibility / 1000) * 10) / 10, // Convert to km
          icon: current.weather_code.toString(),
        });
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Failed to load weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [position]);

  if (!position || loading || error || !weather) return null;

  const getWindDirection = (degrees: number): string => {
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <div
      className={`bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md z-[9999] ${className}`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-orange-500" />
            <span className="font-semibold text-lg">
              {weather.temperature}°C
            </span>
          </div>
          <div className="text-sm text-gray-600">{weather.description}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <Droplets className="w-3 h-3 text-blue-500" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <Wind className="w-3 h-3 text-gray-500" />
            <span>
              {weather.windSpeed} km/h {getWindDirection(weather.windDirection)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Gauge className="w-3 h-3 text-purple-500" />
            <span>{weather.pressure} hPa</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3 text-green-500" />
            <span>{weather.visibility} km</span>
          </div>
        </div>
      </div>
    </div>
  );
};
