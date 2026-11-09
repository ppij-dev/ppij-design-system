import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "./button";
import { MapCard } from "./map-card";
import { Skeleton } from "./skeleton";

const meta: Meta<typeof MapCard> = {
  title: "Admin/MapCard",
  component: MapCard,
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    children: { control: false },
    panel: { control: false },
    panelLabel: { control: "text" },
    footer: { control: "object" },
    chip: { control: "object" },
    onExpandChange: { action: "expandChange" },
    expanded: { control: "boolean" },
    expandLabel: { control: "text" },
    collapseLabel: { control: "text" },
    sheetSummary: { control: "text" },
    unmappedNote: { control: "text" },
    loading: { control: "boolean" },
    loadingFallback: { control: false },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof MapCard>;

const BUBBLES = [
  { id: "u-tokyo", name: "Komsat Tokyo", count: 402, x: 62, y: 58, size: 84 },
  { id: "u-okayama", name: "Komsat Okayama", count: 214, x: 34, y: 62, size: 62 },
  { id: "u-yokohama", name: "Komsat Yokohama", count: 188, x: 58, y: 68, size: 58 },
  { id: "u-kyoto", name: "Komsat Kyoto", count: 96, x: 40, y: 66, size: 42 },
];

/**
 * Stands for the app's Leaflet canvas: `unit_id`, `name`, `lat`/`lng` and
 * `active_count` from `GET /v1/admin/coverage` drive these circles, and the real
 * map, the geography and the fit-to-scope behaviour stay in the app.
 */
function CanvasPlaceholder({ selectedId, onSelect }: { selectedId?: string; onSelect?: (id: string) => void }) {
  return (
    <div className="relative size-full">
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#eef2f6,#dfe7ee)]" />
      <p className="absolute top-3 left-3 text-[11px] font-bold tracking-[.1em] text-brand-muted">PLACEHOLDER PETA</p>
      {BUBBLES.map((bubble) => (
        <button
          key={bubble.id}
          type="button"
          onClick={() => onSelect?.(bubble.id)}
          aria-label={`${bubble.name}: ${bubble.count} anggota aktif`}
          data-selected={selectedId === bubble.id}
          style={{ left: `${bubble.x}%`, top: `${bubble.y}%`, width: bubble.size, height: bubble.size }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-brand-red text-[13px] font-bold text-white shadow-lg data-[selected=true]:ring-4 data-[selected=true]:ring-brand-red/40"
        >
          {bubble.count}
        </button>
      ))}
    </div>
  );
}

/** The selection summary body: the same numbers the map bubble states. */
function Panel({ name = "Komsat Tokyo", count = 402 }: { name?: string; count?: number }) {
  return (
    <>
      <p className="text-[13px] font-bold text-brand-ink">{name}</p>
      <dl className="mt-1.5 grid gap-1 text-xs text-brand-muted">
        <div className="flex items-baseline justify-between gap-3">
          <dt>Anggota aktif</dt>
          <dd className="font-bold text-brand-ink tabular-nums">{count}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt>Profil lengkap</dt>
          <dd className="font-bold text-brand-ink tabular-nums">76%</dd>
        </div>
      </dl>
      <Button size="sm" variant="outline" className="mt-2.5">Buka statistik</Button>
    </>
  );
}

const FOOTER = [
  { value: "12", label: "Koordinator daerah" },
  { value: "184", label: "Komsat aktif" },
  { value: "76%", label: "Profil lengkap" },
];

function Map({ selectedId, onSelect, ...rest }: Partial<React.ComponentProps<typeof MapCard>> & { selectedId?: string; onSelect?: (id: string) => void }) {
  const [selection, setSelection] = React.useState<string | undefined>(selectedId);
  return (
    <MapCard
      title="Cakupan nasional"
      description="Ketuk lingkaran untuk anggota aktif per wilayah. Angka per 2 November 2026."
      panel={<Panel name={BUBBLES.find((bubble) => bubble.id === selection)?.name ?? "Komsat Tokyo"} count={BUBBLES.find((bubble) => bubble.id === selection)?.count ?? 402} />}
      footer={FOOTER}
      chip={selection ? { label: BUBBLES.find((bubble) => bubble.id === selection)?.name ?? "", onClear: () => setSelection(undefined) } : undefined}
      {...rest}
    >
      <CanvasPlaceholder selectedId={selection} onSelect={setSelection} />
    </MapCard>
  );
}

/**
 * The card is uncontrolled, so a story that needs fullscreen opens it on mount.
 * The steps are clicked one at a time: the snap-sheet handle only exists after
 * the fullscreen toggle has rendered.
 */
function Expanded({ steps = "[data-slot=map-card] header button:last-child" }: { steps?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      for (const selector of steps.split("|")) {
        await new Promise((resolve) => window.setTimeout(resolve, 180));
        if (cancelled) return;
        ref.current?.querySelector<HTMLButtonElement>(selector)?.click();
      }
    };
    void run();
    return () => { cancelled = true; };
  }, [steps]);
  return <div ref={ref}><Map /></div>;
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "The dashboard hero at desktop width: the canvas fills the frame and the selection panel floats top right as an overlay. The canvas is the app's; the placeholder names the production contract it stands for. Heights step 420px at 900px and wider, 320px at 601-899px and 240px at 600px and below.",
      },
    },
  },
  render: () => <div className="max-w-5xl"><Map /></div>,
};

export const TabletInlinePanel: Story = {
  parameters: {
    docs: {
      description: {
        story: "Tablet width: the overlay is hidden and the panel becomes an inline bar under the canvas, which is why this story is captured at 760x900 as well as 390 and 1280. The panel stays before the footer in DOM order at every width.",
      },
    },
  },
  render: () => <div className="max-w-5xl"><Map /></div>,
};

