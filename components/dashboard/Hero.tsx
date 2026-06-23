export default function Hero() {
  return (
    <section
      className="
      relative
      h-[500px]
      bg-cover
      bg-center
      text-white
      "
      style={{
        backgroundImage: "url('/images/hero.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 p-6">

        <div className="flex justify-between">
          <button className="text-3xl">
            ☰
          </button>

          <button>
            🔔
          </button>
        </div>

        <div className="mt-24">
          <h1 className="text-5xl font-bold">
            SEOUL 2026
          </h1>

          <p className="mt-3 text-xl">
            Personal Travel Companion
          </p>

          <div className="mt-12">
            <p className="text-2xl">
              10.10 — 10.15
            </p>

            <p className="mt-2 text-xl">
              Hongdae Edition
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}