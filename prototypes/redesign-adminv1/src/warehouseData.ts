import { kordas, komsatsOfKorda, unmapped } from "./mapData";
import type { Scope } from "./mapData";

/**
 * The Statistik warehouse: one deterministic, seed-generated row per membership or open
 * registration, so every facet, aggregate, and CSV export can cross-filter for real. Quotas are
 * tied to the dashboard figures: aktif rows per komsat equal the map counts, completeness and
 * degree/field/province splits match the curated distributions, review states match the queue
 * counts, and the declared-contract card figures (docs/admin-integration/stats.md, gap 3) hold.
 * Production serves this through the facet query contract (stats.md, gap 4); nothing here talks
 * to a server.
 */

export type WarehouseState =
  | "aktif"
  | "baru"
  | "dikirim_ulang"
  | "diperiksa"
  | "menunggu_anggota";

export interface WarehouseRow {
  id: string;
  name: string;
  state: WarehouseState;
  korda: string;
  komsat: string;
  degree: string;
  field: string;
  institution: string;
  major: string;
  province: string;
  funding: string[];
  source: string;
  category: string;
  completeness: string;
  expiry: string;
  card: string;
  kind: string;
  registered: string;
  daysWaiting: number;
}

export const stateLabels: Record<WarehouseState, string> = {
  aktif: "Anggota aktif",
  baru: "Baru",
  dikirim_ulang: "Dikirim ulang",
  diperiksa: "Sedang diperiksa",
  menunggu_anggota: "Menunggu anggota",
};

export const MONTHS = ["2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"];
export const monthLabel = (month: string) => {
  const names = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const [, m] = month.split("-");
  return names[Number(m) - 1] + " " + month.slice(2, 4);
};

const UNMAPPED_KORDA = "Belum dipetakan";

/* --- deterministic randomness ---------------------------------------------------------- */

function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Largest-remainder split of `total` across `weights`, returning integers that sum to total. */
function allocate(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const raw = weights.map((w) => (w / sum) * total);
  const base = raw.map((r) => Math.floor(r));
  let rest = total - base.reduce((a, b) => a + b, 0);
  const order = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac);
  for (const { i } of order) {
    if (rest <= 0) break;
    base[i] += 1;
    rest -= 1;
  }
  return base;
}

/* --- curated quota tables (they mirror the dashboard distributions and tiles) ----------- */

type Quotas = [string, number][];

const degreeNational: Quotas = [["S1", 714], ["S2", 418], ["S3", 89], ["D3", 45], ["D2", 13], ["Lainnya", 18], ["Tidak diisi", 8]];
const degreeKanto: Quotas = [["S1", 261], ["S2", 128], ["S3", 24], ["D3", 18], ["Lainnya", 12], ["Tidak diisi", 9]];
const fieldNational: Quotas = [["Teknik", 391], ["Ekonomi & Bisnis", 301], ["Ilmu Sosial", 217], ["Kesehatan", 161], ["Seni", 95], ["Lainnya", 92], ["Tidak diisi", 48]];
const fieldKanto: Quotas = [["Teknik", 148], ["Ekonomi & Bisnis", 102], ["Ilmu Sosial", 74], ["Kesehatan", 55], ["Lainnya", 45], ["Tidak diisi", 28]];
const provinceNational: Quotas = [["Jawa Barat", 437], ["DKI Jakarta", 356], ["Jawa Tengah", 201], ["Jawa Timur", 148], ["Banten", 70], ["Lainnya", 63], ["Tidak diisi", 30]];
const provinceKanto: Quotas = [["Jawa Barat", 152], ["DKI Jakarta", 118], ["Jawa Tengah", 71], ["Jawa Timur", 49], ["Banten", 26], ["Lainnya", 24], ["Tidak diisi", 12]];
const completenessNational: Quotas = [["Lengkap", 966], ["Belum lengkap", 246], ["Belum aktivasi", 93]];
const completenessKanto: Quotas = [["Lengkap", 357], ["Belum lengkap", 68], ["Belum aktivasi", 27]];
const cardNational = 1102;
const cardKanto = 390;
const expiringNational = 23;
const expiringKanto = 9;
const newMonthNational = 48;
const newMonthKanto = 17;
const reviewStates: [WarehouseState, number][] = [["baru", 37], ["dikirim_ulang", 9], ["diperiksa", 11], ["menunggu_anggota", 6]];
const reviewKanto: [WarehouseState, number][] = [["baru", 12], ["dikirim_ulang", 3], ["diperiksa", 4], ["menunggu_anggota", 2]];

