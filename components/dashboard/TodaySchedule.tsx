import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";
import type { SchedulePreviewItem } from "@/lib/travel-data";

type TodayScheduleProps = {
  items: SchedulePreviewItem[];
};

export default function TodaySchedule({ items }: TodayScheduleProps) {
  return (
    <section className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <CalendarDays size={21} strokeWidth={2.1} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-lg font-bold text-neutral-950">今日行程</h2>
              <p className="text-sm font-semibold text-neutral-500">
                Today Schedule
              </p>
            </div>
          </div>
        </div>

        <Link
          className="flex shrink-0 items-center gap-1 text-sm font-bold text-neutral-800"
          href="/itinerary"
        >
          查看完整行程
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="mt-6 space-y-5">
        {items.map((item, index) => (
          <Link
            key={`${item.time}-${item.title}`}
            className="flex gap-3 rounded-2xl transition active:bg-neutral-50"
            href="/itinerary"
          >
            <div className="w-14 shrink-0 pt-1">
              <p className="text-sm font-bold text-neutral-950">{item.time}</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-4 w-4 rounded-full border-[3px] border-neutral-300 bg-white" />
              {index !== items.length - 1 && (
                <div className="mt-1 h-14 w-px bg-neutral-200" />
              )}
            </div>

            <div className="min-w-0 flex-1 pb-2">
              <h3 className="text-base font-bold text-neutral-950">
                {item.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-neutral-500">
                {item.subtitle}
              </p>
            </div>

            <div
              aria-label={item.title}
              className="h-16 w-24 shrink-0 rounded-xl bg-neutral-100 bg-cover bg-center"
              role="img"
              style={{ backgroundImage: `url(${item.image})` }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
