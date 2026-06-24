import { Menu } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="relative h-[360px] overflow-hidden bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/images/hero.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/30" />

      <div className="relative z-10 flex h-full flex-col px-5 pb-20 pt-6">
        <button
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded-full text-white/90"
          type="button"
        >
          <Menu size={28} strokeWidth={2.2} />
        </button>

        <div className="mt-auto max-w-[300px]">
          <h1 className="text-[2.35rem] font-bold leading-none tracking-normal drop-shadow-sm">
            SEOUL 2026
          </h1>

          <p className="mt-3 text-base font-medium drop-shadow-sm">
            Personal Travel Companion
          </p>

          <p className="mt-7 text-xl font-medium leading-tight drop-shadow-sm">
            10.10 - 10.15
          </p>
        </div>
      </div>
    </section>
  );
}
