export default function FlightCard() {
  return (
    <div
      className="
      bg-white
      rounded-[28px]
      p-4
      shadow-sm
      min-h-[170px]
      "
    >
      <p className="text-[11px] text-gray-400">
        ✈ 航班資訊
      </p>

      <div className="mt-3">
        <p className="font-semibold text-[15px]">
          高雄 KHH
        </p>

        <p className="text-gray-400 text-sm">
          →
        </p>

        <p className="font-semibold text-[15px]">
          首爾 ICN
        </p>
      </div>

      <p className="mt-2 text-xs text-gray-400">
        TW668
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div>
          <p className="text-[11px] text-gray-400">
            出發
          </p>

          <p className="text-xl font-bold">
            08:35
          </p>
        </div>

        <div>
          <p className="text-[11px] text-gray-400">
            抵達
          </p>

          <p className="text-xl font-bold">
            12:05
          </p>
        </div>
      </div>
    </div>
  );
}