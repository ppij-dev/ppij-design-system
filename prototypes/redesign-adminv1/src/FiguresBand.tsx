import type { ReactNode } from "react";
import { IconArrowRight } from "@tabler/icons-react";
import { komsats, komsatsOfKorda, kordas, type Scope } from "./mapData";
import { coverageKorda, formatCount, statsByScope, type Bucket, type Distribution } from "./statsData";
import type { StatsTopic } from "./MapCard";

/**
 * The dashboard figures band. Instead of four equal stat cards, related metrics share one group
 * with one question, one headline, and one deep link. Every number maps to a named production
 * field (comments name the endpoint + field); the fabricated "Kartu diterbitkan" card is gone.
 * At komsat scope the organisasi group is omitted, mirroring production (no org tiles there).
 */

interface FiguresBandProps {
  scope: Scope;
  onOpenTopic: (topic: StatsTopic) => void;
}

/** Degree composition mini bar (production: distributions.degree_level items + other + unknown). */
function MiniBar({ distribution, total }: { distribution: Distribution; total: number }) {
  const top = distribution.items.slice(0, 3);
  const rest = distribution.other + distribution.unknown + distribution.items.slice(3).reduce((sum, b: Bucket) => sum + b.count, 0);
  const shades = ["#c8102e", "#d85269", "#efbbc4"];
  return (
    <div
      className="figure-mini-bar"
      role="img"
      aria-label={top.map((b, i) => `${b.label} ${formatCount(b.count)}`).join(", ") + (rest > 0 ? `, lainnya ${formatCount(rest)}` : "")}
    >
      {top.map((bucket, i) => (
        <i key={bucket.key} style={{ width: `${(bucket.count / total) * 100}%`, background: shades[i] }} title={`${bucket.label}: ${formatCount(bucket.count)}`} />
      ))}
      {rest > 0 ? <i style={{ width: `${(rest / total) * 100}%`, background: "#f1f2f3" }} title={`Lainnya: ${formatCount(rest)}`} /> : null}
    </div>
  );
}

/** Completeness stacked bar (production: completeness lengkap/belum_lengkap/belum_aktivasi). */
function CompletenessBar({ scope }: { scope: Scope }) {
  const c = statsByScope[scope].completeness;
  const segments = [
    { label: "Lengkap", count: c.lengkap, background: "#1E7A46" },
    { label: "Belum lengkap", count: c.belum_lengkap, background: "#E2A02B" },
    { label: "Belum aktivasi", count: c.belum_aktivasi, background: "#8A9099" },
  ];
  return (
    <div>
      <div
        className="figure-stack"
        role="img"
        aria-label={segments.map((s) => `${s.label} ${formatCount(s.count)}`).join(", ")}
      >
        {segments.map((s) => (
          <i key={s.label} style={{ width: `${(s.count / c.active_total) * 100}%`, background: s.background }} title={`${s.label}: ${formatCount(s.count)}`} />
        ))}
      </div>
      <p className="figure-legend">
        {segments.map((s) => (
          <span key={s.label}>
            <i style={{ background: s.background }} /> {formatCount(s.count)}
          </span>
        ))}
      </p>
    </div>
  );
}

export function FiguresBand({ scope, onOpenTopic }: FiguresBandProps) {
  const stats = statsByScope[scope];
  const degree = stats.distributions.degree_level;
  const degreeTotal = degree.items.reduce((sum, b) => sum + b.count, 0) + degree.other + degree.unknown;
  const scopeKomsats = scope === "national" ? komsats : komsatsOfKorda("u-kanto");
  const delta = stats.tiles.new_this_month;

  const groups: {
    topic: StatsTopic;
    label: string;
    value: string;
    warn?: boolean;
    body: ReactNode;
    link: string;
  }[] = [
    {
      topic: "anggota",
      label: "Anggota aktif",
      value: formatCount(stats.tiles.active_members),
      body: (
        <>
          <p className="figure-sub">
            <strong>+{formatCount(delta)}</strong> baru bulan ini
            <span className="figure-sep" />
            {degree.items[0].label} {Math.round((degree.items[0].count / degreeTotal) * 100)}%
          </p>
          <MiniBar distribution={degree} total={degreeTotal} />
        </>
      ),
      link: "Statistik anggota",
    },
    {
      topic: "verifikasi",
      label: "Menunggu verifikasi",
      value: formatCount(stats.tiles.pending_verification),
      warn: true,
      body: (
        <p className="figure-sub">
          {formatCount(stats.review.baru)} baru · {formatCount(stats.review.dikirim_ulang)} dikirim ulang · {formatCount(stats.review.diperiksa)} diperiksa
          {stats.avg_review_days_90d !== null ? (
            <>
              <span className="figure-sep" />
              rata-rata {new Intl.NumberFormat("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(stats.avg_review_days_90d)} hari
            </>
          ) : null}
        </p>
      ),
      link: "Statistik verifikasi",
    },
    {
      topic: "anggota",
      label: "Berlaku 60 hari",
      value: formatCount(stats.tiles.expiring_within_60_days),
      body: <CompletenessBar scope={scope} />,
      link: "Kelengkapan data",
    },
  ];

  if (scope !== "komsat") {
    groups.push({
      topic: "organisasi",
      label: "Organisasi",
      value: formatCount(scopeKomsats.length),
      body: (
        <p className="figure-sub">
          {scope === "national" ? `di ${formatCount(kordas.length)} korda` : `wilayah Kanto · ${coverageKorda.prefectures.length} prefektur`}
          <span className="figure-sep" />
          komsat aktif
        </p>
      ),
      link: "Statistik organisasi",
    });
  }

  return (
    <section className="figures-band" aria-label="Angka kunci">
      <div className="band-head">
        <h2>Angka kunci</h2>
        <p>Satu kelompok per pertanyaan; ketuk untuk membuka Statistik.</p>
      </div>
      <div className="band-groups" data-count={groups.length}>
        {groups.map((group) => (
          <button key={group.label} type="button" className="figure-group" onClick={() => onOpenTopic(group.topic)}>
            <span className="figure-label">{group.label}</span>
            <span className={`figure-value${group.warn ? " warn" : ""}`}>{group.value}</span>
            {group.body}
            <span className="figure-link">{group.link} <IconArrowRight size={14} /></span>
          </button>
        ))}
      </div>
    </section>
  );
}
