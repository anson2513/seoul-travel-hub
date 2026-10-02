import {
  seoul2026Trip,
  type Category,
  type OpeningHours,
  type Place,
  type TicketInfo,
  type TimePriority,
} from "@/lib/seoul-2026-master";

export type ItineraryCategory =
  | "flight"
  | "airport"
  | "transit"
  | "hotel"
  | "food"
  | "photo"
  | "cafe"
  | "shopping"
  | "pharmacy"
  | "attraction"
  | "market"
  | "rest";

export type ItineraryItem = {
  id: string;
  sequence?: number;
  startTime: string;
  endTime?: string;
  title: string;
  nameKo?: string;
  nameEn?: string;
  category: ItineraryCategory;
  location: string;
  address: string;
  naverQuery: string;
  note: string;
  details: string[];
  tips: string[];
  image?: string;
  timePriority?: TimePriority;
  hardDeadline?: string | null;
  openingHours?: OpeningHours;
  ticket?: TicketInfo;
  nearestStation?: string;
  subwayLines?: string[];
  exit?: string;
  walkMinutes?: number;
  transportNote?: string;
  mustVisit?: boolean;
  mustEat?: boolean;
  mustBuy?: boolean;
  photoPriority?: boolean;
  mustDo?: string[];
  mustOrder?: string[];
  mustBuyItems?: string[];
  warnings?: string[];
  requiresRecheck?: boolean;
  backupPlan?: string;
  completed?: boolean;
  favorite?: boolean;
  isCustom?: boolean;
};

export type ItineraryDay = {
  id: string;
  label: string;
  date: string;
  isoDate: string;
  tabDate: string;
  weekday: string;
  title: string;
  area: string;
  theme: string;
  notes?: string[];
  items: ItineraryItem[];
};

export const itineraryStorageKey =
  "seoul-travel-hub-itinerary-v5-day1-dinner";
export const previousItineraryStorageKeys = [
  "seoul-travel-hub-itinerary-v4-day1-seed",
  "seoul-travel-hub-itinerary-v3-final-master",
];
export const legacyItineraryStorageKey = "seoul-travel-hub-itinerary-v2";
export const hotelStorageKey = "seoul-travel-hub-hotels-v3-kotaro-address";

export const categoryLabels: Record<ItineraryCategory, string> = {
  flight: "航班",
  airport: "機場",
  transit: "交通",
  hotel: "住宿",
  food: "餐飲",
  photo: "拍照",
  cafe: "咖啡",
  shopping: "購物",
  pharmacy: "藥局",
  attraction: "景點",
  market: "市場",
  rest: "休息",
};

const categoryMap: Record<Category, ItineraryCategory> = {
  AIRPORT: "airport",
  HOTEL: "hotel",
  TRANSIT: "transit",
  PHOTO: "photo",
  FOOD: "food",
  SHOPPING: "shopping",
  PHARMACY: "pharmacy",
  ATTRACTION: "attraction",
  MARKET: "market",
};

function describeOpeningHours(openingHours?: OpeningHours) {
  if (!openingHours) return [];
  const range =
    openingHours.open && openingHours.close
      ? `營業時間 ${openingHours.open}-${openingHours.close}`
      : openingHours.note
        ? `營業時間 ${openingHours.note}`
        : null;
  const admission = openingHours.lastAdmission
    ? `最晚入場 ${openingHours.lastAdmission}`
    : null;
  const closed = openingHours.closedDays?.length
    ? `固定休息 ${openingHours.closedDays.join("、")}`
    : null;
  return [range, admission, closed].filter(Boolean) as string[];
}

function describeTicket(ticket?: TicketInfo) {
  if (!ticket) return [];
  if (!ticket.required) return [ticket.note === "FREE" ? "免費入場" : "免門票"];
  const details = [
    "需要門票",
    ticket.priceKRW ? `票價 ₩${ticket.priceKRW.toLocaleString("en-US")}` : null,
    ticket.advanceRecommended ? "建議事先購票" : null,
    ticket.provider ? `購票方式 ${ticket.provider}` : null,
  ];
  return details.filter(Boolean) as string[];
}

function joinList(label: string, values?: string[]) {
  return values?.length ? `${label}：${values.join("、")}` : null;
}

