import { useEffect, useMemo, useRef, useState } from "react";
import { IconChevronLeft, IconChevronRight, IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import { activeBanners, jstToday, type PromoBanner } from "../banners";

// Promo banner, ported exactly from ppij-identity-sso
// portal/BannerCarousel.tsx (portal-promo-banner,
// revamp-portal-branding 1.2). Image slides follow the banners.json
// contract in ../banners.ts.
const INTERVAL_MS = 6000;
const SWIPE_PX = 40;

const LABELS = {
  id: {
    label: "Pengumuman",
    prev: "Pengumuman sebelumnya",
    next: "Pengumuman berikutnya",
    goto: "Tampilkan pengumuman {n}",
    pause: "Jeda",
    play: "Putar",
    slide: "{n} dari {total}",
  },
  en: {
    label: "Announcements",
    prev: "Previous announcement",
    next: "Next announcement",
    goto: "Show announcement {n}",
    pause: "Pause",
    play: "Play",
    slide: "{n} of {total}",
  },
} as const;

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export interface BannerCarouselProps {
  banners: PromoBanner[];
  locale?: "id" | "en";
}

/**
 * Rolling promo banner. The 970 x 250 image shows from 768 px wide,
 * the 320 x 100 image below. Rotates every 6 s; pauses on hover,
 * focus, touch and the pause button; never rotates under reduced
 * motion. One banner shows no controls; no active banner renders
 * nothing. Entries are filtered by JST date in the browser, so an
 * expired promotion drops out without a deploy.
 */
export function BannerCarousel({ banners, locale = "id" }: BannerCarouselProps) {
  const slides = useMemo(() => activeBanners(banners, jstToday()), [banners]);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const reduceMotion = useReducedMotion();
  const touchX = useRef<number | null>(null);
  const count = slides.length;
  const paused = manualPause || hovered || focused || touching || reduceMotion;
  const current = Math.min(index, Math.max(count - 1, 0));

  useEffect(() => {
    if (paused || count < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  if (count === 0) return null;
  const go = (next: number) => setIndex((next + count) % count);
  const label = LABELS[locale].label;
  const altOf = (b: PromoBanner) => (locale === "en" ? b.alt.en : b.alt.id);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className="group relative aspect-[32/10] overflow-hidden rounded-xl bg-brand-ink md:aspect-[97/25]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
        setTouching(true);
      }}
      onTouchEnd={(e) => {
        setTouching(false);
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > SWIPE_PX) go(current + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="absolute inset-0" aria-live={paused ? "polite" : "off"}>
        {slides.map((b, k) => {
          const shown = k === current;
          return (
            <div
              key={b.id}
              role="group"
              aria-roledescription="slide"
              aria-label={LABELS[locale].slide.replace("{n}", String(k + 1)).replace("{total}", String(count))}
              aria-hidden={!shown}
              inert={!shown}
              className={`absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${shown ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              <a
                href={b.href}
                target={b.href.startsWith("https://") ? "_blank" : undefined}
                rel={b.href.startsWith("https://") ? "noopener noreferrer" : undefined}
                className="block h-full w-full focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
              >
                <picture className="block h-full w-full">
                  <source media="(min-width: 768px)" srcSet={b.image.desktop} width={970} height={250} />
                  <img
                    src={b.image.mobile}
                    alt={altOf(b)}
                    width={320}
                    height={100}
                    loading={k === 0 ? "eager" : "lazy"}
                    className="block h-full w-full object-cover"
                  />
                </picture>
              </a>
            </div>
          );
        })}
      </div>

      {count > 1 ? (
        <>
          <div role="group" aria-label={label} className="absolute right-1.5 bottom-1 flex items-center rounded-full bg-brand-ink/60 px-1">
            <button
              type="button"
              aria-label={manualPause ? LABELS[locale].play : LABELS[locale].pause}
              aria-pressed={manualPause}
              onClick={() => setManualPause((v) => !v)}
              className="flex size-7 items-center justify-center rounded-full text-white focus-visible:outline-2 focus-visible:outline-white"
            >
              {manualPause ? <IconPlayerPlay className="size-3.5" aria-hidden="true" /> : <IconPlayerPause className="size-3.5" aria-hidden="true" />}
            </button>
            {slides.map((b, k) => (
              <button
                key={b.id}
                type="button"
                aria-label={LABELS[locale].goto.replace("{n}", String(k + 1))}
                aria-current={k === current ? "true" : undefined}
                onClick={() => go(k)}
                className="flex size-7 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-white"
              >
                <span className={`block size-1.5 rounded-full ${k === current ? "bg-white" : "bg-white/55"}`} />
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label={LABELS[locale].prev}
            onClick={() => go(current - 1)}
            className="absolute top-1/2 left-2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-ink/55 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-white md:flex"
          >
            <IconChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={LABELS[locale].next}
            onClick={() => go(current + 1)}
            className="absolute top-1/2 right-2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-ink/55 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-white md:flex"
          >
            <IconChevronRight className="size-5" aria-hidden="true" />
          </button>
        </>
      ) : null}
    </section>
  );
}
