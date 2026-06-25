"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SPLASH_HOLD_MS = 1500;
const SPLASH_FADE_MS = 420;

type SplashState = "visible" | "leaving" | "hidden";

export default function SplashScreen() {
  const [state, setState] = useState<SplashState>("visible");

  useEffect(() => {
    const holdTimer = window.setTimeout(() => {
      setState("leaving");
    }, SPLASH_HOLD_MS);

    const hideTimer = window.setTimeout(() => {
      setState("hidden");
    }, SPLASH_HOLD_MS + SPLASH_FADE_MS);

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (state === "hidden") return null;

  return (
    <div
      aria-label="SEOUL Travel Hub 啟動畫面"
      className={`fixed inset-0 z-[999] bg-[#F7F5F2] transition-opacity duration-500 ${
        state === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="status"
    >
      <div className="relative mx-auto h-[100svh] max-w-[430px] overflow-hidden bg-[#F7F5F2]">
        <section className="absolute left-1/2 top-[42%] flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center px-10 text-center">
          <Image
            alt=""
            aria-hidden="true"
            className="size-[108px] rounded-[24px] object-cover shadow-[0_26px_58px_rgba(49,36,27,0.22)]"
            height={268}
            priority
            src="/images/app-icon-black-gold.png"
            width={268}
          />

          <h1
            className="mt-8 whitespace-nowrap text-[1.85rem] font-bold leading-none text-neutral-950"
            style={{
              fontFamily:
                'Georgia, "Times New Roman", "Noto Serif TC", "PMingLiU", serif',
            }}
          >
            SEOUL Travel Hub
          </h1>

          <p
            className="mt-5 text-[1.05rem] font-semibold leading-tight text-neutral-500"
            style={{
              fontFamily:
                '"PMingLiU", "Noto Serif TC", Georgia, "Times New Roman", serif',
            }}
          >
            開發者 by ANSON
          </p>
        </section>

        <Image
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full select-none"
          height={780}
          priority
          src="/images/splash-hero-line-art.png"
          width={1080}
        />
      </div>
    </div>
  );
}
