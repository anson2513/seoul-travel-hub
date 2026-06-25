"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarDays,
  Clock,
  Copy,
  Edit3,
  ExternalLink,
  Lightbulb,
  MapPin,
  Navigation,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import BottomNav from "@/components/dashboard/BottomNav";
import {
  categoryLabels,
  defaultItineraryDays,
  itineraryStorageKey,
  type ItineraryCategory,
  type ItineraryDay,
  type ItineraryItem,
} from "@/lib/itinerary-data";

type ItineraryFormState = {
  title: string;
  startTime: string;
  endTime: string;
  category: ItineraryCategory;
  location: string;
  address: string;
  naverQuery: string;
  note: string;
  details: string;
  tips: string;
};

const categoryTone: Record<ItineraryCategory, string> = {
  flight: "bg-orange-50 text-orange-700",
  transit: "bg-blue-50 text-blue-700",
  hotel: "bg-violet-50 text-violet-700",
  food: "bg-amber-50 text-amber-700",
  photo: "bg-emerald-50 text-emerald-700",
  cafe: "bg-stone-100 text-stone-700",
  shopping: "bg-pink-50 text-pink-700",
  rest: "bg-neutral-100 text-neutral-600",
};

const categoryAccent: Record<ItineraryCategory, string> = {
  flight: "from-orange-200 to-sky-200",
  transit: "from-sky-200 to-blue-100",
  hotel: "from-violet-200 to-stone-100",
  food: "from-amber-200 to-orange-100",
  photo: "from-emerald-200 to-sky-100",
  cafe: "from-stone-200 to-amber-100",
  shopping: "from-pink-200 to-orange-100",
  rest: "from-neutral-200 to-stone-100",
};

const emptyForm: ItineraryFormState = {
  title: "",
  startTime: "09:00",
  endTime: "",
  category: "photo",
  location: "",
  address: "",
  naverQuery: "",
  note: "",
  details: "",
  tips: "",
};

function readStoredDays() {
  if (typeof window === "undefined") return defaultItineraryDays;

  try {
    const raw = window.localStorage.getItem(itineraryStorageKey);
    if (!raw) return defaultItineraryDays;

    const parsed = JSON.parse(raw) as ItineraryDay[];
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : defaultItineraryDays;
  } catch {
    return defaultItineraryDays;
  }
}

function normalizeLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function itemToForm(item: ItineraryItem): ItineraryFormState {
  return {
    title: item.title,
    startTime: item.startTime,
    endTime: item.endTime ?? "",
    category: item.category,
    location: item.location,
    address: item.address,
    naverQuery: item.naverQuery,
    note: item.note,
    details: item.details.join("\n"),
    tips: item.tips.join("\n"),
  };
}

function makeNaverSearchUrl(query: string) {
  const encodedQuery = encodeURIComponent(query);
  const appname = encodeURIComponent("seoul-travel-hub.vercel.app");

  return `nmap://search?query=${encodedQuery}&appname=${appname}`;
}

function makeAndroidNaverIntent(query: string) {
  const encodedQuery = encodeURIComponent(query);
  const appname = encodeURIComponent("seoul-travel-hub.vercel.app");

  return `intent://search?query=${encodedQuery}&appname=${appname}#Intent;scheme=nmap;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.nhn.android.nmap;end`;
}

function openNaverMap(item: ItineraryItem) {
  const query = item.naverQuery || item.address || item.location || item.title;
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("android")) {
    window.location.href = makeAndroidNaverIntent(query);
    return;
  }

  const startedAt = Date.now();
  window.location.href = makeNaverSearchUrl(query);

  window.setTimeout(() => {
    if (Date.now() - startedAt < 1800) {
      window.location.href =
        "https://apps.apple.com/tw/app/naver-map-navigation/id311867728";
    }
  }, 1200);
}

function visualLabel(item: ItineraryItem) {
  return categoryLabels[item.category].slice(0, 1);
}

