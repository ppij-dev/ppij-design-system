import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  IconArrowRight, IconCircleCheck, IconMaximize, IconMinimize, IconChevronDown, IconChevronUp,
} from "@tabler/icons-react";
import { Badge, Button, Skeleton } from "ppij-design-system";
import {
  activeOfKorda, komsats, komsatsOfKorda, kordas, municipalities, totalActive, unmapped,
  type Scope,
} from "./mapData";
import { coverageKorda, coverageNational, formatCount, statsByScope } from "./statsData";
import { JAPAN_BOUNDS, KORDA_MAX_ZOOM, MUNICIPALITY_MIN_ZOOM, type MapBubble } from "./mapLevels";

/** Leaflet is imported lazily so the initial chunk and the gate build stay free of it. */
const LeafletMap = lazy(() => import("./LeafletMap"));

export type StatsTopic = "anggota" | "verifikasi" | "organisasi";

type CircleLevel = "korda" | "komsat" | "municipality";

const levelForZoom = (zoom: number): CircleLevel => (zoom < KORDA_MAX_ZOOM ? "korda" : zoom < MUNICIPALITY_MIN_ZOOM ? "komsat" : "municipality");

const boundsOf = (points: [number, number][]): [[number, number], [number, number]] => {
  if (points.length === 0) return JAPAN_BOUNDS;
  const lats = points.map(([lat]) => lat);
  const lngs = points.map(([, lng]) => lng);
  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ];
};

/** The production profile for the selected workspace: national, Korda Kanto, or Komsat Tokyo. */
const KORDA_ID = "u-kanto";
const KOMSAT_ID = "u-tokyo";

function scopedBubbles(scope: Scope, zoom: number): MapBubble[] {
  const level = levelForZoom(zoom);
  if (level === "korda") {
    if (scope !== "national") return [];
    return kordas.map((k) => ({ unit_id: k.unit_id, kind: "korda" as const, name: k.name, lat: k.lat, lng: k.lng, active_count: activeOfKorda(k.unit_id) }));
  }
  if (level === "komsat") {
    const rows = scope === "national" ? komsats : scope === "korda" ? komsatsOfKorda(KORDA_ID) : komsats.filter((k) => k.unit_id === KOMSAT_ID);
    return rows.map((k) => ({ unit_id: k.unit_id, kind: "komsat" as const, name: k.name, lat: k.lat, lng: k.lng, active_count: k.active_count }));
  }
  const rows = scope === "national" ? municipalities : scope === "korda" ? municipalities.filter((m) => m.prefecture_code === "13" || komsatsOfKorda(KORDA_ID).some((k) => k.name.replace("Komsat ", "") === m.name_romaji)) : municipalities.filter((m) => m.prefecture_code === "13");
  return rows.map((m) => ({ unit_id: `muni:${m.code}`, kind: "municipality" as const, name: m.name_romaji, lat: m.lat, lng: m.lng, active_count: m.active_count }));
}

interface Selection {
  unit_id: string;
  kind: CircleLevel;
  name: string;
}

interface MapCardProps {
  scope: Scope;
  scopeName: string;
  onOpenStats: (topic: StatsTopic) => void;
}

/**
 * The dashboard hero: a full content-island-width map card. Height steps 420/320/240px at
 * ≥900px / 601–899px / ≤600px; the selection panel floats top-right on desktop and becomes a
 * summary bar below the header on tablet; phones expand to a fullscreen view with a snap sheet.
 * The network strip lives on as the card footer; the level side card renders below the card.
 */
