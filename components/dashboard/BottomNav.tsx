"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Camera, FileText, Home } from "lucide-react";

const navItems = [
  { label: "首頁", href: "/", icon: Home },
  { label: "行程", href: "/itinerary", icon: CalendarDays },
  { label: "記帳", href: "/accounting", icon: FileText },
  { label: "Photo Map", href: "/photo-map", icon: Camera },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-[430px] px-4 pb-3">
        <div className="flex h-24 items-center justify-around rounded-[30px] border border-neutral-200/80 bg-white/95 shadow-[0_-10px_35px_rgba(39,31,27,0.08)] backdrop-blur-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                className="flex min-h-16 min-w-16 flex-col items-center justify-center gap-1 rounded-2xl"
                href={item.href}
              >
                <Icon
                  size={27}
                  strokeWidth={isActive ? 2.35 : 1.9}
                  className={isActive ? "text-neutral-950" : "text-neutral-400"}
                />
                <span
                  className={`text-sm font-semibold ${
                    isActive ? "text-neutral-950" : "text-neutral-500"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
