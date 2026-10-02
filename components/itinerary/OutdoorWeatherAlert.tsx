import {
  CheckCircle2,
  CloudRain,
  CloudSun,
  RefreshCw,
  Thermometer,
  TriangleAlert,
  Wind,
} from "lucide-react";
import type {
  OutdoorWeatherDay,
  OutdoorWeatherTarget,
} from "@/lib/itinerary-weather";

export type OutdoorWeatherStatus =
  | "loading"
  | "refreshing"
  | "ready"
  | "error";

type OutdoorWeatherAlertProps = {
  dayLabel: string;
  dayWeather?: OutdoorWeatherDay;
  placeNames: string[];
  targets: OutdoorWeatherTarget[];
  status: OutdoorWeatherStatus;
  updatedAt?: string;
  onRefresh: () => void;
};

function clothingAdvice(dayWeather?: OutdoorWeatherDay) {
  const lowest = dayWeather?.minApparentTemperature ?? dayWeather?.minTemperature;
  if (lowest === null || lowest === undefined) return null;
  if (lowest <= 12) return "氣溫偏低，建議帶保暖外套";
  if (lowest <= 18) return "早晚偏涼，建議帶薄外套";
  return "整日氣溫舒適，可依個人體感穿著";
}

function metricSummary(target: OutdoorWeatherTarget) {
  const temperature =
    target.minTemperature === null || target.maxTemperature === null
      ? null
      : target.minTemperature === target.maxTemperature
        ? `氣溫 ${target.minTemperature}°C`
        : `氣溫 ${target.minTemperature}-${target.maxTemperature}°C`;
  const metrics = [
    temperature,
    target.minApparentTemperature === null
      ? null
      : `體感最低 ${target.minApparentTemperature}°C`,
    target.rainChance === null ? null : `降雨 ${target.rainChance}%`,
    target.maxWindSpeed === null
      ? null
      : `風速 ${target.maxWindSpeed} km/h`,
    target.maxWindGust === null
      ? null
      : `陣風 ${target.maxWindGust} km/h`,
  ].filter(Boolean);

  return metrics.join(" · ");
}

export function OutdoorWeatherBadge({
  target,
}: {
  target?: OutdoorWeatherTarget;
}) {
  if (!target || target.status !== "available" || target.severity !== "warning") {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
      <TriangleAlert size={13} />
      天氣警告
    </span>
  );
}

export function OutdoorWeatherDetail({
  target,
}: {
  target?: OutdoorWeatherTarget;
}) {
  if (!target) return null;

  if (target.status === "unavailable") {
    return (
      <section className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="flex items-center gap-2 text-base font-bold text-neutral-950">
          <CloudSun size={18} />
          戶外天氣
        </h3>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-neutral-500">
          尚未進入 16 天預報範圍，接近行程日期後會自動更新。
        </p>
      </section>
    );
  }

  const isWarning = target.severity === "warning";

  return (
    <section
      className={`mt-5 rounded-2xl border p-4 ${
        isWarning ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"
      }`}
    >
      <h3 className="flex items-center gap-2 text-base font-bold text-neutral-950">
        {isWarning ? <TriangleAlert size={18} /> : <CheckCircle2 size={18} />}
        {isWarning ? "戶外天氣警告" : "戶外天氣正常"}
      </h3>
      <p className="mt-2 text-sm font-semibold leading-relaxed text-neutral-600">
        {metricSummary(target)}
      </p>
      {isWarning ? (
        <p className="mt-1 text-sm font-bold leading-relaxed text-red-700">
          {target.risks.map((risk) => risk.label).join(" · ")}
        </p>
      ) : null}
      {isWarning && target.backupPlan ? (
        <p className="mt-2 text-sm font-bold text-red-700">
          備案：{target.backupPlan}
        </p>
      ) : null}
    </section>
  );
}

