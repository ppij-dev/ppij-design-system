/** Decorative catalog; membership state and affiliation never derive from these IDs. */
export interface CardTheme {
  id: string;
  group: "korda" | "nusantara" | "seasons" | "ppij";
  labelId: string;
  labelEn: string;
  base: string;
  asset: string;
  width: number;
  height: number;
  viewBox: string;
}
export const cardThemes: readonly CardTheme[] = [
  {
    "id": "korda-hokkaido",
    "group": "korda",
    "labelId": "Hokkaido",
    "labelEn": "Hokkaido",
    "base": "#FAFAFA",
    "asset": "/card-themes/korda-hokkaido.png",
    "width": 1581,
    "height": 995,
    "viewBox": "790.5 139.3 774.7 646.8"
  },
  {
    "id": "korda-tohoku",
    "group": "korda",
    "labelId": "Tohoku",
    "labelEn": "Tohoku",
    "base": "#FAFAFA",
    "asset": "/card-themes/korda-tohoku.png",
    "width": 1579,
    "height": 996,
    "viewBox": "789.5 139.4 773.7 647.4"
  },
  {
    "id": "korda-kanto",
    "group": "korda",
    "labelId": "Kanto",
    "labelEn": "Kanto",
    "base": "#FAFAFA",
    "asset": "/card-themes/korda-kanto.png",
    "width": 1580,
    "height": 995,
    "viewBox": "790.0 139.3 774.2 646.8"
  },
  {
    "id": "korda-hokuriku",
    "group": "korda",
    "labelId": "Hokuriku",
    "labelEn": "Hokuriku",
    "base": "#FAFAFA",
    "asset": "/card-themes/korda-hokuriku.png",
    "width": 1579,
    "height": 996,
    "viewBox": "789.5 139.4 773.7 647.4"
  },
  {
    "id": "korda-chubu",
    "group": "korda",
    "labelId": "Chubu",
    "labelEn": "Chubu",
    "base": "#FAFAFA",
    "asset": "/card-themes/korda-chubu.png",
    "width": 1579,
    "height": 996,
    "viewBox": "789.5 139.4 773.7 647.4"
  },
  {
    "id": "korda-kansai",
    "group": "korda",
    "labelId": "Kansai",
    "labelEn": "Kansai",
    "base": "#FAFAFA",
    "asset": "/card-themes/korda-kansai.png",
    "width": 1580,
    "height": 996,
    "viewBox": "790.0 139.4 774.2 647.4"
  },
  {
    "id": "korda-shikoku",
    "group": "korda",
    "labelId": "Shikoku",
    "labelEn": "Shikoku",
    "base": "#FAFAFA",
    "asset": "/card-themes/korda-shikoku.png",
    "width": 1579,
    "height": 996,
    "viewBox": "789.5 139.4 773.7 647.4"
  },
  {
    "id": "korda-chugoku",
    "group": "korda",
    "labelId": "Chugoku",
    "labelEn": "Chugoku",
    "base": "#FAFAFA",
    "asset": "/card-themes/korda-chugoku.png",
    "width": 1580,
    "height": 995,
    "viewBox": "790.0 139.3 774.2 646.8"
  },
  {
    "id": "korda-kitakyushu-okinawa",
    "group": "korda",
    "labelId": "Kitakyushu–Okinawa",
    "labelEn": "Kitakyushu–Okinawa",
    "base": "#FAFAFA",
    "asset": "/card-themes/korda-kitakyushu-okinawa.png",
    "width": 1579,
    "height": 996,
    "viewBox": "789.5 139.4 773.7 647.4"
  },
  {
    "id": "nusantara-sumatera-barat-rumah-gadang",
    "group": "nusantara",
    "labelId": "Sumatera Barat · Rumah Gadang",
    "labelEn": "Sumatera Barat · Rumah Gadang",
    "base": "#F3F7FC",
    "asset": "/card-themes/nusantara-sumatera-barat-rumah-gadang.png",
    "width": 1579,
    "height": 996,
    "viewBox": "789.5 139.4 773.7 647.4"
  },
  {
    "id": "nusantara-sumatera-utara-rumah-bolon",
    "group": "nusantara",
    "labelId": "Sumatera Utara · Rumah Bolon",
    "labelEn": "Sumatera Utara · Rumah Bolon",
    "base": "#F3F7F1",
    "asset": "/card-themes/nusantara-sumatera-utara-rumah-bolon.png",
    "width": 1580,
    "height": 996,
    "viewBox": "790.0 139.4 774.2 647.4"
  },
  {
    "id": "nusantara-jakarta-monas",
    "group": "nusantara",
    "labelId": "Jakarta · Monas",
    "labelEn": "Jakarta · Monas",
    "base": "#F3F7FC",
    "asset": "/card-themes/nusantara-jakarta-monas.png",
    "width": 1580,
    "height": 996,
    "viewBox": "790.0 139.4 774.2 647.4"
  },
  {
    "id": "nusantara-jawa-barat-angklung",
    "group": "nusantara",
    "labelId": "Jawa Barat · Angklung",
    "labelEn": "Jawa Barat · Angklung",
    "base": "#F3F7F1",
    "asset": "/card-themes/nusantara-jawa-barat-angklung.png",
    "width": 1579,
    "height": 996,
    "viewBox": "789.5 139.4 773.7 647.4"
  },
  {
    "id": "nusantara-jawa-tengah-borobudur",
    "group": "nusantara",
    "labelId": "Jawa Tengah · Borobudur",
    "labelEn": "Jawa Tengah · Borobudur",
    "base": "#FBF6ED",
    "asset": "/card-themes/nusantara-jawa-tengah-borobudur.png",
    "width": 1580,
    "height": 996,
    "viewBox": "790.0 139.4 774.2 647.4"
  },
  {
    "id": "nusantara-yogyakarta-tugu",
    "group": "nusantara",
    "labelId": "Yogyakarta · Tugu",
    "labelEn": "Yogyakarta · Tugu",
    "base": "#F3F7FC",
    "asset": "/card-themes/nusantara-yogyakarta-tugu.png",
    "width": 1580,
    "height": 996,
    "viewBox": "790.0 139.4 774.2 647.4"
  },
  {
    "id": "nusantara-jawa-timur-tugu-pahlawan",
    "group": "nusantara",
    "labelId": "Jawa Timur · Tugu Pahlawan",
    "labelEn": "Jawa Timur · Tugu Pahlawan",
    "base": "#FBF6ED",
    "asset": "/card-themes/nusantara-jawa-timur-tugu-pahlawan.png",
    "width": 1580,
    "height": 995,
    "viewBox": "790.0 139.3 774.2 646.8"
  },
  {
    "id": "nusantara-bali-ulun-danu",
    "group": "nusantara",
    "labelId": "Bali · Ulun Danu Beratan",
    "labelEn": "Bali · Ulun Danu Beratan",
    "base": "#F3F7FC",
    "asset": "/card-themes/nusantara-bali-ulun-danu.png",
    "width": 1579,
    "height": 996,
    "viewBox": "789.5 139.4 773.7 647.4"
  },
  {
    "id": "nusantara-ntb-lumbung",
    "group": "nusantara",
    "labelId": "NTB · Lumbung Sasak",
    "labelEn": "NTB · Lumbung Sasak",
    "base": "#F3F7F1",
    "asset": "/card-themes/nusantara-ntb-lumbung.png",
    "width": 1580,
    "height": 996,
    "viewBox": "790.0 139.4 774.2 647.4"
  },
  {
    "id": "nusantara-ntt-sumba-house",
    "group": "nusantara",
    "labelId": "NTT · Rumah Sumba",
    "labelEn": "NTT · Rumah Sumba",
    "base": "#FBF6ED",
    "asset": "/card-themes/nusantara-ntt-sumba-house.png",
    "width": 1579,
    "height": 996,
    "viewBox": "789.5 139.4 773.7 647.4"
  },
  {
    "id": "nusantara-kalimantan-tengah-betang",
    "group": "nusantara",
    "labelId": "Kalimantan Tengah · Huma Betang",
    "labelEn": "Kalimantan Tengah · Huma Betang",
    "base": "#F3F7F1",
    "asset": "/card-themes/nusantara-kalimantan-tengah-betang.png",
    "width": 1579,
    "height": 996,
    "viewBox": "789.5 139.4 773.7 647.4"
  },
  {
    "id": "nusantara-sulawesi-selatan-tongkonan",
    "group": "nusantara",
    "labelId": "Sulawesi Selatan · Tongkonan",
    "labelEn": "Sulawesi Selatan · Tongkonan",
    "base": "#FBF6ED",
    "asset": "/card-themes/nusantara-sulawesi-selatan-tongkonan.png",
    "width": 1579,
    "height": 996,
    "viewBox": "789.5 139.4 773.7 647.4"
  },
  {
    "id": "nusantara-maluku-baileo",
    "group": "nusantara",
    "labelId": "Maluku · Baileo",
    "labelEn": "Maluku · Baileo",
    "base": "#F3F7FC",
    "asset": "/card-themes/nusantara-maluku-baileo.png",
    "width": 1580,
    "height": 996,
    "viewBox": "790.0 139.4 774.2 647.4"
  },
  {
    "id": "nusantara-papua-pegunungan-honai",
    "group": "nusantara",
    "labelId": "Papua Pegunungan · Honai",
    "labelEn": "Papua Pegunungan · Honai",
    "base": "#F3F7F1",
    "asset": "/card-themes/nusantara-papua-pegunungan-honai.png",
    "width": 1579,
    "height": 996,
    "viewBox": "789.5 139.4 773.7 647.4"
  },
  {
    "id": "ppij-national",
    "group": "ppij",
    "labelId": "PPI Jepang",
    "labelEn": "PPI Japan",
    "base": "#FAFAFA",
    "asset": "/card-themes/ppij-national.svg",
    "width": 1000,
    "height": 1000,
    "viewBox": "0 0 1000 1000"
  },
  {
    "id": "season-spring",
    "group": "seasons",
    "labelId": "Musim semi · Sakura",
    "labelEn": "Spring · Sakura",
    "base": "#F3F7FC",
    "asset": "/card-themes/season-spring.png",
    "width": 1580,
    "height": 996,
    "viewBox": "790.0 139.4 774.2 647.4"
  },
  {
    "id": "season-summer",
    "group": "seasons",
    "labelId": "Musim panas · Matsuri",
    "labelEn": "Summer · Matsuri",
    "base": "#F3F7F1",
    "asset": "/card-themes/season-summer.png",
    "width": 1579,
    "height": 996,
    "viewBox": "789.5 139.4 773.7 647.4"
  },
  {
    "id": "season-autumn",
    "group": "seasons",
    "labelId": "Musim gugur · Momiji",
    "labelEn": "Autumn · Momiji",
    "base": "#FBF6ED",
    "asset": "/card-themes/season-autumn.png",
    "width": 1579,
    "height": 996,
    "viewBox": "789.5 139.4 773.7 647.4"
  },
  {
    "id": "season-winter",
    "group": "seasons",
    "labelId": "Musim dingin · Salju",
    "labelEn": "Winter · Snow",
    "base": "#F3F7FC",
    "asset": "/card-themes/season-winter.svg",
    "width": 1000,
    "height": 1000,
    "viewBox": "0 0 1000 1000"
  }
];

const byId = new Map(cardThemes.map(theme => [theme.id, theme]));

// The theme id for Kyushu-Okinawa keeps the catalogue's older "kitakyushu" spelling.
const kordaThemeAliases: Record<string, string> = { "kyushu-okinawa": "kitakyushu-okinawa" };

// The saved value comes from the member preference API (server-side, per member_id), so it
// loads on every device. An id the current catalogue no longer publishes falls back to the
// korda default — catalogue changes never strand a stored preference.
export function resolveCardTheme(korda: string | null | undefined, saved: string | null): CardTheme {
  // /v1/me carries the korda unit's display name as the seed spells it ("PPI Kanto"; one slug
  // is "korda-hokkaido"), so the lookup drops those prefixes before matching the catalogue.
  // A body without membership.korda (older payloads, test stubs) falls back to the national
  // theme; the decorative card must never crash the home page.
  const bare = (korda ?? "").trim().toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, "-").replace(/^(?:ppi-)?(?:korda-)?/, "");
  const slug = kordaThemeAliases[bare] ?? bare;
  return (saved && byId.get(saved)) || byId.get(`korda-${slug}`) || byId.get("ppij-national")!;
}
