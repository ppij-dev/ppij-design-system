import type { PromoBanner } from "./banners";
// @ts-expect-error Static banner artwork; the portal serves its own copies from /banners.
import b1d from "../../../brand/banners/banner_1.jpg";
// @ts-expect-error Static banner artwork; the portal serves its own copies from /banners.
import b1m from "../../../brand/banners/banner_1_mobile.jpg";
// @ts-expect-error Static banner artwork; the portal serves its own copies from /banners.
import b2d from "../../../brand/banners/banner_2.jpg";
// @ts-expect-error Static banner artwork; the portal serves its own copies from /banners.
import b2m from "../../../brand/banners/banner_2_mobile.jpg";
// @ts-expect-error Static banner artwork; the portal serves its own copies from /banners.
import b3d from "../../../brand/banners/banner_3.jpg";
// @ts-expect-error Static banner artwork; the portal serves its own copies from /banners.
import b3m from "../../../brand/banners/banner_3_mobile.jpg";
// @ts-expect-error Static banner artwork; the portal serves its own copies from /banners.
import b4d from "../../../brand/banners/banner_4.jpg";
// @ts-expect-error Static banner artwork; the portal serves its own copies from /banners.
import b4m from "../../../brand/banners/banner_4_mobile.jpg";

/**
 * The real banners.json entries from ppij-identity-sso (October
 * 2026) with the real artwork from brand/banners, for stories and
 * prototypes. Dates are JST; expired entries drop out by
 * themselves in BannerCarousel.
 */
export const SAMPLE_BANNERS: PromoBanner[] = [
  { id: "banner_4", image: { desktop: b4d, mobile: b4m }, alt: { id: "Webinar gratis Communication Survival Skills 2027 bersama John Robert Powers, Sabtu 31 Oktober 2026 pukul 14.00 WIB via Zoom. Daftar sekarang.", en: "Free Communication Survival Skills 2027 webinar with John Robert Powers, Saturday 31 October 2026, 14.00 WIB on Zoom. Register now." }, href: "https://bit.ly/CSSSeminar2026", start: "2026-10-24", end: "2026-11-01", order: 1 },
  { id: "banner_1", image: { desktop: b1d, mobile: b1m }, alt: { id: "Diskon 10% di Toko Indonesia Tokyo untuk anggota PPI Jepang", en: "10% off at Toko Indonesia Tokyo for PPI Japan members" }, href: "https://ppijepang.org", start: "2026-10-20", end: "2026-12-31", order: 2 },
  { id: "banner_2", image: { desktop: b2d, mobile: b2m }, alt: { id: "Gratis ongkir kirim paket ke Indonesia untuk anggota aktif", en: "Free shipping to Indonesia for active members" }, href: "https://ppijepang.org", start: "2026-10-20", end: "2026-12-31", order: 3 },
  { id: "banner_3", image: { desktop: b3d, mobile: b3m }, alt: { id: "Ski & Snowboard bareng PPI Okayama musim dingin ini. Daftar sekarang.", en: "Join the PPI Okayama Winter Ski and Snowboard trip. Register now." }, href: "https://ppijepang.org", start: "2026-10-21", order: 4 },
];
