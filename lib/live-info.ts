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
  base: "KRW";
  target: "TWD";
  rate: number | null;
  updatedAt: string;
};

type OpenWeatherForecast = {
  list?: Array<{
    dt?: number;
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

type ExchangeRateResponse = {
  rates?: {
    TWD?: number;
  };
  time_last_update_utc?: string;
};

type LiveFetchOptions = {
  refresh?: boolean;
};

const seoul = {
  latitude: 37.5665,
  longitude: 126.978,
};

function formatTime(value?: string | number) {
  const date =
    typeof value === "number"
      ? new Date(value * 1000)
      : value
        ? new Date(value)
        : new Date();

  return new Intl.DateTimeFormat("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Taipei",
  }).format(date);
}

function round(value?: number | null) {
  return typeof value === "number" ? Math.round(value) : null;
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
  if ([71, 73, 75, 85, 86].includes(code ?? -1)) return { text: "下雪", icon: "❄️" };
  if ([95, 96, 99].includes(code ?? -1)) return { text: "雷雨", icon: "⛈️" };
  return { text: "天氣資料", icon: "☁️" };
}

function fetchCacheOptions(revalidateSeconds: number, refresh?: boolean) {
  return refresh ? { cache: "no-store" as const } : { next: { revalidate: revalidateSeconds } };
}

async function getOpenWeather(options: LiveFetchOptions = {}): Promise<WeatherInfo | null> {
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
    fetchCacheOptions(900, options.refresh),
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
    updatedAt: formatTime(current.dt),
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
    fetchCacheOptions(900, options.refresh),
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
      updatedAt: formatTime(),
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
    updatedAt: formatTime(currentTime),
  };
}

export async function getSeoulWeather(options: LiveFetchOptions = {}): Promise<WeatherInfo> {
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
      updatedAt: formatTime(),
    };
  }
}

export async function getKrwTwdRate(options: LiveFetchOptions = {}): Promise<ExchangeInfo> {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/KRW", {
      ...fetchCacheOptions(3600, options.refresh),
    });

    if (!response.ok) throw new Error("Exchange request failed");

    const data = (await response.json()) as ExchangeRateResponse;

    return {
      source: "ExchangeRate API",
      base: "KRW",
      target: "TWD",
      rate: data.rates?.TWD ?? null,
      updatedAt: formatTime(data.time_last_update_utc),
    };
  } catch {
    return {
      source: "ExchangeRate API",
      base: "KRW",
      target: "TWD",
      rate: null,
      updatedAt: formatTime(),
    };
  }
}
