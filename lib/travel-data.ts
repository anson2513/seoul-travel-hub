export type FlightInfo = {
  airline: string;
  flightNo: string;
  date: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  departTime: string;
  arriveTime: string;
  direction: "去程" | "回程";
};

export type SchedulePreviewItem = {
  time: string;
  title: string;
  subtitle: string;
  image?: string;
};

export const tripDates = {
  start: seoul2026Trip.startDate,
  end: seoul2026Trip.endDate,
  display: "10.10 - 10.15",
};

export const flights: FlightInfo[] = [
  {
    airline: "Tigerair Taiwan",
    flightNo: "IT662",
    date: "2026-10-10",
    fromCode: "KHH",
    fromCity: "高雄",
    toCode: "GMP",
    toCity: "首爾",
    departTime: "15:55",
    arriveTime: "19:45",
    direction: "去程",
  },
  {
    airline: "Tigerair Taiwan",
    flightNo: "IT662",
    date: "2026-10-15",
    fromCode: "GMP",
    fromCity: "首爾",
    toCode: "KHH",
    toCity: "高雄",
    departTime: "20:35",
    arriveTime: "22:40",
    direction: "回程",
  },
];

export function getTodaySchedulePreview(date = new Date()): SchedulePreviewItem[] {
  return getDashboardDay(date).places.slice(0, 4).map((item) => ({
    time: item.startTime ?? "彈性",
    title: item.nameZh,
    subtitle: item.nameKo ?? item.addressKo ?? item.area ?? "首爾",
    image: item.imageUrl ?? undefined,
  }));
}

export const emergencyContacts = [
  {
    label: "緊急電話",
    value: "119",
    href: "tel:119",
    tone: "red",
  },
  {
    label: "旅遊服務",
    value: "1330",
    href: "tel:1330",
    tone: "blue",
  },
  {
    label: "駐韓代表處",
    value: "+82-2-738-1038",
    href: "tel:+8227381038",
    tone: "dark",
  },
] as const;
import { getDashboardDay, seoul2026Trip } from "@/lib/seoul-2026-master";
