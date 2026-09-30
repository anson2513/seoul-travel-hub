import {
  CheckCircle2,
  CloudRain,
  CloudSun,
  RefreshCw,
  TriangleAlert,
  Wind,
} from "lucide-react";
import type { OutdoorWeatherTarget } from "@/lib/itinerary-weather";

export type OutdoorWeatherStatus =
  | "loading"
  | "refreshing"
  | "ready"
  | "error";

type OutdoorWeatherAlertProps = {
  dayLabel: string;
  placeNames: string[];
  targets: OutdoorWeatherTarget[];
  status: OutdoorWeatherStatus;
  updatedAt?: string;
  onRefresh: () => void;
};

function metricSummary(target: OutdoorWeatherTarget) {
  const metrics = [
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
        {isWarning
          ? target.risks.map((risk) => risk.label).join(" · ")
          : metricSummary(target)}
      </p>
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
  placeNames,
  targets,
  status,
  updatedAt,
  onRefresh,
}: OutdoorWeatherAlertProps) {
  if (!placeNames.length) return null;

  const availableTargets = targets.filter(
    (target) => target.status === "available",
  );
  const warningTargets = availableTargets.filter(
    (target) => target.severity === "warning",
  );
  const hasWeather = status === "ready" || status === "refreshing";
  const isUnavailable =
    hasWeather && !availableTargets.length && targets.length > 0;
  const isWarning = warningTargets.length > 0;

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
            {dayLabel} 戶外景點天氣
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
                    : "目前沒有風雨警告"}
          </h2>
          <p className="mt-1 text-xs font-semibold leading-relaxed text-neutral-500">
            {placeNames.join("、")}
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
          接近旅行日期後會自動出現逐時降雨、風速與雷雨警告。
        </p>
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
                {target.severity === "warning"
                  ? target.risks.map((risk) => risk.label).join(" · ")
                  : metricSummary(target)}
              </p>
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
