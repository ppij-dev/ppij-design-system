# Statistik page and API contracts

Read [shared shell rules](README.md) and [dashboard.md](dashboard.md) first. Preview: `prototypes/redesign-adminv1/src/StatsPage.tsx`, `src/statsData.ts`. Production target: new statistics surface under `/admin`, backed by the contracts below. The workspace selector is the scope filter; the page is one route with a topic parameter, not one page per topic. Topics: **anggota**, **verifikasi**, **organisasi** (organisasi hidden at komsat scope, mirroring production tiles). Dashboard figure groups deep-link with the topic preselected.

## Topic-to-field mapping (all currently served)

| Topic | Metrics | Production source |
| --- | --- | --- |
| Anggota | `active_members`, `new_this_month`, `expiring_within_60_days` | `GET /v1/admin/dashboard` `tiles` |
| Anggota | `lengkap`, `belum_lengkap`, `belum_aktivasi` over `active_total` | `GET /v1/admin/dashboard` `completeness` |
| Anggota | degree, study field, funding, origin distributions | `GET /v1/admin/dashboard` `distributions.*` |
| Verifikasi | per-tab counts (Baru, Dikirim ulang, Sedang diperiksa, Menunggu anggota, Selesai) | `GET /v1/admin/review` `counts` |
| Verifikasi | `avg_review_days_90d`, per-komsat `queue_count`, `admin_name`, `no_admin` | `GET /v1/admin/dashboard` `operations` |
| Organisasi | unit counts, `non_komsat_active`, prefecture states | `GET /v1/admin/map`, `coverage`, `GET /v1/admin/units` |

Komsat filters reuse the member-directory filter vocabulary. When a komsat filter is active, distributions may not be re-aggregated server-side yet; the preview says so in place and the filtered tables use `operations` rows, which do carry per-komsat values.

## Gap 1 — monthly trend series: `GET /v1/admin/stats/timeseries`

The preview renders the monthly trend (dashboard "Aktivitas bulan ini", Statistik trend cards) from synthetic series. Production contract to implement:

- **Purpose:** monthly counts of one metric inside the caller's admin scope, for trend charts and range switches (6 or 12 months).
- **Authorization:** admin contexts only; a verifikator context or a caller without an admin context gets 403, like `GET /v1/admin/dashboard`. The root is the selected context, or the unit named by `scope`, which must lie inside the caller's granted subtree (otherwise 403).
- **Parameters:**
  - `scope` — UUID, optional; root unit inside the granted subtree (default: selected context).
  - `metric` — string, required, enum `new_members` (memberships that became ACTIVE in the bucket), `submissions` (registrations submitted), `approvals` (registrations approved). Unknown values: 400.
  - `interval` — string, optional, only `month` in v1 (default `month`; other values 400).
  - `months` — integer, optional, enum 6 or 12 (default 6). The window ends with the current partial month.
  - `lang` — string, optional, `id` or `en` (affects nothing in v1; reserved for future labels).
- **Response 200** (`application/json`):

```json
{
  "scope": { "unit_id": "…", "type": "national", "name": "PPI Jepang", "path": "PPI Jepang" },
  "metric": "new_members",
  "interval": "month",
  "window": { "months": 6, "from": "2026-05", "to": "2026-10" },
  "points": [
    { "bucket": "2026-05", "count": 39 },
    { "bucket": "2026-06", "count": 52 }
  ],
  "total": 283,
  "generated_at": "2026-10-31T09:00:00Z"
}
```

- **Semantics:** `points` is contiguous; months with no activity are `0`, never missing. `total` is the window sum. Counts only — no personal data, no small-count suppression beyond what the dashboard already applies. Buckets are UTC+9 (Japan), matching membership date boundaries. Counts come from the same indexed queries/materialized views as the dashboard (5-minute refresh); `generated_at` is the refresh stamp. The current month's `new_members` point must equal `tiles.new_this_month` for the same scope.
- **Errors:** 400 (bad params), 401 unauthenticated, 403 out of scope or non-admin context — same shapes as the dashboard endpoint.

## Gap 2 — filtered re-aggregation: `GET /v1/admin/stats/distributions`

The dashboard endpoint accepts only `scope`, so a Statistik view filtered by komsat or member attributes cannot re-aggregate. Contract to implement:

- **Purpose:** one distribution of ACTIVE members over one group, computed after applying the member-directory filters.
- **Authorization:** identical to `GET /v1/admin/dashboard` (admin contexts, `scope` inside the granted subtree).
- **Parameters:**
  - `group_by` — string, required, enum `degree_level`, `study_field`, `funding`, `origin_province`, `activation_state`, `completeness`. Unknown: 400.
  - Member filters, mirroring `GET /v1/admin/members`: `status`, `komsat_id`, `institution`, `degree_level`, `study_field`, `scholarship`, `source`, `activation_state`, `expiry_window`, `category`.
  - `lang` — `id` or `en` for label resolution.
- **Response 200** (`application/json`):

```json
{
  "group_by": "degree_level",
  "filters_applied": { "komsat_id": "…" },
  "items": [ { "key": "s1", "label_id": "S1", "label_en": "Bachelor", "count": 714 } ],
  "other": 18,
  "unknown": 8,
  "active_total": 1305,
  "generated_at": "2026-10-31T09:00:00Z"
}
```

- **Semantics:** the same catalogue labels and bucket semantics as the dashboard `distributions` block, restricted to the filtered population. `funding` counts a member under each of their sources (items can exceed `active_total`), as in production today. `completeness` groups over `lengkap`/`belum_lengkap`/`belum_aktivasi`. Counts only; responses hold no personal data.

## Preview honesty rules

- Every non-trend number on Statistik maps to a field in the table above; the synthetic dataset in `statsData.ts` keeps them mutually consistent (active total equals the map's member sum, `pending_verification` equals the Baru tab count, the last trend bucket equals `new_this_month`).
- Trend cards carry the footnote naming `GET /v1/admin/stats/timeseries`; a filtered distribution card names this page's Gap 2 instead of pretending to be filtered.
- Do not migrate the preview's series, footnotes, or demo callbacks; server responses decide every figure.
