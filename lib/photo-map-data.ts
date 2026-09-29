import { type Place, seoul2026Trip } from "@/lib/seoul-2026-master";

export type PhotoSpotStatus = "all" | "pending" | "completed";

export type PhotoSpot = {
  id: string;
  sourcePlaceId?: string;
  isCustom?: boolean;
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
  schemaVersion?: 2;
  spots: PhotoSpot[];
};

export const photoMapStorageKey =
  "seoul-travel-hub-photo-map-v2-final-master";
export const legacyPhotoMapStorageKey = "seoul-travel-hub-photo-map-v1";

export const photoTripDays = seoul2026Trip.days.map((day) => ({
  id: day.date,
  label: day.id.replace("day-", "DAY ").toUpperCase(),
  date: day.date.slice(5).replace("-", "."),
}));

const legacySeedIds = new Set([
  "photo-gyeongbokgung",
  "photo-bukchon",
  "photo-ikseondong",
  "photo-ddp",
  "photo-ihwa",
  "photo-naksan",
  "photo-seongsu",
  "photo-hannam",
  "photo-hongdae",
  "photo-starfield",
  "photo-seokchon",
  "photo-lotte-tower",
  "photo-nseoul",
  "photo-yeouido",
  "photo-myeongdong",
]);

const photoWindowOverrides: Record<string, [string, string]> = {
  ddp: ["18:00", "19:30"],
  "haus-nowhere": ["13:00", "15:00"],
};

const photoPresentation: Record<
  string,
  { lightType: string; advice: string }
> = {
  "haneul-park": {
    lightType: "秋日草原 / 城市天際線",
    advice: "利用芒草、步道與首爾天際線安排前後景，14:30 前離開前往下一站。",
  },
  "63-skypicnic": {
    lightType: "日景 / 夕陽 / 藍調 / 夜景",
    advice: "依序拍攝漢江日景、黃金時刻、日落、藍調與首爾夜景。",
  },
  gyeongbokgung: {
    lightType: "上午柔光",
    advice: "以宮殿中軸、勤政殿與傳統建築為主，早到可避開主要人潮。",
  },
  songhyeon: {
    lightType: "上午街拍",
    advice: "沿石牆與街道取景，利用秋日樹色和行人比例增加畫面層次。",
  },
  bukchon: {
    lightType: "午後街景",
    advice: "以韓屋屋簷、坡道與巷弄縱深構圖，拍攝時留意居民生活。",
  },
  ddp: {
    lightType: "建築 / 夜景",
    advice: "利用曲面建築與燈光拍攝廣角構圖，藍調後更能呈現未來感。",
  },
  "myeongdong-cartoon-street": {
    lightType: "上午街拍",
    advice: "尋找漫畫建築、巷弄線條與首爾塔同框的位置。",
  },
  "national-museum": {
    lightType: "午後建築光線",
    advice: "以開放廣場、建築框景與遠方首爾塔為主要拍攝重點。",
  },
  "baekbeom-square": {
    lightType: "午後 / 黃金時刻",
    advice: "利用漢陽城牆、草地與首爾塔安排層次，為下一站日落拍攝暖身。",
  },
  "n-seoul-tower": {
    lightType: "夕陽 / 藍調 / 夜景",
    advice: "依序保留日景、黃金時刻、日落、藍調與夜景，不要只拍單一時段。",
  },
  "haus-nowhere": {
    lightType: "室內建築 / 裝置藝術",
    advice: "以空間尺度、藝術裝置與人物互動構圖，留意室內拍攝規範。",
  },
  "sea-life-coex": {
    lightType: "室內低光",
    advice: "靠近玻璃並關閉閃光燈，等待魚群進入乾淨背景再拍攝。",
  },
  "coex-library": {
    lightType: "室內建築 / 夜間",
    advice: "由中央區域與高樓層分別拍攝巨型書牆、手扶梯和空間尺度。",
  },
  cheonggyecheon: {
    lightType: "夜景 / 水面倒影",
    advice: "以橋樑、城市燈光與水面倒影構圖，優先使用清溪廣場至乙支路一帶。",
  },
  "starfield-suwon": {
    lightType: "上午室內建築",
    advice: "拍攝中央手扶梯、巨型書牆、樓層俯視與人物比例，12:00 前離開。",
  },
};

