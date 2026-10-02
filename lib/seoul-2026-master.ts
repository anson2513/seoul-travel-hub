export type Category =
  | "AIRPORT"
  | "HOTEL"
  | "TRANSIT"
  | "PHOTO"
  | "FOOD"
  | "SHOPPING"
  | "PHARMACY"
  | "ATTRACTION"
  | "MARKET";

export type TimePriority = "FLEXIBLE" | "RECOMMENDED" | "HARD";

export type OpeningHours = {
  open?: string;
  close?: string;
  lastAdmission?: string;
  closedDays?: string[];
  note?: string;
};

export type TicketInfo = {
  required: boolean;
  advanceRecommended?: boolean;
  provider?: "KLOOK" | "OFFICIAL" | "ONSITE" | null;
  priceKRW?: number | null;
  bookingUrl?: string | null;
  note?: string;
};

export type TransportInfo = {
  method?: string[];
  station?: string;
  subwayLines?: string[];
  exit?: string;
  walkMinutes?: number;
  estimatedMinutes?: number;
  note?: string;
};

export type Place = {
  id: string;
  sequence: number;
  category: Category;
  nameZh: string;
  nameKo?: string;
  nameEn?: string;
  addressKo?: string;
  area?: string;
  latitude?: number | null;
  longitude?: number | null;
  nearestStation?: string;
  subwayLines?: string[];
  exit?: string;
  walkMinutes?: number;
  walkingDistanceMeters?: number;
  phone?: string;
  startTime?: string;
  endTime?: string;
  openingHours?: OpeningHours;
  ticket?: TicketInfo;
  timePriority: TimePriority;
  hardDeadline?: string | null;
  mustVisit?: boolean;
  mustEat?: boolean;
  mustBuy?: boolean;
  photoPriority?: boolean;
  features?: string[];
  mustDo?: string[];
  mustOrder?: string[];
  mustBuyItems?: string[];
  navigationKeyword?: string;
  transportFromPrevious?: TransportInfo;
  note?: string;
  userNote?: string;
  warning?: string[];
  requiresRecheck?: boolean;
  backupPlan?: string;
  naverMapUrl?: string | null;
  kakaoMapUrl?: string | null;
  reservationUrl?: string | null;
  klookUrl?: string | null;
  officialUrl?: string | null;
  imageUrl?: string | null;
  completed?: boolean;
  favorite?: boolean;
  personalNotes?: string;
};

export type TripDay = {
  id: string;
  date: string;
  weekday: string;
  title: string;
  routeSummary: string[];
  notes?: string[];
  places: Place[];
};

export type ScheduleStatus = "EARLY" | "ON_TIME" | "AT_RISK" | "LATE";

export type SeoulTrip = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  timezone: string;
  currency: "KRW";
  language: "zh-TW";
  airport: {
    arrival: { airport: string; airportKo: string; code: "GMP"; date: string; time: string };
    departure: { airport: string; airportKo: string; code: "GMP"; date: string; time: string };
  };
  accommodation: {
    name: string;
    nameKo: string;
    addressKo: string;
    area: string;
    nearestStation: string;
    preferredExit: string;
  };
  days: TripDay[];
};

function place(input: Omit<Place, "latitude" | "longitude" | "naverMapUrl" | "kakaoMapUrl">): Place {
  return {
    ...input,
    latitude: null,
    longitude: null,
    naverMapUrl: null,
    kakaoMapUrl: null,
  };
}

const ticket = (
  required: boolean,
  input: Omit<TicketInfo, "required"> = {},
): TicketInfo => ({ required, ...input });

