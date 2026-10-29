import { IconHome, IconIdBadge2, IconSchool, IconUsers, IconCalendar } from "@tabler/icons-react";
import { MemberCardBlock, PortalShell, ServiceTiles, StatusCard } from "ppij-design-system";
import logoUrl from "../../../../brand/ppij-logo.png";

export function PortalView({ onNavigate }: { onNavigate: (view: "profile") => void }) {
  const go = (view: "profile") => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate(view);
  };
  return (
    <PortalShell
      logoSrc={logoUrl}
      navItems={[
        { label: "Beranda", href: "#", icon: <IconHome className="size-5" stroke={1.75} />, current: true },
        { label: "Profil", href: "#", icon: <IconIdBadge2 className="size-5" stroke={1.75} />, onClick: go("profile") },
      ]}
      languages={[{ label: "Bahasa Indonesia", current: true }, { label: "English" }]}
      accountItems={[
        { label: "Akun", href: "#" },
        { label: "Kebijakan Privasi", href: "#" },
        { label: "Syarat Layanan", href: "#" },
      ]}
      helpText="Butuh bantuan? Hubungi pengurus komsatmu atau sekretariat PPI Jepang."
      legalItems={[
        { label: "Kebijakan Privasi", href: "#" },
        { label: "Syarat Layanan", href: "#" },
      ]}
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-brand-ink">Halo, Darma</h1>
        <StatusCard compact icon={<IconIdBadge2 stroke={1.75} />} title="Kartu anggota aktif" actionLabel="Lihat profil" actionHref="#" onAction={() => onNavigate("profile")} />
        <div className="flex flex-col gap-5 md:grid md:grid-cols-[350px_minmax(0,1fr)] md:items-start md:gap-x-8 md:gap-y-6">
          {/* Entry point to the registration wizard. The wizard itself
              stays in the app; the design system records it in the
              Storybook Wizard section, so this card is inert here. */}
          <a
            href="#"
            className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-brand-border bg-card px-4 py-3 text-brand-ink hover:border-brand-red focus-visible:outline-2 focus-visible:outline-brand-red md:col-span-2"
          >
            <span>
              <span className="block text-xs font-semibold tracking-wide text-brand-muted uppercase">Lengkapi profilmu</span>
              <span className="block font-semibold">Tambahkan minat dan keahlianmu</span>
            </span>
            <span aria-hidden className="text-sm font-semibold text-brand-red">&rsaquo;</span>
          </a>
          <div className="md:sticky md:top-[72px]">
            <MemberCardBlock name="I Nyoman Darma Kotama" memberId="PPIJ-2026-000123" komsat="Okayama" affiliation="Okayama University" validUntil="Okt 2027" statusLabel="Aktif" backNote="Tunjukkan kartu ini saat verifikasi kehadiran." themes={[{ id: "kansai", label: "Kansai", group: "Korda", base: "#c8102e", faceTheme: "red" }, { id: "ppij-ink", label: "PPIJ Tinta", group: "PPIJ", base: "#1c1f23", faceTheme: "ink" }, { id: "sakura", label: "Sakura", group: "Musim", base: "#d77a94", faceTheme: "red" }, { id: "mega-mendung", label: "Mega Mendung", group: "Nusantara", base: "#31517f", faceTheme: "ink" }]} />
          </div>
          <ServiceTiles
            groups={[
              { heading: "Layanan nasional", icon: <IconSchool className="size-5" />, tiles: [{ title: "Pemira 2026", href: "#" }, { title: "Informasi beasiswa", href: "#" }, { title: "Layanan konsuler", href: "#" }] },
              { heading: "Korda Kansai", icon: <IconUsers className="size-5" />, tiles: [{ title: "Musyawarah wilayah", href: "#" }, { title: "Buku panduan anggota", href: "#" }] },
              { heading: "Komsat Okayama", icon: <IconCalendar className="size-5" />, tiles: [{ title: "Kalender kegiatan", href: "#" }, { title: "Mentoring mahasiswa baru", href: "#" }] },
            ]}
          />
        </div>
      </div>
    </PortalShell>
  );
}
