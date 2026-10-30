import * as React from "react";
import { JAPAN_OUTLINE } from "./japan-outline";

type Point = { x: number; y: number };
type Prefecture = Point & { name: string };
type Flight = { from: number; to: number; started: number; duration: number };

const place = (name: string, lon: number, lat: number): Prefecture => ({
  name, x: (lon - 122) * 32, y: (47 - lat) * 32,
});

// Representative prefectural capitals. Connections are illustrative, not travel data.
const PREFECTURES = [
  place("Hokkaido", 141.35, 43.06), place("Aomori", 140.74, 40.82),
  place("Iwate", 141.15, 39.70), place("Miyagi", 140.87, 38.27),
  place("Fukushima", 140.47, 37.75), place("Niigata", 139.02, 37.90),
  place("Ishikawa", 136.63, 36.59), place("Nagano", 138.18, 36.65),
  place("Tokyo", 139.69, 35.69), place("Kanagawa", 139.64, 35.45),
  place("Aichi", 136.91, 35.18), place("Kyoto", 135.76, 35.02),
  place("Osaka", 135.50, 34.69), place("Okayama", 133.93, 34.66),
  place("Hiroshima", 132.46, 34.40), place("Ehime", 132.77, 33.84),
  place("Fukuoka", 130.42, 33.59), place("Kumamoto", 130.71, 32.80),
  place("Kagoshima", 130.56, 31.60), place("Okinawa", 127.68, 26.22),
];
const ARRIVAL_MS = 540;
const SLOT_COUNT = 4;

function arc(from: Point, to: Point) {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const control = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 - Math.max(40, distance * .35) };
  const point = (t: number): Point => ({
    x: (1 - t) ** 2 * from.x + 2 * (1 - t) * t * control.x + t ** 2 * to.x,
    y: (1 - t) ** 2 * from.y + 2 * (1 - t) * t * control.y + t ** 2 * to.y,
  });
  return { point };
}