function addMinutes(time: string, minutes: number) {
  const [hour, minute] = time.split(":").map(Number);
  const total = hour * 60 + minute + minutes;
  const nextHour = Math.floor(total / 60) % 24;
  const nextMinute = total % 60;

  return `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`;
}

function getPhotoWindow(place: Place): [string, string] {
  const override = photoWindowOverrides[place.id];
  if (override) return override;

  const start = place.startTime ?? place.openingHours?.open ?? "10:00";
  return [start, place.endTime ?? addMinutes(start, 90)];
}

function getArea(place: Place) {
  if (place.area) return place.area;

  const address = place.addressKo ?? "";
  if (address.includes("마포구")) return "麻浦區";
  if (address.includes("영등포구")) return "永登浦區";
  if (address.includes("종로구")) return "鐘路區";
  if (address.includes("중구")) return "中區";
  if (address.includes("용산구")) return "龍山區";
  if (address.includes("성동구")) return "城東區";
  if (address.includes("강남구")) return "江南區";
  if (address.includes("수원시")) return "水原市";

  return place.nearestStation ?? "首爾";
}

function getNote(place: Place) {
  const notes = [place.note, ...(place.warning ?? [])].filter(Boolean);
  return notes.join(" ") || "依現場人潮、天氣與開放狀態調整拍攝順序。";
}

function toPhotoSpot(
  day: (typeof seoul2026Trip.days)[number],
  place: Place,
): PhotoSpot {
  const [bestStart, bestEnd] = getPhotoWindow(place);
  const presentation = photoPresentation[place.id] ?? {
    lightType: "行程時段",
    advice: "依 Final Master Data 的行程時段前往，現場再依光線與人潮調整構圖。",
  };

  return {
    id: `photo-${place.id}`,
    sourcePlaceId: place.id,
    isCustom: false,
    title: place.nameZh,
    area: getArea(place),
    address: place.addressKo ?? place.navigationKeyword ?? place.nameKo ?? "",
    naverQuery:
      place.navigationKeyword ?? place.nameKo ?? place.addressKo ?? place.nameZh,
    dayDate: day.date,
    dayLabel: day.id.replace("day-", "DAY ").toUpperCase(),
    bestStart,
    bestEnd,
    lightType: presentation.lightType,
    advice: presentation.advice,
    note: getNote(place),
    image: place.imageUrl ?? undefined,
    completed: place.completed ?? false,
    createdAt: `${day.date}T00:${String(place.sequence).padStart(2, "0")}:00.000Z`,
  };
}

export const defaultPhotoSpots: PhotoSpot[] = seoul2026Trip.days.flatMap(
  (day) =>
    day.places
      .filter(
        (place) => place.category === "PHOTO" || place.category === "ATTRACTION",
      )
      .map((place) => toPhotoSpot(day, place)),
);

export const defaultPhotoMapState: PhotoMapState = {
  schemaVersion: 2,
  spots: defaultPhotoSpots,
};

function isLegacyCustomSpot(spot: PhotoSpot) {
  return (
    spot.isCustom === true ||
    /^photo-\d{10,}$/.test(spot.id) ||
    (!legacySeedIds.has(spot.id) && !spot.sourcePlaceId)
  );
}

function findLegacyMatch(seed: PhotoSpot, storedSpots: PhotoSpot[]) {
  const aliases: Record<string, string[]> = {
    "photo-coex-library": ["photo-starfield"],
    "photo-n-seoul-tower": ["photo-nseoul"],
  };
  const validIds = new Set([seed.id, ...(aliases[seed.id] ?? [])]);

  return storedSpots.find(
    (spot) => validIds.has(spot.id) || spot.title === seed.title,
  );
}

export function migrateLegacyPhotoMapState(
  legacyState?: PhotoMapState | null,
): PhotoMapState {
  const storedSpots = Array.isArray(legacyState?.spots)
    ? legacyState.spots
    : [];
  const migratedSeeds = defaultPhotoSpots.map((seed) => {
    const stored = findLegacyMatch(seed, storedSpots);
    if (!stored) return seed;

    return {
      ...seed,
      image: stored.image ?? seed.image,
      completed: Boolean(stored.completed),
    };
  });
  const customSpots = storedSpots
    .filter(isLegacyCustomSpot)
    .map((spot) => ({ ...spot, isCustom: true, sourcePlaceId: undefined }));

  return {
    schemaVersion: 2,
    spots: [...migratedSeeds, ...customSpots],
  };
}
