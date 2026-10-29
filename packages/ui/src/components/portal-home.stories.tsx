import type { Meta, StoryObj } from "@storybook/react";
import { IconHome, IconIdBadge2, IconSchool, IconUsers, IconCalendar } from "@tabler/icons-react";
import { PortalShell } from "./portal-shell";
import { StatusCard } from "./status-card";
import { ServiceTiles } from "./service-tiles";
import { MemberCardBlock } from "./member-card-block";
import { BannerCarousel } from "./banner-carousel";
import { TodoStrip } from "./todo-strip";
import { InvitationCard } from "./invitation-card";
import { SAMPLE_BANNERS } from "../sample-banners";
// @ts-expect-error Static brand asset; the portal supplies its own served copy.
import logoUrl from "../../../../brand/ppij-logo.png";
// @ts-expect-error Static brand asset; the portal supplies its own served copy.
import mapUrl from "../../../../brand/id-map.svg";

const meta: Meta = { title: "Portal/PortalHome", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;

const SHELL = {
  logoSrc: logoUrl,
  navItems: [
    { label: "Beranda", href: "#", icon: <IconHome className="size-5" stroke={1.75} />, current: true },
    { label: "Profil", href: "#", icon: <IconIdBadge2 className="size-5" stroke={1.75} /> },
  ],
  languages: [{ label: "Bahasa Indonesia", current: true }, { label: "English" }],
  accountItems: [{ label: "Akun", href: "#" }, { label: "Kebijakan Privasi", href: "#" }, { label: "Syarat Layanan", href: "#" }],
  helpText: "Butuh bantuan? Hubungi pengurus komsatmu atau sekretariat PPI Jepang.",
  legalItems: [{ label: "Kebijakan Privasi", href: "#" }, { label: "Syarat Layanan", href: "#" }],
} as const;

const TILES = [
  { heading: "Layanan nasional", icon: <IconSchool className="size-5" />, tiles: [{ title: "Pemira 2026", href: "#" }, { title: "Informasi beasiswa", href: "#" }, { title: "Layanan konsuler", href: "#" }] },
  { heading: "Korda Kansai", icon: <IconUsers className="size-5" />, tiles: [{ title: "Musyawarah wilayah", href: "#" }, { title: "Buku panduan anggota", href: "#" }] },
  { heading: "Komsat Okayama", icon: <IconCalendar className="size-5" />, tiles: [{ title: "Kalender kegiatan", href: "#" }, { title: "Mentoring mahasiswa baru", href: "#" }] },
];

/**
 * Beranda as the portal composes it (Beranda.tsx): promo banner
 * first, greeting, the todo strip and invitation inside the grid,
 * then the member card sticky beside the services. An active
 * membership shows no StatusCard; non-active states do.
 */
export const Active: Story = {
  render: () => (
    <PortalShell {...SHELL}>
      <div className="flex flex-col gap-5">
        <BannerCarousel banners={SAMPLE_BANNERS} />
        <h1 className="text-2xl font-bold text-brand-ink">Halo, Darma</h1>
        <div className="flex flex-col gap-5 md:grid md:grid-cols-[350px_minmax(0,1fr)] md:items-start md:gap-x-8 md:gap-y-6">
          <TodoStrip heading="Langkah berikutnya" label="Tambahkan minat Anda (opsional)" href="#" />
          <div className="md:sticky md:top-[72px]">
            <MemberCardBlock locale="id" memberId="PPIJ-2026-000123" name="I Nyoman Darma Kotama" number="PPIJ-2026-000123" komsat="Okayama" korda="PPI Kansai" validUntil="2027-10-31" state="active" logoSrc={logoUrl} mapSrc={mapUrl} />
          </div>
          <ServiceTiles groups={TILES} />
        </div>
      </div>
    </PortalShell>
  ),
};

export const WithInvitation: Story = {
  render: () => (
    <PortalShell {...SHELL}>
      <div className="flex flex-col gap-5">
        <BannerCarousel banners={SAMPLE_BANNERS} />
        <h1 className="text-2xl font-bold text-brand-ink">Halo, Darma</h1>
        <div className="flex flex-col gap-5 md:grid md:grid-cols-[350px_minmax(0,1fr)] md:items-start md:gap-x-8 md:gap-y-6">
          <InvitationCard heading="Undangan peran" body="Anda diundang sebagai Pengurus di Komsat Okayama. Berlaku sampai 30 November 2026." actionLabel="Lihat undangan" href="#" />
          <div className="md:sticky md:top-[72px]">
            <MemberCardBlock locale="id" memberId="PPIJ-2026-000123" name="I Nyoman Darma Kotama" number="PPIJ-2026-000123" komsat="Okayama" korda="PPI Kansai" validUntil="2027-10-31" state="active" logoSrc={logoUrl} mapSrc={mapUrl} />
          </div>
          <ServiceTiles groups={TILES} />
        </div>
      </div>
    </PortalShell>
  ),
};

export const Expiring: Story = {
  render: () => (
    <PortalShell {...SHELL}>
      <div className="flex flex-col gap-5">
        <BannerCarousel banners={SAMPLE_BANNERS} />
        <h1 className="text-2xl font-bold text-brand-ink">Halo, Darma</h1>
        <StatusCard compact icon={<IconIdBadge2 stroke={1.75} />} title="Kartu anggota berakhir 15 Nov 2026" actionLabel="Perpanjang" actionHref="#" tone="warning" />
        <div className="flex flex-col gap-5 md:grid md:grid-cols-[350px_minmax(0,1fr)] md:items-start md:gap-x-8 md:gap-y-6">
          <div className="md:sticky md:top-[72px]">
            <MemberCardBlock locale="id" memberId="PPIJ-2026-000123" name="I Nyoman Darma Kotama" number="PPIJ-2026-000123" komsat="Okayama" korda="PPI Kansai" validUntil="2026-11-15" state="expiring" logoSrc={logoUrl} mapSrc={mapUrl} />
          </div>
          <ServiceTiles groups={TILES} />
        </div>
      </div>
    </PortalShell>
  ),
};