const fundingPrimary: Quotas = [["Mandiri", 712], ["Beasiswa swasta", 295], ["Beasiswa Jepang (MEXT)", 146], ["Beasiswa lokal", 98]];
const sources = ["Undangan pengurus", "Pendaftaran mandiri", "Pra-verifikasi"];
const categories: Quotas = [["BIASA", 1018], ["LUAR_BIASA", 182], ["Tidak ditentukan", 105]];
const kinds: Quotas = [["Pendaftaran", 55], ["Perpanjangan", 35], ["Perubahan data", 10]];
const expiringBuckets: Quotas = [["≤ 30 hari", 9], ["31–60 hari", 14]];

const institutions = [
  "Universitas Tokyo", "Waseda University", "Keio University", "Universitas Kyoto", "Osaka University",
  "Nagoya University", "Tsukuba University", "Kyushu University", "Hokkaido University", "Kobe University",
  "Institut Teknologi Tokyo", "Rikkyo University", "Chiba University",
];
const majorsByField: Record<string, string[]> = {
  Teknik: ["Ilmu Komputer", "Teknik Mesin", "Teknik Sipil", "Teknik Elektro", "Arsitektur"],
  "Ekonomi & Bisnis": ["Manajemen", "Akuntansi", "Ekonomi Pembangunan", "Bisnis Internasional"],
  "Ilmu Sosial": ["Hubungan Internasional", "Sosiologi", "Ilmu Politik", "Kajian Jepang"],
  Kesehatan: ["Kedokteran", "Farmasi", "Keperawatan", "Kesehatan Masyarakat"],
  Seni: ["Seni Rupa", "Desain Komunikasi Visual", "Musik"],
  Lainnya: ["Pendidikan", "Hukum", "Pertanian"],
  "Tidak diisi": [],
};
const firstNames = ["Adinda", "Bagas", "Citra", "Dimas", "Eka", "Fajar", "Gita", "Hana", "Iqbal", "Joko", "Kirana", "Lutfi", "Maya", "Nadia", "Oscar", "Putri", "Rizky", "Sari", "Taufik", "Umar", "Vina", "Wahyu", "Yoga", "Zahra", "Bima", "Dewi", "Fahri", "Intan", "Kevin", "Laras"];
const lastNames = ["Saputra", "Wijaya", "Lestari", "Pratama", "Utami", "Santoso", "Maulana", "Anggraini", "Firmansyah", "Puspita", "Hidayat", "Rahayu", "Nugroho", "Kusuma", "Handayani", "Setiawan", "Maharani", "Gunawan", "Permata", "Ramadhan", "Safitri", "Wibowo", "Cahyani", "Halim", "Simanjuntak", "Barus", "Tanjung", "Siregar", "Nainggolan", "Simbolon"];

/** Quota table for one group of rows: the curated Kanto split, else a proportional split of the national remainder. */
function quotasForGroup(group: string, national: Quotas, kanto: Quotas, total: number): Quotas {
  if (group === "Korda Kanto") return kanto;
  const rest = national.map(([label, n]): [string, number] => [label, Math.max(0, n - (kanto.find(([k]) => k === label)?.[1] ?? 0))]);
  const parts = allocate(Math.max(0, total), rest.map(([, n]) => n));
  return rest.map(([label], i): [string, number] => [label, parts[i]]).filter(([, n]) => n > 0);
}

/** Weighted draw over the remaining quota — final counts match the pool sizes exactly. */
function poolPick(pools: { value: string; left: number }[], rand: () => number): string {
  const open = pools.filter((p) => p.left > 0);
  let roll = rand() * open.reduce((sum, p) => sum + p.left, 0);
  for (const pool of open) {
    roll -= pool.left;
    if (roll < 0) {
      pool.left -= 1;
      return pool.value;
    }
  }
  const last = open[open.length - 1];
  last.left -= 1;
  return last.value;
}

