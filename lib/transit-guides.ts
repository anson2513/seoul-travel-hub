export type TransitGuide = {
  line: string;
  boardingStation: string;
  transfer: string;
  alightingStation: string;
  exit: string;
};

const subway = (
  line: string,
  boardingStation: string,
  transfer: string,
  alightingStation: string,
  exit: string,
): TransitGuide => ({
  line,
  boardingStation,
  transfer,
  alightingStation,
  exit,
});

const walk = (from: string, to: string, exit = "不適用"): TransitGuide =>
  subway("步行移動", from, "不需轉乘", to, exit);

const day0AirportRoute = subway(
  "AREX 機場鐵路一般列車（藍色）",
  "金浦機場站（김포공항역）",
  "不需轉乘，搭乘 3 站",
  "弘大入口站（홍대입구역）",
  "6 號出口",
);

const day1MangwonRoute = subway(
  "首爾地鐵 6 號線（橘色）",
  "弘大入口站（홍대입구역）",
  "不需轉乘",
  "望遠站（망원역）",
  "2 號出口",
);

const day1HaneulRoute = subway(
  "首爾地鐵 6 號線（橘色）",
  "望遠站（망원역）",
  "不需轉乘",
  "世界盃競技場站（월드컵경기장역）",
  "1 號出口",
);

const day1YeouidoRoute = subway(
  "6 號線 → 5 號線（紫色）",
  "世界盃競技場站（월드컵경기장역）",
  "公德站（공덕역）轉乘 5 號線",
  "汝矣渡口站（여의나루역）",
  "2 或 3 號出口",
);

const day1ApmRoute = subway(
  "首爾地鐵 5 號線（紫色）",
  "汝矣渡口站（여의나루역）",
  "不需轉乘",
  "東大門歷史文化公園站（동대문역사문화공원역）",
  "14 號出口",
);

const day1HongdaeRoute = subway(
  "首爾地鐵 2 號線（綠色）",
  "東大門歷史文化公園站（동대문역사문화공원역）",
  "不需轉乘",
  "弘大入口站（홍대입구역）",
  "8 號出口",
);

const day2GyeongbokgungRoute = subway(
  "2 號線（綠色）→ 3 號線（橘色）",
  "弘大入口站（홍대입구역）",
  "乙支路3街站（을지로3가역）轉乘 3 號線",
  "景福宮站（경복궁역）",
  "5 號出口",
);

const day2DongdaemunRoute = subway(
  "首爾地鐵 1 號線（深藍色）",
  "鐘路3街站（종로3가역）",
  "不需轉乘",
  "東大門站（동대문역）",
  "4 號出口",
);

const day3MyeongdongRoute = subway(
  "AREX 機場鐵路 → 4 號線（藍色）",
  "弘大入口站（홍대입구역）",
  "首爾站（서울역）轉乘 4 號線",
  "明洞站（명동역）",
  "3 號出口",
);

const day3MuseumRoute = subway(
  "首爾地鐵 4 號線（藍色）",
  "明洞站（명동역）",
  "不需轉乘",
  "二村站（이촌역）",
  "2 號出口（博物館通道）",
);

const day3HongdaeRoute = subway(
  "4 號線（藍色）→ AREX 機場鐵路",
  "會賢站（회현역）",
  "首爾站（서울역）轉乘 AREX",
  "弘大入口站（홍대입구역）",
  "9 號出口",
);

const day4SeongsuRoute = subway(
  "首爾地鐵 2 號線（綠色）",
  "弘大入口站（홍대입구역）",
  "不需轉乘，往聖水／蠶室方向",
  "聖水站（성수역）",
  "2 號出口",
);

const day4CoexRoute = subway(
  "2 號線（綠色）→ 9 號線（金色）",
  "聖水站（성수역）",
  "綜合運動場站（종합운동장역）轉乘 9 號線",
  "奉恩寺站（봉은사역）",
  "7 號出口",
);

const day4CheonggyeRoute = subway(
  "首爾地鐵 2 號線（綠色）",
  "三成站（삼성역）",
  "不需轉乘，往市廳／新村方向",
  "乙支路入口站（을지로입구역）",
  "2 號出口（清溪廣場方向）",
);

const day5SuwonRoute = subway(
  "首都圈地鐵 1 號線（深藍色）",
  "弘大入口站（홍대입구역）",
  "依 NAVER 當日路線轉乘至 1 號線，往水原／天安方向",
  "華西站（화서역）",
  "1 號出口",
);

