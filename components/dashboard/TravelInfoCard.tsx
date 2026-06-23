export default function TravelInfoCard() {
  return (
    <div
      className="
        bg-white
        rounded-[32px]
        shadow-sm
        overflow-hidden
        border border-gray-100
      "
    >
      <div className="grid grid-cols-[1.7fr_1fr_1fr]">

        {/* Flight */}

        <div className="p-5 border-r border-gray-100">

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              ✈︎ 航班資訊
            </span>
          </div>

          <div className="mt-5">
            <p className="text-[17px] font-semibold">
              高雄 KHH → 首爾 ICN
            </p>

            <p className="mt-3 text-sm text-gray-400">
              TW668
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">
                08:35
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Terminal 1
              </p>
            </div>

            <div className="text-gray-300 text-xl">
              →
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold">
                12:05
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Terminal 1
              </p>
            </div>
          </div>
        </div>

        {/* Weather */}

        <div className="p-5 border-r border-gray-100 text-center">

          <p className="text-xs text-gray-500">
            ☁︎ 首爾天氣
          </p>

          <div className="text-4xl mt-4">
            🌤️
          </div>

          <p className="text-4xl font-bold mt-3">
            23°
          </p>

          <p className="text-sm text-gray-500 mt-2">
            多雲
          </p>

          <p className="text-xs text-gray-400 mt-4">
            體感 25℃
          </p>

          <p className="text-xs text-gray-400">
            降雨機率 20%
          </p>

        </div>

        {/* Exchange */}

        <div className="p-5 text-center">

          <p className="text-xs text-gray-500">
            ₩ 匯率（即時）
          </p>

          <div className="mt-6">
            <p className="text-2xl font-semibold">
              1 KRW
            </p>

            <p className="my-3 text-gray-400">
              =
            </p>

            <p className="text-4xl font-bold">
              0.024
            </p>

            <p className="text-sm text-gray-500 mt-1">
              TWD
            </p>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            更新時間 09:41
          </p>

        </div>

      </div>
    </div>
  );
}