/**
 * Synthetic dashboard/map dataset for the preview. The shapes mirror the production API so the
 * redesign maps 1:1 onto real data at integration time:
 * - map:      GET /v1/admin/map            → AdminMapResponse (kordas/komsats/municipalities/unmapped, ACTIVE counts only)
 * - tiles:    GET /v1/admin/dashboard      → tiles (active_members, pending_verification, new_this_month, expiring_within_60_days)
 * - review:   GET /v1/admin/review         → counts per tab (the shell badge uses the same "baru" count)
 * - completn: GET /v1/admin/dashboard      → completeness (lengkap, belum_lengkap, belum_aktivasi over active_total)
 * - distrs:   GET /v1/admin/dashboard      → distributions (degree_level, study_field, funding, origin_province)
 * - ops:      GET /v1/admin/dashboard      → operations rows (korda and national scopes only)
 * - coverage: GET /v1/admin/dashboard      → coverage (national and korda scopes only)
 * - trends:   production gap, contract in docs/admin-integration/stats.md (GET /v1/admin/stats/timeseries)
 * Every derived figure (strip, coverage rows, unit counts) is computed from these rows so the
 * preview cannot show numbers its dataset does not back.
 */

export type Scope = "national" | "korda" | "komsat";

export interface KomsatRow {
  unit_id: string;
  slug: string;
  name: string;
  korda_id: string;
  lat: number;
  lng: number;
  active_count: number;
  /** Operations fields (production: AdminDashboardOperation). queue counts SUBMITTED+IN_REVIEW registrations. */
  queue_count: number;
  avg_review_days_90d: number | null;
  admin_name: string | null;
  admin_others: number;
  no_admin: boolean;
}

export interface KordaRow {
  unit_id: string;
  slug: string;
  name: string;
  lat: number;
  lng: number;
}

export interface MunicipalityRow {
  code: string;
  prefecture_code: string;
  name_ja: string;
  name_romaji: string;
  lat: number;
  lng: number;
  active_count: number;
}

export const kordas: KordaRow[] = [
  { unit_id: "u-kanto", slug: "kanto", name: "Korda Kanto", lat: 35.6812, lng: 139.7671 },
  { unit_id: "u-kansai", slug: "kansai", name: "Korda Kansai", lat: 34.6937, lng: 135.5023 },
  { unit_id: "u-chubu", slug: "chubu", name: "Korda Chubu", lat: 35.1815, lng: 136.9066 },
  { unit_id: "u-kyushu", slug: "kyushu", name: "Korda Kyushu", lat: 33.5904, lng: 130.4017 },
  { unit_id: "u-tohoku", slug: "tohoku", name: "Korda Tohoku", lat: 38.2682, lng: 140.8694 },
  { unit_id: "u-chugoku", slug: "chugoku", name: "Korda Chugoku", lat: 34.3853, lng: 132.4553 },
  { unit_id: "u-hokuriku", slug: "hokuriku", name: "Korda Hokuriku", lat: 36.5613, lng: 136.6562 },
  { unit_id: "u-shikoku", slug: "shikoku", name: "Korda Shikoku", lat: 33.8392, lng: 132.7657 },
  { unit_id: "u-okinawa", slug: "okinawa", name: "Korda Okinawa", lat: 26.2124, lng: 127.6809 },
];

