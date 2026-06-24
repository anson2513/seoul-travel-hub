import { Bell, Menu } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="relative h-[520px] overflow-hidden bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/images/hero.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/35" />

      <div className="relative z-10 flex h-full flex-col justify-between px-6 pb-24 pt-8">
        <div className="flex items-center justify-between">
          <button
            aria-label="Open menu"
            className="grid h-11 w-11 place-items-center rounded-full text-white"
            type="button"
          >
            <Menu size={34} strokeWidth={2.2} />
          </button>

          <button
            aria-label="Notifications"
            className="grid h-11 w-11 place-items-center rounded-full text-white"
            type="button"
          >
            <Bell size={28} fill="currentColor" strokeWidth={0} />
          </button>
        </div>

        <div>
          <h1 className="text-[clamp(3rem,14vw,4.9rem)] font-bold leading-none tracking-normal">
            SEOUL 2026
          </h1>

          <p className="mt-4 text-[clamp(1.25rem,5vw,1.75rem)] font-medium">
            Personal Travel Companion
          </p>

          <div className="mt-12 space-y-3 text-[clamp(1.35rem,6vw,2rem)] font-medium leading-tight">
            <p>10.10 - 10.15</p>
            <p>Hongdae Edition</p>
          </div>
        </div>
      </div>
    </section>
  );
}
