/**
 * Scope-level dashboard figures for the preview. Every field is named after its production backing
 * field (see mapData.ts header and docs/admin-integration/stats.md); nothing is shown without one.
 * Values are internally consistent: active_members = sum of komsat counts + unmapped (1.305),
 * pending_verification = the "baru" tab count, profil lengkap = lengkap / active_total ≈ 74%.
 */
import { komsats, totalActive } from "./mapData";
import type { Scope } from "./mapData";

export type Tab = "baru" | "dikirim_ulang" | "diperiksa" | "menunggu_anggota" | "selesai";

export const tabLabels: Record<Tab, string> = {
  baru: "Baru",
  dikirim_ulang: "Dikirim ulang",
  diperiksa: "Sedang diperiksa",
  menunggu_anggota: "Menunggu anggota",
  selesai: "Selesai",
};

export interface Tiles {
  /** tiles.active_members */
  active_members: number;
  /** tiles.pending_verification (SUBMITTED + IN_REVIEW) */
  pending_verification: number;
  /** tiles.new_this_month */
  new_this_month: number;
  /** tiles.expiring_within_60_days */
  expiring_within_60_days: number;
  /** Declared contract (stats.md, gap 3): tiles.cards_active — ACTIVE member cards in scope. */
  cards_active: number;
  /** Declared contract (stats.md, gap 3): tiles.cards_issued_this_month. */
  cards_issued_this_month: number;
}

export interface Completeness {
  active_total: number;
  lengkap: number;
  belum_lengkap: number;
  belum_aktivasi: number;
  reminder_eligible: number;
}

export interface Bucket { key: string; label: string; count: number }
export interface Distribution { items: Bucket[]; other: number; unknown: number }

export interface ScopeStats {
  tiles: Tiles;
  review: Record<Tab, number>;
  completeness: Completeness;
  distributions: {
    degree_level: Distribution;
    study_field: Distribution;
    funding: Distribution;
    origin_province: Distribution;
  };
  /** operations.avg_review_days_90d for the scope; null below korda. */
  avg_review_days_90d: number | null;
}

