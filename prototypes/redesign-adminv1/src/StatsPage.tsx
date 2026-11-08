import { useMemo, useState } from "react";
import { IconDownload, IconFilter, IconFilterOff, IconSearch, IconTrendingDown, IconTrendingUp, IconX } from "@tabler/icons-react";
import {
  Badge, BarChart, Button, Callout, DistributionBar, FactList, FilterChips, PageHeader, PanelCard,
  PieChart, SearchableMultiSelect, StatStrip, Table, TableBody, TableCell, TableHead, TableHeader,
  TableRow, Tabs, TabsList, TabsTrigger,
} from "ppij-design-system";
import { komsats, komsatsOfKorda, kordas, type Scope } from "./mapData";
import { coverageKorda, coverageNational, formatCount } from "./statsData";
import {
  countByMonth, countWithValue, distinctValues, emptyFilters, exportCsv, facetCounts, facetLabels,
  filterRows, monthLabel, rowsInScope, stateLabels,
  type FacetKey, type Filters, type WarehouseRow,
} from "./warehouseData";
import type { StatsTopic } from "./MapCard";

/**
 * The Statistik page as a data warehouse: one filterable dataset, facet menus over every
 * registration dimension, active-filter chips with per-value counts, aggregates that always
 * reflect the current filter set, and a client-side CSV export (Blob download, no server).
 * The workspace selector stays the scope root; production serves the same shape through the
 * facet query contract (docs/admin-integration/stats.md, gap 4), and member-level exports there
 * must run through the audited export contract (gap 5).
 */

const views: { id: StatsTopic; label: string }[] = [
  { id: "anggota", label: "Anggota" },
  { id: "verifikasi", label: "Verifikasi" },
  { id: "organisasi", label: "Organisasi" },
];

const facetOrder: FacetKey[] = [
  "state", "korda", "komsat", "degree", "field", "institution", "province",
  "funding", "source", "category", "completeness", "expiry", "card", "kind",
];

function FacetBars({ rows, filters, facet, title, limit = 6, footnote }: {
  rows: WarehouseRow[];
  filters: Filters;
  facet: FacetKey;
  title: string;
  limit?: number;
  footnote?: string;
}) {
  const counts = facetCounts(rows, filters, facet).slice(0, limit);
  const total = counts.reduce((sum, [, n]) => sum + n, 0) || 1;
  const rest = facetCounts(rows, filters, facet).length - counts.length;
  return (
    <PanelCard title={title} headingLevel={3}>
      <BarChart
        orientation="horizontal"
        data={counts.map(([value, count]) => ({ label: value, value: count, hint: `${value}: ${formatCount(count)}` }))}
        ariaLabel={`${title}, ${formatCount(total)} baris`}
      />
      {footnote ? <p className="stat-footnote">{footnote}</p> : <p className="stat-footnote">{rest > 0 ? `+${rest} nilai lain dalam data.` : "Dari data terfilter."}</p>}
    </PanelCard>
  );
}

function TrendFromRows({ rows, title }: { rows: WarehouseRow[]; title: string }) {
  const byMonth = countByMonth(rows);
  const last = byMonth[byMonth.length - 1]?.count ?? 0;
  const prev = byMonth[byMonth.length - 2]?.count ?? 0;
  const pct = prev > 0 ? Math.round(((last - prev) / prev) * 100) : 0;
  const up = pct >= 0;
  return (
    <PanelCard title={title} headingLevel={3}>
      <div className="mb-1">
        <div>
          <p className="trend-total">
            <strong>{formatCount(last)}</strong> {monthLabel("2026-10")}
            <Badge variant={up ? "success" : "destructive"}>
              {up ? <IconTrendingUp size={13} /> : <IconTrendingDown size={13} />} {up ? "Naik" : "Turun"} {Math.abs(pct)}%
            </Badge>
          </p>
        </div>
      </div>
      <BarChart
        data={byMonth.map(({ month, count }) => ({ label: monthLabel(month), value: count, hint: `${monthLabel(month)}: ${formatCount(count)}` }))}
        height={150}
        highlightLast
        ariaLabel={`${title}, April sampai Oktober 2026`}
      />
      <p className="stat-footnote">Produksi: GET /v1/admin/stats/timeseries (docs/admin-integration/stats.md, gap 1) — seri di sini dihitung dari data terfilter.</p>
    </PanelCard>
  );
}

