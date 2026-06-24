import { BadgeDollarSign, CloudSun, Plane } from "lucide-react";
import type { ExchangeInfo, WeatherInfo } from "@/lib/live-info";
import type { FlightInfo } from "@/lib/travel-data";

type TravelInfoCardProps = {
  flight: FlightInfo;
  weather: WeatherInfo;
  exchange: ExchangeInfo;
};

function displayRate(rate: number | null) {
  if (!rate) return "更新中";
  return rate.toFixed(4);
}

function displayTemp(value: number | null) {
  return value === null ? "更新中" : `${value}°C`;
}

export default function TravelInfoCard({
  flight,
  weather,
  exchange,
}: TravelInfoCardProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-neutral-200/80 bg-white shadow-[0_18px_45px_rgba(39,31,27,0.10)]">
      <div className="grid grid-cols-1 divide-y divide-neutral-200/80 min-[390px]:grid-cols-[1.45fr_1fr_1fr] min-[390px]:divide-x min-[390px]:divide-y-0">
        <div className="p-5">
          <div className="flex items-center gap-3 text-neutral-900">
            <Plane size={19} strokeWidth={2.1} />
            <h2 className="text-base font-bold">航班資訊</h2>
          </div>

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            {flight.airline} · {flight.flightNo}
          </p>

          <div className="mt-3 flex items-center gap-2 text-[1.45rem] font-bold leading-tight text-neutral-950">
            <span>{flight.fromCity}</span>
            <span className="text-xl text-neutral-400">→</span>
            <span>{flight.toCity}</span>
          </div>

          <p className="mt-1 text-sm font-semibold text-neutral-500">
            {flight.fromCode} → {flight.toCode} · {flight.direction}
          </p>

          <div className="mt-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-neutral-400">起飛</p>
              <p className="mt-1 text-2xl font-bold text-neutral-950">
                {flight.departTime}
              </p>
            </div>

            <div className="pb-1 text-3xl text-neutral-300">→</div>

            <div className="text-right">
              <p className="text-xs font-medium text-neutral-400">抵達</p>
              <p className="mt-1 text-2xl font-bold text-neutral-950">
                {flight.arriveTime}
              </p>
            </div>
          </div>

          <p className="mt-5 rounded-full bg-neutral-50 px-3 py-2 text-center text-xs font-semibold text-neutral-500">
            {flight.date}
          </p>
        </div>

        <div className="p-5 text-center">
          <div className="flex items-center justify-center gap-2 text-neutral-900">
            <CloudSun size={19} strokeWidth={2.1} />
            <h2 className="text-base font-bold">首爾天氣</h2>
          </div>

          <div className="mt-6 text-5xl leading-none" aria-hidden="true">
            {weather.icon}
          </div>

          <p className="mt-4 text-3xl font-bold text-neutral-950">
            {displayTemp(weather.temperature)}
          </p>

          <p className="mt-2 text-sm font-semibold text-neutral-500">
            {weather.description}
          </p>

          <div className="mt-4 space-y-1 text-xs font-medium text-neutral-500">
            <p>體感 {displayTemp(weather.feelsLike)}</p>
            <p>
              降雨機率{" "}
              {weather.rainChance === null ? "更新中" : `${weather.rainChance}%`}
            </p>
            <p className="text-neutral-400">更新 {weather.updatedAt}</p>
          </div>
        </div>

        <div className="p-5 text-center">
          <div className="flex items-center justify-center gap-2 text-neutral-900">
            <BadgeDollarSign size={19} strokeWidth={2.1} />
            <h2 className="text-base font-bold">匯率</h2>
          </div>

          <div className="mt-9">
            <p className="text-xl font-bold text-neutral-950">1 KRW</p>
            <p className="my-4 text-xl font-semibold text-neutral-400">=</p>
            <p className="text-2xl font-bold text-neutral-950">
              {displayRate(exchange.rate)}
            </p>
            <p className="mt-1 text-base font-bold text-neutral-500">TWD</p>
          </div>

          <p className="mt-6 text-xs font-medium text-neutral-400">
            更新時間 {exchange.updatedAt}
          </p>
        </div>
      </div>
    </section>
  );
}
