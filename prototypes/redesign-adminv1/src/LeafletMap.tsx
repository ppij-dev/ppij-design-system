import { useEffect, useMemo } from "react";
import { divIcon } from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { type MapBubble } from "./mapLevels";

/**
 * Lazy-loaded Leaflet canvas (the only chunk that pays for Leaflet). Mirrors the production map:
 * OpenStreetMap raster tiles with attribution, one divIcon bubble per unit whose diameter grows
 * with the square root of the ACTIVE count (capped at 40px), zoom reported to the parent so it can
 * switch circle levels, and imperative fit-to-bounds requests when a korda is clicked.
 * Shared constants and types live in mapLevels.ts so this module stays the only Leaflet importer.
 */

/** Production circle sizing: square-root growth, 28–40px, so neighbours stay tappable. */
interface LeafletMapProps {
  bubbles: MapBubble[];
  selectedId: string | null;
  initialZoom: number;
  initialBounds: [[number, number], [number, number]];
  fitRequest: { key: number; bounds: [[number, number], [number, number]] } | null;
  onZoom: (zoom: number) => void;
  onSelect: (bubble: MapBubble) => void;
}

function bubbleDiameter(count: number): number {
  return Math.min(40, Math.max(28, 20 + Math.round(Math.sqrt(Math.max(count, 0)) * 2.5)));
}

function bubbleIcon(bubble: MapBubble, selected: boolean) {
  const size = bubbleDiameter(bubble.active_count);
  return divIcon({
    className: "map-bubble-wrap",
    html: `<span class="map-bubble" data-kind="${bubble.kind}"${selected ? ' data-selected="true"' : ""} role="button" aria-label="${bubble.name}: ${bubble.active_count} anggota aktif">${bubble.active_count}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function ZoomButtons() {
  const map = useMap();
  return (
    <div className="map-zoom">
      <button type="button" aria-label="Perbesar peta" onClick={() => map.zoomIn()}>
        <IconPlus size={16} />
      </button>
      <button type="button" aria-label="Perkecil peta" onClick={() => map.zoomOut()}>
        <IconMinus size={16} />
      </button>
    </div>
  );
}

function ZoomListener({ onZoom }: { onZoom: (zoom: number) => void }) {
  useMapEvents({ zoomend: (event) => onZoom(event.target.getZoom()) });
  return null;
}

export default function LeafletMap({ bubbles, selectedId, initialZoom, initialBounds, fitRequest, onZoom, onSelect }: LeafletMapProps) {
  const markers = useMemo(
    () =>
      bubbles.map((bubble) => ({
        bubble,
        icon: bubbleIcon(bubble, bubble.unit_id === selectedId),
      })),
    [bubbles, selectedId],
  );

  return (
    <MapContainer center={[36.2, 138.2]} zoom={initialZoom} zoomControl={false} attributionControl className="map-leaflet">
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
      />
      <ZoomButtons />
      <ZoomListener onZoom={onZoom} />
      <FitEffect fitKey={fitRequest?.key ?? 0} bounds={fitRequest?.bounds ?? initialBounds} maxZoom={initialZoom} />
      {markers.map(({ bubble, icon }) => (
        <Marker
          key={bubble.unit_id}
          position={[bubble.lat, bubble.lng]}
          icon={icon}
          zIndexOffset={bubble.kind === "korda" ? 400 : 0}
          eventHandlers={{ click: () => onSelect(bubble) }}
        />
      ))}
    </MapContainer>
  );
}

/** Fits the view once per request key (and once on mount); renders nothing. */
function FitEffect({ fitKey, bounds, maxZoom }: { fitKey: number; bounds: [[number, number], [number, number]]; maxZoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [24, 24], maxZoom });
  }, [map, fitKey, bounds, maxZoom]);
  return null;
}
