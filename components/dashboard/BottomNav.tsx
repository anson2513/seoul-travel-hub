import {
  Home,
  CalendarDays,
  FileText,
  Camera,
} from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-[430px] mx-auto px-4 pb-3">

        <div
          className="
            bg-white/95
            backdrop-blur-xl
            rounded-[32px]
            shadow-[0_-8px_30px_rgba(0,0,0,0.08)]
            border
            border-gray-100
            h-20
            flex
            items-center
            justify-around
          "
        >

          <button className="flex flex-col items-center">
            <Home
              size={22}
              strokeWidth={2.2}
              className="text-black"
            />

            <span className="text-[11px] font-medium mt-1 text-black">
              首頁
            </span>
          </button>

          <button className="flex flex-col items-center">
            <CalendarDays
              size={22}
              strokeWidth={1.8}
              className="text-gray-400"
            />

            <span className="text-[11px] mt-1 text-gray-400">
              行程
            </span>
          </button>

          <button className="flex flex-col items-center">
            <FileText
              size={22}
              strokeWidth={1.8}
              className="text-gray-400"
            />

            <span className="text-[11px] mt-1 text-gray-400">
              記帳
            </span>
          </button>

          <button className="flex flex-col items-center">
            <Camera
              size={22}
              strokeWidth={1.8}
              className="text-gray-400"
            />

            <span className="text-[11px] mt-1 text-gray-400">
              Photo Map
            </span>
          </button>

        </div>

      </div>
    </nav>
  );
}