function weightedPick(pairs: Quotas, rand: () => number): string {
  const total = pairs.reduce((sum, [, n]) => sum + n, 0);
  let roll = rand() * total;
  for (const [value, n] of pairs) {
    roll -= n;
    if (roll < 0) return value;
  }
  return pairs[pairs.length - 1][0];
}

function buildRows(): WarehouseRow[] {
  const rand = mulberry32(20261031);
  const rows: WarehouseRow[] = [];
  const usedNames = new Set<string>();
  let serial = 0;
  const nextId = () => `PPIJ-2026-${String(++serial).padStart(4, "0")}`;

  const makeName = (): string => {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const name = `${firstNames[Math.floor(rand() * firstNames.length)]} ${lastNames[Math.floor(rand() * lastNames.length)]}`;
      if (!usedNames.has(name)) {
        usedNames.add(name);
        return name;
      }
    }
    const fallback = `Anggota Contoh ${serial + 1}`;
    usedNames.add(fallback);
    return fallback;
  };

  const baseRow = (state: WarehouseState, korda: string, komsat: string, registered: string): WarehouseRow => ({
    id: nextId(),
    name: makeName(),
    state,
    korda,
    komsat,
    degree: "",
    field: "",
    institution: "",
    major: "",
    province: "",
    funding: [],
    source: "",
    category: "",
    completeness: "",
    expiry: "",
    card: "",
    kind: "",
    registered,
    daysWaiting: 0,
  });

  /**
   * One quota pool per korda per dimension, sized exactly to the korda's row count from the
   * curated split (Kanto) or the proportional national remainder (everyone else). Rows draw
   * weighted from their korda's pools, so korda-level totals reproduce the dashboard
   * distributions exactly; the national reconcile below absorbs per-label rounding drift.
   */
  const kordaPools = new Map<string, { degree: { value: string; left: number }[]; field: { value: string; left: number }[]; province: { value: string; left: number }[]; completeness: { value: string; left: number }[] }>();
  for (const kordaName of [...kordas.map((k) => k.name), UNMAPPED_KORDA]) {
    const total = kordaName === UNMAPPED_KORDA
      ? unmapped.reduce((sum, u) => sum + u.active_count, 0)
      : komsatsOfKorda(kordas.find((k) => k.name === kordaName)?.unit_id ?? "").reduce((sum, k) => sum + k.active_count, 0);
    const toPool = (quotas: Quotas) => quotas.map(([value, left]) => ({ value, left }));
    kordaPools.set(kordaName, {
      degree: toPool(quotasForGroup(kordaName, degreeNational, degreeKanto, total)),
      field: toPool(quotasForGroup(kordaName, fieldNational, fieldKanto, total)),
      province: toPool(quotasForGroup(kordaName, provinceNational, provinceKanto, total)),
      completeness: toPool(quotasForGroup(kordaName, completenessNational, completenessKanto, total)),
    });
  }
  const pool = (quotas: Quotas) => quotas.map(([value, left]) => ({ value, left }));

  const institutionFor = (komsatSlug: string, field: string): string => {
    const slugSum = [...komsatSlug].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const options = institutions.filter((_, i) => (i + slugSum) % 3 !== 0).slice(0, 8);
    const list = majorsByField[field]?.length ? options : institutions;
    return list[Math.floor(rand() * list.length)] ?? institutions[0];
  };

  /* Aktif member rows — komsat counts equal the map exactly. */
  interface ActiveGroup { korda: string; komsat: string; slug: string; count: number }
  const groups: ActiveGroup[] = [
    ...kordas.flatMap((korda) =>
      komsatsOfKorda(korda.unit_id).map((k) => ({ korda: korda.name, komsat: k.name.replace("Komsat ", ""), slug: k.slug, count: k.active_count })),
    ),
    ...unmapped.map((u) => ({ korda: UNMAPPED_KORDA, komsat: u.name.replace("Komsat ", ""), slug: u.slug, count: u.active_count })),
  ];

  const aktifFlags: { row: WarehouseRow }[] = [];
  for (const group of groups) {
    const total = group.count;
    const pools = kordaPools.get(group.korda);
    if (!pools) throw new Error(`warehouse: missing quota pools for ${group.korda}`);
    const degrees = pools.degree;
    const fields = pools.field;
    const provinces = pools.province;
    const completeness = pools.completeness;
    for (let i = 0; i < total; i += 1) {
      const row = baseRow("aktif", group.korda, group.komsat, MONTHS[Math.floor(rand() * (MONTHS.length - 1))]);
      row.degree = poolPick(degrees, rand);
      row.field = row.degree === "Tidak diisi" ? "Tidak diisi" : poolPick(fields, rand);
      row.institution = row.field === "Tidak diisi" ? "Tidak diisi" : institutionFor(group.slug, row.field);
      row.major = row.field === "Tidak diisi" ? "—" : (majorsByField[row.field]?.[Math.floor(rand() * (majorsByField[row.field]?.length || 1))] ?? "—");
      row.province = poolPick(provinces, rand);
      const primary = weightedPick(fundingPrimary, rand);
      row.funding = [primary];
      if (rand() < 0.28) {
        const second = weightedPick(fundingPrimary, rand);
        if (second !== primary) row.funding.push(second);
      }
      row.source = sources[Math.floor(rand() * (rand() < 0.1 ? 3 : 2))];
      row.category = weightedPick(categories, rand);
      row.completeness = poolPick(completeness, rand);
      row.kind = weightedPick(kinds, rand);
      row.expiry = "> 90 hari";
      aktifFlags.push({ row });
      rows.push(row);
    }
  }

  /* Exact-card, expiring, and current-month quotas over a shuffled aktif order. */
  const order = aktifFlags.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const isKanto = (index: number) => aktifFlags[index].row.korda === "Korda Kanto";
  const takeFrom = (national: number, kanto: number, apply: (row: WarehouseRow) => void) => {
    let usedKanto = 0;
    for (const index of order) {
      if (usedKanto >= kanto) break;
      if (!isKanto(index)) continue;
      apply(aktifFlags[index].row);
      usedKanto += 1;
    }
    let usedRest = 0;
    for (const index of order) {
      if (usedRest >= national - kanto) break;
      if (isKanto(index)) continue;
      apply(aktifFlags[index].row);
      usedRest += 1;
    }
  };
  takeFrom(newMonthNational, newMonthKanto, (row) => {
    row.registered = "2026-10";
  });
  const expiringBucketsPools = expiringBuckets.map(([value, left]) => ({ value, left }));
  takeFrom(expiringNational, expiringKanto, (row) => {
    row.expiry = poolPick(expiringBucketsPools, rand);
  });
  takeFrom(cardNational, cardKanto, (row) => {
    row.card = "Kartu aktif";
  });
  for (const { row } of aktifFlags) {
    if (!row.card) row.card = "Belum terbit";
    if (row.expiry === "> 90 hari" && rand() < 0.18) row.expiry = "61–90 hari";
  }

  /* Open registration rows — exact queue counts (state totals match the review endpoint). */
  const stateSplit = reviewStates.map(([state, national]) => {
    const kantoPair = reviewKanto.find(([s]) => s === state);
    const kantoCount = kantoPair?.[1] ?? 0;
    const otherKordas = kordas.filter((k) => k.unit_id !== "u-kanto");
    const weights = otherKordas.map((k) => komsatsOfKorda(k.unit_id).reduce((sum, k2) => sum + k2.active_count, 0));
    const parts = allocate(Math.max(0, national - kantoCount), weights);
    const byKorda = new Map<string, number>([["Korda Kanto", kantoCount]]);
    otherKordas.forEach((k, i) => byKorda.set(k.name, parts[i]));
    return { state, byKorda };
  });
  for (const { state, byKorda } of stateSplit) {
    for (const [kordaName, count] of byKorda) {
      const komsatPool = kordaName === UNMAPPED_KORDA ? [] : komsatsOfKorda(kordas.find((k) => k.name === kordaName)?.unit_id ?? "");
      for (let i = 0; i < count; i += 1) {
        const komsat = komsatPool[Math.floor(rand() * komsatPool.length)];
        const row = baseRow(state, kordaName, komsat.name.replace("Komsat ", ""), rand() < 0.6 ? "2026-10" : "2026-09");
        row.degree = weightedPick(degreeNational.slice(0, 5), rand);
        row.field = weightedPick(fieldNational.slice(0, 5), rand);
        row.institution = institutionFor(komsat.slug, row.field);
        row.major = majorsByField[row.field]?.[Math.floor(rand() * majorsByField[row.field].length)] ?? "—";
        row.province = weightedPick(provinceNational.slice(0, 5), rand);
        const primary = weightedPick(fundingPrimary, rand);
        row.funding = [primary];
        row.source = sources[Math.floor(rand() * (rand() < 0.2 ? 3 : 2))];
        row.category = weightedPick(categories, rand);
        row.completeness = rand() < 0.55 ? "Lengkap" : "Belum lengkap";
        row.kind = weightedPick(kinds, rand);
        row.expiry = "—";
        row.card = "Belum terbit";
        row.daysWaiting = state === "baru" ? 1 + Math.floor(rand() * 18) : 1 + Math.floor(rand() * 9);
        rows.push(row);
      }
    }
  }
  return rows;
}

