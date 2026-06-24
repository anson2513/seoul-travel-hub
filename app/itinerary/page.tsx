import { CalendarDays, Clock, MapPin, Plus } from "lucide-react";
import BottomNav from "@/components/dashboard/BottomNav";
import { todaySchedulePreview } from "@/lib/travel-data";

const days = [
  { label: "DAY 1", date: "10.10", weekday: "Sat", active: true },
  { label: "DAY 2", date: "10.11", weekday: "Sun", active: false },
  { label: "DAY 3", date: "10.12", weekday: "Mon", active: false },
  { label: "DAY 4", date: "10.13", weekday: "Tue", active: false },
  { label: "DAY 5", date: "10.14", weekday: "Wed", active: false },
  { label: "DAY 6", date: "10.15", weekday: "Thu", active: false },
];

export default function ItineraryPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <div className="mx-auto max-w-[430px] px-5 pb-36 pt-10">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-normal text-neutral-950">
              我的行程
            </h1>
            <p className="mt-1 text-lg font-semibold text-neutral-700">
              Itinerary
            </p>
          </div>

          <button
            className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-sm"
            type="button"
          >
            <CalendarDays size={24} />
          </button>
        </header>

        <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
          {days.map((day) => (
            <button
              key={day.label}
              className={`min-w-[112px] rounded-2xl border px-4 py-3 text-center shadow-sm ${
                day.active
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-neutral-200 bg-white text-neutral-950"
              }`}
              type="button"
            >
              <span className="block text-base font-bold">{day.label}</span>
              <span className="mt-1 block text-sm font-semibold">
                {day.date} ({day.weekday})
              </span>
            </button>
          ))}
        </div>

        <section className="mt-6 rounded-[26px] border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CalendarDays size={22} />
              <div>
                <p className="text-base font-bold text-neutral-950">
                  2026.10.10
                </p>
                <p className="text-sm font-semibold text-neutral-500">
                  Day 1 · 抵達首爾
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-neutral-500">弘大</span>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[26px] border border-neutral-200 bg-white shadow-sm">
          {todaySchedulePreview.map((item, index) => (
            <div
              key={`${item.time}-${item.title}`}
              className="grid grid-cols-[70px_1fr] border-b border-neutral-100 last:border-b-0"
            >
              <div className="border-r border-neutral-100 px-4 py-5">
                <p className="text-sm font-bold text-neutral-950">{item.time}</p>
                <div className="mx-auto mt-4 grid h-8 w-8 place-items-center rounded-full border border-neutral-200 text-sm font-bold text-neutral-500">
                  {index + 1}
                </div>
              </div>

              <div className="flex gap-4 p-4">
                <div
                  aria-label={item.title}
                  className="h-24 w-28 shrink-0 rounded-xl bg-neutral-100 bg-cover bg-center"
                  role="img"
                  style={{ backgroundImage: `url(${item.image})` }}
                />

                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-neutral-950">
                    {item.title}
                  </h2>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-neutral-500">
                    <MapPin size={15} />
                    {item.subtitle}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-neutral-500">
                    <Clock size={15} />
                    待補營業時間與備註
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <button
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 text-lg font-bold text-white shadow-sm"
          type="button"
        >
          <Plus size={22} />
          新增行程
        </button>
      </div>

      <BottomNav />
    </main>
  );
}