export const seoul2026Trip: SeoulTrip = {
  id: "seoul-2026-final",
  name: "SEOUL TRAVEL HUB 2026",
  startDate: "2026-10-10",
  endDate: "2026-10-15",
  timezone: "Asia/Seoul",
  currency: "KRW",
  language: "zh-TW",
  airport: {
    arrival: {
      airport: "Gimpo International Airport",
      airportKo: "김포국제공항",
      code: "GMP",
      date: "2026-10-10",
      time: "15:55",
    },
    departure: {
      airport: "Gimpo International Airport",
      airportKo: "김포국제공항",
      code: "GMP",
      date: "2026-10-15",
      time: "20:35",
    },
  },
  accommodation: {
    name: "Kotaro House",
    nameKo: "코타로하우스",
    addressKo: "서울 마포구 와우산로 162-8",
    area: "Hongdae",
    nearestStation: "홍대입구역",
    preferredExit: "6",
  },
  days: [
    {
      id: "day-0",
      date: "2026-10-10",
      weekday: "Sat",
      title: "抵達日｜金浦 → 弘大",
      routeSummary: ["金浦國際機場", "Kotaro House", "Ready Young 弘大藥局", "弘大商圈", "住宿"],
      notes: ["機場固定為金浦 GMP，不得替換成仁川 ICN。", "第一晚不安排正式景點，早點休息。"],
      places: [
        place({
          id: "gimpo-arrival",
          sequence: 1,
          category: "AIRPORT",
          nameZh: "金浦國際機場",
          nameKo: "김포국제공항",
          nameEn: "Gimpo International Airport",
          addressKo: "김포국제공항",
          imageUrl: "/images/itinerary/day-0/gimpo-international-airport.webp",
          startTime: "15:55",
          timePriority: "HARD",
          note: "抵達金浦機場後搭乘 AREX 前往弘大。",
          mustDo: ["入境", "領取行李", "確認交通卡"],
          transportFromPrevious: {
            method: ["AREX Airport Railroad"],
            station: "김포공항역 → 홍대입구역",
          },
          warning: ["本次機場為 GMP，請勿前往 ICN。"],
        }),
        place({
          id: "kotaro-house",
          sequence: 2,
          category: "HOTEL",
          nameZh: "Kotaro House",
          nameKo: "코타로하우스",
          addressKo: "서울 마포구 와우산로 162-8",
          imageUrl: "/images/itinerary/day-0/kotaro-house.webp",
          area: "Hongdae",
          nearestStation: "홍대입구역",
          exit: "6",
          timePriority: "FLEXIBLE",
          note: "辦理入住並放置行李。",
          mustDo: ["Check-in", "放置行李"],
        }),
        place({
          id: "ready-young-hongdae",
          sequence: 3,
          category: "PHARMACY",
          nameZh: "Ready Young 弘大藥局",
          nameKo: "레디영약국",
          nameEn: "Ready Young Pharmacy Hongdae",
          addressKo: "서울 마포구 홍익로6길 8",
          imageUrl: "/images/itinerary/day-0/ready-young-hongdae.webp",
          nearestStation: "홍대입구역",
          exit: "9",
          walkMinutes: 3,
          openingHours: { open: "10:00", close: "23:00" },
          timePriority: "HARD",
          hardDeadline: "23:00",
          mustBuy: true,
          mustBuyItems: ["THOME CPR Serum 30ml"],
          requiresRecheck: true,
          note: "抵達首爾第一晚優先購買，避免後續缺貨還需要重新找店。",
        }),
        place({
          id: "hongdae-day0",
          sequence: 4,
          category: "SHOPPING",
          nameZh: "弘大商圈",
          nameKo: "홍대거리",
          imageUrl: "/images/itinerary/day-0/hongdae-shopping-street.webp",
          nearestStation: "홍대입구역",
          timePriority: "FLEXIBLE",
          features: ["Shopping", "Olive Young", "Dinner", "Night walk"],
          note: "第一晚不安排正式景點，早點休息。",
        }),
      ],
    },
    {
      id: "day-1",
      date: "2026-10-11",
      weekday: "Sun",
      title: "漢江・天空公園・63 SkyPicnic",
      routeSummary: [
        "Kotaro House",
        "望遠市場",
        "天空公園",
        "汝矣島漢江公園",
        "63 SkyPicnic",
        "apM Place",
        "弘大",
        "Kotaro House",
      ],
      notes: [
        "主要拍攝任務：天空公園秋季芒草、汝矣島漢江、63 SkyPicnic 夕陽、藍調與夜景。",
        "15:40 離開汝矣島漢江公園，目標 16:10 前抵達 63 SkyPicnic。",
        "63 SkyPicnic 結束後前往東大門 apM Place 購買男裝，再返回弘大。",
        "弘大晚餐不鎖定時間，依購物結束時間與體力決定。",
      ],
      places: [
        place({
          id: "mangwon-market",
          sequence: 1,
          category: "MARKET",
          nameZh: "望遠市場",
          nameKo: "망원시장",
          nameEn: "Mangwon Market",
          addressKo: "서울 마포구 포은로6길 27",
          imageUrl: "/images/itinerary/day-1/mangwon-market.webp",
          nearestStation: "망원역",
          subwayLines: ["Line 6"],
          exit: "2",
          startTime: "09:30",
          endTime: "11:00",
          openingHours: { open: "09:00", close: "21:00" },
          timePriority: "RECOMMENDED",
          mustEat: true,
          mustOrder: ["早餐", "市場美食"],
          features: ["早餐", "市場逛街", "美食"],
          note: "早餐＋市場逛街。",
        }),
        place({
          id: "haneul-park",
          sequence: 2,
          category: "PHOTO",
          nameZh: "天空公園",
          nameKo: "하늘공원",
          nameEn: "Haneul Park",
          addressKo: "서울 마포구 하늘공원로 95",
          imageUrl: "/images/itinerary/day-1/haneul-park.webp",
          nearestStation: "월드컵경기장역",
          subwayLines: ["Line 6"],
          exit: "1",
          startTime: "11:20",
          endTime: "13:40",
          timePriority: "RECOMMENDED",
          photoPriority: true,
          features: ["拍照", "秋季芒草", "散步", "首爾天際線"],
          note: "10 月芒草季，DAY 1 主要拍照景點。",
          warning: ["不要在此等待日落。", "13:40 必須離開。"],
        }),
        place({
          id: "yeouido-hangang-park",
          sequence: 3,
          category: "PHOTO",
          nameZh: "汝矣島漢江公園",
          nameKo: "여의도한강공원",
          nameEn: "Yeouido Hangang Park",
          addressKo: "서울 영등포구 여의동로 330",
          imageUrl: "/images/itinerary/day-1/yeouido-hangang-park.webp",
          navigationKeyword: "여의도한강공원",
          area: "Yeouido",
          startTime: "14:40",
          endTime: "15:40",
          timePriority: "RECOMMENDED",
          photoPriority: true,
          features: ["漢江", "散步", "拍照", "城市景觀"],
          note: "漢江河岸散步與拍照，之後沿漢江方向前往 63 大樓。",
        }),
        place({
          id: "63-skypicnic",
          sequence: 4,
          category: "PHOTO",
          nameZh: "63 SkyPicnic",
          nameKo: "63 스카이피크닉",
          nameEn: "63 SkyPicnic",
          addressKo: "서울 영등포구 63로 50 63한화생명빌딩 60F",
          imageUrl: "/images/itinerary/day-1/63-skypicnic.webp",
          navigationKeyword: "63 스카이피크닉",
          area: "Yeouido",
          nearestStation: "여의나루역",
          subwayLines: ["Line 5"],
          exit: "1",
          startTime: "16:10",
          endTime: "19:15",
          openingHours: { open: "10:00", close: "22:00", lastAdmission: "21:30" },
          ticket: ticket(true, { advanceRecommended: true, provider: "KLOOK", bookingUrl: null }),
          timePriority: "HARD",
          mustVisit: true,
          photoPriority: true,
          mustDo: [
            "16:10-17:20 白天漢江＋首爾城市景觀",
            "17:20-18:01 黃金時刻＋夕陽",
            "18:01-18:35 日落＋藍調",
            "18:35-19:15 首爾夜景",
          ],
          features: ["Han River", "Seoul skyline", "Sunset", "Rooftop"],
          warning: ["下雨、強風或雷電時屋頂可能關閉。", "到訪前確認天氣。"],
          backupPlan: "若屋頂關閉，改用室內觀景台。",
        }),
        place({
          id: "apm-day1",
          sequence: 5,
          category: "SHOPPING",
          nameZh: "apM Place Shopping Centre",
          nameKo: "에이피엠 플레이스",
          nameEn: "APM Place",
          addressKo: "서울 중구 을지로 276",
          imageUrl: "/images/itinerary/day-1/apm-place.webp",
          navigationKeyword: "에이피엠 플레이스",
          nearestStation: "동대문역사문화공원역",
          startTime: "20:00",
          endTime: "21:30",
          timePriority: "HARD",
          mustBuy: true,
          userNote: "東大門購物；主要任務為男裝。",
          requiresRecheck: true,
          warning: ["樓層配置及營業日可能變更。"],
        }),
        place({
          id: "hongdae-dinner-day1",
          sequence: 6,
          category: "FOOD",
          nameZh: "元堂馬鈴薯排骨湯 東橋店",
          nameKo: "원당감자탕 동교점",
          addressKo: "서울 마포구 홍익로6길 76",
          imageUrl: "/images/itinerary/day-1/wondang-gamjatang.webp",
          navigationKeyword: "원당감자탕 동교점",
          area: "Hongdae",
          nearestStation: "홍대입구역",
          exit: "8",
          walkingDistanceMeters: 145,
          phone: "02-334-3666",
          startTime: "22:00",
          timePriority: "RECOMMENDED",
          mustEat: true,
          mustOrder: ["馬鈴薯排骨湯"],
          features: ["晚餐", "馬鈴薯排骨湯"],
          note: "DAY 1 東大門購物結束後前往。",
        }),
        place({
          id: "return-kotaro-day1",
          sequence: 7,
          category: "HOTEL",
          nameZh: "返回 Kotaro House",
          nameKo: "코타로하우스",
          addressKo: "서울 마포구 와우산로 162-8",
          navigationKeyword: "서울 마포구 와우산로 162-8",
          area: "Hongdae",
          timePriority: "FLEXIBLE",
          note: "DAY 1 行程結束。",
          imageUrl: "/images/itinerary/day-0/kotaro-house.webp",
        }),
      ],
    },
    {
      id: "day-2",
      date: "2026-10-12",
      weekday: "Mon",
      title: "景福宮 → 北村 → 益善洞 → 東大門",
      routeSummary: ["景福宮", "松峴洞", "三清洞", "北村", "清水堂", "東大門文具玩具街", "DDP"],
      notes: ["東大門文具玩具街必須在 16:00 前抵達。"],
      places: [
        place({
          id: "gyeongbokgung",
          sequence: 1,
          category: "PHOTO",
          nameZh: "景福宮",
          nameKo: "경복궁",
          nameEn: "Gyeongbokgung Palace",
          addressKo: "서울 종로구 사직로 161",
          nearestStation: "경복궁역",
          subwayLines: ["Line 3"],
          exit: "5",
          walkMinutes: 5,
          startTime: "09:00",
          endTime: "10:30",
          openingHours: { open: "09:00", close: "18:00", lastAdmission: "17:00", closedDays: ["Tuesday"] },
          ticket: ticket(true, { provider: "ONSITE", priceKRW: 3000 }),
          timePriority: "HARD",
          photoPriority: true,
          features: ["Joseon Palace", "Geunjeongjeon", "Gyeonghoeru", "Traditional architecture"],
        }),
        place({
          id: "songhyeon",
          sequence: 2,
          category: "PHOTO",
          nameZh: "三清洞・松峴洞石牆街",
          nameKo: "송현동 일대",
          addressKo: "서울 종로구 송현동 57-1 일대",
          navigationKeyword: "열린송현 녹지광장",
          startTime: "10:30",
          endTime: "11:15",
          timePriority: "FLEXIBLE",
          photoPriority: true,
          features: ["Stone wall", "Street photography", "Autumn atmosphere"],
        }),
        place({
          id: "samcheong",
          sequence: 3,
          category: "SHOPPING",
          nameZh: "三清洞",
          nameKo: "삼청동",
          navigationKeyword: "삼청동길",
          startTime: "11:15",
          endTime: "12:00",
          timePriority: "FLEXIBLE",
          features: ["Boutiques", "Hanok", "Lifestyle stores", "Cafe"],
        }),
        place({
          id: "kodak-bukchon",
          sequence: 4,
          category: "SHOPPING",
          nameZh: "Kodak Bukchon Seoul House",
          nameKo: "코닥 북촌서울하우스",
          addressKo: "서울 종로구 삼청로2길 37-2",
          startTime: "12:00",
          endTime: "12:45",
          timePriority: "FLEXIBLE",
          navigationKeyword: "코닥 북촌서울하우스",
          requiresRecheck: true,
        }),
        place({
          id: "bukchon",
          sequence: 5,
          category: "PHOTO",
          nameZh: "北村韓屋村",
          nameKo: "북촌한옥마을",
          nameEn: "Bukchon Hanok Village",
          addressKo: "서울 종로구 가회동 31-78 일대",
          navigationKeyword: "북촌한옥마을",
          nearestStation: "안국역",
          startTime: "12:45",
          endTime: "14:00",
          timePriority: "FLEXIBLE",
          photoPriority: true,
          features: ["Hanok", "Traditional streets", "Sloped alleys"],
          warning: ["此處為住宅區，請保持安靜。", "請勿阻擋住家入口，並遵守限制觀光區規定。"],
        }),
        place({
          id: "cheongsudang",
          sequence: 6,
          category: "FOOD",
          nameZh: "清水堂",
          nameKo: "청수당 베이커리",
          nameEn: "Cheongsudang Bakery",
          addressKo: "서울 종로구 돈화문로11나길 31-9",
          area: "Ikseondong",
          startTime: "14:10",
          endTime: "15:00",
          openingHours: { open: "10:30", close: "20:00" },
          timePriority: "HARD",
          features: ["Hanok cafe", "Garden", "Water feature", "Dessert"],
          warning: ["約 15:00 必須離開。"],
        }),
        place({
          id: "dongdaemun-toy-street",
          sequence: 7,
          category: "SHOPPING",
          nameZh: "東大門文具玩具街",
          nameKo: "동대문 문구완구거리",
          nameEn: "Dongdaemun Stationery and Toy Street",
          addressKo: "서울 종로구 종로52길 36 일대",
          navigationKeyword: "동대문 문구완구거리",
          nearestStation: "동대문역",
          subwayLines: ["Line 1", "Line 4"],
          exit: "4",
          startTime: "15:30",
          endTime: "17:30",
          openingHours: { note: "約 08:00-19:00" },
          timePriority: "HARD",
          hardDeadline: "16:00",
          features: ["Toys", "Stationery", "Character goods", "Models", "Party supplies"],
          warning: ["部分店家約 18:00 關門。", "目標 15:30-15:45 抵達，最晚不可超過 16:00。"],
        }),
        place({
          id: "ddp",
          sequence: 8,
          category: "PHOTO",
          nameZh: "東大門設計廣場",
          nameKo: "동대문디자인플라자",
          nameEn: "Dongdaemun Design Plaza",
          addressKo: "서울 중구 을지로 281",
          timePriority: "FLEXIBLE",
          photoPriority: true,
          features: ["Architecture", "Night photography", "Zaha Hadid"],
        }),
        place({
          id: "apm-day2",
          sequence: 9,
          category: "SHOPPING",
          nameZh: "東大門 APM 補貨",
          nameKo: "에이피엠 플레이스",
          addressKo: "서울 중구 을지로 276",
          navigationKeyword: "에이피엠 플레이스",
          timePriority: "FLEXIBLE",
          note: "只買缺少的服裝，主要採買安排在 DAY 1。",
        }),
        place({
          id: "mimiline",
          sequence: 10,
          category: "SHOPPING",
          nameZh: "MIMILINE",
          nameKo: "미미라인",
          addressKo: "서울 중구 마장로 30",
          openingHours: { note: "約 11:00-05:00" },
          timePriority: "FLEXIBLE",
          features: ["Accessories", "Fashion", "Lifestyle goods"],
          requiresRecheck: true,
          warning: ["地址過去曾變更，出發前請再次確認。"],
        }),
      ],
    },
    {
      id: "day-3",
      date: "2026-10-13",
      weekday: "Tue",
      title: "明洞 → 國立中央博物館 → N首爾塔",
      routeSummary: ["明洞漫畫街", "明洞商圈", "水剌醬蟹", "國立中央博物館", "南山白凡廣場", "N首爾塔", "弘大烤肉"],
      notes: ["N首爾塔必須涵蓋日景、黃金時刻、日落、藍調與夜景。"],
      places: [
        place({
          id: "myeongdong-cartoon-street",
          sequence: 1,
          category: "PHOTO",
          nameZh: "明洞漫畫街",
          nameKo: "명동 재미로",
          nearestStation: "명동역",
          subwayLines: ["Line 4"],
          exit: "3",
          startTime: "09:30",
          timePriority: "FLEXIBLE",
          photoPriority: true,
          features: ["Urban alley", "Cartoon buildings", "N Seoul Tower framing"],
        }),
        place({
          id: "myeongdong-shopping",
          sequence: 2,
          category: "SHOPPING",
          nameZh: "明洞商圈",
          nameKo: "명동",
          timePriority: "FLEXIBLE",
        }),
        place({
          id: "nyunyu",
          sequence: 3,
          category: "SHOPPING",
          nameZh: "NYU NYU 明洞",
          nameKo: "뉴뉴 명동",
          addressKo: "서울 중구 명동4길 22 1-4F",
          navigationKeyword: "뉴뉴 명동점",
          openingHours: { open: "09:00", close: "23:00" },
          timePriority: "FLEXIBLE",
          features: ["Accessories", "Jewelry", "Fashion"],
        }),
        place({
          id: "spao",
          sequence: 4,
          category: "SHOPPING",
          nameZh: "SPAO 明洞",
          nameKo: "스파오 명동점",
          addressKo: "서울 중구 명동8나길 15",
          openingHours: { open: "10:00", close: "22:00" },
          timePriority: "FLEXIBLE",
        }),
        place({
          id: "sura-gejang",
          sequence: 5,
          category: "FOOD",
          nameZh: "水剌醬蟹",
          nameKo: "수라게장",
          addressKo: "서울 중구 명동10길 18 2층",
          navigationKeyword: "수라게장",
          startTime: "11:30",
          endTime: "12:30",
          openingHours: { open: "10:00", close: "24:00" },
          timePriority: "FLEXIBLE",
          mustEat: true,
          mustOrder: ["간장게장"],
          warning: ["請使用精確地址，附近有相似名稱的餐廳。"],
        }),
        place({
          id: "national-museum",
          sequence: 6,
          category: "PHOTO",
          nameZh: "韓國國立中央博物館",
          nameKo: "국립중앙박물관",
          nameEn: "National Museum of Korea",
          addressKo: "서울 용산구 서빙고로 137",
          navigationKeyword: "국립중앙박물관",
          nearestStation: "이촌역",
          startTime: "13:15",
          endTime: "14:45",
          openingHours: { open: "09:30", close: "17:30" },
          ticket: ticket(false, { priceKRW: 0, note: "FREE" }),
          timePriority: "FLEXIBLE",
          photoPriority: true,
          features: ["Open Plaza", "Architecture", "N Seoul Tower framing"],
          note: "以拍照為主，不安排深度參觀。",
        }),
        place({
          id: "baekbeom-square",
          sequence: 7,
          category: "PHOTO",
          nameZh: "南山白凡廣場",
          nameKo: "백범광장",
          addressKo: "서울 중구 회현동 일대",
          startTime: "15:15",
          endTime: "16:15",
          timePriority: "FLEXIBLE",
          photoPriority: true,
          features: ["Hanyang City Wall", "Grass lawn", "N Seoul Tower"],
        }),
        place({
          id: "n-seoul-tower",
          sequence: 8,
          category: "PHOTO",
          nameZh: "N首爾塔",
          nameKo: "N서울타워",
          nameEn: "N Seoul Tower",
          addressKo: "서울 용산구 남산공원길 105",
          startTime: "16:30",
          endTime: "19:15",
          openingHours: { note: "約 10:00-22:30" },
          ticket: ticket(true, { advanceRecommended: true, provider: "KLOOK", bookingUrl: null }),
          timePriority: "HARD",
          mustVisit: true,
          photoPriority: true,
          mustDo: ["Daylight", "Golden Hour", "Sunset", "Blue Hour", "Night View"],
          features: ["Seoul panorama", "Namsan", "Sunset", "Night skyline"],
          warning: ["不要自動改走纜車路線，上一站為南山白凡廣場。"],
        }),
        place({
          id: "mokgumung",
          sequence: 9,
          category: "FOOD",
          nameZh: "弘大水芹菜烤肉",
          nameKo: "목구멍 홍대입구역점",
          nameEn: "MokGuMung BBQ Hongdae",
          addressKo: "서울 마포구 월드컵북로4길 8 1층",
          navigationKeyword: "목구멍 홍대입구역점",
          startTime: "20:00",
          openingHours: { open: "12:00", close: "24:00" },
          timePriority: "FLEXIBLE",
          mustEat: true,
          mustOrder: ["Pork", "미나리"],
          features: ["Korean BBQ", "Minari", "Staff grilling"],
        }),
      ],
    },
    {
      id: "day-4",
      date: "2026-10-14",
      weekday: "Wed",
      title: "聖水 → COEX → 清溪川",
      routeSummary: ["JOJO 刀削麵", "STAND OIL", "BLUE ELEPHANT", "HAUS NOWHERE", "SEA LIFE COEX", "星空圖書館", "清溪川"],
      notes: ["聖水只安排 JOJO 一間餐廳。", "SEA LIFE COEX 與 COEX 星空圖書館必須維持同一天。"],
      places: [
        place({
          id: "jojo-seongsu",
          sequence: 1,
          category: "FOOD",
          nameZh: "JOJO 刀削麵 聖水店",
          nameKo: "조조칼국수 성수점",
          nameEn: "JOJO Kalguksu Seongsu",
          addressKo: "서울 성동구 성수일로8길 55 1층",
          navigationKeyword: "조조칼국수 성수점",
          startTime: "10:30",
          endTime: "11:30",
          openingHours: { open: "10:00", close: "21:30" },
          timePriority: "FLEXIBLE",
          mustEat: true,
          mustOrder: ["낙지해물파전"],
          note: "主點章魚海鮮煎餅，可選配刀削麵。",
        }),
        place({
          id: "stand-oil",
          sequence: 2,
          category: "SHOPPING",
          nameZh: "STAND OIL 聖水",
          nameKo: "스탠드오일",
          addressKo: "서울 성동구 연무장11길 19",
          openingHours: { open: "11:00", close: "20:00" },
          timePriority: "FLEXIBLE",
          features: ["Bags", "Korean fashion"],
        }),
        place({
          id: "blue-elephant",
          sequence: 3,
          category: "SHOPPING",
          nameZh: "BLUE ELEPHANT 聖水旗艦店",
          nameKo: "블루엘리펀트 성수",
          addressKo: "서울 성동구 연무장길 13 2-3F",
          navigationKeyword: "블루엘리펀트 성수 플래그십",
          openingHours: { open: "12:00", close: "22:00" },
          timePriority: "FLEXIBLE",
          features: ["Eyewear", "Sunglasses"],
          note: "使用這個已儲存位置。",
        }),
        place({
          id: "haus-nowhere",
          sequence: 4,
          category: "PHOTO",
          nameZh: "HAUS NOWHERE SEOUL",
          nameKo: "하우스 노웨어 서울",
          addressKo: "서울 성동구 뚝섬로 433",
          nearestStation: "성수역",
          exit: "3",
          openingHours: { open: "11:00", close: "21:00" },
          timePriority: "FLEXIBLE",
          photoPriority: true,
          features: ["Experimental retail", "Art installations", "Giant dog installation", "Robot installation", "IICOMBINED"],
        }),
        place({
          id: "sea-life-coex",
          sequence: 5,
          category: "ATTRACTION",
          nameZh: "SEA LIFE COEX 水族館",
          nameKo: "씨라이프 코엑스",
          nameEn: "SEA LIFE COEX",
          addressKo: "서울 강남구 영동대로 513",
          nearestStation: "봉은사역 / 삼성역",
          startTime: "16:30",
          endTime: "18:30",
          openingHours: { open: "10:00", close: "20:00", lastAdmission: "19:00" },
          ticket: ticket(true, { advanceRecommended: true, provider: "KLOOK", bookingUrl: null }),
          timePriority: "HARD",
          mustVisit: true,
          features: ["Recommended duration 90-120 minutes"],
          warning: ["不可重複入場。"],
        }),
        place({
          id: "coex-library",
          sequence: 6,
          category: "PHOTO",
          nameZh: "COEX 星空圖書館",
          nameKo: "별마당 도서관",
          nameEn: "Starfield Library COEX",
          addressKo: "서울 강남구 영동대로 513 스타필드 코엑스몰 B1",
          navigationKeyword: "별마당 도서관",
          startTime: "18:30",
          endTime: "20:00",
          openingHours: { open: "10:30", close: "22:00" },
          ticket: ticket(false, { priceKRW: 0, note: "FREE" }),
          timePriority: "HARD",
          mustVisit: true,
          photoPriority: true,
          features: ["Large bookshelves", "Atrium", "Architecture"],
          warning: ["必須與 SEA LIFE COEX 維持同一天。"],
        }),
        place({
          id: "cheonggyecheon",
          sequence: 7,
          category: "PHOTO",
          nameZh: "清溪川夜景",
          nameKo: "청계천",
          nameEn: "Cheonggyecheon Stream",
          area: "Jongno / Euljiro",
          navigationKeyword: "청계광장",
          nearestStation: "을지로입구역",
          subwayLines: ["Line 2"],
          startTime: "21:00",
          endTime: "22:00",
          timePriority: "FLEXIBLE",
          photoPriority: true,
          features: ["Night cityscape", "Stream", "Bridges", "City lights", "Water reflection"],
          note: "拍攝後由 을지로입구역搭 Line 2 返回 홍대입구역。",
          warning: ["使用清溪廣場、廣橋、乙支路一帶的中央清溪川，不可替換成東大門段。"],
        }),
      ],
    },
    {
      id: "day-5",
      date: "2026-10-15",
      weekday: "Thu",
      title: "水原 → 弘大 → 金浦機場",
      routeSummary: ["退房", "水原 Starfield 星空圖書館", "返回弘大", "伴手禮與最後採買", "取行李", "金浦機場"],
      notes: ["水原最晚 12:00 離開。", "最晚 17:30 離開弘大。", "20:35 由金浦 GMP 起飛。"],
      places: [
        place({
          id: "day5-checkout",
          sequence: 1,
          category: "HOTEL",
          nameZh: "Kotaro House 退房",
          nameKo: "코타로하우스",
          addressKo: "서울 마포구 와우산로 162-8",
          startTime: "07:30",
          endTime: "08:00",
          timePriority: "RECOMMENDED",
          note: "退房後將行李寄放在住宿。",
        }),
        place({
          id: "starfield-suwon",
          sequence: 2,
          category: "PHOTO",
          nameZh: "水原 Starfield 星空圖書館",
          nameKo: "별마당 도서관 스타필드 수원점",
          nameEn: "Starfield Library Suwon",
          addressKo: "경기도 수원시 장안구 수성로 175",
          nearestStation: "화서역",
          subwayLines: ["Line 1"],
          startTime: "10:00",
          endTime: "11:30",
          openingHours: { open: "10:00", close: "22:00" },
          ticket: ticket(false, { priceKRW: 0, note: "FREE" }),
          timePriority: "HARD",
          hardDeadline: "12:00",
          mustVisit: true,
          photoPriority: true,
          features: ["22m library", "4F-7F vertical space", "Giant bookshelves", "Escalators", "Architecture"],
          mustDo: ["Central escalator", "Giant bookshelves", "Upper-floor overview", "Human scale photography"],
          warning: ["最晚 12:00 必須離開。", "不要加入水原華城、華城行宮或其他水原景點。"],
        }),
        place({
          id: "return-hongdae",
          sequence: 3,
          category: "HOTEL",
          nameZh: "返回弘大",
          nameKo: "홍대입구역",
          addressKo: "서울 마포구 와우산로 162-8",
          timePriority: "RECOMMENDED",
          note: "目標 13:30-14:00 抵達，只安排午餐、最後購物、伴手禮、咖啡與打包，不再觀光。",
        }),
        place({
          id: "day5-souvenirs",
          sequence: 4,
          category: "SHOPPING",
          nameZh: "伴手禮與最後採買",
          nameKo: "홍대 쇼핑",
          area: "Hongdae",
          timePriority: "FLEXIBLE",
          mustBuy: true,
          mustBuyItems: ["ORION BICHOBI 비쵸비（獨立包裝）", "Samlip Mini Yakgwa 삼립 미니꿀약과", "Market O REAL BROWNIE 240g / 12 count（獨立包裝）"],
          note: "約 20 位同事的辦公室伴手禮。",
        }),
        place({
          id: "day5-luggage",
          sequence: 5,
          category: "HOTEL",
          nameZh: "返回 Kotaro House 取行李",
          nameKo: "코타로하우스",
          addressKo: "서울 마포구 와우산로 162-8",
          startTime: "16:30",
          timePriority: "HARD",
          note: "領取寄放行李，準備前往金浦機場。",
        }),
        place({
          id: "gimpo-departure",
          sequence: 6,
          category: "AIRPORT",
          nameZh: "出發前往金浦國際機場",
          nameKo: "김포국제공항",
          nameEn: "Gimpo International Airport",
          addressKo: "김포국제공항",
          startTime: "17:00",
          endTime: "18:00",
          timePriority: "HARD",
          hardDeadline: "17:30",
          note: "搭乘 AREX：홍대입구역 → 김포공항역；20:35 起飛。",
          mustDo: ["Check-in", "Baggage Drop", "Tax Refund", "Security", "Immigration"],
          transportFromPrevious: { method: ["AREX"], station: "홍대입구역 → 김포공항역" },
          warning: ["目標 18:00 抵達機場。", "本次機場只使用 GMP，絕不可替換為 ICN。"],
        }),
      ],
    },
  ],
};

