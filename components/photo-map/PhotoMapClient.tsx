"use client";

import {
  CalendarDays,
  Camera,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Flag,
  ImagePlus,
  Lightbulb,
  Map,
  MapPin,
  Navigation,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import BottomNav from "@/components/dashboard/BottomNav";
import {
  defaultPhotoMapState,
  photoMapStorageKey,
  photoTripDays,
  type PhotoMapState,
  type PhotoSpot,
  type PhotoSpotStatus,
} from "@/lib/photo-map-data";

type PhotoSpotFormState = {
  title: string;
  area: string;
  address: string;
  naverQuery: string;
  dayDate: string;
  bestStart: string;
  bestEnd: string;
  lightType: string;
  advice: string;
  note: string;
  image: string;
};

type TimeBadge = {
  label: string;
  className: string;
};

const emptyForm: PhotoSpotFormState = {
  title: "",
  area: "",
  address: "",
  naverQuery: "",
  dayDate: "2026-10-10",
  bestStart: "16:45",
  bestEnd: "18:20",
  lightType: "夕陽 / 藍調",
  advice: "",
  note: "",
  image: "",
};

const maxImageSide = 1100;
const imageQuality = 0.78;

function readStoredPhotoMap() {
  if (typeof window === "undefined") return defaultPhotoMapState;

  try {
    const raw = window.localStorage.getItem(photoMapStorageKey);
    if (!raw) return defaultPhotoMapState;

    const parsed = JSON.parse(raw) as PhotoMapState;
    if (!Array.isArray(parsed.spots)) return defaultPhotoMapState;

    return {
      spots: parsed.spots.length > 0 ? parsed.spots : defaultPhotoMapState.spots,
    };
  } catch {
    return defaultPhotoMapState;
  }
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function parseTimeToMinutes(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;

  return hour * 60 + minute;
}

function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function findTripDay(date: string) {
  return photoTripDays.find((day) => day.id === date);
}

function getRouteDate(spots: PhotoSpot[]) {
  const today = getTodayDate();
  if (findTripDay(today)) return today;

  const firstPending = spots.find((spot) => !spot.completed);
  return firstPending?.dayDate ?? photoTripDays[0].id;
}

function sortByDayAndTime(spots: PhotoSpot[]) {
  return [...spots].sort((a, b) => {
    if (a.dayDate !== b.dayDate) return a.dayDate.localeCompare(b.dayDate);
    return a.bestStart.localeCompare(b.bestStart);
  });
}

function getTimeBadge(spot: PhotoSpot): TimeBadge | null {
  if (spot.dayDate !== getTodayDate()) return null;

  const now = getCurrentMinutes();
  const start = parseTimeToMinutes(spot.bestStart);
  const end = parseTimeToMinutes(spot.bestEnd);

  if (now >= start && now <= end) {
    return {
      label: "現在適合",
      className: "bg-emerald-50 text-emerald-700",
    };
  }

  if (now < start && start - now <= 120) {
    return {
      label: "接下來適合",
      className: "bg-amber-50 text-amber-700",
    };
  }

  return null;
}

function isGoldenHourSpot(spot: PhotoSpot) {
  const start = parseTimeToMinutes(spot.bestStart);
  const text = `${spot.lightType} ${spot.advice}`;

  return (
    start >= 16 * 60 ||
    text.includes("夕陽") ||
    text.includes("藍調") ||
    text.includes("日落") ||
    text.includes("夜景")
  );
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

function openNaverMap(spot: PhotoSpot) {
  const query = spot.naverQuery || spot.address || spot.title;
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("android")) {
    window.location.href = makeAndroidNaverIntent(query);
    return;
  }

  window.location.href = makeNaverSearchUrl(query);
}

function copyAddress(spot: PhotoSpot) {
  const text = spot.address || spot.naverQuery || spot.title;

  navigator.clipboard
    ?.writeText(text)
    .then(() => window.alert("已複製地址"))
    .catch(() => window.alert(text));
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
    throw new Error("請選擇圖片檔。");
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
    throw new Error("無法處理圖片。");
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", imageQuality);
}

function spotToForm(spot: PhotoSpot): PhotoSpotFormState {
  return {
    title: spot.title,
    area: spot.area,
    address: spot.address,
    naverQuery: spot.naverQuery,
    dayDate: spot.dayDate,
    bestStart: spot.bestStart,
    bestEnd: spot.bestEnd,
    lightType: spot.lightType,
    advice: spot.advice,
    note: spot.note,
    image: spot.image ?? "",
  };
}

function tipsForSpot(spot: PhotoSpot) {
  const tips = [
    "10 月中旬首爾日落約 18:00，夕陽點建議提早 30-45 分鐘抵達。",
  ];

  if (spot.lightType.includes("夜") || spot.bestStart >= "18:00") {
    tips.push("夜景點可先把手機電量與相機防手震設定確認好。");
  } else if (spot.bestStart < "12:00") {
    tips.push("上午點建議早點抵達，避開人潮會更容易拍乾淨畫面。");
  } else {
    tips.push("下午拍攝注意逆光方向，人物照可找側光或陰影邊緣。");
  }

  return tips;
}

export default function PhotoMapClient() {
  const [photoMap, setPhotoMap] = useState(defaultPhotoMapState);
  const [activeStatus, setActiveStatus] = useState<PhotoSpotStatus>("all");
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSpotId, setEditingSpotId] = useState<string | null>(null);
  const [formState, setFormState] = useState<PhotoSpotFormState>(emptyForm);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredPhotoMap();
    setPhotoMap(stored);
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    try {
      window.localStorage.setItem(photoMapStorageKey, JSON.stringify(photoMap));
    } catch {
      window.alert("照片資料太大，請改用較小的參考照片。");
    }
  }, [photoMap, hasHydrated]);

  const routeDate = getRouteDate(photoMap.spots);
  const routeDay = findTripDay(routeDate);
  const isTripToday = Boolean(findTripDay(getTodayDate()));
  const routeSpots = useMemo(
    () =>
      sortByDayAndTime(photoMap.spots).filter(
        (spot) => spot.dayDate === routeDate && !spot.completed,
      ),
    [photoMap.spots, routeDate],
  );
  const recommendedSpots = useMemo(() => {
    if (isTripToday) {
      const liveSpots = sortByDayAndTime(photoMap.spots).filter(
        (spot) => !spot.completed && getTimeBadge(spot),
      );

      return liveSpots.length > 0
        ? liveSpots.slice(0, 4)
        : routeSpots.slice(0, 4);
    }

    const goldenHourSpots = sortByDayAndTime(photoMap.spots).filter(
      (spot) => !spot.completed && isGoldenHourSpot(spot),
    );

    return goldenHourSpots.slice(0, 4);
  }, [isTripToday, photoMap.spots, routeSpots]);

  const visibleSpots = useMemo(() => {
    const spots = sortByDayAndTime(photoMap.spots);
    if (activeStatus === "completed") return spots.filter((spot) => spot.completed);
    if (activeStatus === "pending") return spots.filter((spot) => !spot.completed);

    return spots;
  }, [activeStatus, photoMap.spots]);

  const selectedSpot =
    photoMap.spots.find((spot) => spot.id === selectedSpotId) ?? null;
  const completedCount = photoMap.spots.filter((spot) => spot.completed).length;
  const completionRate =
    photoMap.spots.length > 0 ? (completedCount / photoMap.spots.length) * 100 : 0;
  const todayCompletedCount = photoMap.spots.filter(
    (spot) => spot.dayDate === getTodayDate() && spot.completed,
  ).length;

  function resetForm() {
    setEditingSpotId(null);
    setFormState({
      ...emptyForm,
      dayDate: routeDate,
    });
  }

  function openCreateForm() {
    resetForm();
    setIsFormOpen(true);
  }

  function openEditForm(spot: PhotoSpot) {
    setEditingSpotId(spot.id);
    setFormState(spotToForm(spot));
    setSelectedSpotId(null);
    setIsFormOpen(true);
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const image = await compressImage(file);
      setFormState((state) => ({ ...state, image }));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "圖片處理失敗。");
    } finally {
      event.target.value = "";
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formState.title.trim()) {
      window.alert("請輸入景點名稱。");
      return;
    }

    const day = findTripDay(formState.dayDate) ?? photoTripDays[0];
    const existingSpot = photoMap.spots.find((spot) => spot.id === editingSpotId);
    const nextSpot: PhotoSpot = {
      id: editingSpotId ?? `photo-${Date.now()}`,
      title: formState.title.trim(),
      area: formState.area.trim() || "首爾",
      address: formState.address.trim(),
      naverQuery:
        formState.naverQuery.trim() ||
        formState.address.trim() ||
        formState.title.trim(),
      dayDate: day.id,
      dayLabel: day.label,
      bestStart: formState.bestStart,
      bestEnd: formState.bestEnd,
      lightType: formState.lightType.trim() || "自訂時間",
      advice: formState.advice.trim() || "現場依光線與人潮調整構圖。",
      note: formState.note.trim(),
      image: formState.image || undefined,
      completed: existingSpot?.completed ?? false,
      createdAt: existingSpot?.createdAt ?? new Date().toISOString(),
    };

    setPhotoMap((state) => {
      if (editingSpotId) {
        return {
          ...state,
          spots: state.spots.map((spot) =>
            spot.id === editingSpotId ? nextSpot : spot,
          ),
        };
      }

      return { ...state, spots: [...state.spots, nextSpot] };
    });

    resetForm();
    setIsFormOpen(false);
  }

  function deleteSpot() {
    const spotId = editingSpotId;
    if (!spotId) return;

    const shouldDelete = window.confirm("確定要刪除這個拍照景點嗎？");
    if (!shouldDelete) return;

    setPhotoMap((state) => ({
      ...state,
      spots: state.spots.filter((spot) => spot.id !== spotId),
    }));
    resetForm();
    setIsFormOpen(false);
  }

  function toggleCompleted(spotId: string) {
    setPhotoMap((state) => ({
      ...state,
      spots: state.spots.map((spot) =>
        spot.id === spotId ? { ...spot, completed: !spot.completed } : spot,
      ),
    }));
  }

  const statusTabs: Array<{ id: PhotoSpotStatus; label: string }> = [
    { id: "all", label: "全部景點" },
    { id: "pending", label: "未完成" },
    { id: "completed", label: "已完成" },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F5F2]">
      <div className="mx-auto max-w-[430px] px-5 pb-36 pt-10">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-normal text-neutral-950">
              Photo Map
            </h1>
            <p className="mt-1 text-lg font-semibold text-neutral-700">
              我的拍照景點清單
            </p>
          </div>

          <button
            aria-label="今日拍照路線"
            className="mt-1 flex size-14 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-950 shadow-sm"
            onClick={() => setIsRouteOpen(true)}
            type="button"
          >
            <Map size={25} />
          </button>
        </header>

        <section className="mt-7 grid grid-cols-3 rounded-[22px] bg-neutral-100 p-1">
          {statusTabs.map((tab) => {
            const isActive = activeStatus === tab.id;

            return (
              <button
                className={`h-12 rounded-[18px] text-sm font-bold transition ${
                  isActive
                    ? "bg-neutral-950 text-white shadow-sm"
                    : "text-neutral-500"
                }`}
                key={tab.id}
                onClick={() => setActiveStatus(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </section>

        <section className="mt-5 grid grid-cols-4 rounded-[24px] border border-neutral-200 bg-white py-4 shadow-sm">
          <div className="border-r border-neutral-100 px-2 text-center">
            <MapPin className="mx-auto text-neutral-950" size={24} />
            <p className="mt-2 text-lg font-bold text-neutral-950">
              {photoMap.spots.length}
            </p>
            <p className="text-xs font-semibold text-neutral-500">全部景點</p>
          </div>
          <div className="border-r border-neutral-100 px-2 text-center">
            <Camera className="mx-auto text-neutral-950" size={24} />
            <p className="mt-2 text-lg font-bold text-neutral-950">
              {todayCompletedCount}
            </p>
            <p className="text-xs font-semibold text-neutral-500">今日已拍</p>
          </div>
          <div className="border-r border-neutral-100 px-2 text-center">
            <Flag className="mx-auto text-neutral-950" size={24} />
            <p className="mt-2 text-lg font-bold text-neutral-950">
              {completedCount}
            </p>
            <p className="text-xs font-semibold text-neutral-500">已完成</p>
          </div>
          <div className="px-2 text-center">
            <div className="mx-auto flex size-6 items-center justify-center rounded-full border-4 border-neutral-200">
              <span className="sr-only">完成度</span>
            </div>
            <p className="mt-2 text-lg font-bold text-neutral-950">
              {formatPercent(completionRate)}
            </p>
            <p className="text-xs font-semibold text-neutral-500">完成度</p>
          </div>
        </section>

        <section className="mt-5 rounded-[24px] border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-amber-700" />
            <div>
              <h2 className="text-base font-bold text-amber-950">
                推薦拍攝
              </h2>
              <p className="mt-0.5 text-xs font-semibold text-amber-800">
                {isTripToday
                  ? "依目前時間顯示現在或接下來適合的景點"
                  : "旅行前先看 10 月中旬夕陽、藍調與夜景重點"}
              </p>
            </div>
          </div>
          <div className="mt-3 grid gap-2">
            {recommendedSpots.length === 0 ? (
              <p className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-neutral-500">
                目前沒有符合時間的推薦景點。
              </p>
            ) : (
              recommendedSpots.map((spot) => {
                const timeBadge = getTimeBadge(spot);

                return (
                  <button
                    className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-left shadow-sm"
                    key={spot.id}
                    onClick={() => setSelectedSpotId(spot.id)}
                    type="button"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-bold text-neutral-950">
                        {spot.title}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-neutral-500">
                        {spot.dayLabel} · {spot.bestStart} - {spot.bestEnd} ·{" "}
                        {spot.lightType}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                        timeBadge?.className ?? "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {timeBadge?.label ?? "秋季重點"}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <section className="mt-5 space-y-3">
          {visibleSpots.length === 0 ? (
            <div className="rounded-[26px] border border-neutral-200 bg-white px-5 py-10 text-center shadow-sm">
              <p className="text-lg font-bold text-neutral-950">
                目前沒有景點
              </p>
              <p className="mt-2 text-sm font-semibold text-neutral-500">
                可以用下方按鈕新增自己的拍照清單。
              </p>
            </div>
          ) : (
            visibleSpots.map((spot, index) => {
              const timeBadge = getTimeBadge(spot);

              return (
                <article
                  className="rounded-[24px] border border-neutral-200 bg-white p-3 shadow-sm"
                  key={spot.id}
                >
                  <button
                    className="grid w-full grid-cols-[96px_1fr] gap-3 text-left"
                    onClick={() => setSelectedSpotId(spot.id)}
                    type="button"
                  >
                    <div>
                      <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
                        {spot.image ? (
                          <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${spot.image})` }}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-neutral-100" />
                        )}
                      </div>

                      <div className="mt-2 text-center text-xs font-bold tracking-normal text-neutral-400">
                        #{String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    <div className="min-w-0 py-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h2 className="truncate text-lg font-bold text-neutral-950">
                            {spot.title}
                          </h2>
                          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-neutral-500">
                            <MapPin size={14} />
                            <span className="truncate">{spot.area}</span>
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                            spot.completed
                              ? "bg-neutral-950 text-white"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {spot.completed ? "已完成" : "未完成"}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-700">
                          {spot.dayLabel}
                        </span>
                        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-600">
                          {spot.bestStart} - {spot.bestEnd}
                        </span>
                        {timeBadge && (
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${timeBadge.className}`}
                          >
                            {timeBadge.label}
                          </span>
                        )}
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm font-semibold leading-relaxed text-neutral-600">
                        {spot.advice}
                      </p>
                    </div>
                  </button>
                </article>
              );
            })
          )}
        </section>

        <button
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 text-lg font-bold text-white shadow-sm"
          onClick={openCreateForm}
          type="button"
        >
          <Plus size={22} />
          新增拍照景點
        </button>
      </div>

      {selectedSpot && (
        <div className="fixed inset-0 z-[60] bg-black/35">
          <button
            aria-label="關閉景點資訊"
            className="absolute inset-0 cursor-default"
            onClick={() => setSelectedSpotId(null)}
            type="button"
          />
          <section className="absolute inset-x-0 bottom-0 mx-auto max-h-[92vh] max-w-[430px] overflow-y-auto rounded-t-[32px] bg-white pb-8 shadow-2xl">
            <div className="sticky top-0 z-10 bg-white/95 px-5 pt-4 backdrop-blur">
              <div className="mx-auto h-1.5 w-14 rounded-full bg-neutral-200" />
              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate text-3xl font-bold text-neutral-950">
                    {selectedSpot.title}
                  </h2>
                  <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-neutral-500">
                    <MapPin size={16} />
                    <span className="truncate">
                      {selectedSpot.area} · {selectedSpot.address || selectedSpot.naverQuery}
                    </span>
                  </p>
                </div>
                <button
                  className="rounded-full bg-neutral-100 p-2 text-neutral-700"
                  onClick={() => setSelectedSpotId(null)}
                  type="button"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="px-5 pt-4">
              <div className="aspect-[4/3] overflow-hidden rounded-[24px] bg-neutral-100">
                {selectedSpot.image ? (
                  <div
                    className="size-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${selectedSpot.image})` }}
                  />
                ) : (
                  <div className="size-full bg-gradient-to-br from-stone-200 to-neutral-100" />
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-neutral-950 text-sm font-bold text-white"
                  onClick={() => openNaverMap(selectedSpot)}
                  type="button"
                >
                  <Navigation size={17} />
                  NAVER 導航
                </button>
                <button
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white text-sm font-bold text-neutral-950"
                  onClick={() => copyAddress(selectedSpot)}
                  type="button"
                >
                  <Copy size={17} />
                  複製地址
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  className={`flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold ${
                    selectedSpot.completed
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-neutral-100 text-neutral-700"
                  }`}
                  onClick={() => toggleCompleted(selectedSpot.id)}
                  type="button"
                >
                  <Check size={17} />
                  {selectedSpot.completed ? "取消完成" : "標記完成"}
                </button>
                <button
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-neutral-100 text-sm font-bold text-neutral-700"
                  onClick={() => openEditForm(selectedSpot)}
                  type="button"
                >
                  <Pencil size={17} />
                  編輯景點
                </button>
              </div>

              <section className="mt-5 rounded-[24px] border border-neutral-200 bg-white p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-neutral-50 p-3">
                    <CalendarDays size={18} className="text-neutral-500" />
                    <p className="mt-2 text-sm font-bold text-neutral-950">
                      {selectedSpot.dayLabel}
                    </p>
                    <p className="text-xs font-semibold text-neutral-500">
                      {selectedSpot.dayDate}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 p-3">
                    <Clock size={18} className="text-neutral-500" />
                    <p className="mt-2 text-sm font-bold text-neutral-950">
                      {selectedSpot.bestStart} - {selectedSpot.bestEnd}
                    </p>
                    <p className="text-xs font-semibold text-neutral-500">
                      {selectedSpot.lightType}
                    </p>
                  </div>
                </div>
              </section>

              <section className="mt-4 overflow-hidden rounded-[24px] border border-neutral-200 bg-white">
                <div className="border-b border-neutral-100 p-4">
                  <div className="flex items-center gap-2">
                    <Camera size={19} className="text-neutral-700" />
                    <h3 className="font-bold text-neutral-950">拍攝建議</h3>
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-neutral-600">
                    {selectedSpot.advice}
                  </p>
                </div>

                <div className="border-b border-neutral-100 p-4">
                  <div className="flex items-center gap-2">
                    <ExternalLink size={19} className="text-neutral-700" />
                    <h3 className="font-bold text-neutral-950">注意事項</h3>
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-neutral-600">
                    {selectedSpot.note || "依現場人潮、天氣與開放狀態調整拍攝順序。"}
                  </p>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <Lightbulb size={19} className="text-neutral-700" />
                    <h3 className="font-bold text-neutral-950">小貼士</h3>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm font-semibold leading-relaxed text-neutral-600">
                    {tipsForSpot(selectedSpot).map((tip) => (
                      <li key={tip}>- {tip}</li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
          </section>
        </div>
      )}

      {isRouteOpen && (
        <div className="fixed inset-0 z-[70] bg-black/30">
          <button
            aria-label="關閉今日拍照路線"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsRouteOpen(false)}
            type="button"
          />
          <section className="absolute inset-x-0 bottom-0 mx-auto max-w-[430px] rounded-t-[32px] bg-white px-5 pb-8 pt-4 shadow-2xl">
            <div className="mx-auto h-1.5 w-14 rounded-full bg-neutral-200" />
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-neutral-950">
                  今日拍照路線
                </h2>
                <p className="mt-1 text-sm font-semibold text-neutral-500">
                  {routeDay
                    ? `${routeDay.label} · ${routeDay.date}`
                    : "未完成景點"}
                </p>
              </div>
              <button
                className="rounded-full bg-neutral-100 p-2 text-neutral-700"
                onClick={() => setIsRouteOpen(false)}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 max-h-[54vh] space-y-3 overflow-y-auto pr-1">
              {routeSpots.length === 0 ? (
                <div className="rounded-2xl bg-neutral-50 p-5 text-center">
                  <p className="font-bold text-neutral-950">今日路線已完成</p>
                  <p className="mt-2 text-sm font-semibold text-neutral-500">
                    可以切換到全部景點確認其他拍照清單。
                  </p>
                </div>
              ) : (
                routeSpots.map((spot, index) => (
                  <div
                    className="grid grid-cols-[32px_1fr_auto] items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3"
                    key={spot.id}
                  >
                    <div className="flex size-8 items-center justify-center rounded-full bg-neutral-950 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <button
                      className="min-w-0 text-left"
                      onClick={() => {
                        setIsRouteOpen(false);
                        setSelectedSpotId(spot.id);
                      }}
                      type="button"
                    >
                      <p className="truncate font-bold text-neutral-950">
                        {spot.title}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-neutral-500">
                        {spot.bestStart} - {spot.bestEnd} · {spot.area}
                      </p>
                    </button>
                    <button
                      className="flex size-10 items-center justify-center rounded-xl bg-neutral-950 text-white"
                      onClick={() => openNaverMap(spot)}
                      type="button"
                    >
                      <Navigation size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-[80] bg-black/30">
          <button
            aria-label="關閉新增景點"
            className="absolute inset-0 cursor-default"
            onClick={() => {
              resetForm();
              setIsFormOpen(false);
            }}
            type="button"
          />
          <section className="absolute inset-x-0 bottom-0 mx-auto max-h-[88vh] max-w-[430px] overflow-y-auto rounded-t-[32px] bg-white px-5 pb-8 pt-4 shadow-2xl">
            <div className="mx-auto h-1.5 w-14 rounded-full bg-neutral-200" />
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-neutral-950">
                  {editingSpotId ? "編輯拍照景點" : "新增拍照景點"}
                </h2>
                <p className="mt-1 text-sm font-semibold text-neutral-500">
                  只存參考照片，拍完後勾選完成即可。
                </p>
              </div>
              <button
                className="rounded-full bg-neutral-100 p-2 text-neutral-700"
                onClick={() => {
                  resetForm();
                  setIsFormOpen(false);
                }}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
              <input
                className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
                onChange={(event) =>
                  setFormState((state) => ({ ...state, title: event.target.value }))
                }
                placeholder="景點名稱"
                value={formState.title}
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  className="h-12 rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
                  onChange={(event) =>
                    setFormState((state) => ({ ...state, area: event.target.value }))
                  }
                  placeholder="區域，例如：鐘路區"
                  value={formState.area}
                />
                <select
                  className="h-12 rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
                  onChange={(event) =>
                    setFormState((state) => ({
                      ...state,
                      dayDate: event.target.value,
                    }))
                  }
                  value={formState.dayDate}
                >
                  {photoTripDays.map((day) => (
                    <option key={day.id} value={day.id}>
                      {day.label} · {day.date}
                    </option>
                  ))}
                </select>
              </div>

              <input
                className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
                onChange={(event) =>
                  setFormState((state) => ({ ...state, address: event.target.value }))
                }
                placeholder="地址或地點描述"
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

              <div className="grid grid-cols-2 gap-3">
                <input
                  className="h-12 rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
                  onChange={(event) =>
                    setFormState((state) => ({
                      ...state,
                      bestStart: event.target.value,
                    }))
                  }
                  type="time"
                  value={formState.bestStart}
                />
                <input
                  className="h-12 rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
                  onChange={(event) =>
                    setFormState((state) => ({
                      ...state,
                      bestEnd: event.target.value,
                    }))
                  }
                  type="time"
                  value={formState.bestEnd}
                />
              </div>

              <input
                className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    lightType: event.target.value,
                  }))
                }
                placeholder="光線類型，例如：夕陽 / 藍調"
                value={formState.lightType}
              />

              <textarea
                className="min-h-24 w-full rounded-xl border border-neutral-200 px-4 py-3 text-base font-semibold outline-none focus:border-neutral-950"
                onChange={(event) =>
                  setFormState((state) => ({ ...state, advice: event.target.value }))
                }
                placeholder="拍攝建議"
                value={formState.advice}
              />

              <textarea
                className="min-h-20 w-full rounded-xl border border-neutral-200 px-4 py-3 text-base font-semibold outline-none focus:border-neutral-950"
                onChange={(event) =>
                  setFormState((state) => ({ ...state, note: event.target.value }))
                }
                placeholder="注意事項"
                value={formState.note}
              />

              <div className="rounded-2xl border border-neutral-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-neutral-950">參考照片</p>
                  {formState.image && (
                    <button
                      className="text-xs font-bold text-neutral-500"
                      onClick={() =>
                        setFormState((state) => ({ ...state, image: "" }))
                      }
                      type="button"
                    >
                      移除
                    </button>
                  )}
                </div>

                {formState.image && (
                  <div
                    className="mt-3 aspect-[4/3] rounded-xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${formState.image})` }}
                  />
                )}

                <label className="mt-3 flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-950 text-sm font-bold text-white">
                  <ImagePlus size={18} />
                  {formState.image ? "更換參考照片" : "上傳參考照片"}
                  <input
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    type="file"
                  />
                </label>
              </div>

              <button
                className="flex h-14 w-full items-center justify-center rounded-2xl bg-neutral-950 text-lg font-bold text-white"
                type="submit"
              >
                {editingSpotId ? "儲存修改" : "+ 新增景點"}
              </button>

              {editingSpotId && (
                <button
                  formNoValidate
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 text-sm font-bold text-red-600"
                  onClick={deleteSpot}
                  type="button"
                >
                  <Trash2 size={17} />
                  刪除景點
                </button>
              )}
            </form>
          </section>
        </div>
      )}

      <BottomNav />
    </main>
  );
}