const day5HongdaeRoute = subway(
  "首都圈地鐵 1 號線（深藍色）",
  "華西站（화서역）",
  "依 NAVER 當日路線轉乘，往首爾方向",
  "弘大入口站（홍대입구역）",
  "6 號出口",
);

const day5AirportRoute = subway(
  "AREX 機場鐵路一般列車（藍色）",
  "弘大入口站（홍대입구역）",
  "不需轉乘，搭乘 3 站",
  "金浦機場站（김포공항역）",
  "依「國際線／International」指標前往航廈",
);

export const transitGuideByPlaceId: Record<string, TransitGuide> = {
  "gimpo-arrival": day0AirportRoute,
  "kotaro-house": day0AirportRoute,
  "ready-young-hongdae": walk(
    "Kotaro House",
    "Ready Young 弘大藥局",
    "弘大入口站 9 號出口側",
  ),
  "hongdae-day0": walk("Ready Young 弘大藥局", "弘大商圈"),

  "day1-kotaro-to-mangwon": day1MangwonRoute,
  "mangwon-market": day1MangwonRoute,
  "day1-mangwon-to-haneul": day1HaneulRoute,
  "haneul-park": day1HaneulRoute,
  "day1-haneul-to-yeouido": day1YeouidoRoute,
  "yeouido-hangang-park": day1YeouidoRoute,
  "day1-yeouido-to-63": walk(
    "汝矣島漢江公園",
    "63 大樓／63 SkyPicnic",
  ),
  "63-skypicnic": walk("汝矣島漢江公園", "63 大樓／63 SkyPicnic"),
  "day1-63-to-apm": day1ApmRoute,
  "apm-day1": day1ApmRoute,
  "day1-apm-to-hongdae": day1HongdaeRoute,
  "hongdae-dinner-day1": day1HongdaeRoute,
  "return-kotaro-day1": walk("元堂馬鈴薯排骨湯 東橋店", "Kotaro House"),

  gyeongbokgung: day2GyeongbokgungRoute,
  songhyeon: walk("景福宮 5 號出口", "三清洞・松峴洞石牆街"),
  samcheong: walk("松峴洞石牆街", "三清洞"),
  "kodak-bukchon": walk("三清洞", "Kodak Bukchon Seoul House"),
  bukchon: walk("Kodak Bukchon Seoul House", "北村韓屋村"),
  cheongsudang: walk("北村韓屋村", "清水堂"),
  "dongdaemun-toy-street": day2DongdaemunRoute,
  ddp: walk("東大門文具玩具街", "東大門設計廣場"),
  "apm-day2": walk("東大門設計廣場", "apM Place"),
  mimiline: walk("apM Place", "MIMILINE"),

  "myeongdong-cartoon-street": day3MyeongdongRoute,
  "myeongdong-shopping": walk("明洞漫畫街", "明洞商圈"),
  nyunyu: walk("明洞商圈", "NYU NYU 明洞"),
  spao: walk("NYU NYU 明洞", "SPAO 明洞"),
  "sura-gejang": walk("SPAO 明洞", "水剌醬蟹"),
  "national-museum": day3MuseumRoute,
  "baekbeom-square": walk("韓國國立中央博物館", "南山白凡廣場"),
  "n-seoul-tower": walk("南山白凡廣場", "N首爾塔（上坡路段）"),
  mokgumung: day3HongdaeRoute,

  "jojo-seongsu": day4SeongsuRoute,
  "stand-oil": walk("JOJO 刀削麵 聖水店", "STAND OIL 聖水"),
  "blue-elephant": walk("STAND OIL 聖水", "BLUE ELEPHANT 聖水旗艦店"),
  "haus-nowhere": walk("BLUE ELEPHANT 聖水旗艦店", "HAUS NOWHERE SEOUL"),
  "sea-life-coex": day4CoexRoute,
  "coex-library": walk("SEA LIFE COEX 水族館", "COEX 星空圖書館"),
  cheonggyecheon: day4CheonggyeRoute,

  "day5-checkout": walk("Kotaro House", "弘大入口站"),
  "starfield-suwon": day5SuwonRoute,
  "return-hongdae": day5HongdaeRoute,
  "day5-souvenirs": walk("弘大入口站", "弘大商圈"),
  "day5-luggage": walk("弘大商圈", "Kotaro House"),
  "gimpo-departure": day5AirportRoute,
};