export const statsByScope: Record<Scope, ScopeStats> = {
  national: {
    tiles: { active_members: totalActive, pending_verification: 37, new_this_month: 48, expiring_within_60_days: 23, cards_active: 1102, cards_issued_this_month: 52 },
    review: { baru: 37, dikirim_ulang: 9, diperiksa: 11, menunggu_anggota: 6, selesai: 214 },
    completeness: { active_total: 1305, lengkap: 966, belum_lengkap: 246, belum_aktivasi: 93, reminder_eligible: 246 },
    distributions: {
      degree_level: {
        items: [
          { key: "s1", label: "S1", count: 714 },
          { key: "s2", label: "S2", count: 418 },
          { key: "s3", label: "S3", count: 89 },
          { key: "d3", label: "D3", count: 45 },
          { key: "d2", label: "D2", count: 13 },
        ],
        other: 18,
        unknown: 8,
      },
      study_field: {
        items: [
          { key: "eng", label: "Teknik", count: 391 },
          { key: "eco", label: "Ekonomi & Bisnis", count: 301 },
          { key: "soc", label: "Ilmu Sosial", count: 217 },
          { key: "health", label: "Kesehatan", count: 161 },
          { key: "arts", label: "Seni", count: 95 },
        ],
        other: 92,
        unknown: 48,
      },
      funding: {
        items: [
          { key: "mandiri", label: "Mandiri", count: 712 },
          { key: "swasta", label: "Beasiswa swasta", count: 295 },
          { key: "mext", label: "Beasiswa Jepang (MEXT)", count: 146 },
          { key: "lokal", label: "Beasiswa lokal", count: 98 },
          { key: "other", label: "Lainnya", count: 55 },
        ],
        other: 0,
        unknown: 0,
      },
      origin_province: {
        items: [
          { key: "jb", label: "Jawa Barat", count: 437 },
          { key: "dki", label: "DKI Jakarta", count: 356 },
          { key: "jt", label: "Jawa Tengah", count: 201 },
          { key: "jim", label: "Jawa Timur", count: 148 },
          { key: "bt", label: "Banten", count: 70 },
        ],
        other: 63,
        unknown: 30,
      },
    },
    avg_review_days_90d: 2.1,
  },
  korda: {
    tiles: { active_members: 452, pending_verification: 12, new_this_month: 17, expiring_within_60_days: 9, cards_active: 390, cards_issued_this_month: 18 },
    review: { baru: 12, dikirim_ulang: 3, diperiksa: 4, menunggu_anggota: 2, selesai: 86 },
    completeness: { active_total: 452, lengkap: 357, belum_lengkap: 68, belum_aktivasi: 27, reminder_eligible: 68 },
    distributions: {
      degree_level: {
        items: [
          { key: "s1", label: "S1", count: 261 },
          { key: "s2", label: "S2", count: 128 },
          { key: "s3", label: "S3", count: 24 },
          { key: "d3", label: "D3", count: 18 },
        ],
        other: 12,
        unknown: 9,
      },
      study_field: {
        items: [
          { key: "eng", label: "Teknik", count: 148 },
          { key: "eco", label: "Ekonomi & Bisnis", count: 102 },
          { key: "soc", label: "Ilmu Sosial", count: 74 },
          { key: "health", label: "Kesehatan", count: 55 },
        ],
        other: 45,
        unknown: 28,
      },
      funding: {
        items: [
          { key: "mandiri", label: "Mandiri", count: 246 },
          { key: "swasta", label: "Beasiswa swasta", count: 98 },
          { key: "mext", label: "Beasiswa Jepang (MEXT)", count: 52 },
          { key: "lokal", label: "Beasiswa lokal", count: 34 },
        ],
        other: 0,
        unknown: 0,
      },
      origin_province: {
        items: [
          { key: "jb", label: "Jawa Barat", count: 152 },
          { key: "dki", label: "DKI Jakarta", count: 118 },
          { key: "jt", label: "Jawa Tengah", count: 71 },
          { key: "jim", label: "Jawa Timur", count: 49 },
          { key: "bt", label: "Banten", count: 26 },
        ],
        other: 24,
        unknown: 12,
      },
    },
    avg_review_days_90d: 1.8,
  },
  komsat: {
    tiles: { active_members: 197, pending_verification: 5, new_this_month: 8, expiring_within_60_days: 3, cards_active: 183, cards_issued_this_month: 9 },
    review: { baru: 5, dikirim_ulang: 1, diperiksa: 2, menunggu_anggota: 1, selesai: 31 },
    completeness: { active_total: 197, lengkap: 162, belum_lengkap: 26, belum_aktivasi: 9, reminder_eligible: 26 },
    distributions: {
      degree_level: {
        items: [
          { key: "s1", label: "S1", count: 108 },
          { key: "s2", label: "S2", count: 57 },
          { key: "s3", label: "S3", count: 11 },
          { key: "d3", label: "D3", count: 9 },
        ],
        other: 6,
        unknown: 6,
      },
      study_field: {
        items: [
          { key: "eng", label: "Teknik", count: 66 },
          { key: "eco", label: "Ekonomi & Bisnis", count: 44 },
          { key: "soc", label: "Ilmu Sosial", count: 33 },
          { key: "health", label: "Kesehatan", count: 22 },
        ],
        other: 19,
        unknown: 13,
      },
      funding: {
        items: [
          { key: "mandiri", label: "Mandiri", count: 108 },
          { key: "swasta", label: "Beasiswa swasta", count: 41 },
          { key: "mext", label: "Beasiswa Jepang (MEXT)", count: 24 },
          { key: "lokal", label: "Beasiswa lokal", count: 15 },
        ],
        other: 0,
        unknown: 0,
      },
      origin_province: {
        items: [
          { key: "jb", label: "Jawa Barat", count: 64 },
          { key: "dki", label: "DKI Jakarta", count: 52 },
          { key: "jt", label: "Jawa Tengah", count: 31 },
          { key: "jim", label: "Jawa Timur", count: 21 },
          { key: "bt", label: "Banten", count: 12 },
        ],
        other: 11,
        unknown: 6,
      },
    },
    avg_review_days_90d: null,
  },
};

/**
 * Synthetic monthly series. Production contract (gap to implement): GET /v1/admin/stats/timeseries,
 * fully specified in docs/admin-integration/stats.md. The last bucket of `new` equals
 * tiles.new_this_month so the dashboard and the trend cannot disagree.
 */
export type TrendKey = "new" | "submissions" | "approvals";

export interface TrendSeries {
  /** Bucket labels, oldest first, Indonesian short months. */
  labels: string[];
  /** tiles.new_this_month per month (production metric: new_members). */
  new: number[];
  /** Registrations submitted per month (production metric: submissions). */
  submissions: number[];
  /** Approvals per month (production metric: approvals). */
  approvals: number[];
}

