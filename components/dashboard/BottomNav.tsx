import { CalendarDays, Camera, FileText, Home } from "lucide-react";

const navItems = [
  { label: "首頁", icon: Home, active: true },
  { label: "行程", icon: CalendarDays, active: false },
  { label: "記帳", icon: FileText, active: false },
  { label: "Photo Map", icon: Camera, active: false },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-[430px] px-4 pb-3">
        <div className="flex h-24 items-center justify-around rounded-[30px] border border-neutral-200/80 bg-white/95 shadow-[0_-10px_35px_rgba(39,31,27,0.08)] backdrop-blur-xl">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className="flex min-h-16 min-w-16 flex-col items-center justify-center gap-1 rounded-2xl"
                type="button"
              >
                <Icon
                  size={27}
                  strokeWidth={item.active ? 2.35 : 1.9}
                  className={item.active ? "text-neutral-950" : "text-neutral-400"}
                />
                <span
                  className={`text-sm font-semibold ${
                    item.active ? "text-neutral-950" : "text-neutral-500"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