export const warehouseRows: WarehouseRow[] = buildRows();

/**
 * Non-Kanto completeness buckets were allocated per korda and can drift a few rows from the
 * national quotas; reconcile them deterministically so the warehouse matches the dashboard bar
 * exactly (Kanto is exact by construction and is never touched).
 */
/** Generic national reconcile: move surplus aktif rows from over-target buckets into deficit ones. */
function reconcileQuotas(field: "degree" | "field" | "province" | "completeness", targets: Quotas): void {
  const aktif = warehouseRows.filter((row) => row.state === "aktif");
  const countOf = (label: string) => aktif.filter((row) => row[field] === label).length;
  const need = new Map(targets.map(([label, n]) => [label, n - countOf(label)]));
  const surplus: WarehouseRow[] = [];
  for (const row of aktif) {
    if ((need.get(row[field]) ?? 0) < 0) surplus.push(row);
  }
  for (const row of surplus) {
    const target = [...need.entries()].find(([, v]) => v > 0)?.[0];
    if (!target) break;
    const from = row[field];
    row[field] = target;
    need.set(from, (need.get(from) ?? 0) + 1);
    need.set(target, (need.get(target) ?? 0) - 1);
  }
}

reconcileQuotas("degree", degreeNational);
reconcileQuotas("field", fieldNational);
reconcileQuotas("province", provinceNational);
reconcileQuotas("completeness", completenessNational);