export const removedItineraryIds = [
  "photo-1",
  "photo-4-lotte-world-tower-east-road",
  "photo-5-techno-mart-9f",
  "photo-7-noksapyeong-bridge",
  "photo-14-banpo-rainbow-fountain",
  "photo-16-deoksugung-stone-wall-road",
  "photo-19-seoul-city-hall-observatory",
  "photo-20-nami-island-petite-france",
  "somunnan-seongsu-gamjatang",
  "dalimak",
  "kyejalam",
] as const;

export const requiresRecheckPlaces = seoul2026Trip.days.flatMap((day) =>
  day.places.filter((item) => item.requiresRecheck),
);

export function formatSeoulDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: seoul2026Trip.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatSeoulTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: seoul2026Trip.timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function getDashboardDay(date = new Date()) {
  const dateKey = formatSeoulDate(date);
  return (
    seoul2026Trip.days.find((day) => day.date === dateKey) ??
    (dateKey < seoul2026Trip.startDate
      ? seoul2026Trip.days[0]
      : seoul2026Trip.days[seoul2026Trip.days.length - 1])
  );
}

export function getNextPlace(day: TripDay, currentTime: string) {
  return (
    day.places.find((item) => item.startTime && item.startTime >= currentTime) ??
    day.places.find((item) => !item.startTime) ??
    day.places[day.places.length - 1]
  );
}

