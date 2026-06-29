"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  CalendarDays,
  ChevronRight,
  Clock,
  Copy,
  Edit3,
  ExternalLink,
  Lightbulb,
  MapPin,
  Navigation,
  Plus,
  Search,
  Trash2,
  Utensils,
  X,
} from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
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
  dayId: string;
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
  image: string;
};

type HotelInfo = {
  name: string;
  address: string;
  naverQuery: string;
};

type HotelsByDay = Record<string, HotelInfo>;

type NearbyFoodCategory = {
  label: string;
  description: string;
  query: string;
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
  dayId: defaultItineraryDays[0].id,
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
  image: "",
};

const maxImageSide = 1200;
const imageQuality = 0.82;
const airportRailroadImage = "/images/arex-train.jpg";
const kaohsiungAirportImage =
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=900&auto=format&fit=crop";
const hotelStorageKey = "seoul-travel-hub-hotels-v1";
const defaultHotelInfo: HotelInfo = {
  name: "弘大住宿",
  address: "弘大入口站周邊",
  naverQuery: "홍대입구역",
};
const nearbyFoodCategories: NearbyFoodCategory[] = [
  { label: "早餐", description: "早晨營業", query: "아침식사" },
  { label: "正餐", description: "人氣餐廳", query: "맛집" },
  { label: "咖啡", description: "咖啡甜點", query: "카페" },
  { label: "宵夜", description: "深夜用餐", query: "야식" },
  { label: "24 小時", description: "全天營業", query: "24시간 음식점" },
];

function makeDefaultHotels(): HotelsByDay {
  return Object.fromEntries(
    defaultItineraryDays.map((day) => [day.id, { ...defaultHotelInfo }]),
  );
}

function readStoredHotels(): HotelsByDay {
  const defaults = makeDefaultHotels();
  if (typeof window === "undefined") return defaults;

  try {
    const raw = window.localStorage.getItem(hotelStorageKey);
    if (!raw) return defaults;

    const parsed = JSON.parse(raw) as HotelsByDay;
    return Object.fromEntries(
      Object.entries(defaults).map(([dayId, fallback]) => {
        const stored = parsed?.[dayId];
        return [
          dayId,
          stored && typeof stored === "object"
            ? {
                name: stored.name || fallback.name,
                address: stored.address || fallback.address,
                naverQuery:
                  stored.naverQuery || stored.address || fallback.naverQuery,
              }
            : fallback,
        ];
      }),
    );
  } catch {
    return defaults;
  }
}

function applyItineraryMigrations(days: ItineraryDay[]) {
  return days.map((day) => ({
    ...day,
    items: day.items.map((item) => {
      if (item.id === "d1-arex-hongdae") {
        return {
          ...item,
          title: "前往飯店",
          details: [
            "搭乘機場鐵道 AREX",
            "從金浦機場前往弘大入口站",
            "抵達後先前往飯店",
          ],
          image: airportRailroadImage,
        };
      }

      if (item.id === "d6-gmp-transit") {
        return {
          ...item,
          image: airportRailroadImage,
        };
      }

      if (item.id === "d6-arrive-khh") {
        return {
          ...item,
          title: "抵達小港機場",
          details: ["22:00 左右抵達小港機場", "領行李與返家"],
          image: kaohsiungAirportImage,
        };
      }

      return item;
    }),
  }));
}

function readStoredDays() {
  if (typeof window === "undefined") {
    return applyItineraryMigrations(defaultItineraryDays);
  }

  try {
    const raw = window.localStorage.getItem(itineraryStorageKey);
    if (!raw) return applyItineraryMigrations(defaultItineraryDays);

    const parsed = JSON.parse(raw) as ItineraryDay[];
    return Array.isArray(parsed) && parsed.length > 0
      ? applyItineraryMigrations(parsed)
      : applyItineraryMigrations(defaultItineraryDays);
  } catch {
    return applyItineraryMigrations(defaultItineraryDays);
  }
}

function normalizeLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function cleanTimeDraft(value: string) {
  if (value.includes(":")) {
    return value.replace(/[^\d:]/g, "").slice(0, 5);
  }

  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 4) return digits;

  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function normalizeTime(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const colonMatch = trimmed.match(/^(\d{1,2}):(\d{1,2})$/);
  const digits = trimmed.replace(/\D/g, "");
  let hour = "";
  let minute = "";

  if (colonMatch) {
    hour = colonMatch[1];
    minute = colonMatch[2];
  } else if (digits.length > 0 && digits.length <= 2) {
    hour = digits;
    minute = "00";
  } else if (digits.length === 3) {
    hour = digits.slice(0, 1);
    minute = digits.slice(1);
  } else if (digits.length === 4) {
    hour = digits.slice(0, 2);
    minute = digits.slice(2);
  } else {
    return "";
  }

  const hourNumber = Number(hour);
  const minuteNumber = Number(minute);

  if (
    Number.isNaN(hourNumber) ||
    Number.isNaN(minuteNumber) ||
    hourNumber > 23 ||
    minuteNumber > 59
  ) {
    return "";
  }

  return `${String(hourNumber).padStart(2, "0")}:${String(
    minuteNumber,
  ).padStart(2, "0")}`;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Unable to read image."));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load image."));
    image.src = dataUrl;
  });
}

async function compressImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const scale = Math.min(
    1,
    maxImageSide / Math.max(image.naturalWidth, image.naturalHeight),
  );
  const width = Math.round(image.naturalWidth * scale);
  const height = Math.round(image.naturalHeight * scale);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to process image.");
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", imageQuality);
}

function itemToForm(item: ItineraryItem, dayId: string): ItineraryFormState {
  return {
    dayId,
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
    image: item.image ?? "",
  };
}

function insertItemByStartTime(items: ItineraryItem[], nextItem: ItineraryItem) {
  const insertAt = items.findIndex(
    (item) => item.startTime.localeCompare(nextItem.startTime) > 0,
  );

  if (insertAt === -1) return [...items, nextItem];

  const nextItems = [...items];
  nextItems.splice(insertAt, 0, nextItem);
  return nextItems;
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
  openNaverSearch(query);
}

function openNaverSearch(query: string) {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("android")) {
    window.location.href = makeAndroidNaverIntent(query);
    return;
  }

  window.location.href = makeNaverSearchUrl(query);
}

function visualLabel(item: ItineraryItem) {
  return categoryLabels[item.category].slice(0, 1);
}

