"use client";

import { RotateCcw, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import {
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type ItineraryGuideReferenceProps = {
  dayLabel: string;
  src: string;
  width: number;
  height: number;
};

type Point = { x: number; y: number };
type Transform = { scale: number; x: number; y: number };

const minScale = 1;
const maxScale = 5;

function distance(first: Point, second: Point) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function midpoint(first: Point, second: Point) {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  };
}

function clampScale(value: number) {
  return Math.min(maxScale, Math.max(minScale, value));
}

export default function ItineraryGuideReference({
  dayLabel,
  src,
  width,
  height,
}: ItineraryGuideReferenceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    x: 0,
    y: 0,
  });
  const pointers = useRef(new Map<number, Point>());
  const pinchStart = useRef<{
    distance: number;
    midpoint: Point;
    transform: Transform;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  function reset() {
    pointers.current.clear();
    pinchStart.current = null;
    setTransform({ scale: 1, x: 0, y: 0 });
  }

  function openViewer() {
    reset();
    setIsOpen(true);
  }

  function closeViewer() {
    reset();
    setIsOpen(false);
  }

  function beginPinch() {
    const activePoints = [...pointers.current.values()];
    if (activePoints.length !== 2) {
      pinchStart.current = null;
      return;
    }

    pinchStart.current = {
      distance: distance(activePoints[0], activePoints[1]),
      midpoint: midpoint(activePoints[0], activePoints[1]),
      transform,
    };
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    if (pointers.current.size === 2) beginPinch();
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const previousPoint = pointers.current.get(event.pointerId);
    if (!previousPoint) return;

    const nextPoint = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, nextPoint);

    if (pointers.current.size === 1 && transform.scale > 1) {
      setTransform((current) => ({
        ...current,
        x: current.x + nextPoint.x - previousPoint.x,
        y: current.y + nextPoint.y - previousPoint.y,
      }));
      return;
    }

    if (pointers.current.size !== 2 || !pinchStart.current) return;
    const activePoints = [...pointers.current.values()];
    const currentMidpoint = midpoint(activePoints[0], activePoints[1]);
    const nextScale = clampScale(
      pinchStart.current.transform.scale *
        (distance(activePoints[0], activePoints[1]) /
          pinchStart.current.distance),
    );
    setTransform({
      scale: nextScale,
      x:
        pinchStart.current.transform.x +
        currentMidpoint.x -
        pinchStart.current.midpoint.x,
      y:
        pinchStart.current.transform.y +
        currentMidpoint.y -
        pinchStart.current.midpoint.y,
    });
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    pinchStart.current = null;
    if (pointers.current.size === 2) beginPinch();
  }

  function handleDoubleClick() {
    setTransform((current) =>
      current.scale > 1
        ? { scale: 1, x: 0, y: 0 }
        : { scale: 2.5, x: 0, y: 0 },
    );
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const nextScale = clampScale(
      transform.scale + (event.deltaY < 0 ? 0.25 : -0.25),
    );
    setTransform((current) => ({
      scale: nextScale,
      x: nextScale === 1 ? 0 : current.x,
      y: nextScale === 1 ? 0 : current.y,
    }));
  }

  return (
    <>
      <section className="mt-5 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs font-bold text-neutral-500">{dayLabel}</p>
            <h2 className="mt-0.5 text-base font-bold text-neutral-950">
              每日交通攻略
            </h2>
          </div>
          <ZoomIn className="text-neutral-700" size={21} />
        </div>
        <button
          aria-label={`放大查看 ${dayLabel} 交通攻略`}
          className="relative block w-full overflow-hidden border-t border-neutral-200 bg-neutral-100"
          onClick={openViewer}
          style={{ aspectRatio: `${width} / ${height}` }}
          type="button"
        >
          <Image
            alt={`${dayLabel} 首爾交通攻略`}
            className="object-contain"
            fill
            loading="lazy"
            sizes="(max-width: 430px) 100vw, 430px"
            src={src}
            unoptimized
          />
        </button>
      </section>

      {isOpen ? (
        <div className="fixed inset-0 z-[120] flex flex-col bg-black text-white">
          <div className="flex h-16 shrink-0 items-center justify-between px-4 pt-[env(safe-area-inset-top)]">
            <div>
              <p className="text-xs font-bold text-white/55">{dayLabel}</p>
              <p className="text-sm font-bold">交通攻略</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="min-w-12 text-center text-xs font-bold text-white/70">
                {Math.round(transform.scale * 100)}%
              </span>
              <button
                aria-label="還原圖片大小"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10"
                onClick={reset}
                type="button"
              >
                <RotateCcw size={19} />
              </button>
              <button
                aria-label="關閉交通攻略"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10"
                onClick={closeViewer}
                type="button"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          <div
            className="relative min-h-0 flex-1 cursor-grab overflow-hidden touch-none active:cursor-grabbing"
            onDoubleClick={handleDoubleClick}
            onPointerCancel={handlePointerEnd}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onWheel={handleWheel}
          >
            <div
              className="absolute inset-0 select-none"
              style={{
                transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
                transformOrigin: "center",
              }}
            >
              <Image
                alt={`${dayLabel} 首爾交通攻略放大圖`}
                className="pointer-events-none object-contain"
                fill
                priority
                sizes="100vw"
                src={src}
                unoptimized
              />
            </div>
          </div>

          <div className="h-[env(safe-area-inset-bottom)] shrink-0" />
        </div>
      ) : null}
    </>
  );
}