export default function ItineraryClient() {
  const [days, setDays] = useState(defaultItineraryDays);
  const [activeDayId, setActiveDayId] = useState(defaultItineraryDays[0].id);
  const [selectedItem, setSelectedItem] = useState<ItineraryItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formItemId, setFormItemId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState<ItineraryFormState>(emptyForm);
  const [hasHydrated, setHasHydrated] = useState(false);

  const activeDay = days.find((day) => day.id === activeDayId) ?? days[0];

  useEffect(() => {
    const storedDays = readStoredDays();
    setDays(storedDays);
    setActiveDayId(storedDays[0]?.id ?? defaultItineraryDays[0].id);
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    window.localStorage.setItem(itineraryStorageKey, JSON.stringify(days));
  }, [days, hasHydrated]);

  function moveItem(itemId: string, direction: "up" | "down") {
    setDays((currentDays) =>
      currentDays.map((day) => {
        if (day.id !== activeDayId) return day;

        const index = day.items.findIndex((item) => item.id === itemId);
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (index < 0 || targetIndex < 0 || targetIndex >= day.items.length) {
          return day;
        }

        const nextItems = [...day.items];
        const [movingItem] = nextItems.splice(index, 1);
        nextItems.splice(targetIndex, 0, movingItem);

        return { ...day, items: nextItems };
      }),
    );
  }

  function openAddForm() {
    setFormItemId(null);
    setFormState(emptyForm);
    setIsFormOpen(true);
  }

  function openEditForm(item: ItineraryItem) {
    setFormItemId(item.id);
    setFormState(itemToForm(item));
    setSelectedItem(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setFormItemId(null);
    setFormState(emptyForm);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextItem: ItineraryItem = {
      id: formItemId ?? `custom-${Date.now()}`,
      startTime: formState.startTime,
      endTime: formState.endTime || undefined,
      title: formState.title.trim() || "未命名行程",
      category: formState.category,
      location: formState.location.trim() || "待補地點",
      address: formState.address.trim() || formState.location.trim() || "待補地址",
      naverQuery:
        formState.naverQuery.trim() ||
        formState.address.trim() ||
        formState.location.trim() ||
        formState.title.trim(),
      note: formState.note.trim() || "待補備註",
      details: normalizeLines(formState.details),
      tips: normalizeLines(formState.tips),
    };

    setDays((currentDays) =>
      currentDays.map((day) => {
        if (day.id !== activeDayId) return day;

        if (formItemId) {
          return {
            ...day,
            items: day.items.map((item) =>
              item.id === formItemId ? { ...item, ...nextItem } : item,
            ),
          };
        }

        return { ...day, items: [...day.items, nextItem] };
      }),
    );

    closeForm();
  }

  function deleteItem(itemId: string) {
    const shouldDelete = window.confirm("確定要刪除這個行程嗎？這只會影響你的手機。");
    if (!shouldDelete) return;

    setDays((currentDays) =>
      currentDays.map((day) =>
        day.id === activeDayId
          ? { ...day, items: day.items.filter((item) => item.id !== itemId) }
          : day,
      ),
    );
    setSelectedItem(null);
  }

  async function copyAddress(item: ItineraryItem) {
    const text = item.address || item.location || item.title;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt("請手動複製地址", text);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F5F2]">
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
            className="grid h-12 w-12 place-items-center rounded-full border border-neutral-200 bg-white shadow-sm"
            type="button"
          >
            <CalendarDays size={24} />
          </button>
        </header>

        <div className="no-scrollbar mt-8 flex gap-3 overflow-x-auto pb-2">
          {days.map((day) => {
            const isActive = day.id === activeDayId;

            return (
              <button
                key={day.id}
                className={`min-w-[112px] rounded-2xl border px-4 py-3 text-center shadow-sm transition ${
                  isActive
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-200 bg-white text-neutral-950"
                }`}
                onClick={() => {
                  setActiveDayId(day.id);
                  setIsEditMode(false);
                  setSelectedItem(null);
                }}
                type="button"
              >
                <span className="block text-base font-bold">{day.label}</span>
                <span className="mt-1 block text-sm font-semibold">
                  {day.tabDate} ({day.weekday})
                </span>
              </button>
            );
          })}
        </div>

        <button
          className={`mt-6 w-full rounded-[22px] border p-4 text-left shadow-sm transition ${
            isEditMode
              ? "border-neutral-950 bg-neutral-950 text-white"
              : "border-neutral-200 bg-white/80 text-neutral-950"
          }`}
          onClick={() => setIsEditMode(true)}
          type="button"
        >
          <div className="flex items-center gap-3">
            <ArrowUpDown size={26} />
            <div>
              <p className="text-base font-bold">調整行程順序</p>
              <p
                className={`mt-1 text-sm font-semibold ${
                  isEditMode ? "text-white/65" : "text-neutral-500"
                }`}
              >
                {isEditMode
                  ? "使用上移 / 下移後按完成"
                  : "點一下後可用上移 / 下移排序"}
              </p>
            </div>
          </div>
        </button>

        {isEditMode && (
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-neutral-950 px-4 py-3 text-white">
            <span className="text-sm font-bold">正在調整順序</span>
            <button
              className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold"
              onClick={() => setIsEditMode(false)}
              type="button"
            >
              完成
            </button>
          </div>
        )}

        <section className="mt-4 overflow-hidden rounded-[26px] border border-neutral-200 bg-white shadow-sm">
          {activeDay.items.map((item, index) => (
            <article
              key={item.id}
              className="grid select-none grid-cols-[72px_1fr] border-b border-neutral-100 last:border-b-0"
              onContextMenu={(event) => event.preventDefault()}
            >
              <button
                className="border-r border-neutral-100 px-3 py-5 text-left"
                onClick={() => setSelectedItem(item)}
                type="button"
              >
                <p className="text-sm font-bold text-neutral-950">
                  {item.startTime}
                </p>
                <div className="relative mx-auto mt-4 grid h-9 w-9 place-items-center rounded-full border border-neutral-200 bg-white text-sm font-bold text-neutral-500">
                  {index + 1}
                </div>
              </button>

              <div className="flex gap-3 p-4">
                <button
                  className="h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-neutral-100 text-left"
                  onClick={() => setSelectedItem(item)}
                  type="button"
                >
                  {item.image ? (
                    <span
                      aria-label={item.title}
                      className="block h-full w-full bg-cover bg-center"
                      role="img"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  ) : (
                    <span
                      className={`grid h-full w-full place-items-center bg-gradient-to-br text-lg font-bold text-neutral-700 ${categoryAccent[item.category]}`}
                    >
                      {visualLabel(item)}
                    </span>
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <button
                    className="block w-full text-left"
                    onClick={() => setSelectedItem(item)}
                    type="button"
                  >
                    <div className="flex items-start gap-2">
                      <h2 className="min-w-0 flex-1 text-xl font-bold leading-tight text-neutral-950">
                        {item.title}
                      </h2>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${categoryTone[item.category]}`}
                      >
                        {categoryLabels[item.category]}
                      </span>
                    </div>

                    <p className="mt-3 flex items-start gap-2 text-sm font-semibold leading-snug text-neutral-500">
                      <MapPin className="mt-0.5 shrink-0" size={15} />
                      <span>{item.location}</span>
                    </p>
                    <p className="mt-2 flex items-start gap-2 text-sm font-semibold leading-snug text-neutral-500">
                      <Clock className="mt-0.5 shrink-0" size={15} />
                      <span>{item.note}</span>
                    </p>
                  </button>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <button
                      className="rounded-xl border border-neutral-200 px-3 py-2 text-xs font-bold text-neutral-950"
                      onClick={() => openNaverMap(item)}
                      type="button"
                    >
                      NAVER 導航
                    </button>

                    {isEditMode && (
                      <div className="flex gap-2">
                        <button
                          aria-label="往上移動"
                          className="grid h-9 w-9 place-items-center rounded-xl border border-neutral-200"
                          disabled={index === 0}
                          onClick={() => moveItem(item.id, "up")}
                          type="button"
                        >
                          <ArrowUp size={18} />
                        </button>
                        <button
                          aria-label="往下移動"
                          className="grid h-9 w-9 place-items-center rounded-xl border border-neutral-200"
                          disabled={index === activeDay.items.length - 1}
                          onClick={() => moveItem(item.id, "down")}
                          type="button"
                        >
                          <ArrowDown size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <button
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 text-lg font-bold text-white shadow-sm"
          onClick={openAddForm}
          type="button"
        >
          <Plus size={22} />
          新增行程
        </button>
      </div>

      <BottomNav />

      {selectedItem && (
        <div className="fixed inset-x-0 bottom-0 z-[60] mx-auto max-w-[430px] rounded-t-[30px] border border-neutral-200 bg-white px-5 pb-32 pt-4 shadow-[0_-18px_45px_rgba(39,31,27,0.18)]">
          <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-neutral-300" />
          <button
            aria-label="關閉行程詳情"
            className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-neutral-100"
            onClick={() => setSelectedItem(null)}
            type="button"
          >
            <X size={22} />
          </button>

          <div className="max-h-[68vh] overflow-y-auto pr-1">
            <div className="flex gap-4">
              <div className="h-28 w-36 shrink-0 overflow-hidden rounded-2xl bg-neutral-100">
                {selectedItem.image ? (
                  <div
                    aria-label={selectedItem.title}
                    className="h-full w-full bg-cover bg-center"
                    role="img"
                    style={{ backgroundImage: `url(${selectedItem.image})` }}
                  />
                ) : (
                  <div
                    className={`grid h-full w-full place-items-center bg-gradient-to-br text-2xl font-bold text-neutral-700 ${categoryAccent[selectedItem.category]}`}
                  >
                    {visualLabel(selectedItem)}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 pr-10 pt-1">
                <h2 className="text-2xl font-bold leading-tight text-neutral-950">
                  {selectedItem.title}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${categoryTone[selectedItem.category]}`}
                  >
                    {categoryLabels[selectedItem.category]}
                  </span>
                  <span className="text-sm font-semibold text-neutral-500">
                    {selectedItem.startTime}
                    {selectedItem.endTime ? ` - ${selectedItem.endTime}` : ""}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-neutral-500">
                  {selectedItem.address}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-950"
                onClick={() => openNaverMap(selectedItem)}
                type="button"
              >
                <Navigation size={17} />
                NAVER 導航
                <ExternalLink size={15} />
              </button>
              <button
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-950"
                onClick={() => copyAddress(selectedItem)}
                type="button"
              >
                <Copy size={17} />
                複製地址
              </button>
            </div>

            <section className="mt-5 overflow-hidden rounded-2xl border border-neutral-200">
              <div className="border-b border-neutral-100 p-4">
                <h3 className="flex items-center gap-2 text-base font-bold text-neutral-950">
                  <Clock size={18} />
                  注意事項
                </h3>
                <ul className="mt-3 space-y-2 text-sm font-semibold leading-relaxed text-neutral-500">
                  {(selectedItem.details.length ? selectedItem.details : [selectedItem.note]).map(
                    (detail) => (
                      <li key={detail}>・{detail}</li>
                    ),
                  )}
                </ul>
              </div>

              <div className="p-4">
                <h3 className="flex items-center gap-2 text-base font-bold text-neutral-950">
                  <Lightbulb size={18} />
                  小貼士
                </h3>
                <ul className="mt-3 space-y-2 text-sm font-semibold leading-relaxed text-neutral-500">
                  {(selectedItem.tips.length ? selectedItem.tips : ["可依體力與天氣彈性調整。"]).map(
                    (tip) => (
                      <li key={tip}>・{tip}</li>
                    ),
                  )}
                </ul>
              </div>
            </section>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-neutral-100 text-sm font-bold text-neutral-950"
                onClick={() => openEditForm(selectedItem)}
                type="button"
              >
                <Edit3 size={17} />
                編輯
              </button>
              <button
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-red-50 text-sm font-bold text-red-600"
                onClick={() => deleteItem(selectedItem.id)}
                type="button"
              >
                <Trash2 size={17} />
                刪除
              </button>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-w-[430px] rounded-t-[30px] border border-neutral-200 bg-white px-5 pb-8 pt-4 shadow-[0_-18px_45px_rgba(39,31,27,0.18)]">
          <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-neutral-300" />
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-950">
              {formItemId ? "編輯行程" : "新增行程"}
            </h2>
            <button
              aria-label="關閉表單"
              className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100"
              onClick={closeForm}
              type="button"
            >
              <X size={22} />
            </button>
          </div>

          <form
            className="mt-5 max-h-[72vh] space-y-3 overflow-y-auto pr-1"
            onSubmit={handleSubmit}
          >
            <input
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
              onChange={(event) =>
                setFormState((state) => ({ ...state, title: event.target.value }))
              }
              placeholder="名稱，例如：景福宮"
              value={formState.title}
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                className="h-12 rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
                inputMode="numeric"
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    startTime: event.target.value,
                  }))
                }
                placeholder="開始 09:00"
                type="text"
                value={formState.startTime}
              />
              <input
                className="h-12 rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
                inputMode="numeric"
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    endTime: event.target.value,
                  }))
                }
                placeholder="結束 10:00"
                type="text"
                value={formState.endTime}
              />
            </div>

            <select
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
              onChange={(event) =>
                setFormState((state) => ({
                  ...state,
                  category: event.target.value as ItineraryCategory,
                }))
              }
              value={formState.category}
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <input
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
              onChange={(event) =>
                setFormState((state) => ({
                  ...state,
                  location: event.target.value,
                }))
              }
              placeholder="地點，例如：弘大商圈"
              value={formState.location}
            />

            <input
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
              onChange={(event) =>
                setFormState((state) => ({
                  ...state,
                  address: event.target.value,
                }))
              }
              placeholder="地址 / 韓文地址"
              value={formState.address}
            />

            <input
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
              onChange={(event) =>
                setFormState((state) => ({
                  ...state,
                  naverQuery: event.target.value,
                }))
              }
              placeholder="NAVER 搜尋字，例如：경복궁"
              value={formState.naverQuery}
            />

            <input
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
              onChange={(event) =>
                setFormState((state) => ({ ...state, note: event.target.value }))
              }
              placeholder="簡短備註"
              value={formState.note}
            />

            <textarea
              className="min-h-24 w-full rounded-xl border border-neutral-200 px-4 py-3 text-base font-semibold outline-none focus:border-neutral-950"
              onChange={(event) =>
                setFormState((state) => ({
                  ...state,
                  details: event.target.value,
                }))
              }
              placeholder="注意事項，一行一項"
              value={formState.details}
            />

            <textarea
              className="min-h-24 w-full rounded-xl border border-neutral-200 px-4 py-3 text-base font-semibold outline-none focus:border-neutral-950"
              onChange={(event) =>
                setFormState((state) => ({ ...state, tips: event.target.value }))
              }
              placeholder="小貼士，一行一項"
              value={formState.tips}
            />

            <button
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 text-lg font-bold text-white"
              type="submit"
            >
              <Plus size={22} />
              {formItemId ? "儲存修改" : "新增行程"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
