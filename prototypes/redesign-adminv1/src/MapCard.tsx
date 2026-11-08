import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  IconArrowRight, IconCircleCheck,
} from "@tabler/icons-react";
import {
  Badge, Button, Callout, FactList, ListRow, MapCard as MapCardFrame, PanelCard, Skeleton,
  type StatStripItem,
} from "ppij-design-system";
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
 * The dashboard hero: a full content-island-width map card. The frame — the 420/320/240px height
 * steps, the overlay panel on desktop, the inline bar on tablet, the phone snap sheet, the escape
 * handling and the footer strip — comes from `ppij-design-system` (MapCard). This file keeps the
 * Leaflet canvas, the geography, the zoom levels, the synthetic bubble data and the metric choice.
 */
export function MapCard({ scope, scopeName, onOpenStats }: MapCardProps) {
  const [zoom, setZoom] = useState(scope === "national" ? 5 : scope === "korda" ? 8 : 11);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [fitRequest, setFitRequest] = useState<{ key: number; bounds: [[number, number], [number, number]] } | null>(null);

  const scopeKomsats = scope === "national" ? komsats : scope === "korda" ? komsatsOfKorda(KORDA_ID) : komsats.filter((k) => k.unit_id === KOMSAT_ID);
  const scopeActive = scope === "national" ? totalActive : scope === "korda" ? activeOfKorda(KORDA_ID) : scopeKomsats[0].active_count;
  const completeness = statsByScope[scope].completeness;
  const lengkapPct = Math.round((completeness.lengkap / completeness.active_total) * 100);

  const initialBounds = useMemo(
    () => (scope === "national" ? JAPAN_BOUNDS : boundsOf(scopeKomsats.map((k) => [k.lat, k.lng]))),
    // The scope decides the initial fit; the bubbles above it are derived from the zoom level.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scope],
  );

  const bubbles = useMemo(() => scopedBubbles(scope, zoom), [scope, zoom]);

  // The map canvas remounts when the scope changes so the new bounds are applied.
  useEffect(() => {
    setZoom(scope === "national" ? 5 : scope === "korda" ? 8 : 11);
    setSelection(null);
    setExpanded(false);
  }, [scope]);

  const initialZoom = scope === "national" ? 5 : scope === "korda" ? 8 : 11;

  const select = (bubble: MapBubble) => {
    setSelection({ unit_id: bubble.unit_id, kind: bubble.kind, name: bubble.name });
    if (bubble.kind === "korda") {
      setFitRequest({ key: (fitRequest?.key ?? 0) + 1, bounds: boundsOf(komsatsOfKorda(bubble.unit_id).map((k) => [k.lat, k.lng])) });
    }
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

  /** The selection summary: the same numbers the map bubbles state. */
  const stats = (
    <div className="grid min-w-0 gap-2.5">
      <div>
        <p className="text-xs text-brand-muted">{kindLabel}</p>
        <p className="text-[13px] font-bold text-brand-ink">{selection?.name ?? scopeName}</p>
      </div>
      <div>
        <p className="text-xs text-brand-muted">Anggota aktif</p>
        <p className="text-lg font-extrabold tracking-tight text-brand-ink">{formatCount(selectedCount)}</p>
        {selection ? <p className="text-xs text-brand-muted">{share}% dari {formatCount(scopeActive)} anggota aktif</p> : null}
      </div>
      <button
        type="button"
        onClick={() => onOpenStats("anggota")}
        className="inline-flex w-fit items-center gap-1.5 rounded-md text-xs font-bold text-brand-red underline-offset-2 hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none max-[600px]:min-h-11 min-[600px]:min-h-8"
      >
        Lihat statistik anggota <IconArrowRight aria-hidden className="size-4" />
      </button>
    </div>
  );

  const footerItems: StatStripItem[] = (scope === "national"
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
        ]);

  return (
    <MapCardFrame
      title={title}
      description="Ketuk lingkaran untuk anggota aktif per wilayah. Data contoh di atas peta OpenStreetMap."
      panel={stats}
      footer={footerItems}
      chip={selection ? { label: selection.name, onClear: () => setSelection(null) } : undefined}
      expanded={expanded}
      onExpandChange={(value) => {
        setExpanded(value);
        setFitRequest(null);
      }}
      sheetSummary={selection ? `${selection.name}: ${formatCount(selectedCount)} anggota` : `${scopeName}: ${formatCount(scopeActive)} anggota aktif`}
      unmappedNote={
        scope !== "komsat" && unmapped.length > 0
          ? <>{unmapped.length} unit belum dipetakan ({formatCount(unmapped.reduce((sum, u) => sum + u.active_count, 0))} anggota): {unmapped.map((u) => u.name).join(", ")}.</>
          : undefined
      }
    >
      <Suspense fallback={<div className="flex size-full flex-col gap-3 bg-card p-4"><Skeleton aria-hidden="true" className="h-5 w-44" /><Skeleton aria-hidden="true" className="size-full" /></div>}>
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
    </MapCardFrame>
  );
}