const months12 = ["Nov", "Des", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt"];

export const trend12: TrendSeries = {
  labels: months12,
  new: [27, 25, 31, 30, 28, 33, 39, 52, 44, 61, 39, 48],
  submissions: [38, 35, 41, 39, 37, 44, 52, 61, 57, 70, 48, 45],
  approvals: [31, 29, 36, 33, 34, 39, 45, 52, 47, 66, 41, 44],
};

export function trendFor(range: 6 | 12): TrendSeries {
  if (range === 12) return trend12;
  const cut = <T,>(rows: T[]) => rows.slice(-6);
  return { labels: cut(trend12.labels), new: cut(trend12.new), submissions: cut(trend12.submissions), approvals: cut(trend12.approvals) };
}

/** Coverage (national): unclaimed/partly claimed prefectures with Non-Komsat members. */
export const coverageNational = {
  candidate_threshold: 15,
  non_komsat_active: 111,
  prefectures: [
    { prefecture_code: "13", name_en: "Tokyo", state: "partial" as const, non_komsat_active: 37, candidate_new_komsat: false },
    { prefecture_code: "14", name_en: "Kanagawa", state: "partial" as const, non_komsat_active: 12, candidate_new_komsat: false },
    { prefecture_code: "23", name_en: "Aichi", state: "partial" as const, non_komsat_active: 21, candidate_new_komsat: true },
    { prefecture_code: "27", name_en: "Osaka", state: "partial" as const, non_komsat_active: 18, candidate_new_komsat: false },
    { prefecture_code: "40", name_en: "Fukuoka", state: "partial" as const, non_komsat_active: 9, candidate_new_komsat: false },
    { prefecture_code: "01", name_en: "Hokkaido", state: "unclaimed" as const, non_komsat_active: 14, candidate_new_komsat: true },
  ],
};

/** Coverage (korda Kanto): prefectures with Non-Komsat members inside the region. */
export const coverageKorda = {
  candidate_threshold: 15,
  non_komsat_active: 43,
  prefectures: [
    { prefecture_code: "13", name_en: "Tokyo", state: "partial" as const, non_komsat_active: 31, candidate_new_komsat: false },
    { prefecture_code: "14", name_en: "Kanagawa", state: "partial" as const, non_komsat_active: 12, candidate_new_komsat: false },
  ],
};

export const formatCount = (value: number) => new Intl.NumberFormat("id-ID").format(value);
export const formatDays = (days: number) => `${new Intl.NumberFormat("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(days)} hari`;

/** Deterministic per-unit composition drift in [-0.10, +0.10] so filtered komsat splits differ believably. */
function driftOf(unitId: string): number {
  let hash = 0;
  for (const ch of unitId) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  return ((hash % 21) - 10) / 100;
}

/**
 * Re-aggregates a distribution over the selected komsat names (design-first: the UI filters as
 * designed; production serves this through GET /v1/admin/stats/distributions, stats.md gap 2).
 * Scaling is deterministic, integers, and totals to the selected population.
 */
export function scopedDistribution(distribution: Distribution, komsatFilter: string[]): Distribution {
  const names = new Set(komsatFilter);
  const selected = komsats.filter((k) => names.has(k.name.replace("Komsat ", "")));
  if (selected.length === 0) return distribution;
  const totalSelected = selected.reduce((sum, k) => sum + k.active_count, 0);
  if (totalSelected === 0) return distribution;
  const buckets = distribution.items.map((item) => ({ ...item, count: 0 }));
  let other = 0;
  let unknown = 0;
  for (const komsat of selected) {
    const share = komsat.active_count / totalSelected;
    const drift = driftOf(komsat.unit_id);
    for (const bucket of buckets) bucket.count += Math.max(0, bucket.count * share * (1 + drift));
    other += distribution.other * share;
    unknown += distribution.unknown * share;
  }
  const rounded = buckets.map((bucket) => ({ ...bucket, count: Math.round(bucket.count) }));
  const roundedRest = { other: Math.round(other), unknown: Math.round(unknown) };
  const target = Math.round(totalSelected);
  const sum = rounded.reduce((acc, bucket) => acc + bucket.count, 0) + roundedRest.other + roundedRest.unknown;
  const largest = rounded.reduce((max, bucket) => (bucket.count > max.count ? bucket : max), rounded[0]);
  largest.count += target - sum;
  if (largest.count < 0) largest.count = 0;
  return { items: rounded, other: roundedRest.other, unknown: roundedRest.unknown };
}
