import {
  Plane,
  CloudSun,
  BadgeDollarSign,
} from "lucide-react";

export default function TravelInfoCard() {
  return (
    <section
      className="
      bg-white
      rounded-[32px]
      shadow-sm
      border
      border-neutral-100
      overflow-hidden
      "
    >
      {/* Flight Section */}
      <div className="p-6">

        <div className="flex items-center gap-2 text-neutral-500">
          <Plane size={16} />
          <span className="text-sm font-medium">
            航班資訊
          </span>
        </div>

        <div className="mt-5">

          <p className="text-xs text-neutral-400">
            Tigerair Taiwan
          </p>

          <p className="mt-1 text-sm font-medium text-neutral-500">
            IT662
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-2xl font-bold">
              KHH
            </span>

            <span className="text-neutral-400">
              →
            </span>

            <span className="text-2xl font-bold">
              GMP
            </span>
          </div>

          <p className="mt-2 text-sm text-neutral-500">
            高雄國際機場 → 金浦國際機場
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between">

          <div>
            <p className="text-xs text-neutral-400">
              起飛
            </p>

            <p className="text-3xl font-bold">
              15:55
            </p>
          </div>

          <div className="text-neutral-300 text-2xl">
            →
          </div>

          <div className="text-right">
            <p className="text-xs text-neutral-400">
              抵達
            </p>

            <p className="text-3xl font-bold">
              19:45
            </p>
          </div>

        </div>

        <div className="mt-4 text-sm text-neutral-500">
          2026.10.10（六）
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-neutral-100" />

      {/* Weather + Exchange */}
      <div className="grid grid-cols-2">

        {/* Weather */}
        <div className="p-5 border-r border-neutral-100">

          <div className="flex items-center gap-2 text-neutral-500">
            <CloudSun size={16} />
            <span className="text-sm font-medium">
              首爾天氣
            </span>
          </div>

          <div className="mt-4 text-center">

            <div className="text-4xl">
              ⛅
            </div>

            <p className="mt-2 text-3xl font-bold">
              23°
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              多雲
            </p>

            <p className="mt-2 text-xs text-neutral-400">
              體感 25°
            </p>

          </div>

        </div>

        {/* Exchange */}
        <div className="p-5">

          <div className="flex items-center gap-2 text-neutral-500">
            <BadgeDollarSign size={16} />
            <span className="text-sm font-medium">
              即時匯率
            </span>
          </div>

          <div className="mt-4 text-center">

            <p className="text-lg font-semibold">
              1 KRW
            </p>

            <p className="my-2 text-neutral-400">
              =
            </p>

            <p className="text-3xl font-bold">
              0.024
            </p>

            <p className="text-sm text-neutral-500">
              TWD
            </p>

            <p className="mt-2 text-xs text-neutral-400">
              更新時間 09:41
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}