/* --- filtering -------------------------------------------------------------------------- */

export type FacetKey =
  | "state" | "korda" | "komsat" | "degree" | "field" | "institution" | "province"
  | "funding" | "source" | "category" | "completeness" | "expiry" | "card" | "kind";

export interface Filters {
  monthsBack: 0 | 3 | 6 | 12;
  state: string[];
  korda: string[];
  komsat: string[];
  degree: string[];
  field: string[];
  institution: string[];
  province: string[];
  funding: string[];
  source: string[];
  category: string[];
  completeness: string[];
  expiry: string[];
  card: string[];
  kind: string[];
}

export const emptyFilters: Filters = {
  monthsBack: 0,
  state: [], korda: [], komsat: [], degree: [], field: [], institution: [], province: [],
  funding: [], source: [], category: [], completeness: [], expiry: [], card: [], kind: [],
};

export const facetLabels: Record<FacetKey, string> = {
  state: "Status", korda: "Korda", komsat: "Komsat", degree: "Jenjang", field: "Bidang studi",
  institution: "Institusi", province: "Provinsi asal", funding: "Pembiayaan", source: "Sumber",
  category: "Kategori", completeness: "Kelengkapan & aktivasi", expiry: "Masa berlaku",
  card: "Kartu anggota", kind: "Jenis pengajuan",
};

const MONTH_NOW = 9; // index of 2026-10 in MONTHS

export function rowsInScope(scope: Scope): WarehouseRow[] {
  if (scope === "korda") return warehouseRows.filter((r) => r.korda === "Korda Kanto");
  if (scope === "komsat") return warehouseRows.filter((r) => r.komsat === "Tokyo");
  return warehouseRows;
}

