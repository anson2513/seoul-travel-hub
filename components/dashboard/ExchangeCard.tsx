export default function ExchangeCard() {
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
        ₩ 匯率（即時）
      </p>

      <div className="mt-5 text-center">
        <p className="text-lg font-bold">
          1 KRW
        </p>

        <p className="my-2 text-gray-400">
          =
        </p>

        <p className="text-4xl font-bold">
          0.024
        </p>

        <p className="text-sm text-gray-400">
          TWD
        </p>

        <p className="mt-3 text-[10px] text-gray-400">
          更新時間 09:41
        </p>
      </div>
    </div>
  );
}