export function MapCard({ scope, scopeName, onOpenStats }: MapCardProps) {
  const [zoom, setZoom] = useState(scope === "national" ? 5 : scope === "korda" ? 8 : 11);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [fitRequest, setFitRequest] = useState<{ key: number; bounds: [[number, number], [number, number]] } | null>(null);

  const scopeKomsats = scope === "national" ? komsats : scope === "korda" ? komsatsOfKorda(KORDA_ID) : komsats.filter((k) => k.unit_id === KOMSAT_ID);
  const scopeActive = scope === "national" ? totalActive : scope === "korda" ? activeOfKorda(KORDA_ID) : scopeKomsats[0].active_count;
  const completeness = statsByScope[scope].completeness;
  const lengkapPct = Math.round((completeness.lengkap / completeness.active_total) * 100);

  const initialBounds = useMemo(
    () => boundsOf(scopeKomsats.map((k) => [k.lat, k.lng])),
    [scopeKomsats],
  );
  const initialZoom = scope === "national" ? 5 : scope === "korda" ? 8 : 11;

  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [expanded]);

  const bubbles = scopedBubbles(scope, zoom);

  const select = (bubble: MapBubble) => {
    const deselect = selection?.unit_id === bubble.unit_id;
    setSelection(deselect ? null : { unit_id: bubble.unit_id, kind: bubble.kind, name: bubble.name });
    if (!deselect && bubble.kind === "korda") {
      setFitRequest({ key: (fitRequest?.key ?? 0) + 1, bounds: boundsOf(komsatsOfKorda(bubble.unit_id).map((k) => [k.lat, k.lng])) });
    }
    setSheetOpen(true);
  };

  const selectedCount = selection
    ? selection.kind === "korda"
      ? activeOfKorda(selection.unit_id)
      : selection.kind === "komsat"
        ? komsats.find((k) => k.unit_id === selection.unit_id)?.active_count ?? 0
        : municipalities.find((m) => `muni:${m.code}` === selection.unit_id)?.active_count ?? 0
    : scopeActive;
  const share = scopeActive > 0 ? Math.round((selectedCount / scopeActive) * 100) : 0;

  const title = scope === "national" ? "Jaringan PPI Jepang" : scope === "korda" ? "Sebaran anggota Korda Kanto" : "Cakupan Komsat Tokyo";
  const kindLabel = !selection
    ? scopeName
    : selection.kind === "korda"
      ? "Koordinator daerah"
      : selection.kind === "komsat"
        ? "Komisariat"
        : "Kota/wilayah";

  const stats = (
    <div className="map-panel-body">
      <div>
        <p className="map-panel-kind">{kindLabel}</p>
        <p className="map-panel-name">{selection?.name ?? scopeName}</p>
      </div>
      <div>
        <p className="map-panel-kind">Anggota aktif</p>
        <p className="map-panel-count">{formatCount(selectedCount)}</p>
        {selection ? <p className="map-panel-share">{share}% dari {formatCount(scopeActive)} anggota aktif</p> : null}
      </div>
      <button type="button" className="map-panel-link" onClick={() => onOpenStats("anggota")}>
        Lihat statistik anggota <IconArrowRight size={15} />
      </button>
    </div>
  );

  return (
    <section className={`map-card${expanded ? " map-card-expanded" : ""}`} aria-label={title}>
      <header className="map-card-head">
        <div>
          <h2>{title}</h2>
          <p>Ketuk lingkaran untuk anggota aktif per wilayah. Data contoh di atas peta OpenStreetMap.</p>
        </div>
        <div className="map-head-actions">
          {selection ? (
            <button type="button" className="map-chip" onClick={() => setSelection(null)}>
              {selection.name} <span aria-hidden="true">×</span>
            </button>
          ) : null}
          <button type="button" className="map-expand" aria-expanded={expanded} onClick={() => { setExpanded((value) => !value); setSheetOpen(false); }}>
            {expanded ? <IconMinimize size={16} /> : <IconMaximize size={16} />}
            {expanded ? "Tutup layar penuh" : "Perbesar peta"}
          </button>
        </div>
      </header>

      <div className="map-canvas">
        <Suspense fallback={<div className="map-loading"><Skeleton className="h-5 w-44" /><Skeleton className="map-loading-canvas" /></div>}>
          <LeafletMap
            bubbles={bubbles}
            selectedId={selection?.unit_id ?? null}
            initialZoom={initialZoom}
            initialBounds={initialBounds}
            fitRequest={fitRequest}
            onZoom={setZoom}
            onSelect={select}
          />
        </Suspense>
        <div className="map-panel-overlay">{stats}</div>
      </div>

      {!expanded ? (
        <aside className="map-panel-inline" aria-label="Ringkasan peta">
          {stats}
        </aside>
      ) : null}

      {expanded ? (
        <div className={`map-sheet${sheetOpen ? " open" : ""}`} aria-label="Ringkasan peta">
          <button type="button" className="map-sheet-handle" aria-expanded={sheetOpen} onClick={() => setSheetOpen((value) => !value)}>
            <span className="map-sheet-bar" aria-hidden="true" />
            <span className="map-sheet-row">{selection ? `${selection.name}: ${formatCount(selectedCount)} anggota` : `${scopeName}: ${formatCount(scopeActive)} anggota aktif`}{sheetOpen ? <IconChevronDown size={15} /> : <IconChevronUp size={15} />}</span>
          </button>
          {sheetOpen ? <div className="map-sheet-body">{stats}</div> : null}
        </div>
      ) : null}

      <footer className="map-footer">
        {(scope === "national"
          ? [
              { value: String(kordas.length), label: "Koordinator daerah" },
              { value: String(komsats.length), label: "Komsat aktif" },
              { value: `${lengkapPct}%`, label: "Profil lengkap" },
            ]
          : scope === "korda"
            ? [
                { value: formatCount(scopeActive), label: "Anggota aktif" },
                { value: String(scopeKomsats.length), label: "Komsat aktif" },
                { value: `${lengkapPct}%`, label: "Profil lengkap" },
              ]
            : [
                { value: formatCount(scopeActive), label: "Anggota terdaftar" },
                { value: String(municipalities.filter((m) => m.prefecture_code === "13").length), label: "Wilayah aktif" },
                { value: `${lengkapPct}%`, label: "Profil lengkap" },
              ]
        ).map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </footer>
      {scope !== "komsat" && unmapped.length > 0 ? (
        <p className="map-unmapped">
          {unmapped.length} unit belum dipetakan ({formatCount(unmapped.reduce((sum, u) => sum + u.active_count, 0))} anggota): {unmapped.map((u) => u.name).join(", ")}.
        </p>
      ) : null}
    </section>
  );
}

