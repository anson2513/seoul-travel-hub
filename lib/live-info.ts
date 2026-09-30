import {
  outdoorWeatherPlaceIdSet,
  type OutdoorWeatherResponse,
  type OutdoorWeatherRisk,
  type OutdoorWeatherTarget,
} from "@/lib/itinerary-weather";
import { seoul2026Trip } from "@/lib/seoul-2026-master";

export type WeatherInfo = {
  source: "OpenWeather" | "Open-Meteo";
  location: string;
  temperature: number | null;
  feelsLike: number | null;
  rainChance: number | null;
  description: string;
  icon: string;
  updatedAt: string;
};

export type ExchangeInfo = {
  source: "ExchangeRate API";
  base: "TWD";
  target: "KRW";
  rate: number | null;
  updatedAt: string;
};

type OpenWeatherForecast = {
  list?: Array<{
    pop?: number;
    main?: {
      temp?: number;
      feels_like?: number;
    };
    weather?: Array<{
      description?: string;
      icon?: string;
      main?: string;
    }>;
  }>;
};

type OpenMeteoForecast = {
  current?: {
    time?: string;
    temperature_2m?: number;
    apparent_temperature?: number;
    weather_code?: number;
  };
  hourly?: {
    time?: string[];
    precipitation_probability?: number[];
  };
};

type OpenMeteoItineraryForecast = {
  hourly?: {
    time?: string[];
    precipitation_probability?: Array<number | null>;
    weather_code?: Array<number | null>;
    wind_speed_10m?: Array<number | null>;
    wind_gusts_10m?: Array<number | null>;
  };
};

type ExchangeRateResponse = {
  rates?: {
    KRW?: number;
  };
};

type LiveFetchOptions = {
  refresh?: boolean;
};

const seoul = {
  latitude: 37.5665,
  longitude: 126.978,
};

function formatNow(timeZone = "Asia/Taipei") {
  return new Intl.DateTimeFormat("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(new Date());
}

function round(value?: number | null) {
  return typeof value === "number" ? Math.round(value) : null;
}

function fetchCacheOptions(revalidateSeconds: number, refresh?: boolean) {
  return refresh
    ? { cache: "no-store" as const }
    : { next: { revalidate: revalidateSeconds } };
}

function timeoutSignal() {
  return AbortSignal.timeout(3500);
}

function maxNumber(values: Array<number | null | undefined>) {
  const numbers = values.filter(
    (value): value is number => typeof value === "number",
  );
  return numbers.length ? Math.round(Math.max(...numbers)) : null;
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function hourOverlapsVisit(
  forecastTime: string,
  startTime: string,
  endTime: string,
) {
  const hour = forecastTime.slice(11, 16);
  const hourStart = timeToMinutes(hour);
  const visitStart = timeToMinutes(startTime);
  const visitEnd = timeToMinutes(endTime);
  return hourStart < visitEnd && hourStart + 60 > visitStart;
}

function isRainCode(code: number | null | undefined) {
  return typeof code === "number" &&
    ((code >= 51 && code <= 67) || (code >= 80 && code <= 82));
}

function isThunderstormCode(code: number | null | undefined) {
  return typeof code === "number" && code >= 95 && code <= 99;
}

function openWeatherIcon(icon?: string) {
  if (!icon) return "☁️";
  if (icon.startsWith("01")) return "☀️";
  if (icon.startsWith("02")) return "🌤️";
  if (icon.startsWith("03") || icon.startsWith("04")) return "☁️";
  if (icon.startsWith("09") || icon.startsWith("10")) return "🌧️";
  if (icon.startsWith("11")) return "⛈️";
  if (icon.startsWith("13")) return "❄️";
  return "🌫️";
}

function openMeteoDescription(code?: number) {
  if (code === 0) return { text: "晴朗", icon: "☀️" };
  if ([1, 2].includes(code ?? -1)) return { text: "多雲時晴", icon: "🌤️" };
  if (code === 3) return { text: "多雲", icon: "☁️" };
  if ([45, 48].includes(code ?? -1)) return { text: "霧", icon: "🌫️" };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code ?? -1)) {
    return { text: "有雨", icon: "🌧️" };
  }
  if ([71, 73, 75, 85, 86].includes(code ?? -1)) {
    return { text: "下雪", icon: "❄️" };
  }
  if ([95, 96, 99].includes(code ?? -1)) return { text: "雷雨", icon: "⛈️" };
  return { text: "天氣資料", icon: "☁️" };
}

