# Statistik page and API contracts

Read [shared shell rules](README.md) and [dashboard.md](dashboard.md) first. Preview: `prototypes/redesign-adminv1/src/StatsPage.tsx`, `src/warehouseData.ts`. Production target: a statistics surface under `/admin` backed by the contracts below. Design-first rule agreed with the user: the UI is not constrained to today's endpoints — **every metric carries either a serving endpoint or a declared contract here**. The workspace selector stays the scope root; the page is one route with a view parameter (anggota, verifikasi, organisasi), and dashboard figures deep-link into it.

## The data warehouse

The Statistik page is an explorable dataset, not a fixed report: facet menus over every registration dimension, active-filter chips with per-value counts, aggregates that always recompute from the current filter set, and a **client-side CSV export** (Blob + anchor download, UTF-8 with BOM, `statistik-ppiij-<scope>-<view>-<date>.csv`, `;`-separated). No server round trip happens in the preview. In production, aggregate exports stay the default and are served from counts; **any member-level export must run through the audited export contract (gap 5)** — never by shipping masked-by-default directory rows to the browser in bulk.

## Facet inventory (registration dimensions, from `ppij-identity`)

| Facet | Production field | Backing today |
| --- | --- | --- |
| Status | member `status` + registration tab (Anggota aktif, Baru, Dikirim ulang, Sedang diperiksa, Menunggu anggota) | `GET /v1/admin/members`, `GET /v1/admin/review` `counts` |
| Korda / Komsat | unit subtree (`korda_id`, `komsat_id`) | `GET /v1/admin/units`, `GET /v1/admin/map` |
| Jenjang | `degree_level` | directory filter + `distributions.degree_level` |
| Bidang studi | `study_field` | directory filter + `distributions.study_field` |
| Institusi | `institution` (`institution_name`) | directory filter |
| Provinsi asal | `origin_province` | `distributions.origin_province` |
| Pembiayaan | `scholarship`/funding (multi-count) | directory filter + `distributions.funding` |
| Sumber | `source` (Undangan pengurus, Pendaftaran mandiri, Pra-verifikasi) | directory filter |
| Kategori | `category` (BIASA, LUAR_BIASA, Tidak ditentukan) | directory filter |
| Kelengkapan & aktivasi | `completeness` (`lengkap`, `belum_lengkap`, `belum_aktivasi`) + `activation_state` | `GET /v1/admin/dashboard` `completeness` |
| Masa berlaku | `expiry_window` over `valid_until` | directory filter |
| Kartu anggota | card issuance state — **declared contract, gap 3** | none yet |
| Jenis pengajuan | registration `kind` (Pendaftaran, Perpanjangan, Perubahan data) | `GET /v1/admin/review` |
| Bulan pendaftaran | registration date range (submission/approval month) | **declared contract, gap 1** |
| Status email | `email_status` (ok, deferred, bounced) | directory row field; facet candidate |
| Tanda review | `flags` (e.g. `possible_duplicate`), `current_round`, `days_waiting` | `GET /v1/admin/review` items; facet candidate |

The preview builds the first fourteen as filters; the last two rows are directory/review fields available for the same facet machinery when product asks for them.

## Gap 1 — monthly trend series: `GET /v1/admin/stats/timeseries`

- **Purpose:** monthly counts of one metric inside the caller's admin scope, for trend charts and range switches.
- **Authorization:** admin contexts only; a verifikator context or a caller without an admin context gets 403, like `GET /v1/admin/dashboard`. The root is the selected context, or the unit named by `scope`, which must lie inside the caller's granted subtree (otherwise 403).
- **Parameters:** `scope` (UUID, optional, default selected context), `metric` (required, enum `new_members` — memberships that became ACTIVE in the bucket, `submissions` — registrations submitted, `approvals` — registrations approved, `cards_issued` — member cards issued), `interval` (only `month` in v1; other values 400), `months` (enum 6 or 12, default 6, window ends with the current partial month), `lang` (`id`/`en`, reserved).
- **Response 200** (`application/json`):

```json
{
  "scope": { "unit_id": "…", "type": "national", "name": "PPI Jepang", "path": "PPI Jepang" },
  "metric": "new_members",
  "interval": "month",
  "window": { "months": 6, "from": "2026-05", "to": "2026-10" },
  "points": [ { "bucket": "2026-05", "count": 39 } ],
  "total": 283,
  "generated_at": "2026-10-31T09:00:00Z"
}
```