/**
 * The level side card that production places beside the map, now below it: national sees the
 * Cakupan prefecture list, korda sees the disabled Klaim card, komsat sees the open queue.
 */
export function MapSideCard({ scope, onOpenReview }: { scope: Scope; onOpenReview: () => void }) {
  if (scope === "national") {
    const coverage = coverageNational;
    return (
      <section className="side-card" aria-labelledby="side-cakupan">
        <div className="section-head">
          <div>
            <h2 id="side-cakupan">Cakupan wilayah</h2>
            <p>Prefektur dengan anggota non-komsat dan peluang komsat baru.</p>
          </div>
        </div>
        <ul className="coverage-list">
          {coverage.prefectures.map((p) => (
            <li key={p.prefecture_code}>
              <span>
                {p.name_en}
                {p.state === "partial" ? <small>sebagian</small> : null}
                {p.candidate_new_komsat ? <Badge variant="secondary">Kandidat komsat</Badge> : null}
              </span>
              <strong>{formatCount(p.non_komsat_active)}</strong>
            </li>
          ))}
          <li className="coverage-total">
            <span>Total non-komsat aktif</span>
            <strong>{formatCount(coverage.non_komsat_active)}</strong>
          </li>
        </ul>
      </section>
    );
  }
  if (scope === "korda") {
    return (
      <section className="side-card" aria-labelledby="side-klaim">
        <div className="section-head">
          <div>
            <h2 id="side-klaim">Klaim wilayah</h2>
            <Badge variant="secondary">Segera hadir</Badge>
          </div>
        </div>
        <p className="side-card-note">Prefektur dapat diklaim korda pada pembaruan berikutnya. Total non-komsat di Kanto: {formatCount(coverageKorda.non_komsat_active)} ({coverageKorda.prefectures.map((p) => `${p.name_en} ${formatCount(p.non_komsat_active)}`).join(", ")}).</p>
      </section>
    );
  }
  const stats = statsByScope.komsat;
  return (
    <section className="side-card" aria-labelledby="side-antrean">
      <div className="section-head">
        <div>
          <h2 id="side-antrean">Antrean verifikasi</h2>
          <p>Pengajuan yang menunggu keputusan di Komsat Tokyo.</p>
        </div>
        <span className="side-count">{formatCount(stats.review.baru)}</span>
      </div>
      <ul className="coverage-list">
        {(["baru", "dikirim_ulang", "diperiksa", "menunggu_anggota"] as const).map((tab) => (
          <li key={tab}>
            <span>{tabLabelsShort[tab]}</span>
            <strong>{formatCount(stats.review[tab])}</strong>
          </li>
        ))}
      </ul>
      <Button variant="ghost" size="sm" className="side-card-action" onClick={onOpenReview}>
        Buka Verifikasi <IconArrowRight size={15} />
      </Button>
      <p className="side-card-hint"><IconCircleCheck size={14} /> Angka sama dengan lencana Verifikasi di navigasi.</p>
    </section>
  );
}

const tabLabelsShort = {
  baru: "Baru",
  dikirim_ulang: "Dikirim ulang",
  diperiksa: "Sedang diperiksa",
  menunggu_anggota: "Menunggu anggota",
} as const;
