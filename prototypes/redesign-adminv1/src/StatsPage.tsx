import { useMemo, useState } from "react";
import { IconArrowRight, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge, PageHeader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "ppij-design-system";
import { komsats, komsatsOfKorda, kordas, type Scope } from "./mapData";
import {
  coverageKorda, coverageNational, formatCount, formatDays, statsByScope, tabLabels, trendFor,
  type Tab, type TrendKey, type TrendSeries,
} from "./statsData";
import { SearchableMultiSelect } from "./SearchableMultiSelect";
import type { StatsTopic } from "./MapCard";

/**
 * The single Statistik page. The topic arrives as a parameter (dashboard figures deep-link into
 * it) and switches in place; the workspace selector stays the scope filter, matching production's
 * `?scope=` semantics. Trends render the synthetic series and carry the production contract
 * footnote (docs/admin-integration/stats.md); distributions behind an active komsat filter note
 * the re-aggregation gap instead of pretending to be filtered.
 */

const topics: { id: StatsTopic; label: string }[] = [
  { id: "anggota", label: "Anggota" },
  { id: "verifikasi", label: "Verifikasi" },
  { id: "organisasi", label: "Organisasi" },
];

function TrendCard({ title, series, keys, footnote }: {
  title: string;
  series: TrendSeries;
  keys: { key: TrendKey; label: string; className: string }[];
  footnote?: string;
}) {
  const rows = series.labels.map((label, i) => ({ label, values: keys.map((k) => series[k.key][i]) }));
  const max = Math.max(1, ...rows.flatMap((row) => row.values));
  const head = keys[0];
  const last = series[head.key][series[head.key].length - 1];
  const prev = series[head.key][series[head.key].length - 2];
  const pct = prev > 0 ? Math.round(((last - prev) / prev) * 100) : 0;
  const up = pct >= 0;
  return (
    <section className="stat-card trend-card" aria-label={title}>
      <div className="stat-card-head">
        <div>
          <h3>{title}</h3>
          <p className="trend-total">
            <strong>{formatCount(last)}</strong> bulan terakhir
            <Badge variant={up ? "success" : "destructive"}>
              {up ? <IconTrendingUp size={13} /> : <IconTrendingDown size={13} />} {up ? "Naik" : "Turun"} {Math.abs(pct)}%
            </Badge>
          </p>
        </div>
        <div className="trend-legend" aria-hidden="true">
          {keys.map((k) => (
            <span key={k.key}><i className={k.className} /> {k.label}</span>
          ))}
        </div>
      </div>
      <div className="trend-chart" role="img" aria-label={`${title}, ${rows.length} bulan terakhir`}>
        {rows.map((row) => (
          <div className="trend-col" key={row.label}>
            <div className="trend-bars">
              {row.values.map((value, i) => (
                <i key={i} className={keys[i].className} style={{ height: `${Math.max(6, (value / max) * 100)}%` }} title={`${keys[i].label}: ${formatCount(value)}`} />
              ))}
            </div>
            <span>{row.label}</span>
          </div>
        ))}
      </div>
      {footnote ? <p className="stat-footnote">{footnote}</p> : null}
    </section>
  );
}

function DistributionCard({ title, distribution, note }: { title: string; distribution: { items: { key: string; label: string; count: number }[]; other: number; unknown: number }; note?: string }) {
  const items = [...distribution.items].sort((a, b) => b.count - a.count).slice(0, 5);
  const max = Math.max(1, ...items.map((i) => i.count));
  const rest = distribution.other + distribution.unknown + distribution.items.slice(5).reduce((sum, i) => sum + i.count, 0);
  return (
    <section className="stat-card" aria-label={title}>
      <div className="stat-card-head"><h3>{title}</h3></div>
      <ul className="dist-list">
        {items.map((item) => (
          <li key={item.key}>
            <span>{item.label}</span>
            <div aria-hidden="true"><i style={{ width: `${(item.count / max) * 100}%` }} /></div>
            <strong>{formatCount(item.count)}</strong>
          </li>
        ))}
        {rest > 0 ? (
          <li className="dist-rest">
            <span>Lainnya / tidak diisi</span>
            <div aria-hidden="true" />
            <strong>{formatCount(rest)}</strong>
          </li>
        ) : null}
      </ul>
      {note ? <p className="stat-footnote">{note}</p> : null}
    </section>
  );
}

export function StatsPage({ scope, scopeName, topic, onTopic }: {
  scope: Scope;
  scopeName: string;
  topic: StatsTopic;
  onTopic: (topic: StatsTopic) => void;
}) {
  const [range, setRange] = useState<6 | 12>(6);
  const [komsatFilter, setKomsatFilter] = useState<string[]>([]);
  const stats = statsByScope[scope];
  const series = useMemo(() => trendFor(range), [range]);
  const visibleTopics = topics.filter((t) => t.id !== "organisasi" || scope !== "komsat");
  const activeTopic = visibleTopics.some((t) => t.id === topic) ? topic : "anggota";
  const scopeKomsatNames = (scope === "national" ? komsats : komsatsOfKorda("u-kanto")).map((k) => k.name.replace("Komsat ", ""));
  const filtered = komsatFilter.length > 0;
  const trendFootnote = "Seri contoh. Kontrak produksi: GET /v1/admin/stats/timeseries — lihat docs/admin-integration/stats.md.";

  return <div className="verification-page-island stats-page">
    <PageHeader title="Statistik" description={`Angka terperinci untuk ${scopeName}. Setiap topik memakai metrik dasbor produksi; tren memakai seri contoh.`} />
    <div className="stats-toolbar">
      <div className="tabs stats-tabs" role="tablist" aria-label="Topik statistik">
        {visibleTopics.map((t) => (
          <button key={t.id} role="tab" aria-selected={activeTopic === t.id} className={activeTopic === t.id ? "selected" : ""} onClick={() => onTopic(t.id)}>{t.label}</button>
        ))}
      </div>
      <div className="stats-controls">
        {scope !== "komsat" ? (
          <SearchableMultiSelect
            compact
            label="Komsat"
            values={komsatFilter}
            allLabel="Semua komsat"
            options={scopeKomsatNames}
            onChange={setKomsatFilter}
          />
        ) : null}
        <div className="filter-pills" aria-label="Rentang waktu tren">
          {([6, 12] as const).map((value) => (
            <button key={value} className={range === value ? "active" : ""} aria-pressed={range === value} onClick={() => setRange(value)}>{value} bulan</button>
          ))}
        </div>
      </div>
    </div>

    {activeTopic === "anggota" ? (
      <>
        <div className="stats-grid-two">
          <TrendCard title="Anggota baru per bulan" series={series} keys={[{ key: "new", label: "Anggota baru", className: "trend-red" }]} footnote={trendFootnote} />
          <section className="stat-card" aria-label="Kelengkapan data">
            <div className="stat-card-head">
              <div>
                <h3>Kelengkapan data</h3>
                <p className="trend-total"><strong>{formatCount(stats.completeness.active_total)}</strong> anggota aktif</p>
              </div>
            </div>
            <div className="completeness-stack" role="img" aria-label={`Lengkap ${formatCount(stats.completeness.lengkap)}, belum lengkap ${formatCount(stats.completeness.belum_lengkap)}, belum aktivasi ${formatCount(stats.completeness.belum_aktivasi)}`}>
              <i style={{ width: `${(stats.completeness.lengkap / stats.completeness.active_total) * 100}%`, background: "#1E7A46" }} />
              <i style={{ width: `${(stats.completeness.belum_lengkap / stats.completeness.active_total) * 100}%`, background: "#E2A02B" }} />
              <i style={{ width: `${(stats.completeness.belum_aktivasi / stats.completeness.active_total) * 100}%`, background: "#8A9099" }} />
            </div>
            <ul className="completeness-legend">
              <li><i style={{ background: "#1E7A46" }} /> Lengkap <strong>{formatCount(stats.completeness.lengkap)}</strong></li>
              <li><i style={{ background: "#E2A02B" }} /> Belum lengkap <strong>{formatCount(stats.completeness.belum_lengkap)}</strong></li>
              <li><i style={{ background: "#8A9099" }} /> Belum aktivasi <strong>{formatCount(stats.completeness.belum_aktivasi)}</strong></li>
            </ul>
            <p className="stat-footnote">Produksi: tiles dan completeness dari GET /v1/admin/dashboard.</p>
          </section>
        </div>
        <div className="stats-grid-two">
          <DistributionCard title="Jenjang pendidikan" distribution={stats.distributions.degree_level} note={filtered ? "Pemfilteran per komsat menunggu API agregasi (docs/admin-integration/stats.md)." : undefined} />
          <DistributionCard title="Bidang studi" distribution={stats.distributions.study_field} />
          <DistributionCard title="Pembiayaan" distribution={stats.distributions.funding} note="Anggota dapat memiliki lebih dari satu sumber pembiayaan." />
          <DistributionCard title="Provinsi asal" distribution={stats.distributions.origin_province} />
        </div>
      </>
    ) : null}

    {activeTopic === "verifikasi" ? (
      <>
        <div className="stats-grid-two">
          <TrendCard
            title="Pengajuan dan keputusan"
            series={series}
            keys={[
              { key: "submissions", label: "Masuk", className: "trend-soft" },
              { key: "approvals", label: "Disetujui", className: "trend-red" },
            ]}
            footnote={trendFootnote}
          />
          <section className="stat-card" aria-label="Antrean per tab">
            <div className="stat-card-head">
              <div>
                <h3>Antrean per tab</h3>
                <p className="trend-total"><strong>{formatCount(stats.tiles.pending_verification)}</strong> menunggu verifikasi</p>
              </div>
            </div>
            <ul className="dist-list">
              {(Object.keys(tabLabels) as Tab[]).map((tab) => {
                const max = Math.max(1, ...Object.values(stats.review));
                return (
                  <li key={tab}>
                    <span>{tabLabels[tab]}</span>
                    <div aria-hidden="true"><i style={{ width: `${(stats.review[tab] / max) * 100}%` }} /></div>
                    <strong>{formatCount(stats.review[tab])}</strong>
                  </li>
                );
              })}
            </ul>
            <p className="stat-footnote">Produksi: GET /v1/admin/review counts per tab.</p>
          </section>
        </div>
        {scope !== "komsat" ? (
          <section className="stat-card" aria-label="Kinerja verifikasi komsat">
            <div className="stat-card-head">
              <div>
                <h3>Kinerja verifikasi komsat</h3>
                <p className="trend-total">Rata-rata 90 hari terakhir: <strong>{stats.avg_review_days_90d === null ? "—" : formatDays(stats.avg_review_days_90d)}</strong></p>
              </div>
            </div>
            <div className="table-section">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Komsat</TableHead>
                    <TableHead>Aktif</TableHead>
                    <TableHead>Antrean</TableHead>
                    <TableHead>Rata-rata</TableHead>
                    <TableHead>Admin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(scope === "national" ? komsats : komsatsOfKorda("u-kanto"))
                    .filter((k) => !filtered || komsatFilter.includes(k.name.replace("Komsat ", "")))
                    .map((k) => (
                      <TableRow key={k.unit_id} className={k.no_admin ? "ops-row-warn" : ""}>
                        <TableCell><strong>{k.name.replace("Komsat ", "")}</strong></TableCell>
                        <TableCell>{formatCount(k.active_count)}</TableCell>
                        <TableCell>{formatCount(k.queue_count)}</TableCell>
                        <TableCell>{k.avg_review_days_90d === null ? "—" : formatDays(k.avg_review_days_90d)}</TableCell>
                        <TableCell>
                          {k.no_admin ? <Badge variant="warning">Tanpa admin</Badge> : k.admin_name ?? (k.admin_others > 0 ? `${k.admin_others} admin lainnya` : "—")}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <p className="stat-footnote">Produksi: operations rows dari GET /v1/admin/dashboard (korda dan nasional).</p>
          </section>
        ) : null}
      </>
    ) : null}

    {activeTopic === "organisasi" && scope !== "komsat" ? (
      <div className="stats-grid-two">
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
        <section className="stat-card" aria-label="Ringkasan organisasi">
          <div className="stat-card-head">
            <div>
              <h3>Ringkasan organisasi</h3>
              <p className="trend-total">{scope === "national" ? <><strong>{formatCount(kordas.length)}</strong> korda · <strong>{formatCount(komsats.length)}</strong> komsat aktif</> : <><strong>{formatCount(komsatsOfKorda("u-kanto").length)}</strong> komsat aktif</>}</p>
            </div>
            <Badge variant="secondary">Klaim wilayah: segera hadir</Badge>
          </div>
          <p className="stat-footnote">Produksi: GET /v1/admin/map (unit aktif) dan tiles.active_komsats; pohon unit dari GET /v1/admin/units.</p>
          <p className="stat-card-link">Kelola unit di halaman Organisasi <IconArrowRight size={14} /></p>
        </section>
      </div>
    ) : null}
  </div>;
}
