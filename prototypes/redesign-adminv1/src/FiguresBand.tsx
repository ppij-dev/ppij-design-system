import { DistributionBar, FiguresBand as FiguresBandShell, FiguresBandSeparator, type FiguresBandGroup } from "ppij-design-system";
import { komsats, komsatsOfKorda, kordas, type Scope } from "./mapData";
import { coverageKorda, formatCount, statsByScope, type Bucket, type Distribution } from "./statsData";
import type { StatsTopic } from "./MapCard";

/**
 * The dashboard figures band. Instead of four equal stat cards, related metrics share one group
 * with one question, one headline, and one deep link. Every number maps to a named production
 * field (comments name the endpoint + field); the fabricated "Kartu diterbitkan" card is gone.
 * At komsat scope the organisasi group is omitted, mirroring production (no org tiles there).
 *
 * The band itself, its column steps, the group anatomy and the stacked bars come from
 * `ppij-design-system` (FiguresBand, DistributionBar); this file only selects the metrics and
 * their production contracts.
 */

interface FiguresBandProps {
  scope: Scope;
  onOpenTopic: (topic: StatsTopic) => void;
}

/** The band's own colour steps: the degree ramp and the completeness traffic lights. */
const DEGREE_SHADES = ["#c8102e", "#d85269", "#efbbc4"];
const DEGREE_REST = "#f1f2f3";
const COMPLETENESS_SHADES = ["#1E7A46", "#E2A02B", "#8A9099"];

/** Degree composition (production: `distributions.degree_level` items + other + unknown). */
function degreeSegments(distribution: Distribution) {
  const top = distribution.items.slice(0, 3);
  const rest = distribution.other + distribution.unknown + distribution.items.slice(3).reduce((sum, b: Bucket) => sum + b.count, 0);
  return [
    ...top.map((bucket, index) => ({ label: bucket.label, value: bucket.count, color: DEGREE_SHADES[index] })),
    ...(rest > 0 ? [{ label: "Lainnya", value: rest, color: DEGREE_REST }] : []),
  ];
}

/** Completeness (production: `completeness.lengkap` / `belum_lengkap` / `belum_aktivasi`). */
function completenessSegments(scope: Scope) {
  const c = statsByScope[scope].completeness;
  return [
    { label: "Lengkap", value: c.lengkap, color: COMPLETENESS_SHADES[0] },
    { label: "Belum lengkap", value: c.belum_lengkap, color: COMPLETENESS_SHADES[1] },
    { label: "Belum aktivasi", value: c.belum_aktivasi, color: COMPLETENESS_SHADES[2] },
  ];
}

export function FiguresBand({ scope, onOpenTopic }: FiguresBandProps) {
  const stats = statsByScope[scope];
  const degree = stats.distributions.degree_level;
  const mode = degree.items[0];
  const degreeTotal = degree.items.reduce((sum, b) => sum + b.count, 0) + degree.other + degree.unknown;
  const scopeKomsats = scope === "national" ? komsats : komsatsOfKorda("u-kanto");
  const delta = stats.tiles.new_this_month;
  const decimals = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const groups: FiguresBandGroup[] = [
    {
      label: "Anggota aktif",
      value: formatCount(stats.tiles.active_members),
      sub: (
        <>
          <strong>+{formatCount(delta)}</strong> baru bulan ini
          <FiguresBandSeparator />
          {mode.label} {Math.round((mode.count / degreeTotal) * 100)}%
        </>
      ),
      visual: (
        <DistributionBar
          segments={degreeSegments(degree)}
          legend="none"
          ariaLabel={`Komposisi jenjang studi, ${formatCount(degreeTotal)} anggota`}
        />
      ),
      linkLabel: "Statistik anggota",
      onSelect: () => onOpenTopic("anggota"),
    },
    {
      label: "Menunggu verifikasi",
      value: formatCount(stats.tiles.pending_verification),
      tone: "warn",
      sub: (
        <>
          {formatCount(stats.review.baru)} baru · {formatCount(stats.review.dikirim_ulang)} dikirim ulang · {formatCount(stats.review.diperiksa)} diperiksa
          {stats.avg_review_days_90d !== null ? (
            <>
              <FiguresBandSeparator />
              rata-rata {decimals.format(stats.avg_review_days_90d)} hari
            </>
          ) : null}
        </>
      ),
      linkLabel: "Statistik verifikasi",
      onSelect: () => onOpenTopic("verifikasi"),
    },
    {
      label: "Kartu & masa berlaku",
      value: formatCount(stats.tiles.cards_active),
      sub: (
        <>
          <strong>+{formatCount(stats.tiles.cards_issued_this_month)}</strong> kartu terbit bulan ini
          <FiguresBandSeparator />
          {formatCount(stats.tiles.expiring_within_60_days)} berlaku ≤ 60 hari
        </>
      ),
      visual: (
        <DistributionBar
          segments={completenessSegments(scope)}
          legend="inline"
          ariaLabel={`Kelengkapan berkas, ${formatCount(stats.completeness.active_total)} anggota`}
        />
      ),
      linkLabel: "Kelengkapan & kartu",
      onSelect: () => onOpenTopic("anggota"),
    },
  ];

  if (scope !== "komsat") {
    groups.push({
      label: "Organisasi",
      value: formatCount(scopeKomsats.length),
      sub: (
        <>
          {scope === "national" ? `di ${formatCount(kordas.length)} korda` : `wilayah Kanto · ${coverageKorda.prefectures.length} prefektur`}
          <FiguresBandSeparator />
          komsat aktif
        </>
      ),
      linkLabel: "Statistik organisasi",
      onSelect: () => onOpenTopic("organisasi"),
    });
  }

  return (
    <FiguresBandShell
      title="Angka kunci"
      description="Satu kelompok per pertanyaan; ketuk untuk membuka Statistik."
      groups={groups}
    />
  );
}
