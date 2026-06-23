export default function WeatherCard() {
  return (
    <div
      className="
      bg-white
      rounded-[28px]
      p-4
      shadow-sm
      min-h-[170px]
      text-center
      "
    >
      <p className="text-[11px] text-gray-400">
        ☁ 首爾天氣
      </p>

      <div className="mt-3 text-4xl">
        ⛅
      </div>

      <p className="mt-3 text-3xl font-bold">
        23℃
      </p>

      <p className="text-sm text-gray-500">
        多雲
      </p>

      <p className="mt-3 text-xs text-gray-400">
        體感 25℃
      </p>

      <p className="text-xs text-gray-400">
        降雨機率 20%
      </p>
    </div>
  );
}