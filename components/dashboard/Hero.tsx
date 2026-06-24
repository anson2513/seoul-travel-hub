export default function Hero() {
  return (
    <section
      className="relative h-[380px] overflow-hidden bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/images/hero-upload-clean.png')",
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,16,24,0.18)_0%,rgba(12,16,24,0.04)_45%,rgba(12,16,24,0.22)_100%)]" />

      <div className="relative z-10 flex h-full flex-col px-6 pt-14 pb-16">
        <div className="max-w-[290px]">
          <h1 className="text-[2.05rem] font-semibold leading-none tracking-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.30)]">
            SEOUL 2026
          </h1>

          <p className="mt-3 text-[1rem] font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.22)]">
            Personal Travel Companion
          </p>

          <p className="mt-6 text-[1.35rem] font-medium leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.22)]">
            10.10 - 10.15
          </p>
        </div>
      </div>
    </section>
  );
}