export const PhoneSnapSheet: Story = {
  parameters: {
    docs: {
      description: {
        story: "A phone in fullscreen: the canvas fills the screen and the summary becomes a snap sheet at the bottom with its own handle toggle reporting `aria-expanded`. The handle's summary line states the selection and its count; opening it shows the same panel body.",
      },
    },
  },
  render: () => <Expanded steps="[data-slot=map-card] header button:last-child|[data-slot=map-sheet] button" />,
};

export const Fullscreen: Story = {
  parameters: { docs: { description: { story: "Fullscreen at desktop width: `position: fixed` over the whole viewport, the header's toggle reports `aria-expanded=\"true\"` and reads \"Tutup layar penuh\", and Escape closes it and returns focus to the toggle." } } },
  render: () => <Expanded />,
};

export const SelectedChip: Story = {
  parameters: { docs: { description: { story: "A selected unit: the chip names it and clears the selection, and its accessible name says what clearing does (`Hapus pilihan: Komsat Tokyo`) instead of relying on the X glyph." } } },
  render: () => <div className="max-w-5xl"><Map selectedId="u-tokyo" /></div>,
};

export const LongUnitNames: Story = {
  parameters: { docs: { description: { story: "Long unit names truncate in the chip, the panel and the footer labels instead of breaking the header row." } } },
  render: () => (
    <div className="max-w-5xl">
      <MapCard
        title="Cakupan Korda Kansai dengan nama wilayah yang panjang"
        description="Angka per 2 November 2026."
        panel={<Panel name="Komsat Okayama dengan nama lembaga yang sangat panjang" count={214} />}
        chip={{ label: "Komsat Okayama dengan nama lembaga yang sangat panjang", onClear: () => undefined }}
        footer={FOOTER}
      >
        <CanvasPlaceholder />
      </MapCard>
    </div>
  ),
};

export const Loading: Story = {
  parameters: { docs: { description: { story: "Loading: the app supplies its own fallback and the frame announces itself with `role=\"status\"`, so the card does not shift when the map arrives." } } },
  render: () => (
    <div className="max-w-5xl">
      <Map
        loading
        loadingFallback={
          <>
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-full w-full" />
          </>
        }
      />
    </div>
  ),
};

export const UnmappedNote: Story = {
  parameters: { docs: { description: { story: "The unmapped note: units without coordinates are stated in text rather than silently missing from the map." } } },
  render: () => (
    <div className="max-w-5xl">
      <Map unmappedNote="12 komsat belum punya koordinat dan tidak tampil di peta. Lengkapi di Organisasi." />
    </div>
  ),
};

export const ThreeItemFooter: Story = {
  parameters: { docs: { description: { story: "The footer is a `StatStrip` in its compact form, which is the same three-item value-over-label strip as before: 21px values, 12px labels, 18px below 600px." } } },
  render: () => (
    <div className="max-w-5xl">
      <MapCard title="Cakupan nasional" description="Angka per 2 November 2026" panel={<Panel />} footer={FOOTER}>
        <CanvasPlaceholder />
      </MapCard>
    </div>
  ),
};

export const NoFooter: Story = {
  parameters: { docs: { description: { story: "No footer and no chip: the frame ends after the panel, so a page can use the card without the strip." } } },
  render: () => (
    <div className="max-w-5xl">
      <MapCard title="Cakupan nasional" description="Angka per 2 November 2026" panel={<Panel />}>
        <CanvasPlaceholder />
      </MapCard>
    </div>
  ),
};

/** Holds the selection, the chip and fullscreen in state, so the Playground responds to the canvas and the controls. */
function PlaygroundMap({ title, description, panelLabel, footer, chip, expanded: initialExpanded, onExpandChange, expandLabel, collapseLabel, sheetSummary, unmappedNote, loading, className }: React.ComponentProps<typeof MapCard>) {
  const [selection, setSelection] = React.useState<string | undefined>("u-tokyo");
  const [expanded, setExpanded] = React.useState(initialExpanded ?? false);
  React.useEffect(() => setExpanded(initialExpanded ?? false), [initialExpanded]);
  const picked = BUBBLES.find((bubble) => bubble.id === selection);
  return (
    <MapCard
      title={title}
      description={description}
      panelLabel={panelLabel}
      footer={footer}
      chip={chip && picked ? { label: picked.name, onClear: () => setSelection(undefined) } : undefined}
      expanded={expanded}
      onExpandChange={(next) => { setExpanded(next); onExpandChange?.(next); }}
      expandLabel={expandLabel}
      collapseLabel={collapseLabel}
      sheetSummary={sheetSummary}
      unmappedNote={unmappedNote}
      loading={loading}
      className={className}
      panel={<Panel name={picked?.name ?? "Komsat Tokyo"} count={picked?.count ?? 402} />}
    >
      <CanvasPlaceholder selectedId={selection} onSelect={setSelection} />
    </MapCard>
  );
}

export const Playground: Story = {
  args: {
    title: "Cakupan nasional",
    description: "Ketuk lingkaran untuk anggota aktif per wilayah. Angka per 2 November 2026.",
    panelLabel: "Ringkasan peta",
    footer: FOOTER,
    chip: { label: "Komsat Tokyo", onClear: () => undefined },
    expanded: false,
    expandLabel: "Perbesar peta",
    collapseLabel: "Tutup layar penuh",
    sheetSummary: "Komsat Tokyo: 402 anggota aktif",
    loading: false,
  },
  render: (args) => (
    <div className="max-w-5xl">
      <PlaygroundMap {...args} />
    </div>
  ),
};