async function getOpenWeather(
  options: LiveFetchOptions = {},
): Promise<WeatherInfo | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) return null;

  const params = new URLSearchParams({
    lat: String(seoul.latitude),
    lon: String(seoul.longitude),
    appid: apiKey,
    units: "metric",
    lang: "zh_tw",
  });

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?${params.toString()}`,
    {
      ...fetchCacheOptions(900, options.refresh),
      signal: timeoutSignal(),
    },
  );

  if (!response.ok) return null;

  const data = (await response.json()) as OpenWeatherForecast;
  const current = data.list?.[0];

  if (!current) return null;

  const weather = current.weather?.[0];

  return {
    source: "OpenWeather",
    location: "首爾",
    temperature: round(current.main?.temp),
    feelsLike: round(current.main?.feels_like),
    rainChance: round((current.pop ?? 0) * 100),
    description: weather?.description ?? weather?.main ?? "天氣資料",
    icon: openWeatherIcon(weather?.icon),
    updatedAt: formatNow(),
  };
}

async function getOpenMeteo(options: LiveFetchOptions = {}): Promise<WeatherInfo> {
  const params = new URLSearchParams({
    latitude: String(seoul.latitude),
    longitude: String(seoul.longitude),
    current: "temperature_2m,apparent_temperature,weather_code",
    hourly: "precipitation_probability",
    timezone: "Asia/Tokyo",
    forecast_days: "1",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
    {
      ...fetchCacheOptions(900, options.refresh),
      signal: timeoutSignal(),
    },
  );

  if (!response.ok) {
    return {
      source: "Open-Meteo",
      location: "首爾",
      temperature: null,
      feelsLike: null,
      rainChance: null,
      description: "暫無天氣資料",
      icon: "☁️",
      updatedAt: formatNow(),
    };
  }

  const data = (await response.json()) as OpenMeteoForecast;
  const currentTime = data.current?.time;
  const hourlyIndex = currentTime
    ? data.hourly?.time?.findIndex((time) => time >= currentTime)
    : -1;
  const rainChance =
    typeof hourlyIndex === "number" && hourlyIndex >= 0
      ? data.hourly?.precipitation_probability?.[hourlyIndex]
      : null;
  const description = openMeteoDescription(data.current?.weather_code);

  return {
    source: "Open-Meteo",
    location: "首爾",
    temperature: round(data.current?.temperature_2m),
    feelsLike: round(data.current?.apparent_temperature),
    rainChance: round(rainChance),
    description: description.text,
    icon: description.icon,
    updatedAt: formatNow(),
  };
}

export async function getSeoulWeather(
  options: LiveFetchOptions = {},
): Promise<WeatherInfo> {
  try {
    return (await getOpenWeather(options)) ?? (await getOpenMeteo(options));
  } catch {
    return {
      source: "Open-Meteo",
      location: "首爾",
      temperature: null,
      feelsLike: null,
      rainChance: null,
      description: "暫無天氣資料",
      icon: "☁️",
      updatedAt: formatNow(),
    };
  }
}

export async function getSeoulOutdoorWeather(): Promise<OutdoorWeatherResponse> {
  const params = new URLSearchParams({
    latitude: String(seoul.latitude),
    longitude: String(seoul.longitude),
    hourly:
      "precipitation_probability,weather_code,wind_speed_10m,wind_gusts_10m",
    timezone: "Asia/Seoul",
    forecast_days: "16",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
    {
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    },
  );

  if (!response.ok) throw new Error("Outdoor weather request failed");

  const data = (await response.json()) as OpenMeteoItineraryForecast;
  const hourly = data.hourly;
  const times = hourly?.time ?? [];

  const targets: OutdoorWeatherTarget[] = seoul2026Trip.days.flatMap((day) =>
    day.places
      .filter((place) => outdoorWeatherPlaceIdSet.has(place.id))
      .map((place) => {
        const startTime = place.startTime ?? "09:00";
        const endTime = place.endTime ?? "10:00";
        const indices = times.flatMap((time, index) =>
          time.startsWith(`${day.date}T`) &&
          hourOverlapsVisit(time, startTime, endTime)
            ? [index]
            : [],
        );

        if (!indices.length) {
          return {
            itemId: place.id,
            title: place.nameZh,
            date: day.date,
            startTime,
            endTime,
            status: "unavailable",
            severity: "safe",
            rainChance: null,
            maxWindSpeed: null,
            maxWindGust: null,
            risks: [],
            backupPlan: place.backupPlan,
          } satisfies OutdoorWeatherTarget;
        }

        const rainChance = maxNumber(
          indices.map((index) => hourly?.precipitation_probability?.[index]),
        );
        const maxWindSpeed = maxNumber(
          indices.map((index) => hourly?.wind_speed_10m?.[index]),
        );
        const maxWindGust = maxNumber(
          indices.map((index) => hourly?.wind_gusts_10m?.[index]),
        );
        const weatherCodes = indices.map(
          (index) => hourly?.weather_code?.[index],
        );
        const risks: OutdoorWeatherRisk[] = [];

        if (weatherCodes.some(isThunderstormCode)) {
          risks.push({ type: "thunderstorm", label: "可能有雷雨" });
        }
        if (weatherCodes.some(isRainCode) || (rainChance ?? 0) >= 50) {
          risks.push({
            type: "rain",
            label: `降雨機率最高 ${rainChance ?? 0}%`,
          });
        }
        if ((maxWindSpeed ?? 0) >= 35 || (maxWindGust ?? 0) >= 50) {
          risks.push({
            type: "strong_wind",
            label: `陣風最高 ${maxWindGust ?? maxWindSpeed ?? 0} km/h`,
          });
        }

        return {
          itemId: place.id,
          title: place.nameZh,
          date: day.date,
          startTime,
          endTime,
          status: "available",
          severity: risks.length ? "warning" : "safe",
          rainChance,
          maxWindSpeed,
          maxWindGust,
          risks,
          backupPlan: place.backupPlan,
        } satisfies OutdoorWeatherTarget;
      }),
  );

  return {
    source: "Open-Meteo",
    updatedAt: formatNow("Asia/Seoul"),
    targets,
  };
}

export async function getTwdKrwRate(
  options: LiveFetchOptions = {},
): Promise<ExchangeInfo> {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/TWD", {
      ...fetchCacheOptions(3600, options.refresh),
      signal: timeoutSignal(),
    });

    if (!response.ok) throw new Error("Exchange request failed");

    const data = (await response.json()) as ExchangeRateResponse;

    return {
      source: "ExchangeRate API",
      base: "TWD",
      target: "KRW",
      rate: data.rates?.KRW ?? null,
      updatedAt: formatNow(),
    };
  } catch {
    return {
      source: "ExchangeRate API",
      base: "TWD",
      target: "KRW",
      rate: null,
      updatedAt: formatNow(),
    };
  }
}