export default function ItineraryClient() {
  const [days, setDays] = useState(defaultItineraryDays);
  const [activeDayId, setActiveDayId] = useState(defaultItineraryDays[0].id);
  const [hotelsByDay, setHotelsByDay] = useState<HotelsByDay>(makeDefaultHotels);
  const [hotelFormState, setHotelFormState] =
    useState<HotelInfo>(defaultHotelInfo);
  const [selectedItem, setSelectedItem] = useState<ItineraryItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formItemId, setFormItemId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFoodPanelOpen, setIsFoodPanelOpen] = useState(false);
  const [isHotelFormOpen, setIsHotelFormOpen] = useState(false);
  const [formState, setFormState] = useState<ItineraryFormState>(emptyForm);
  const [hasHydrated, setHasHydrated] = useState(false);

  const activeDay = days.find((day) => day.id === activeDayId) ?? days[0];
  const activeHotel = hotelsByDay[activeDayId] ?? defaultHotelInfo;

  useEffect(() => {
    const storedDays = readStoredDays();
    setDays(storedDays);
    setActiveDayId(storedDays[0]?.id ?? defaultItineraryDays[0].id);
    setHotelsByDay(readStoredHotels());
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    window.localStorage.setItem(itineraryStorageKey, JSON.stringify(days));
  }, [days, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    window.localStorage.setItem(hotelStorageKey, JSON.stringify(hotelsByDay));
  }, [hotelsByDay, hasHydrated]);

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
    setFormState({ ...emptyForm, dayId: activeDayId });
    setIsFoodPanelOpen(false);
    setIsHotelFormOpen(false);
    setIsFormOpen(true);
  }

  function openRestaurantForm() {
    setFormItemId(null);
    setFormState({
      ...emptyForm,
      dayId: activeDayId,
      category: "food",
      location: `${activeHotel.name}附近`,
      address: activeHotel.address,
      naverQuery: activeHotel.naverQuery,
      note: "飯店附近用餐",
    });
    setIsFoodPanelOpen(false);
    setIsFormOpen(true);
  }

  function openHotelForm() {
    setHotelFormState(activeHotel);
    setIsFoodPanelOpen(false);
    setIsHotelFormOpen(true);
  }

  function handleHotelSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextHotel: HotelInfo = {
      name: hotelFormState.name.trim() || "未命名飯店",
      address: hotelFormState.address.trim() || "待補飯店地址",
      naverQuery:
        hotelFormState.naverQuery.trim() ||
        hotelFormState.address.trim() ||
        hotelFormState.name.trim(),
    };

    setHotelsByDay((current) => ({
      ...current,
      [activeDayId]: nextHotel,
    }));
    setIsHotelFormOpen(false);
  }

  function searchNearbyFood(category: NearbyFoodCategory) {
    const hotelQuery =
      activeHotel.naverQuery || activeHotel.address || activeHotel.name;
    openNaverSearch(`${hotelQuery} ${category.query}`);
  }

  function openEditForm(item: ItineraryItem) {
    setFormItemId(item.id);
    setFormState(itemToForm(item, activeDayId));
    setSelectedItem(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setFormItemId(null);
    setFormState(emptyForm);
  }

  async function handleImageFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const image = await compressImage(file);
      setFormState((state) => ({ ...state, image }));
    } catch {
      window.alert("照片無法讀取，請重新選擇一張圖片。");
    }
  }

  function updateTimeField(field: "startTime" | "endTime", value: string) {
    setFormState((state) => ({
      ...state,
      [field]: cleanTimeDraft(value),
    }));
  }

  function normalizeTimeField(field: "startTime" | "endTime") {
    setFormState((state) => ({
      ...state,
      [field]: normalizeTime(state[field]),
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const startTime = normalizeTime(formState.startTime) || "09:00";
    const endTime = normalizeTime(formState.endTime);

    const nextItem: ItineraryItem = {
      id: formItemId ?? `custom-${Date.now()}`,
      startTime,
      endTime: endTime || undefined,
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
      image: formState.image || undefined,
    };

    const targetDayId = days.some((day) => day.id === formState.dayId)
      ? formState.dayId
      : activeDayId;

    setDays((currentDays) => {
      const sourceDayId = formItemId
        ? currentDays.find((day) =>
            day.items.some((item) => item.id === formItemId),
          )?.id
        : null;

      if (formItemId && sourceDayId === targetDayId) {
        return currentDays.map((day) =>
          day.id === targetDayId
            ? {
                ...day,
                items: day.items.map((item) =>
                  item.id === formItemId ? { ...item, ...nextItem } : item,
                ),
              }
            : day,
        );
      }

      return currentDays.map((day) => {
        const itemsWithoutMovingItem = formItemId
          ? day.items.filter((item) => item.id !== formItemId)
          : day.items;

        if (day.id === targetDayId) {
          return {
            ...day,
            items: insertItemByStartTime(itemsWithoutMovingItem, nextItem),
          };
        }

        return itemsWithoutMovingItem.length === day.items.length
          ? day
          : { ...day, items: itemsWithoutMovingItem };
      });
    });

    setActiveDayId(targetDayId);
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
                  setIsFoodPanelOpen(false);
                  setIsHotelFormOpen(false);
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

        <section className="mt-4 rounded-[22px] border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-800">
              <Building2 size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-neutral-500">
                {activeDay.label} 住宿地點
              </p>
              <h2 className="mt-0.5 truncate text-lg font-bold text-neutral-950">
                {activeHotel.name}
              </h2>
              <p className="mt-1 truncate text-sm font-semibold text-neutral-500">
                {activeHotel.address}
              </p>
            </div>
            <button
              aria-label={`修改 ${activeDay.label} 飯店`}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-700"
              onClick={openHotelForm}
              type="button"
            >
              <Edit3 size={18} />
            </button>
          </div>

          <button
            className="mt-4 flex h-12 w-full items-center gap-3 rounded-xl bg-neutral-950 px-4 text-left text-white"
            onClick={() => setIsFoodPanelOpen(true)}
            type="button"
          >
            <Utensils size={19} />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">飯店附近美食</span>
              <span className="block text-xs font-semibold text-white/60">
                用 NAVER 搜尋步行可達餐廳
              </span>
            </span>
            <ChevronRight size={19} />
          </button>
        </section>

        <button
          className={`mt-4 w-full rounded-[22px] border p-4 text-left shadow-sm transition ${
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
                className="relative border-r border-neutral-100 px-3 py-5 text-left"
                onClick={() => setSelectedItem(item)}
                type="button"
              >
                <p className="text-center text-[13px] font-bold tabular-nums text-neutral-950">
                  {item.startTime}
                </p>
                {index > 0 && (
                  <span className="absolute left-1/2 top-0 h-[66px] w-px -translate-x-1/2 bg-neutral-200" />
                )}
                {index < activeDay.items.length - 1 && (
                  <span className="absolute bottom-0 left-1/2 top-[66px] w-px -translate-x-1/2 bg-neutral-200" />
                )}
                <div
                  className={`relative z-10 mx-auto mt-3 grid h-7 w-7 place-items-center rounded-full border text-[11px] font-semibold tabular-nums transition-colors ${
                    isEditMode
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-[#D8D3CB] bg-[#F5F2ED] text-neutral-600"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
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

      {isFoodPanelOpen && (
        <div className="fixed inset-x-0 bottom-0 z-[65] mx-auto max-w-[430px] rounded-t-[30px] border border-neutral-200 bg-white px-5 pb-32 pt-4 shadow-[0_-18px_45px_rgba(39,31,27,0.18)]">
          <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-neutral-300" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-neutral-950">
                飯店附近美食
              </h2>
              <p className="mt-1 text-sm font-semibold text-neutral-500">
                {activeDay.label} · {activeHotel.name}
              </p>
            </div>
            <button
              aria-label="關閉附近美食"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-100"
              onClick={() => setIsFoodPanelOpen(false)}
              type="button"
            >
              <X size={22} />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-neutral-100 p-3">
            <Building2 className="shrink-0 text-neutral-700" size={20} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-neutral-950">
                {activeHotel.address}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-neutral-500">
                NAVER 將依此位置搜尋
              </p>
            </div>
            <button
              className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-bold text-neutral-700"
              onClick={openHotelForm}
              type="button"
            >
              修改
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {nearbyFoodCategories.map((category) => (
              <button
                key={category.label}
                className="flex min-h-16 items-center gap-3 rounded-2xl border border-neutral-200 px-3 text-left"
                onClick={() => searchNearbyFood(category)}
                type="button"
              >
                <Search className="shrink-0 text-neutral-600" size={18} />
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-neutral-950">
                    {category.label}
                  </span>
                  <span className="block text-xs font-semibold text-neutral-500">
                    {category.description}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-center text-xs font-semibold leading-relaxed text-neutral-500">
            評價、營業狀態與步行距離以 NAVER Map 最新資料為準
          </p>

          <button
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-neutral-950 text-sm font-bold text-neutral-950"
            onClick={openRestaurantForm}
            type="button"
          >
            <Plus size={18} />
            新增餐廳到行程
          </button>
        </div>
      )}

      {isHotelFormOpen && (
        <div className="fixed inset-x-0 bottom-0 z-[75] mx-auto max-w-[430px] rounded-t-[30px] border border-neutral-200 bg-white px-5 pb-32 pt-4 shadow-[0_-18px_45px_rgba(39,31,27,0.18)]">
          <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-neutral-300" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-950">修改飯店資訊</h2>
              <p className="mt-1 text-sm font-semibold text-neutral-500">
                只套用於 {activeDay.label}
              </p>
            </div>
            <button
              aria-label="關閉飯店表單"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-100"
              onClick={() => setIsHotelFormOpen(false)}
              type="button"
            >
              <X size={22} />
            </button>
          </div>

          <form className="mt-5 space-y-3" onSubmit={handleHotelSubmit}>
            <input
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
              onChange={(event) =>
                setHotelFormState((state) => ({
                  ...state,
                  name: event.target.value,
                }))
              }
              placeholder="飯店名稱"
              value={hotelFormState.name}
            />
            <input
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
              onChange={(event) =>
                setHotelFormState((state) => ({
                  ...state,
                  address: event.target.value,
                }))
              }
              placeholder="飯店地址或附近地標"
              value={hotelFormState.address}
            />
            <input
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
              onChange={(event) =>
                setHotelFormState((state) => ({
                  ...state,
                  naverQuery: event.target.value,
                }))
              }
              placeholder="NAVER 韓文搜尋字，例如：홍대입구역"
              value={hotelFormState.naverQuery}
            />
            <p className="px-1 text-xs font-semibold leading-relaxed text-neutral-500">
              建議填入韓文飯店名稱或韓文地址，附近搜尋會更準確。
            </p>
            <button
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-neutral-950 text-base font-bold text-white"
              type="submit"
            >
              儲存飯店資訊
            </button>
          </form>
        </div>
      )}

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
            <label className="block rounded-xl border border-neutral-200 px-4 py-2 outline-none focus-within:border-neutral-950">
              <span className="block text-xs font-bold text-neutral-500">
                安排日期
              </span>
              <select
                className="mt-0.5 h-7 w-full bg-transparent text-base font-semibold text-neutral-950 outline-none"
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    dayId: event.target.value,
                  }))
                }
                value={formState.dayId}
              >
                {days.map((day) => (
                  <option key={day.id} value={day.id}>
                    {day.label}｜{day.tabDate} ({day.weekday})
                  </option>
                ))}
              </select>
            </label>

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
                onBlur={() => normalizeTimeField("startTime")}
                onChange={(event) =>
                  updateTimeField("startTime", event.target.value)
                }
                placeholder="開始 09:00"
                type="text"
                value={formState.startTime}
              />
              <input
                className="h-12 rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
                inputMode="numeric"
                onBlur={() => normalizeTimeField("endTime")}
                onChange={(event) =>
                  updateTimeField("endTime", event.target.value)
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

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-neutral-950">行程照片</p>
                  <p className="mt-0.5 text-xs font-semibold text-neutral-500">
                    上傳後會自動適配列表圖片比例
                  </p>
                </div>
                {formState.image && (
                  <button
                    className="rounded-full bg-white px-3 py-1 text-xs font-bold text-neutral-600 shadow-sm"
                    onClick={() =>
                      setFormState((state) => ({ ...state, image: "" }))
                    }
                    type="button"
                  >
                    移除
                  </button>
                )}
              </div>

              <div className="overflow-hidden rounded-xl bg-white">
                {formState.image ? (
                  <div
                    aria-label="行程照片預覽"
                    className="h-36 bg-cover bg-center"
                    role="img"
                    style={{ backgroundImage: `url(${formState.image})` }}
                  />
                ) : (
                  <div className="grid h-28 place-items-center border border-dashed border-neutral-300 text-center">
                    <div>
                      <Plus className="mx-auto text-neutral-500" size={24} />
                      <p className="mt-2 text-sm font-bold text-neutral-600">
                        從手機相簿選擇照片
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <label className="mt-3 flex h-11 cursor-pointer items-center justify-center rounded-xl bg-neutral-950 text-sm font-bold text-white">
                <input
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageFileChange}
                  type="file"
                />
                {formState.image ? "更換照片" : "上傳照片"}
              </label>
            </div>

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
