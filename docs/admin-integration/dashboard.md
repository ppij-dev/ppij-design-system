# Dashboard UX handoff

Read [shared shell rules](README.md) first. Preview: `prototypes/redesign-adminv1/src/App.tsx`, `Dashboard`. Production: `ppij-identity/web/src/components/admin/Dashboard.tsx` and `dashboard/Blocks.tsx`; route `/admin` and `/en/admin`.

## Layout and interaction

Show the current workspace and a concise orientation, then a clear **Perlu perhatian** area with the verification queue as the first actionable item. Its count and oldest-waiting detail must come from live scoped data. Selecting it opens Verifikasi; a recent submission opens the corresponding review detail. Keep **Aktivitas bulan ini**, **Pengajuan terbaru**, and the network/coverage summary visually distinct. At narrow widths, stack panels in reading order, keep row actions easy to tap, and avoid clipping chart labels or long unit names.

National, korda, and komsat contexts use different summaries and destinations. The preview's four Korda bars, `+48`, `74%`, and three sample submissions are illustrative only. Derive every metric from the current dashboard/queue data and preserve the production dashboard map where it conveys live geographic information. Missing chart data should have a plain empty state, not a fabricated zero trend. The shell's queue badge and dashboard queue card must agree for the same scope and queue definition.

## Production behavior to retain

Keep `useAdminDashboard`, `useReviewQueue`, their loading/error/retry behavior, and the real admin context. Preserve existing feature visibility and permission checks. Do not assume every context can open every dashboard action. A changed context must invalidate/refetch scoped metrics rather than leave the previous workspace's figures visible. Use translated metric labels and locale-aware number/date formatting.

## Acceptance

- Priority and recent-review links open the correct scoped production destination.
- Metrics, counts, and map reflect live data and change with context.
- Loading, empty, and failed queries are legible on phone, tablet, and desktop.
- No synthetic preview data or local navigation state is migrated.