function trailingSegment(point: (t: number) => Point, progress: number) {
  return Array.from({ length: 13 }, (_, index) => {
    const { x, y } = point(progress * index / 12);
    return `${index ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}

/** Public-domain Natural Earth geography with illustrative prefecture connections. */
export function JapanNetwork({ locale }: { locale: "id" | "en" }) {
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const slots = Array.from(svg.querySelectorAll<SVGGElement>("[data-flight]"));
    const nodes = Array.from(svg.querySelectorAll<SVGGElement>("[data-node]"));
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const active: Array<Flight | null> = Array(SLOT_COUNT).fill(null);
    let visible = false;
    let frame = 0;
    let nextLaunch = 0;
    let previousPair = "";
    let launchCount = 0;

    const clear = () => {
      active.fill(null);
      slots.forEach((slot) => { slot.style.opacity = "0"; });
      nodes.forEach((node) => { node.style.opacity = "0"; });
    };
    const launch = (now: number) => {
      const slotIndex = active.findIndex((flight) => flight === null);
      if (slotIndex < 0) return;
      launchCount += 1;
      let pair: [number, number] | null = null;
      for (let attempt = 0; attempt < 24; attempt++) {
        const from = launchCount % 9 === 0 ? PREFECTURES.length - 1 : Math.floor(Math.random() * PREFECTURES.length);
        const to = Math.floor(Math.random() * PREFECTURES.length);
        const distance = Math.hypot(PREFECTURES[from].x - PREFECTURES[to].x, PREFECTURES[from].y - PREFECTURES[to].y);
        if (from !== to && distance > 105 && distance < 480 && `${from}-${to}` !== previousPair
          && !active.some((flight) => flight && (flight.from === from || flight.to === to))) {
          pair = [from, to];
          break;
        }
      }
      if (!pair) return;
      const [from, to] = pair;
      previousPair = `${from}-${to}`;
      const distance = Math.hypot(PREFECTURES[from].x - PREFECTURES[to].x, PREFECTURES[from].y - PREFECTURES[to].y);
      active[slotIndex] = { from, to, started: now, duration: 1550 + distance * 1.35 };
      slots[slotIndex].style.opacity = "1";
    };
    const tick = (now: number) => {
      if (now >= nextLaunch) {
        launch(now);
        nextLaunch = now + 420 + Math.random() * 320;
      }
      const nodeOpacity = Array(PREFECTURES.length).fill(0) as number[];
      const arrival = Array(PREFECTURES.length).fill(0) as number[];
      active.forEach((flight, index) => {
        if (!flight) return;
        const slot = slots[index];
        const progress = Math.min(1, (now - flight.started) / flight.duration);
        const line = slot.querySelector<SVGPathElement>("[data-trail-line]");
        const lineGlow = slot.querySelector<SVGPathElement>("[data-trail-glow]");
        const glow = slot.querySelector<SVGCircleElement>("[data-glow]");
        const projectile = slot.querySelector<SVGCircleElement>("[data-projectile]");
        const sparks = slot.querySelectorAll<SVGCircleElement>("[data-spark]");
        if (progress < 1) {
          const curve = arc(PREFECTURES[flight.from], PREFECTURES[flight.to]);
          const path = trailingSegment(curve.point, progress);
          line?.setAttribute("d", path);
          lineGlow?.setAttribute("d", path);
          if (line) line.style.opacity = "1";
          if (lineGlow) lineGlow.style.opacity = "1";
          sparks.forEach((spark, sparkIndex) => {
          const t = progress - (sparkIndex + 1) / sparks.length * .15;
            if (t < 0) { spark.style.opacity = "0"; return; }
            const point = curve.point(t);
            spark.setAttribute("cx", String(point.x));
            spark.setAttribute("cy", String(point.y));
            spark.style.opacity = String((1 - sparkIndex / sparks.length) * .9);
          });
          const { x, y } = curve.point(progress);
          projectile?.setAttribute("cx", String(x));
          projectile?.setAttribute("cy", String(y));
          glow?.setAttribute("cx", String(x));
          glow?.setAttribute("cy", String(y));
          if (projectile) projectile.style.opacity = "1";
          if (glow) glow.style.opacity = ".38";
          nodeOpacity[flight.from] = Math.max(nodeOpacity[flight.from], Math.max(0, 1 - progress * 2.4));
        } else {
          const elapsed = now - flight.started - flight.duration;
          const fade = Math.max(0, 1 - elapsed / ARRIVAL_MS);
          if (projectile) projectile.style.opacity = "0";
          if (line) line.style.opacity = String(fade);
          if (lineGlow) lineGlow.style.opacity = String(fade);
          if (glow) glow.style.opacity = "0";
          sparks.forEach((spark) => { spark.style.opacity = String(fade * .3); });
          nodeOpacity[flight.to] = Math.max(nodeOpacity[flight.to], fade);
          arrival[flight.to] = Math.max(arrival[flight.to], elapsed / ARRIVAL_MS);
          if (elapsed >= ARRIVAL_MS) {
            active[index] = null;
            slot.style.opacity = "0";
          }
        }
      });
      nodes.forEach((node, index) => {
        node.style.opacity = String(nodeOpacity[index]);
        const ripple = node.querySelector<SVGCircleElement>("[data-ripple]");
        if (ripple) {
          ripple.setAttribute("r", String(8 + arrival[index] * 22));
          ripple.style.opacity = arrival[index] > 0 ? String((1 - arrival[index]) * .65) : "0";
        }
      });
      frame = window.requestAnimationFrame(tick);
    };
    const sync = () => {
      window.cancelAnimationFrame(frame);
      clear();
      if (visible && !document.hidden && !preference.matches) {
        nextLaunch = performance.now() + 450;
        frame = window.requestAnimationFrame(tick);
      }
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .1 });
    observer.observe(svg);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <svg ref={svgRef} className="japan-network" viewBox="90 52 650 650" role="img" aria-label={locale === "id" ? "Peta Jepang putih; cahaya merah sesekali bergerak di antara prefektur" : "White map of Japan with occasional red light traveling between prefectures"}>
    <defs>
      <linearGradient id="land-face" x1="0" y1="0" x2="0.9" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="0.55" stopColor="#f1f4f7" /><stop offset="1" stopColor="#c9d2dc" /></linearGradient>
      <linearGradient id="land-side" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b9c4d0" /><stop offset="1" stopColor="#647485" /></linearGradient>
      <filter id="land-shadow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="15" /></filter>
      <filter id="flight-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" /></filter>
    </defs>
    <path d={JAPAN_OUTLINE} transform="translate(0 28)" fill="#020c1b" opacity=".7" filter="url(#land-shadow)" />
    <path d={JAPAN_OUTLINE} transform="translate(0 17)" fill="#687889" />
    <path d={JAPAN_OUTLINE} transform="translate(0 11)" fill="url(#land-side)" />
    <path d={JAPAN_OUTLINE} fill="url(#land-face)" stroke="#ffffff" strokeWidth="1.4" />
    {Array.from({ length: SLOT_COUNT }, (_, index) => <g key={index} data-flight={index} style={{ opacity: 0 }}>
      <path data-trail-glow fill="none" stroke="#ff4d6d" strokeWidth="10" strokeLinecap="round" strokeOpacity=".45" opacity="0" filter="url(#flight-glow)" />
      <path data-trail-line fill="none" stroke="#ff6b84" strokeWidth="1.7" strokeLinecap="round" opacity="0" strokeOpacity=".45" />
      {Array.from({ length: 20 }, (_, spark) => <circle key={spark} data-spark r={3 * (1 - spark / 20)} fill="#ff6486" opacity="0" />)}
      <circle data-glow r="12" fill="#ff4d6d" opacity="0" />
      <circle data-projectile r="5" fill="#ff4d6d" className="network-traveler" />
    </g>)}
    {PREFECTURES.map((prefecture, index) => <g key={prefecture.name} data-node={index} transform={`translate(${prefecture.x.toFixed(1)} ${prefecture.y.toFixed(1)})`} style={{ opacity: 0 }}>
      <circle data-ripple r="8" fill="none" stroke="#ff4d6d" strokeWidth="2" opacity="0" />
      <circle r="11" fill="#ff4d6d" opacity=".18" />
      <circle r="5" fill="#ff4d6d" />
      <text x={prefecture.x > 525 ? -11 : 11} y="-11" textAnchor={prefecture.x > 525 ? "end" : "start"} className="network-label">{prefecture.name}</text>
    </g>)}
  </svg>;
}
