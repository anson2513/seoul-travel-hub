export default function EmergencyCard() {
  return (
    <div
      className="
      bg-white
      rounded-[32px]
      p-6
      shadow-sm
      "
    >
      <div className="flex items-center gap-3">
        <h2 className="font-bold text-lg">
          緊急聯絡
        </h2>

        <span className="text-gray-400">
          Emergency
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">

        <div className="text-center">
          <div
            className="
            inline-flex
            items-center
            justify-center
            h-10
            px-4
            rounded-full
            bg-red-50
            text-red-500
            font-bold
            "
          >
            119
          </div>

          <p className="mt-3 text-sm">
            緊急電話
          </p>
        </div>

        <div className="text-center">
          <div
            className="
            inline-flex
            items-center
            justify-center
            h-10
            px-4
            rounded-full
            bg-blue-50
            text-blue-600
            font-bold
            "
          >
            1330
          </div>

          <p className="mt-3 text-sm">
            旅遊服務
          </p>
        </div>

        <div className="text-center">
          <div className="text-2xl">
            ☎
          </div>

          <p className="mt-2 text-sm">
            駐韓代表處
          </p>

          <p className="text-xs text-gray-500">
            +82-2-738-1038
          </p>
        </div>

      </div>
    </div>
  );
}