/**
 * Shared map constants and types. Kept out of LeafletMap.tsx so the lazy Leaflet chunk stays
 * leaf-only: MapCard imports from here without pulling Leaflet into the main bundle.
 */

/** Zoom below this shows korda circles (national scope only) — production lib/map.ts. */
export const KORDA_MAX_ZOOM = 7;
/** From this zoom on, circles are cities/wards. Komsat circles sit in between. */
export const MUNICIPALITY_MIN_ZOOM = 10;

/** Whole of Japan, including Okinawa — the initial national view (production lib/map.ts). */
export const JAPAN_BOUNDS: [[number, number], [number, number]] = [
  [24.0, 122.9],
  [45.6, 146.0],
];

export interface MapBubble {
  unit_id: string;
  kind: "korda" | "komsat" | "municipality";
  name: string;
  lat: number;
  lng: number;
  active_count: number;
}