- **Semantics:** `points` is contiguous; empty months are `0`, never missing. `total` is the window sum. Counts only, no personal data. Buckets are UTC+9. Same indexed queries/materialized views as the dashboard (5-minute refresh); `generated_at` is the refresh stamp. The current month's `new_members` point must equal `tiles.new_this_month` for the same scope.
- **Errors:** 400 bad params, 401 unauthenticated, 403 out of scope or non-admin context.

## Gap 2 — filtered re-aggregation: `GET /v1/admin/stats/distributions`

The dashboard endpoint accepts only `scope`. Contract: same authorization rules; `group_by` (required, enum `degree_level`, `study_field`, `funding`, `origin_province`, `activation_state`, `completeness`) plus the member-directory filter set (`status`, `komsat_id`, `institution`, `degree_level`, `study_field`, `scholarship`, `source`, `activation_state`, `expiry_window`, `category`) and `lang`. Response:

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

`funding` counts a member under each of their sources (items can exceed `active_total`), as in production today. Counts only; no personal data.

## Gap 3 — card metrics on the dashboard tiles

Extend `AdminDashboardResponse.tiles` with `cards_active` (ACTIVE member cards in scope) and `cards_issued_this_month` (cards issued in the current calendar month). Server source: the member-card issuance records joined to active memberships, same 5-minute materialized refresh; invariant to enforce: `cards_active ≤ active_members` and `cards_issued_this_month ≥ new_this_month` when every new member receives a card. The preview's "Kartu & masa berlaku" figures band group renders both plus `tiles.expiring_within_60_days`.

## Gap 4 — warehouse facet query: `GET /v1/admin/stats/facets`

Powers cross-filtered aggregates: facet counts over an arbitrary filter combination.

- **Authorization:** identical to the dashboard endpoint (admin contexts, `scope` inside the granted subtree).
- **Parameters:** `scope` (UUID, optional), `facets` (required, comma-separated facet names from the inventory above), and any directory filter as a constraint (`status`, `komsat_id`, `institution`, `degree_level`, `study_field`, `scholarship`, `source`, `activation_state`, `expiry_window`, `category`, `completeness`, `kind`, `registered_from`/`registered_to` in `YYYY-MM`). Multi-valued constraints repeat the parameter.
- **Response 200:** one block per requested facet with per-value counts computed over the rows matching all OTHER constraints (data-warehouse semantics, so counts update as filters combine):

```json
{
  "scope": { "unit_id": "…", "type": "national", "name": "PPI Jepang" },
  "total": 1368,
  "facets": {
    "degree_level": [ { "value": "S1", "count": 714 } ],
    "completeness": [ { "value": "lengkap", "count": 966 } ]
  },
  "generated_at": "2026-10-31T09:00:00Z"
}
```

- **Server source:** materialized member/registration rollups (active memberships joined to their latest registration), refreshed every 5 minutes; counts only. Institutional values are free text — the facet list may need a length cap or a `min_count` threshold to stay readable.

## Gap 5 — audited member-level export: `POST /v1/admin/exports`

- **Purpose:** the only sanctioned path to member-level rows in bulk. Aggregate CSVs (counts per facet value) remain the default export and need no server process; the moment an export carries member-level fields it becomes an audited action.
- **Authorization:** admin contexts only, `scope` inside the granted subtree; the scope is stamped onto the export record.
- **Request:** `{ "filters": { …same vocabulary as gap 4… }, "columns": ["member_number", "full_name", "status", "komsat", …], "reason": "string (required, stored in the audit log)" }`.
- **Response 202:** `{ "export_id": "…", "state": "pending" }`; `GET /v1/admin/exports/{id}` reports `state` and a short-lived download URL when ready.
- **Audit:** every request is audit-logged (who, when, scope, filters, columns, reason, row count) before delivery, matching the directory's audited reveal posture. Sensitive columns stay masked unless separately revealed.

## Preview honesty rules

- The warehouse dataset is synthetic and seed-generated; its quotas are tied to the dashboard figures (aktif per komsat equals the map counts, completeness equals the dashboard bar, review states equal the queue counts, and the last trend bucket equals `tiles.new_this_month`), so no preview view can contradict the dashboard.
- Trend cards and facet aggregates footnote their production contract (gap 1 or gap 4) instead of implying the preview talks to a server.
- On phones (≤600px) the registration-period facet defaults to the last 6 months; 12 months stays selectable (Q15).
- English i18n keys for the new Statistik strings are drafted at integration time; this repository owns no translations (Q17).
- Do not migrate the preview's generator, series, footnotes, or demo callbacks; server responses decide every figure.

## Adoption

Implementing `GET /v1/admin/stats/*` follows `ppij-identity`'s own approved OpenSpec change; the contracts in this document are the design source those specs implement, not a license to add endpoints from a chat message (Q18).
