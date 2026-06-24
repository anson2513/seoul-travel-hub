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
  image: string;
};

export const tripDates = {
  start: "2026-10-10",
  end: "2026-10-15",
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

export const todaySchedulePreview: SchedulePreviewItem[] = [
  {
    time: "09:00",
    title: "早餐",
    subtitle: "弘大 Cafe Layered",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
  },
  {
    time: "10:30",
    title: "景福宮",
    subtitle: "Gyeongbokgung Palace",
    image:
      "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?q=80&w=800&auto=format&fit=crop",
  },
  {
    time: "13:00",
    title: "土俗村蔘雞湯",
    subtitle: "Tosokchon Samgyetang",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop",
  },
  {
    time: "15:30",
    title: "北村韓屋村",
    subtitle: "Bukchon Hanok Village",
    image:
      "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop",
  },
];

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
