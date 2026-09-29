"use client";

import { CalendarClock, CloudSun, Flag, Route } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  formatSeoulDate,
  formatSeoulTime,
  getDashboardDay,
  getNextHardPlace,
  getNextPlace,
  getScheduleStatus,
  seoul2026Trip,
  type ScheduleStatus,
} from "@/lib/seoul-2026-master";

const statusCopy: Record<ScheduleStatus, string> = {
  EARLY: "時間充裕",
  ON_TIME: "準時",
  AT_RISK: "注意時間",
  LATE: "可能遲到",
};

export default function TripStatusCard() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const snapshot = useMemo(() => {
    const dateKey = formatSeoulDate(now);
    const currentTime = formatSeoulTime(now);
    const day = getDashboardDay(now);
    const dayIndex = seoul2026Trip.days.findIndex((item) => item.id === day.id);
    const beforeTrip = dateKey < seoul2026Trip.startDate;
    const afterTrip = dateKey > seoul2026Trip.endDate;
    const next = beforeTrip ? day.places[0] : getNextPlace(day, currentTime);
    const nextHard = getNextHardPlace(day, beforeTrip ? "00:00" : currentTime);
    const status = beforeTrip
      ? "ON_TIME"
      : getScheduleStatus(nextHard, currentTime);
    const progress = beforeTrip
      ? 0
      : afterTrip
        ? 100
        : Math.round(((dayIndex + 1) / seoul2026Trip.days.length) * 100);

    return {
      currentTime,
      day,
      dayIndex,
      next,
      nextHard,
      status,
      progress,
      phase: beforeTrip ? "行前準備" : afterTrip ? "旅程完成" : `DAY ${dayIndex}`,
    };
  }, [now]);

  return (
    <section className="rounded-[26px] bg-neutral-950 p-5 text-white shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-white/55">TRIP STATUS</p>
          <h2 className="mt-1 text-2xl font-bold">{snapshot.phase}</h2>
          <p className="mt-1 text-sm font-semibold text-white/65">
            {snapshot.day.date.replaceAll("-", ".")} · 首爾時間 {snapshot.currentTime}
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-neutral-950">
          {statusCopy[snapshot.status]}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-bold text-white/60">
          <span>旅程進度</span>
          <span>{snapshot.progress}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-white transition-[width]"
            style={{ width: `${snapshot.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm">
        <div className="flex items-start gap-3">
          <Flag className="mt-0.5 shrink-0 text-white/65" size={17} />
          <div>
            <p className="text-xs font-bold text-white/45">下一站</p>
            <p className="mt-0.5 font-bold">
              {snapshot.next?.startTime ?? "彈性"} · {snapshot.next?.nameZh ?? "待確認"}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CalendarClock className="mt-0.5 shrink-0 text-white/65" size={17} />
          <div>
            <p className="text-xs font-bold text-white/45">下一個鎖定時間</p>
            <p className="mt-0.5 font-bold">
              {snapshot.nextHard
                ? `${snapshot.nextHard.hardDeadline ?? snapshot.nextHard.startTime} · ${snapshot.nextHard.nameZh}`
                : "今日無其他鎖定行程"}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Route className="mt-0.5 shrink-0 text-white/65" size={17} />
          <div className="min-w-0">
            <p className="text-xs font-bold text-white/45">今日路線</p>
            <p className="mt-0.5 line-clamp-2 font-semibold text-white/85">
              {snapshot.day.routeSummary.join(" → ")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-white/65">
          <CloudSun size={17} />
          <span className="text-xs font-bold">天氣資訊顯示於上方即時卡片</span>
        </div>
      </div>
    </section>
  );
}