export const komsats: KomsatRow[] = [
  { unit_id: "u-tokyo", slug: "tokyo", name: "Komsat Tokyo", korda_id: "u-kanto", lat: 35.6812, lng: 139.7671, active_count: 197, queue_count: 12, avg_review_days_90d: 1.4, admin_name: "Rina Putri", admin_others: 1, no_admin: false },
  { unit_id: "u-yokohama", slug: "yokohama", name: "Komsat Yokohama", korda_id: "u-kanto", lat: 35.4437, lng: 139.638, active_count: 96, queue_count: 4, avg_review_days_90d: 2.1, admin_name: "Dimas Aryo", admin_others: 0, no_admin: false },
  { unit_id: "u-chiba", slug: "chiba", name: "Komsat Chiba", korda_id: "u-kanto", lat: 35.6073, lng: 140.1064, active_count: 74, queue_count: 3, avg_review_days_90d: 2.8, admin_name: null, admin_others: 2, no_admin: false },
  { unit_id: "u-saitama", slug: "saitama", name: "Komsat Saitama", korda_id: "u-kanto", lat: 35.8617, lng: 139.6455, active_count: 64, queue_count: 5, avg_review_days_90d: null, admin_name: null, admin_others: 0, no_admin: true },
  { unit_id: "u-tsukuba", slug: "tsukuba", name: "Komsat Tsukuba", korda_id: "u-kanto", lat: 36.0835, lng: 140.0764, active_count: 21, queue_count: 1, avg_review_days_90d: 1.9, admin_name: "Sari Dewi", admin_others: 0, no_admin: false },
  { unit_id: "u-kobe", slug: "kobe", name: "Komsat Kobe", korda_id: "u-kansai", lat: 34.6901, lng: 135.1955, active_count: 118, queue_count: 9, avg_review_days_90d: 2.4, admin_name: "Ayaka Mori", admin_others: 0, no_admin: false },
  { unit_id: "u-kyoto", slug: "kyoto", name: "Komsat Kyoto", korda_id: "u-kansai", lat: 35.0211, lng: 135.7539, active_count: 102, queue_count: 6, avg_review_days_90d: 2.2, admin_name: "Kenji Watanabe", admin_others: 1, no_admin: false },
  { unit_id: "u-osaka", slug: "osaka", name: "Komsat Osaka", korda_id: "u-kansai", lat: 34.6937, lng: 135.5023, active_count: 86, queue_count: 7, avg_review_days_90d: 3.0, admin_name: null, admin_others: 0, no_admin: true },
  { unit_id: "u-nagoya", slug: "nagoya", name: "Komsat Nagoya", korda_id: "u-chubu", lat: 35.1815, lng: 136.9066, active_count: 121, queue_count: 5, avg_review_days_90d: 2.5, admin_name: "Yui Tanaka", admin_others: 0, no_admin: false },
  { unit_id: "u-shizuoka", slug: "shizuoka", name: "Komsat Shizuoka", korda_id: "u-chubu", lat: 34.9756, lng: 138.3828, active_count: 62, queue_count: 2, avg_review_days_90d: 1.8, admin_name: "Ryo Hamamatsu", admin_others: 0, no_admin: false },
  { unit_id: "u-fukuoka", slug: "fukuoka", name: "Komsat Fukuoka", korda_id: "u-kyushu", lat: 33.5904, lng: 130.4017, active_count: 68, queue_count: 4, avg_review_days_90d: 2.6, admin_name: "Mina Kuroda", admin_others: 0, no_admin: false },
  { unit_id: "u-kagoshima", slug: "kagoshima", name: "Komsat Kagoshima", korda_id: "u-kyushu", lat: 31.5966, lng: 130.5571, active_count: 36, queue_count: 1, avg_review_days_90d: 1.2, admin_name: "Sora Arimura", admin_others: 0, no_admin: false },
  { unit_id: "u-sendai", slug: "sendai", name: "Komsat Sendai", korda_id: "u-tohoku", lat: 38.2682, lng: 140.8694, active_count: 52, queue_count: 3, avg_review_days_90d: 2.9, admin_name: "Hana Sato", admin_others: 0, no_admin: false },
  { unit_id: "u-morioka", slug: "morioka", name: "Komsat Morioka", korda_id: "u-tohoku", lat: 39.7036, lng: 141.1527, active_count: 22, queue_count: 1, avg_review_days_90d: null, admin_name: null, admin_others: 1, no_admin: false },
  { unit_id: "u-hiroshima", slug: "hiroshima", name: "Komsat Hiroshima", korda_id: "u-chugoku", lat: 34.3853, lng: 132.4553, active_count: 55, queue_count: 2, avg_review_days_90d: 2.0, admin_name: "Nao Fujimoto", admin_others: 0, no_admin: false },
  { unit_id: "u-kanazawa", slug: "kanazawa", name: "Komsat Kanazawa", korda_id: "u-hokuriku", lat: 36.5613, lng: 136.6562, active_count: 45, queue_count: 2, avg_review_days_90d: 2.3, admin_name: "Aki Shimizu", admin_others: 0, no_admin: false },
  { unit_id: "u-matsuyama", slug: "matsuyama", name: "Komsat Matsuyama", korda_id: "u-shikoku", lat: 33.8392, lng: 132.7657, active_count: 41, queue_count: 1, avg_review_days_90d: 1.6, admin_name: "Yuta Cho", admin_others: 0, no_admin: false },
  { unit_id: "u-naha", slug: "naha", name: "Komsat Naha", korda_id: "u-okinawa", lat: 26.2124, lng: 127.6809, active_count: 24, queue_count: 1, avg_review_days_90d: 1.1, admin_name: "Mei Gusuku", admin_others: 0, no_admin: false },
];

/** Units with members but no coordinates (production lists them under the map). */
export const unmapped = [
  { unit_id: "u-nagareyama", type: "komsat" as const, slug: "nagareyama", name: "Komsat Nagareyama", is_non_komsat: false, active_count: 12 },
  { unit_id: "u-isezaki", type: "komsat" as const, slug: "isezaki", name: "Komsat Isezaki", is_non_komsat: false, active_count: 9 },
];

/**
 * City/ward circles (production zoom ≥ 10). Tokyo has four real wards that sum to its komsat
 * count; every other city mirrors its komsat so no unit disappears when zooming in.
 */
export const municipalities: MunicipalityRow[] = [
  { code: "13104", prefecture_code: "13", name_ja: "新宿区", name_romaji: "Shinjuku", lat: 35.6938, lng: 139.7036, active_count: 64 },
  { code: "13112", prefecture_code: "13", name_ja: "世田谷区", name_romaji: "Setagaya", lat: 35.6462, lng: 139.6532, active_count: 52 },
  { code: "13103", prefecture_code: "13", name_ja: "港区", name_romaji: "Minato", lat: 35.6581, lng: 139.7516, active_count: 43 },
  { code: "13111", prefecture_code: "13", name_ja: "豊島区", name_romaji: "Toshima", lat: 35.7255, lng: 139.7144, active_count: 38 },
  ...komsats.filter((k) => k.korda_id !== "u-kanto").map((k, i) => ({
    code: String(9200 + i),
    prefecture_code: "00",
    name_ja: k.name.replace("Komsat ", ""),
    name_romaji: k.name.replace("Komsat ", ""),
    lat: k.lat,
    lng: k.lng,
    active_count: k.active_count,
  })),
];

/** Derived totals — the only numbers the strip and figures band may show. */
export const totalActive = komsats.reduce((sum, k) => sum + k.active_count, 0) + unmapped.reduce((sum, u) => sum + u.active_count, 0);
export const activeOfKorda = (kordaId: string) => komsats.filter((k) => k.korda_id === kordaId).reduce((sum, k) => sum + k.active_count, 0);
export const komsatsOfKorda = (kordaId: string) => komsats.filter((k) => k.korda_id === kordaId);
export const tokyoWardTotal = municipalities.filter((m) => m.prefecture_code === "13").reduce((sum, m) => sum + m.active_count, 0);