export function StatsPage({ scope, scopeName, topic, onTopic }: {
  scope: Scope;
  scopeName: string;
  topic: StatsTopic;
  onTopic: (topic: StatsTopic) => void;
}) {
  const [filters, setFilters] = useState<Filters>(() => ({
    ...emptyFilters,
    // Q15: phones default the registration-period facet to the last 6 months; 12 months stays selectable.
    monthsBack: typeof window !== "undefined" && window.matchMedia("(max-width: 600px)").matches ? 6 : 0,
  }));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const scopedRows = useMemo(() => rowsInScope(scope), [scope]);
  const filtered = useMemo(() => filterRows(scopedRows, filters), [scopedRows, filters]);

  const setValue = (key: FacetKey, values: string[]) => setFilters((current) => ({ ...current, [key]: values }));
  const toggleValue = (key: FacetKey, value: string) =>
    setFilters((current) => {
      const selected = current[key].includes(value) ? current[key].filter((v) => v !== value) : [...current[key], value];
      return { ...current, [key]: selected };
    });
  const clearAll = () => setFilters({ ...emptyFilters });

  const activeFacets: [FacetKey, string][] = facetOrder.flatMap((key) => filters[key].map((value) => [key, value] as [FacetKey, string]));
  const activeCount = activeFacets.length + (filters.monthsBack > 0 ? 1 : 0);

  const rootKomsats = scope === "korda" ? komsatsOfKorda("u-kanto") : scope === "komsat" ? komsatsOfKorda("u-kanto").filter((k) => k.unit_id === "u-tokyo") : komsats;
  const facetKorda = filters.korda.length > 0 && scope === "national" ? kordas.filter((k) => filters.korda.includes(k.name)) : null;
  const komsatOptions = [...new Set((facetKorda ? facetKorda.flatMap((k) => komsatsOfKorda(k.unit_id)) : rootKomsats).map((k) => k.name.replace("Komsat ", "")))];

  const aktif = filtered.filter((r) => r.state === "aktif");
  const pending = filtered.filter((r) => r.state !== "aktif");
  const avgWaiting = pending.length > 0 ? pending.reduce((sum, r) => sum + r.daysWaiting, 0) / pending.length : null;
  const completeness = facetCounts(filtered, filters, "completeness");
  const completenessMap = new Map(completeness);
  const cLengkap = completenessMap.get("Lengkap") ?? 0;
  const cBelum = completenessMap.get("Belum lengkap") ?? 0;
  const cAktivasi = completenessMap.get("Belum aktivasi") ?? 0;
  const cTotal = cLengkap + cBelum + cAktivasi || 1;

  const exportNow = () => {
    const date = "20261031";
    exportCsv(filtered, `statistik-ppiij-${scope}-${topic}-${date}.csv`);
  };

  const renderFacet = (key: FacetKey) => {
    if (key === "korda" && scope !== "national") return null;
    if (key === "komsat" && scope === "komsat") return null;
    const options = key === "komsat"
      ? komsatOptions
      : key === "state"
        ? Object.values(stateLabels)
        : key === "funding"
          ? ["Mandiri", "Beasiswa swasta", "Beasiswa Jepang (MEXT)", "Beasiswa lokal"]
          : distinctValues(scopedRows, key as Exclude<FacetKey, "months" | "funding" | "state" | "korda" | "komsat">);
    const counts = new Map(facetCounts(scopedRows, { ...filters, [key]: [] }, key));
    return (
      <div key={key} className="warehouse-facet">
        <SearchableMultiSelect
          compact
          label={facetLabels[key]}
          allLabel={`Semua ${facetLabels[key].toLowerCase()}`}
          values={filters[key]}
          options={options}
          onChange={(values) => setValue(key, values)}
        />
        <p className="warehouse-facet-counts">
          {options.slice(0, 3).map((option) => `${option} ${formatCount(counts.get(option) ?? 0)}`).join(" · ")}
        </p>
      </div>
    );
  };

  return <PanelCard padding="page" className="grid gap-0 stats-page">
    <PageHeader
      title="Statistik"
      description={`Gudang data ${scopeName}: saring bebas, baca agregatnya, unduh sebagai CSV. Setiap angka mengikuti filter aktif.`}
      actions={
        <div className="stats-header-actions">
          <Button size="sm" variant="outline" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}>
            <IconFilter size={16} /> Filter{activeCount > 0 ? ` (${activeCount})` : ""}
          </Button>
          <Button size="sm" onClick={exportNow} disabled={filtered.length === 0}>
            <IconDownload size={16} /> Unduh CSV ({formatCount(filtered.length)})
          </Button>
        </div>
      }
    />

    <div className="warehouse-toolbar">
      <Tabs value={topic} onValueChange={(next) => onTopic(next as StatsTopic)}>
        <TabsList appearance="underline" aria-label="Tampilan statistik">
          {views.filter((v) => v.id !== "organisasi" || scope !== "komsat").map((v) => (
            <TabsTrigger key={v.id} value={v.id}>{v.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>

    {filtersOpen ? (
      <details className="warehouse-panel" open>
        <summary>Dimensi data <span>14 facet · produksi memakai kontrak gudang data (stats.md, gap 4)</span></summary>
        <div className="warehouse-facets">
          {facetOrder.map(renderFacet)}
          <div className="warehouse-facet">
            <span className="warehouse-facet-label">Bulan pendaftaran</span>
            <div className="filter-pills">
              {([0, 3, 6, 12] as const).map((value) => (
                <button
                  key={value}
                  className={filters.monthsBack === value ? "active" : ""}
                  aria-pressed={filters.monthsBack === value}
                  onClick={() => setFilters((current) => ({ ...current, monthsBack: value }))}
                >
                  {value === 0 ? "Semua" : `${value} bulan`}
                </button>
              ))}
            </div>
            <p className="warehouse-facet-counts">Rentang dihitung dari Oktober 2026.</p>
          </div>
        </div>
      </details>
    ) : null}

    {activeCount > 0 ? (
      <FilterChips
        label="Filter aktif"
        clearAllLabel="Reset semua"
        chips={[
          ...(filters.monthsBack > 0 ? [{ label: `${filters.monthsBack} bulan terakhir`, value: "monthsBack", onRemove: () => setFilters((current) => ({ ...current, monthsBack: 0 })) }] : []),
          ...activeFacets.map(([key, value]) => ({
            label: `${facetLabels[key]}: ${value}`,
            value: `${key}:${value}`,
            count: countWithValue(scopedRows, filters, key, value),
            onRemove: () => toggleValue(key, value),
          })),
        ]}
        onClearAll={clearAll}
      />
    ) : null}

    <StatStrip
      label="Total gudang data"
      className="mb-4"
      items={[
        { value: formatCount(filtered.length), label: "Baris data" },
        { value: formatCount(aktif.length), label: "Anggota aktif" },
        { value: formatCount(pending.length), label: "Menunggu verifikasi" },
        { value: formatCount(aktif.filter((r) => r.registered === "2026-10").length), label: "Baru bulan ini" },
        { value: formatCount(aktif.filter((r) => r.card === "Kartu aktif").length), label: "Kartu aktif" },
        ...(avgWaiting !== null ? [{ value: new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(avgWaiting), label: "Hari menunggu (rata-rata)" }] : []),
      ]}
    />

    {topic === "anggota" ? (
      <>
        <div className="stats-grid-two">
          <TrendFromRows rows={filtered} title="Pendaftaran per bulan" />
          <PanelCard title="Kelengkapan & aktivasi" headingLevel={3} badge={<Badge variant="secondary">{formatCount(cTotal)} baris</Badge>}>
            <DistributionBar
              size="md"
              legend="list"
              className="[&>div]:h-[18px]"
              segments={[
                { label: "Lengkap", value: cLengkap, color: "#1E7A46" },
                { label: "Belum lengkap", value: cBelum, color: "#E2A02B" },
                { label: "Belum aktivasi", value: cAktivasi, color: "#8A9099" },
              ]}
              ariaLabel={`Kelengkapan data, ${formatCount(cTotal)} baris terfilter`}
            />
            <p className="stat-footnote">Agregat lintas facet dihitung dari baris terfilter; produksi memakai kontrak gudang data (stats.md, gap 4).</p>
          </PanelCard>
          <PanelCard title="Anggota Biasa vs Luar Biasa" headingLevel={3}>
            <PieChart
              data={facetCounts(filtered, filters, "category").map(([label, value]) => ({ label, value }))}
              maxSlices={2}
              ariaLabel={`Komposisi kategori anggota, ${formatCount(filtered.length)} baris terfilter`}
            />
            <p className="stat-footnote">Produksi: field kategori dari GET /v1/admin/anggota. "Jenis kelamin" belum punya field di data contoh ini, jadi ceritanya ada di Storybook (Admin/PieChart), sesuai keputusan pemilik.</p>
          </PanelCard>
        </div>
        <div className="stats-grid-two">
          <FacetBars rows={filtered} filters={filters} facet="degree" title="Jenjang pendidikan" limit={7} />
          <FacetBars rows={filtered} filters={filters} facet="field" title="Bidang studi" limit={7} />
          <FacetBars rows={filtered} filters={filters} facet="funding" title="Pembiayaan" limit={4} footnote="Satu anggota dapat memiliki lebih dari satu sumber pembiayaan." />
          <FacetBars rows={filtered} filters={filters} facet="province" title="Provinsi asal" limit={7} />
          <FacetBars rows={filtered} filters={filters} facet="institution" title="Institusi" limit={8} />
          <FacetBars rows={filtered} filters={filters} facet="source" title="Sumber pendaftaran" limit={3} />
        </div>
      </>
    ) : null}

    {topic === "verifikasi" ? (
      <>
        <div className="stats-grid-two">
          <TrendFromRows rows={filtered.filter((r) => r.state !== "aktif")} title="Pengajuan masuk per bulan" />
          <FacetBars rows={filtered} filters={filters} facet="state" title="Status antrean" limit={5} footnote="Produksi: GET /v1/admin/review counts per tab." />
        </div>
        <div className="stats-grid-two">
          <FacetBars rows={filtered} filters={filters} facet="kind" title="Jenis pengajuan" limit={3} />
          <FacetBars rows={filtered} filters={filters} facet="komsat" title="Antrean per komsat" limit={8} />
        </div>
        <section className="stat-card" aria-label="Kinerja verifikasi komsat">
          <div className="stat-card-head">
            <div>
              <h3>Kinerja verifikasi komsat</h3>
              <p className="trend-total">Rata-rata hari menunggu: <strong>{avgWaiting === null ? "—" : new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(avgWaiting)}</strong></p>
            </div>
          </div>
          <div className="warehouse-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Komsat</TableHead>
                  <TableHead>Aktif</TableHead>
                  <TableHead>Menunggu</TableHead>
                  <TableHead>Rata-rata hari</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...new Set(filtered.map((r) => r.komsat))].map((komsatName) => {
                  const kRows = filtered.filter((r) => r.komsat === komsatName);
                  const kPending = kRows.filter((r) => r.state !== "aktif");
                  const kAvg = kPending.length > 0 ? kPending.reduce((sum, r) => sum + r.daysWaiting, 0) / kPending.length : null;
                  return (
                    <TableRow key={komsatName}>
                      <TableCell><strong>{komsatName}</strong></TableCell>
                      <TableCell>{formatCount(kRows.filter((r) => r.state === "aktif").length)}</TableCell>
                      <TableCell>{formatCount(kPending.length)}</TableCell>
                      <TableCell>{kAvg === null ? "—" : new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(kAvg)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <p className="stat-footnote">Produksi: operations rows dari GET /v1/admin/dashboard; agregat lintas facet di sini memakai kontrak gudang data (stats.md, gap 4).</p>
        </section>
      </>
    ) : null}

    {topic === "organisasi" && scope !== "komsat" ? (
      <div className="stats-grid-two">
        <section className="stat-card" aria-label="Ringkasan organisasi">
          <div className="stat-card-head">
            <div>
              <h3>Anggota per {scope === "national" ? "korda" : "komsat"}</h3>
              <p className="trend-total">{formatCount(filtered.length)} baris terfilter</p>
            </div>
          </div>
          <div className="warehouse-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit</TableHead>
                  <TableHead>Aktif</TableHead>
                  <TableHead>Menunggu</TableHead>
                  <TableHead>% Lengkap</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(scope === "national" ? kordas.map((k) => k.name) : ["Korda Kanto"]).flatMap((kordaName) => {
                  const groupRows = filtered.filter((r) => r.korda === kordaName);
                  if (scope === "national") {
                    const kAktif = groupRows.filter((r) => r.state === "aktif");
                    const lengkap = kAktif.filter((r) => r.completeness === "Lengkap").length;
                    return [<TableRow key={kordaName}>
                      <TableCell><strong>{kordaName}</strong></TableCell>
                      <TableCell>{formatCount(kAktif.length)}</TableCell>
                      <TableCell>{formatCount(groupRows.filter((r) => r.state !== "aktif").length)}</TableCell>
                      <TableCell>{kAktif.length > 0 ? `${Math.round((lengkap / kAktif.length) * 100)}%` : "—"}</TableCell>
                    </TableRow>];
                  }
                  return komsatsOfKorda("u-kanto").map((k) => {
                    const komsatName = k.name.replace("Komsat ", "");
                    const kRows = groupRows.filter((r) => r.komsat === komsatName);
                    const kAktif = kRows.filter((r) => r.state === "aktif");
                    const lengkap = kAktif.filter((r) => r.completeness === "Lengkap").length;
                    return <TableRow key={komsatName}>
                      <TableCell><strong>{komsatName}</strong></TableCell>
                      <TableCell>{formatCount(kAktif.length)}</TableCell>
                      <TableCell>{formatCount(kRows.filter((r) => r.state !== "aktif").length)}</TableCell>
                      <TableCell>{kAktif.length > 0 ? `${Math.round((lengkap / kAktif.length) * 100)}%` : "—"}</TableCell>
                    </TableRow>;
                  });
                })}
              </TableBody>
            </Table>
          </div>
          <p className="stat-footnote">Pohon unit dari GET /v1/admin/units; anggota per unit juga tersedia di GET /v1/admin/map.</p>
        </section>
        <section className="stat-card" aria-label="Cakupan wilayah">
          <div className="stat-card-head">
            <div>
              <h3>Cakupan wilayah</h3>
              <p className="trend-total"><strong>{formatCount((scope === "national" ? coverageNational : coverageKorda).non_komsat_active)}</strong> anggota non-komsat aktif</p>
            </div>
          </div>
          <ul className="coverage-list">
            {(scope === "national" ? coverageNational : coverageKorda).prefectures.map((p) => (
              <li key={p.prefecture_code}>
                <span>{p.name_en}{p.state === "partial" ? <small>sebagian</small> : null}{p.candidate_new_komsat ? <Badge variant="secondary">Kandidat komsat</Badge> : null}</span>
                <strong>{formatCount(p.non_komsat_active)}</strong>
              </li>
            ))}
          </ul>
          <p className="stat-footnote">Produksi: coverage dari GET /v1/admin/dashboard; klaim wilayah menyusul (1.x).</p>
        </section>
      </div>
    ) : null}
  </PanelCard>;
}