function masterPlaceToItem(item: Place): ItineraryItem {
  const transport = item.transportFromPrevious;
  const details = [
    item.nameKo ? `韓文名稱：${item.nameKo}` : null,
    item.nearestStation ? `最近車站：${item.nearestStation}` : null,
    item.subwayLines?.length ? `地鐵：${item.subwayLines.join("、")}` : null,
    item.exit ? `出口：${item.exit}` : null,
    item.walkMinutes ? `步行約 ${item.walkMinutes} 分鐘` : null,
    item.walkingDistanceMeters
      ? `步行約 ${item.walkingDistanceMeters} 公尺`
      : null,
    item.phone ? `電話：${item.phone}` : null,
    ...describeOpeningHours(item.openingHours),
    ...describeTicket(item.ticket),
    joinList("必做", item.mustDo),
    joinList("必吃", item.mustOrder),
    joinList("必買", item.mustBuyItems),
    joinList("重點", item.features),
    item.userNote ?? null,
  ].filter(Boolean) as string[];

  const warnings = [...(item.warning ?? [])];
  if (item.requiresRecheck) warnings.unshift("⚠ 出發前再次確認");
  if (item.backupPlan) warnings.push(`備案：${item.backupPlan}`);

  const transportNote = transport
    ? [
        transport.method?.join(" / "),
        transport.station,
        transport.estimatedMinutes ? `約 ${transport.estimatedMinutes} 分鐘` : null,
        transport.note,
      ]
        .filter(Boolean)
        .join(" · ")
    : undefined;
  if (transportNote) details.push(`交通：${transportNote}`);

  // NAVER integrated search is more reliable with one canonical place name.
  // The full address remains available as a fallback and for copying.
  const query =
    item.navigationKeyword ?? item.nameKo ?? item.addressKo ?? item.nameZh;

  return {
    id: item.id,
    sequence: item.sequence,
    startTime: item.startTime ?? "",
    endTime: item.endTime,
    title: item.nameZh,
    nameKo: item.nameKo,
    nameEn: item.nameEn,
    category: categoryMap[item.category],
    location: item.nameKo ?? item.area ?? item.nearestStation ?? item.nameZh,
    address: item.addressKo ?? item.navigationKeyword ?? item.nameKo ?? "待確認",
    naverQuery: query || item.nameZh,
    note: item.note ?? item.userNote ?? details[0] ?? "依現場狀況彈性調整",
    details,
    tips: warnings,
    image: item.imageUrl ?? undefined,
    timePriority: item.timePriority,
    hardDeadline: item.hardDeadline,
    openingHours: item.openingHours,
    ticket: item.ticket,
    nearestStation: item.nearestStation,
    subwayLines: item.subwayLines,
    exit: item.exit,
    walkMinutes: item.walkMinutes,
    transportNote,
    mustVisit: item.mustVisit,
    mustEat: item.mustEat,
    mustBuy: item.mustBuy,
    photoPriority: item.photoPriority,
    mustDo: item.mustDo,
    mustOrder: item.mustOrder,
    mustBuyItems: item.mustBuyItems,
    warnings,
    requiresRecheck: item.requiresRecheck,
    backupPlan: item.backupPlan,
    completed: item.completed ?? false,
    favorite: item.favorite ?? false,
  };
}

export const defaultItineraryDays: ItineraryDay[] = seoul2026Trip.days.map(
  (day, index) => ({
    id: day.id,
    label: `DAY ${index}`,
    date: day.date.replaceAll("-", "."),
    isoDate: day.date,
    tabDate: day.date.slice(5).replace("-", "."),
    weekday: day.weekday,
    title: day.title,
    area: day.routeSummary.at(-1) ?? "首爾",
    theme: day.routeSummary.join(" → "),
    notes: day.notes,
    items: day.places.map(masterPlaceToItem),
  }),
);

export function getDefaultHotelInfo() {
  return {
    name: seoul2026Trip.accommodation.name,
    address: seoul2026Trip.accommodation.addressKo,
    naverQuery: `${seoul2026Trip.accommodation.nameKo} ${seoul2026Trip.accommodation.addressKo}`,
  };
}
