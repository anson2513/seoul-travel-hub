export type PhotoSpotStatus = "all" | "pending" | "completed";

export type PhotoSpot = {
  id: string;
  title: string;
  area: string;
  address: string;
  naverQuery: string;
  dayDate: string;
  dayLabel: string;
  bestStart: string;
  bestEnd: string;
  lightType: string;
  advice: string;
  note: string;
  image?: string;
  completed: boolean;
  createdAt: string;
};

export type PhotoMapState = {
  spots: PhotoSpot[];
};

export const photoMapStorageKey = "seoul-travel-hub-photo-map-v1";

export const photoTripDays = [
  { id: "2026-10-10", label: "DAY 1", date: "10.10" },
  { id: "2026-10-11", label: "DAY 2", date: "10.11" },
  { id: "2026-10-12", label: "DAY 3", date: "10.12" },
  { id: "2026-10-13", label: "DAY 4", date: "10.13" },
  { id: "2026-10-14", label: "DAY 5", date: "10.14" },
  { id: "2026-10-15", label: "DAY 6", date: "10.15" },
];

export const defaultPhotoSpots: PhotoSpot[] = [
  {
    id: "photo-gyeongbokgung",
    title: "景福宮",
    area: "鐘路區",
    address: "서울 종로구 사직로 161 경복궁",
    naverQuery: "경복궁",
    dayDate: "2026-10-11",
    dayLabel: "DAY 2",
    bestStart: "09:30",
    bestEnd: "11:30",
    lightType: "上午柔光",
    advice: "建議開門後不久抵達，避開人潮並保留韓服拍攝時間。",
    note: "光化門、勤政殿、宮牆線條都適合拍。",
    image:
      "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?q=80&w=900&auto=format&fit=crop",
    completed: false,
    createdAt: "2026-10-11T01:00:00.000Z",
  },
  {
    id: "photo-bukchon",
    title: "北村韓屋村",
    area: "鐘路區",
    address: "서울 종로구 계동길 37",
    naverQuery: "북촌한옥마을",
    dayDate: "2026-10-11",
    dayLabel: "DAY 2",
    bestStart: "14:00",
    bestEnd: "16:00",
    lightType: "午後側光",
    advice: "坡道與屋簷線條很好看，拍攝時注意音量與居民生活。",
    note: "穿韓服或淺色衣服會更適合韓屋街景。",
    image:
      "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=900&auto=format&fit=crop",
    completed: false,
    createdAt: "2026-10-11T02:00:00.000Z",
  },
  {
    id: "photo-ikseondong",
    title: "益善洞",
    area: "鐘路區",
    address: "서울 종로구 익선동",
    naverQuery: "익선동",
    dayDate: "2026-10-11",
    dayLabel: "DAY 2",
    bestStart: "16:30",
    bestEnd: "18:20",
    lightType: "夕陽到藍調",
    advice: "10 月中旬首爾約 18:00 日落，建議 16:30 後開始走巷弄。",
    note: "韓屋巷弄、店面燈光、窗景都適合拍。",
    image:
      "https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=900&auto=format&fit=crop",
    completed: false,
    createdAt: "2026-10-11T03:00:00.000Z",
  },
  {
    id: "photo-ddp",
    title: "DDP 東大門設計廣場",
    area: "中區",
    address: "서울 중구 을지로 281",
    naverQuery: "동대문디자인플라자",
    dayDate: "2026-10-12",
    dayLabel: "DAY 3",
    bestStart: "10:00",
    bestEnd: "12:00",
    lightType: "白天建築線條",
    advice: "上午光線比較乾淨，適合拍曲面建築與未來感構圖。",
    note: "可多拍廣角與人物比例照。",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=900&auto=format&fit=crop",
    completed: false,
    createdAt: "2026-10-12T01:00:00.000Z",
  },
  {
    id: "photo-ihwa",
    title: "梨花洞壁畫村",
    area: "鐘路區",
    address: "서울 종로구 이화동",
    naverQuery: "이화벽화마을",
    dayDate: "2026-10-12",
    dayLabel: "DAY 3",
    bestStart: "15:00",
    bestEnd: "16:30",
    lightType: "午後街景",
    advice: "坡道多，下午拍攝不要排太趕，保留移動與休息時間。",
    note: "壁畫、階梯、街角店面都可列入取景。",
    image:
      "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=900&auto=format&fit=crop",
    completed: false,
    createdAt: "2026-10-12T02:00:00.000Z",
  },
  {
    id: "photo-naksan",
    title: "駱山公園",
    area: "鐘路區",
    address: "서울 종로구 낙산길 41",
    naverQuery: "낙산공원",
    dayDate: "2026-10-12",
    dayLabel: "DAY 3",
    bestStart: "16:45",
    bestEnd: "18:30",
    lightType: "日落藍調",
    advice: "建議 16:45 前抵達城牆段，10 月日落很快，別拖到 18:00 後才開始。",
    note: "城牆、城市天際線、藍調時刻是重點。",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop",
    completed: false,
    createdAt: "2026-10-12T03:00:00.000Z",
  },
  {
    id: "photo-seongsu",
    title: "聖水洞",
    area: "城東區",
    address: "서울 성동구 성수동",
    naverQuery: "성수동",
    dayDate: "2026-10-13",
    dayLabel: "DAY 4",
    bestStart: "10:30",
    bestEnd: "14:30",
    lightType: "白天街拍",
    advice: "店面、工業風街景、咖啡廳外觀適合白天拍攝。",
    note: "先標記 Cafe Onion 與想逛的品牌店。",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=900&auto=format&fit=crop",
    completed: false,
    createdAt: "2026-10-13T01:00:00.000Z",
  },
  {
    id: "photo-hannam",
    title: "漢南洞",
    area: "龍山區",
    address: "서울 용산구 한남동",
    naverQuery: "한남동",
    dayDate: "2026-10-13",
    dayLabel: "DAY 4",
    bestStart: "15:00",
    bestEnd: "17:20",
    lightType: "午後生活感",
    advice: "10 月傍晚較早變暗，精品街區與咖啡廳建議 17:20 前拍完主畫面。",
    note: "適合拍生活感、穿搭與街角店面。",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=900&auto=format&fit=crop",
    completed: false,
    createdAt: "2026-10-13T02:00:00.000Z",
  },
  {
    id: "photo-hongdae",
    title: "弘大商圈",
    area: "麻浦區",
    address: "서울 마포구 홍대입구",
    naverQuery: "홍대입구",
    dayDate: "2026-10-13",
    dayLabel: "DAY 4",
    bestStart: "18:00",
    bestEnd: "21:30",
    lightType: "夜間街景",
    advice: "夜晚招牌與街頭藝人氛圍較強，注意人潮中的隨身物。",
    note: "適合拍霓虹、街頭表演與潮流商店。",
    image:
      "https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=900&auto=format&fit=crop",
    completed: false,
    createdAt: "2026-10-13T03:00:00.000Z",
  },
  {
    id: "photo-starfield",
    title: "星空圖書館",
    area: "江南區",
    address: "서울 강남구 영동대로 513 스타필드 코엑스몰",
    naverQuery: "스타필드 코엑스몰 별마당도서관",
    dayDate: "2026-10-14",
    dayLabel: "DAY 5",
    bestStart: "10:00",
    bestEnd: "12:00",
    lightType: "室內明亮",
    advice: "上午人潮相對可控，適合拍巨型書牆與人物比例。",
    note: "室內點不受日落影響，但建議避開中午人潮。",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=900&auto=format&fit=crop",
    completed: false,
    createdAt: "2026-10-14T01:00:00.000Z",
  },
  {
    id: "photo-seokchon",
    title: "石村湖",
    area: "松坡區",
    address: "서울 송파구 석촌호수",
    naverQuery: "석촌호수",
    dayDate: "2026-10-14",
    dayLabel: "DAY 5",
    bestStart: "14:30",
    bestEnd: "16:30",
    lightType: "午後湖景",
    advice: "湖面倒影與樂天塔同框建議下午拍，避免太晚變成純夜景。",
    note: "散步時留意湖邊構圖與塔身倒影。",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop",
    completed: false,
    createdAt: "2026-10-14T02:00:00.000Z",
  },
  {
    id: "photo-lotte-tower",
    title: "樂天世界塔",
    area: "松坡區",
    address: "서울 송파구 올림픽로 300",
    naverQuery: "롯데월드타워",
    dayDate: "2026-10-14",
    dayLabel: "DAY 5",
    bestStart: "15:30",
    bestEnd: "17:20",
    lightType: "天際線",
    advice: "日落前拍建築細節與天際線，17:30 後就會逐漸進入藍調。",
    note: "可與石村湖一起安排。",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=900&auto=format&fit=crop",
    completed: false,
    createdAt: "2026-10-14T03:00:00.000Z",
  },
  {
    id: "photo-nseoul",
    title: "N首爾塔",
    area: "龍山區",
    address: "서울 용산구 남산공원길 105",
    naverQuery: "N서울타워",
    dayDate: "2026-10-14",
    dayLabel: "DAY 5",
    bestStart: "16:45",
    bestEnd: "18:40",
    lightType: "夕陽到夜景",
    advice: "10 月中旬約 18:00 日落，建議 16:45 前抵達並先找好取景位置。",
    note: "夕陽、藍調時刻、首爾夜景都可以一次完成。",
    image:
      "https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=900&auto=format&fit=crop",
    completed: false,
    createdAt: "2026-10-14T04:00:00.000Z",
  },
  {
    id: "photo-yeouido",
    title: "汝矣島漢江公園",
    area: "永登浦區",
    address: "서울 영등포구 여의동로 330",
    naverQuery: "여의도한강공원",
    dayDate: "2026-10-15",
    dayLabel: "DAY 6",
    bestStart: "09:30",
    bestEnd: "11:30",
    lightType: "上午河岸",
    advice: "最後一天建議拍輕鬆河岸照，不要壓縮回飯店取行李時間。",
    note: "漢江、城市天際線、散步照是重點。",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop",
    completed: false,
    createdAt: "2026-10-15T01:00:00.000Z",
  },
  {
    id: "photo-myeongdong",
    title: "明洞",
    area: "中區",
    address: "서울 중구 명동",
    naverQuery: "명동",
    dayDate: "2026-10-15",
    dayLabel: "DAY 6",
    bestStart: "12:30",
    bestEnd: "15:30",
    lightType: "白天街景",
    advice: "以補貨與伴手禮為主，拍照可抓店面、街道與小吃。",
    note: "最後購物日，拍照不要拖到回飯店取行李時間。",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=900&auto=format&fit=crop",
    completed: false,
    createdAt: "2026-10-15T02:00:00.000Z",
  },
];

export const defaultPhotoMapState: PhotoMapState = {
  spots: defaultPhotoSpots,
};