/**
 * The level side card that production places beside the map, now below it: national sees the
 * Cakupan prefecture list, korda sees the disabled Klaim card, komsat sees the open queue.
 * The card shell, the rows and the notes come from `ppij-design-system`.
 */
export function MapSideCard({ scope, onOpenReview }: { scope: Scope; onOpenReview: () => void }) {
  if (scope === "national") {
    const coverage = coverageNational;
    return (
      <PanelCard
        title="Cakupan wilayah"
        description="Prefektur dengan anggota non-komsat dan peluang komsat baru."
        className="max-w-full"
      >
        <ul className="grid list-none">
          {coverage.prefectures.map((p) => (
            <li key={p.prefecture_code} className="border-t border-brand-border">
              <ListRow
                title={p.name_en}
                subtitle={p.state === "partial" ? "sebagian" : undefined}
                badge={p.candidate_new_komsat ? <Badge variant="secondary">Kandidat komsat</Badge> : null}
                trailing={<strong className="text-sm font-extrabold tabular-nums text-brand-ink">{formatCount(p.non_komsat_active)}</strong>}
              />
            </li>
          ))}
          <li className="border-t border-brand-border">
            <ListRow
              tone="muted"
              title="Total non-komsat aktif"
              trailing={<strong className="text-sm font-extrabold tabular-nums text-brand-ink">{formatCount(coverage.non_komsat_active)}</strong>}
            />
          </li>
        </ul>
      </PanelCard>
    );
  }
  if (scope === "korda") {
    return (
      <PanelCard title="Klaim wilayah" badge={<Badge variant="secondary">Segera hadir</Badge>}>
        <Callout tone="neutral">
          Prefektur dapat diklaim korda pada pembaruan berikutnya. Total non-komsat di Kanto: {formatCount(coverageKorda.non_komsat_active)} ({coverageKorda.prefectures.map((p) => `${p.name_en} ${formatCount(p.non_komsat_active)}`).join(", ")}).
        </Callout>
      </PanelCard>
    );
  }
  const stats = statsByScope.komsat;
  return (
    <PanelCard
      title="Antrean verifikasi"
      description="Pengajuan yang menunggu keputusan di Komsat Tokyo."
      action={<Button variant="ghost" size="sm" onClick={onOpenReview}>Buka Verifikasi <IconArrowRight aria-hidden className="size-4" /></Button>}
      badge={<Badge variant="secondary">{formatCount(stats.review.baru)}</Badge>}
    >
      <FactList
        variant="rows"
        items={(["baru", "dikirim_ulang", "diperiksa", "menunggu_anggota"] as const).map((tab) => ({
          label: tabLabelsShort[tab],
          value: formatCount(stats.review[tab]),
        }))}
      />
      <div className="mt-3">
        <Callout tone="success" density="compact" icon={<IconCircleCheck stroke={1.75} aria-hidden />}>
          Angka sama dengan lencana Verifikasi di navigasi.
        </Callout>
      </div>
    </PanelCard>
  );
}

const tabLabelsShort = {
  baru: "Baru",
  dikirim_ulang: "Dikirim ulang",
  diperiksa: "Sedang diperiksa",
  menunggu_anggota: "Menunggu anggota",
} as const;