export default function OutdoorWeatherAlert({
  dayLabel,
  dayWeather,
  placeNames,
  targets,
  status,
  updatedAt,
  onRefresh,
}: OutdoorWeatherAlertProps) {
  const availableTargets = targets.filter(
    (target) => target.status === "available",
  );
  const warningTargets = availableTargets.filter(
    (target) => target.severity === "warning",
  );
  const hasWeather = status === "ready" || status === "refreshing";
  const isUnavailable =
    hasWeather && dayWeather?.status === "unavailable";
  const isWarning = warningTargets.length > 0;
  const advice = clothingAdvice(dayWeather);

  return (
    <section
      className={`mt-4 rounded-[22px] border p-4 shadow-sm ${
        isWarning
          ? "border-red-200 bg-red-50"
          : "border-neutral-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
            isWarning
              ? "bg-red-600 text-white"
              : "bg-sky-50 text-sky-700"
          }`}
        >
          {isWarning ? <TriangleAlert size={22} /> : <CloudSun size={23} />}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-neutral-500">
            {dayLabel} 整日天氣
          </p>
          <h2 className="mt-0.5 text-base font-bold text-neutral-950">
            {status === "loading"
              ? "正在同步逐時預報"
              : status === "error"
                ? "天氣資料暫時無法取得"
                : isUnavailable
                  ? "尚未進入 16 天預報範圍"
                  : isWarning
                    ? `${warningTargets.length} 個景點需要留意`
                    : "目前沒有天氣警告"}
          </h2>
          <p className="mt-1 text-xs font-semibold leading-relaxed text-neutral-500">
            {placeNames.length ? placeNames.join("、") : "首爾整日預報"}
          </p>
        </div>

        <button
          aria-label="重新整理戶外景點天氣"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-neutral-700 shadow-sm disabled:opacity-50"
          disabled={status === "loading" || status === "refreshing"}
          onClick={onRefresh}
          type="button"
        >
          <RefreshCw
            className={
              status === "loading" || status === "refreshing"
                ? "animate-spin"
                : ""
            }
            size={18}
          />
        </button>
      </div>

      {status === "error" ? (
        <p className="mt-3 rounded-xl bg-neutral-100 px-3 py-2.5 text-xs font-bold leading-relaxed text-neutral-600">
          請點右上角重新整理；原有行程與本機資料不受影響。
        </p>
      ) : null}

      {isUnavailable ? (
        <p className="mt-3 rounded-xl bg-neutral-100 px-3 py-2.5 text-xs font-bold leading-relaxed text-neutral-600">
          接近旅行日期後會自動出現逐時氣溫、體感、降雨與風速預報。
        </p>
      ) : null}

      {hasWeather && dayWeather?.status === "available" ? (
        <div className="mt-3 rounded-2xl bg-neutral-950 px-4 py-4 text-white">
          <div className="grid grid-cols-2 divide-x divide-white/20">
            <div className="pr-4">
              <p className="text-xs font-bold text-white/60">今日最低</p>
              <p className="mt-1 text-3xl font-bold">
                {dayWeather.minTemperature ?? "--"}°
              </p>
            </div>
            <div className="pl-4">
              <p className="text-xs font-bold text-white/60">今日最高</p>
              <p className="mt-1 text-3xl font-bold">
                {dayWeather.maxTemperature ?? "--"}°
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/15 pt-3 text-xs font-semibold text-white/75">
            <span>最低體感 {dayWeather.minApparentTemperature ?? "--"}°C</span>
            <span>最高降雨 {dayWeather.maxRainChance ?? "--"}%</span>
          </div>
          {advice ? (
            <p className="mt-2 text-sm font-bold text-white">{advice}</p>
          ) : null}
        </div>
      ) : null}

      {hasWeather && availableTargets.length ? (
        <div className="mt-3 space-y-2">
          {availableTargets.map((target) => (
            <div
              className={`rounded-xl px-3 py-2.5 ${
                target.severity === "warning" ? "bg-white" : "bg-emerald-50"
              }`}
              key={target.itemId}
            >
              <div className="flex items-center gap-2">
                {target.severity === "warning" ? (
                  target.risks.some((risk) => risk.type === "strong_wind") ? (
                    <Wind className="shrink-0 text-red-600" size={16} />
                  ) : target.risks.some((risk) => risk.type === "cold") ? (
                    <Thermometer className="shrink-0 text-red-600" size={16} />
                  ) : (
                    <CloudRain className="shrink-0 text-red-600" size={16} />
                  )
                ) : (
                  <CheckCircle2
                    className="shrink-0 text-emerald-700"
                    size={16}
                  />
                )}
                <p className="min-w-0 flex-1 text-sm font-bold text-neutral-950">
                  {target.title}
                </p>
                <span className="text-xs font-bold text-neutral-500">
                  {target.startTime}-{target.endTime}
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-neutral-600">
                {metricSummary(target)}
              </p>
              {target.severity === "warning" ? (
                <p className="mt-1 text-xs font-bold leading-relaxed text-red-700">
                  {target.risks.map((risk) => risk.label).join(" · ")}
                </p>
              ) : null}
              {target.severity === "warning" && target.backupPlan ? (
                <p className="mt-1 text-xs font-bold text-red-700">
                  備案：{target.backupPlan}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {hasWeather && updatedAt ? (
        <p className="mt-3 text-right text-[11px] font-semibold text-neutral-400">
          首爾時間更新 {updatedAt}
        </p>
      ) : null}
    </section>
  );
}
