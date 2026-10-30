import * as React from "react";
import { JAPAN_OUTLINE } from "./japan-outline";

const city = (lon: number, lat: number) => ({ x: (lon - 122) * 32, y: (47 - lat) * 32 });
const CITIES = [
  { name: "Fukuoka", ...city(130.42, 33.59) },
  { name: "Okayama", ...city(133.93, 34.66) },
  { name: "Osaka", ...city(135.5, 34.69) },
  { name: "Tokyo", ...city(139.69, 35.68) },
  { name: "Sendai", ...city(140.87, 38.27) },
  { name: "Sapporo", ...city(141.35, 43.06) },
];
const LINKS = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [1, 3], [0, 3]] as const;

function route(a: { x: number; y: number }, b: { x: number; y: number }) {
  const cx = (a.x + b.x) / 2;
  const cy = (a.y + b.y) / 2 - Math.max(20, Math.hypot(a.x - b.x, a.y - b.y) * 0.18);
  return `M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
}

/** Public-domain Natural Earth geography, raised as a white relief map. Routes are illustrative. */
export function JapanNetwork({ locale }: { locale: "id" | "en" }) {
  return <svg className="japan-network" viewBox="90 52 650 650" role="img" aria-label={locale === "id" ? "Peta Jepang putih dengan cahaya merah yang menghubungkan beberapa kota" : "White map of Japan with red light connecting several cities"}>
    <defs>
      <linearGradient id="land-face" x1="0" y1="0" x2="0.9" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="0.55" stopColor="#f1f4f7" /><stop offset="1" stopColor="#c9d2dc" /></linearGradient>
      <linearGradient id="land-side" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b9c4d0" /><stop offset="1" stopColor="#647485" /></linearGradient>
      <filter id="land-shadow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="15" /></filter>
      <filter id="route-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" /></filter>
      <radialGradient id="node-core"><stop offset="0" stopColor="#fff" /><stop offset="0.35" stopColor="#ffb7b7" /><stop offset="1" stopColor="#d21d3e" /></radialGradient>
    </defs>
    <path d={JAPAN_OUTLINE} transform="translate(0 28)" fill="#020c1b" opacity=".7" filter="url(#land-shadow)" />
    <path d={JAPAN_OUTLINE} transform="translate(0 17)" fill="#687889" />
    <path d={JAPAN_OUTLINE} transform="translate(0 11)" fill="url(#land-side)" />
    <path d={JAPAN_OUTLINE} fill="url(#land-face)" stroke="#ffffff" strokeWidth="1.4" />
    <g className="network-routes">
      {LINKS.map(([from, to], index) => {
        const d = route(CITIES[from], CITIES[to]);
        return <g key={`${from}-${to}`}>
          <path d={d} fill="none" stroke="#f03a59" strokeWidth="8" opacity=".55" filter="url(#route-glow)" />
          <path d={d} fill="none" stroke="#bf1737" strokeWidth="1.4" opacity=".7" />
          <path d={d} fill="none" stroke="#ff6a79" strokeWidth="2.5" strokeLinecap="round" className="network-flow" style={{ animationDelay: `${index * -0.63}s` }} />
          <circle r="4" fill="#fff5f5" className="network-traveler" style={{ animationDelay: `${index * -0.75}s` }}><animateMotion dur={`${3.3 + index * 0.28}s`} begin={`${index * -0.55}s`} repeatCount="indefinite" path={d} /></circle>
        </g>;
      })}
    </g>
    <g className="network-nodes">
      {CITIES.map((point, index) => <g key={point.name} transform={`translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`}>
        <circle r="15" fill="#bf1737" opacity=".18" className="network-pulse" style={{ animationDelay: `${index * -0.48}s` }} />
        <circle r="7" fill="#a80f2e" stroke="#fff" strokeWidth="2.5" />
        <circle r="2.8" fill="url(#node-core)" />
        {(point.name === "Okayama" || point.name === "Tokyo" || point.name === "Sapporo") && <text x="12" y="-12" className="network-label">{point.name}</text>}
      </g>)}
    </g>
  </svg>;
}