export function matches(row: WarehouseRow, filters: Filters): boolean {
  const multi: [FacetKey, string | string[]][] = [
    ["state", row.state], ["korda", row.korda], ["komsat", row.komsat], ["degree", row.degree],
    ["field", row.field], ["institution", row.institution], ["province", row.province],
    ["funding", row.funding], ["source", row.source], ["category", row.category],
    ["completeness", row.completeness], ["expiry", row.expiry], ["card", row.card], ["kind", row.kind],
  ];
  for (const [key, value] of multi) {
    const selected = filters[key] as string[];
    if (selected.length === 0) continue;
    const candidates = Array.isArray(value) ? value : [value];
    if (!selected.some((s: string) => candidates.includes(s))) return false;
  }
  if (filters.monthsBack > 0) {
    const from = MONTH_NOW - (filters.monthsBack - 1);
    const monthIndex = MONTHS.indexOf(row.registered);
    if (monthIndex < from) return false;
  }
  return true;
}

export const filterRows = (rows: WarehouseRow[], filters: Filters) => rows.filter((row) => matches(row, filters));

/** Data-warehouse facet count: rows matching every OTHER selection plus this one value. */
export function countWithValue(rows: WarehouseRow[], filters: Filters, key: FacetKey, value: string): number {
  const adjusted: Filters = { ...filters, [key]: [value] };
  return rows.filter((row) => matches(row, adjusted)).length;
}

export function distinctValues(rows: WarehouseRow[], key: "state" | "korda" | "komsat" | "degree" | "field" | "institution" | "province" | "source" | "category" | "completeness" | "expiry" | "card" | "kind"): string[] {
  const values = new Map<string, number>();
  for (const row of rows) {
    if (key === "state") values.set(stateLabels[row.state], (values.get(stateLabels[row.state]) ?? 0) + 1);
    else {
      const raw = row[key] as string;
      values.set(raw, (values.get(raw) ?? 0) + 1);
    }
  }
  return [...values.entries()].sort((a, b) => b[1] - a[1]).map(([value]) => value);
}

/** Counts per value of one facet over the filtered rows (the facet menu's own tallies). */
export function facetCounts(rows: WarehouseRow[], filters: Filters, key: FacetKey): [string, number][] {
  const adjusted: Filters = { ...filters, [key]: [] };
  const base = rows.filter((row) => matches(row, adjusted));
  const values = new Map<string, number>();
  for (const row of base) {
    const candidates: string[] =
      key === "state" ? [stateLabels[row.state]]
        : key === "funding" ? row.funding
          : [row[key as Exclude<FacetKey, "months" | "state" | "funding">]];
    for (const value of candidates) values.set(value, (values.get(value) ?? 0) + 1);
  }
  return [...values.entries()].sort((a, b) => b[1] - a[1]);
}

export function countByMonth(rows: WarehouseRow[]): { month: string; count: number }[] {
  return MONTHS.map((month) => ({ month, count: rows.filter((r) => r.registered === month).length }));
}

/* --- CSV export (client-side only, no server round trip) -------------------------------- */

const CSV_COLUMNS: [string, (row: WarehouseRow) => string][] = [
  ["No. anggota", (r) => r.id],
  ["Nama", (r) => r.name],
  ["Status", (r) => stateLabels[r.state]],
  ["Korda", (r) => r.korda],
  ["Komsat", (r) => r.komsat],
  ["Jenjang", (r) => r.degree],
  ["Bidang studi", (r) => r.field],
  ["Institusi", (r) => r.institution],
  ["Jurusan", (r) => r.major],
  ["Provinsi asal", (r) => r.province],
  ["Pembiayaan", (r) => r.funding.join(" + ")],
  ["Sumber", (r) => r.source],
  ["Kategori", (r) => r.category],
  ["Kelengkapan", (r) => r.completeness],
  ["Masa berlaku", (r) => r.expiry],
  ["Kartu", (r) => r.card],
  ["Jenis pengajuan", (r) => r.kind],
  ["Bulan pendaftaran", (r) => r.registered],
  ["Hari menunggu", (r) => (r.state === "aktif" ? "" : String(r.daysWaiting))],
];

/** Downloads the filtered rows as UTF-8 CSV; entirely client-side (Blob + anchor). */
export function exportCsv(rows: WarehouseRow[], filename: string): void {
  const escape = (value: string) => (/[",;\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);
  const lines = [
    CSV_COLUMNS.map(([header]) => header).join(";"),
    ...rows.map((row) => CSV_COLUMNS.map(([, cell]) => escape(cell(row))).join(";")),
  ];
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
