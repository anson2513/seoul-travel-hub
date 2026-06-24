"use client";

import { BadgeDollarSign, CloudSun, Plane, RefreshCw } from "lucide-react";
import { useState } from "react";
import type { ExchangeInfo, WeatherInfo } from "@/lib/live-info";
import type { FlightInfo } from "@/lib/travel-data";

type TravelInfoCardProps = {
  flight: FlightInfo;
  weather: WeatherInfo;
  exchange: ExchangeInfo;
};

type LiveStatus = "idle" | "loading" | "error";

function clientTime() {
  return new Intl.DateTimeFormat("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

function displayRate(rate: number | null) {
  if (!rate) return "更新中";
  return rate.toFixed(2);
}

function displayTemp(value: number | null) {
  return value === null ? "更新中" : `${value}°C`;
}

function metricTextClass(value: number | null) {
  return value === null ? "text-2xl" : "text-4xl";
}

function rateTextClass(rate: number | null) {
  return rate === null ? "text-2xl" : "text-3xl";
}

function refreshIconClass(status: LiveStatus) {
  return status === "loading"
    ? "animate-spin text-neutral-950"
    : "text-neutral-400";
}

export default function TravelInfoCard({
  flight,
  weather: initialWeather,
  exchange: initialExchange,
}: TravelInfoCardProps) {
  const [weather, setWeather] = useState(initialWeather);
  const [exchange, setExchange] = useState(initialExchange);
  const [weatherStatus, setWeatherStatus] = useState<LiveStatus>("idle");
  const [exchangeStatus, setExchangeStatus] = useState<LiveStatus>("idle");

  async function refreshWeather() {
    setWeatherStatus("loading");

    try {
      const response = await fetch("/api/weather", { cache: "no-store" });
      if (!response.ok) throw new Error("Weather refresh failed");
      const nextWeather = (await response.json()) as WeatherInfo;
      setWeather({ ...nextWeather, updatedAt: clientTime() });
      setWeatherStatus("idle");
    } catch {
      setWeatherStatus("error");
    }
  }

  async function refreshExchange() {
    setExchangeStatus("loading");

    try {
      const response = await fetch("/api/exchange", { cache: "no-store" });
      if (!response.ok) throw new Error("Exchange refresh failed");
      const nextExchange = (await response.json()) as ExchangeInfo;
      setExchange({ ...nextExchange, updatedAt: clientTime() });
      setExchangeStatus("idle");
    } catch {
      setExchangeStatus("error");
    }
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-neutral-200/80 bg-white shadow-[0_18px_45px_rgba(39,31,27,0.10)]">
      <div className="p-5">
        <div className="flex items-center gap-3 text-neutral-900">
          <Plane size={21} strokeWidth={2.1} />
          <h2 className="text-lg font-bold">航班資訊</h2>
        </div>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          {flight.airline} · {flight.flightNo}
        </p>

        <div className="mt-3 flex items-center gap-3 text-[2rem] font-bold leading-none text-neutral-950">
          <span>{flight.fromCity}</span>
          <span className="text-2xl text-neutral-300">→</span>
          <span>{flight.toCity}</span>
        </div>

        <p className="mt-3 text-base font-bold text-neutral-500">
          {flight.fromCode} → {flight.toCode} · {flight.direction}
        </p>

        <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-end gap-4">
          <div>
            <p className="text-sm font-semibold text-neutral-400">起飛</p>
            <p className="mt-2 text-3xl font-bold text-neutral-950">
              {flight.departTime}
            </p>
          </div>

          <div className="pb-2 text-3xl text-neutral-300">→</div>

          <div className="text-right">
            <p className="text-sm font-semibold text-neutral-400">抵達</p>
            <p className="mt-2 text-3xl font-bold text-neutral-950">
              {flight.arriveTime}
            </p>
          </div>
        </div>

        <p className="mt-5 rounded-full bg-neutral-50 px-3 py-2 text-center text-sm font-bold text-neutral-500">
          {flight.date}
        </p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-neutral-200/80 border-t border-neutral-200/80">
        <button
          className="flex min-h-[218px] flex-col p-4 text-left active:bg-neutral-50"
          onClick={refreshWeather}
          type="button"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-neutral-900">
              <CloudSun size={18} strokeWidth={2.1} />
              <h2 className="text-base font-bold leading-tight">首爾天氣</h2>
            </div>
            <RefreshCw
              aria-hidden="true"
              className={refreshIconClass(weatherStatus)}
              size={16}
            />
          </div>

          <div className="mt-5 text-center">
            <div className="text-5xl leading-none" aria-hidden="true">
              {weather.icon}
            </div>
            <p
              className={`mt-4 font-bold leading-none text-neutral-950 ${metricTextClass(
                weather.temperature,
              )}`}
            >
              {displayTemp(weather.temperature)}
            </p>
            <p className="mt-3 text-sm font-bold text-neutral-500">
              {weather.description}
            </p>
          </div>

          <div className="mt-auto space-y-1 text-center text-xs font-semibold text-neutral-500">
            <p>體感 {displayTemp(weather.feelsLike)}</p>
            <p>
              降雨機率{" "}
              {weather.rainChance === null ? "更新中" : `${weather.rainChance}%`}
            </p>
            <p className="text-neutral-400">
              {weatherStatus === "error"
                ? "更新失敗，點擊重試"
                : `更新 ${weather.updatedAt}`}
            </p>
          </div>
        </button>

        <button
          className="flex min-h-[218px] flex-col p-4 text-left active:bg-neutral-50"
          onClick={refreshExchange}
          type="button"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-neutral-900">
              <BadgeDollarSign size={18} strokeWidth={2.1} />
              <h2 className="text-base font-bold leading-tight">匯率</h2>
            </div>
            <RefreshCw
              aria-hidden="true"
              className={refreshIconClass(exchangeStatus)}
              size={16}
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg font-bold text-neutral-950">1 TWD</p>
            <p className="my-3 text-xl font-semibold text-neutral-300">=</p>
            <p
              className={`font-bold leading-none text-neutral-950 ${rateTextClass(
                exchange.rate,
              )}`}
            >
              {displayRate(exchange.rate)}
            </p>
            <p className="mt-2 text-base font-bold text-neutral-500">KRW</p>
          </div>

          <div className="mt-auto text-center text-xs font-semibold text-neutral-400">
            <p>
              {exchangeStatus === "error"
                ? "更新失敗，點擊重試"
                : `更新時間 ${exchange.updatedAt}`}
            </p>
          </div>
        </button>
      </div>
    </section>
  );
}