export function getNextHardPlace(day: TripDay, currentTime: string) {
  return day.places.find(
    (item) =>
      item.timePriority === "HARD" &&
      (item.hardDeadline ?? item.startTime) &&
      (item.hardDeadline ?? item.startTime ?? "") >= currentTime,
  );
}

function minutes(value: string) {
  const [hours, mins] = value.split(":").map(Number);
  return hours * 60 + mins;
}

export function getScheduleStatus(
  nextHard: Place | undefined,
  currentTime: string,
  estimatedMinutes = 30,
): ScheduleStatus {
  const targetTime = nextHard?.hardDeadline ?? nextHard?.startTime;
  if (!targetTime) return "ON_TIME";
  const remaining = minutes(targetTime) - minutes(currentTime);
  if (remaining < estimatedMinutes) return "LATE";
  if (remaining <= estimatedMinutes + 30) return "AT_RISK";
  if (remaining > 90) return "EARLY";
  return "ON_TIME";
}

export function validateSeoul2026Trip() {
  const places = seoul2026Trip.days.flatMap((day) => day.places);
  const seen = new Set<string>();
  const duplicateIds: string[] = [];
  const hardWithoutTime: string[] = [];

  for (const item of places) {
    if (seen.has(item.id)) duplicateIds.push(item.id);
    seen.add(item.id);
    if (item.timePriority === "HARD" && !item.startTime && !item.hardDeadline) {
      hardWithoutTime.push(item.id);
    }
  }

  return {
    placeCount: places.length,
    duplicateIds,
    hardWithoutTime,
    valid: duplicateIds.length === 0 && hardWithoutTime.length === 0,
  };
}
