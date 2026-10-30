import { IconHome, IconIdBadge2, IconSchool, IconUsers, IconCalendar } from "@tabler/icons-react";
import { BannerCarousel, MemberCardBlock, PortalShell, ServiceTiles, TodoStrip, type PromoBanner } from "ppij-design-system";
import logoUrl from "../../../../brand/ppij-logo.png";
import mapUrl from "../../../../brand/id-map.svg";
import b1d from "../../../../brand/banners/banner_1.jpg";
import b1m from "../../../../brand/banners/banner_1_mobile.jpg";
import b2d from "../../../../brand/banners/banner_2.jpg";
import b2m from "../../../../brand/banners/banner_2_mobile.jpg";
import b3d from "../../../../brand/banners/banner_3.jpg";
import b3m from "../../../../brand/banners/banner_3_mobile.jpg";
import b4d from "../../../../brand/banners/banner_4.jpg";
import b4m from "../../../../brand/banners/banner_4_mobile.jpg";
import { pick, type Locale, type View } from "./Remaining";

const BANNERS: PromoBanner[] = [
  { id: "banner_4", image: { desktop: b4d, mobile: b4m }, alt: { id: "Webinar gratis Communication Survival Skills 2027 bersama John Robert Powers, Sabtu 31 Oktober 2026 pukul 14.00 WIB via Zoom. Daftar sekarang.", en: "Free Communication Survival Skills 2027 webinar with John Robert Powers, Saturday 31 October 2026, 14.00 WIB on Zoom. Register now." }, href: "https://bit.ly/CSSSeminar2026", start: "2026-10-24", end: "2026-11-01", order: 1 },
  { id: "banner_1", image: { desktop: b1d, mobile: b1m }, alt: { id: "Diskon 10% di Toko Indonesia Tokyo untuk anggota PPI Jepang", en: "10% off at Toko Indonesia Tokyo for PPI Japan members" }, href: "https://ppijepang.org", start: "2026-10-20", end: "2026-12-31", order: 2 },
  { id: "banner_2", image: { desktop: b2d, mobile: b2m }, alt: { id: "Gratis ongkir kirim paket ke Indonesia untuk anggota aktif", en: "Free shipping to Indonesia for active members" }, href: "https://ppijepang.org", start: "2026-10-20", end: "2026-12-31", order: 3 },
  { id: "banner_3", image: { desktop: b3d, mobile: b3m }, alt: { id: "Ski & Snowboard bareng PPI Okayama musim dingin ini. Daftar sekarang.", en: "Join the PPI Okayama Winter Ski and Snowboard trip. Register now." }, href: "https://ppijepang.org", start: "2026-10-21", order: 4 },
];

export function PortalView({ onNavigate, locale, onLocale }: { onNavigate: (view: View) => void; locale: Locale; onLocale: (locale: Locale) => void }) {
  const go = (view: View) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate(view);
  };
  return (
    <PortalShell
      logoSrc={logoUrl}
      navItems={[
        { label: pick(locale, "Beranda", "Home"), href: "#", icon: <IconHome className="size-5" stroke={1.75} />, current: true },
        { label: pick(locale, "Profil", "Profile"), href: "#", icon: <IconIdBadge2 className="size-5" stroke={1.75} />, onClick: go("profile") },
      ]}
      languages={[{ label: "Bahasa Indonesia", current: locale === "id", onSelect: () => onLocale("id") }, { label: "English", current: locale === "en", onSelect: () => onLocale("en") }]}
      accountItems={[
        { label: pick(locale, "Akun", "Account"), href: "#akun" },
        { label: pick(locale, "Kebijakan Privasi", "Privacy policy"), href: "#privasi" },
        { label: pick(locale, "Syarat Layanan", "Terms of service"), href: "#syarat" },
      ]}
      helpText={pick(locale, "Butuh bantuan? Hubungi pengurus komsatmu atau sekretariat PPI Jepang.", "Need help? Contact your local PPI committee or the PPI Japan secretariat.")}
      legalItems={[
        { label: pick(locale, "Kebijakan Privasi", "Privacy policy"), href: "#privasi" },
        { label: pick(locale, "Syarat Layanan", "Terms of service"), href: "#syarat" },
      ]}
    >
      <div className="flex flex-col gap-5">
        <BannerCarousel banners={BANNERS} locale={locale} />
        <h1 className="text-2xl font-bold text-brand-ink">{pick(locale, "Halo, Darma", "Hello, Darma")}</h1>
        <div className="flex flex-col gap-5 md:grid md:grid-cols-[350px_minmax(0,1fr)] md:items-start md:gap-x-8 md:gap-y-6">
          <TodoStrip heading={pick(locale, "Langkah berikutnya", "Next step")} label={pick(locale, "Tambahkan minat Anda (opsional)", "Add your interests (optional)")} href="#" onClick={go("profile")} />
          <div className="md:sticky md:top-[72px]">
            <MemberCardBlock locale={locale} memberId="PPIJ-2026-000123" name="I Nyoman Darma Kotama" number="PPIJ-2026-000123" komsat="Okayama" korda="PPI Kansai" validUntil="2027-10-31" state="active" logoSrc={logoUrl} mapSrc={mapUrl} />
          </div>
          <ServiceTiles
            groups={[
              { heading: pick(locale, "Layanan nasional", "National services"), icon: <IconSchool className="size-5" />, tiles: [{ title: "Pemira 2026", href: "#" }, { title: pick(locale, "Informasi beasiswa", "Scholarships"), href: "#" }, { title: pick(locale, "Layanan konsuler", "Consular services"), href: "#" }] },
              { heading: "Korda Kansai", icon: <IconUsers className="size-5" />, tiles: [{ title: pick(locale, "Musyawarah wilayah", "Regional assembly"), href: "#" }, { title: pick(locale, "Buku panduan anggota", "Member guide"), href: "#" }] },
              { heading: "Komsat Okayama", icon: <IconCalendar className="size-5" />, tiles: [{ title: pick(locale, "Kalender kegiatan", "Events calendar"), href: "#" }, { title: pick(locale, "Mentoring mahasiswa baru", "New student mentoring"), href: "#" }] },
            ]}
          />
        </div>
      </div>
    </PortalShell>
  );
}
