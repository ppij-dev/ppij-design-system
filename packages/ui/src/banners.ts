/**
 * Promo banner data contract, ported from ppij-identity-sso
 * web/src/lib/banners.ts. The build-time validator (validateBanners /
 * loadPromoBanners) stays in the app; the browser-side selection
 * (activeBanners, jstToday) ships here so consumers render exactly
 * what the portal renders.
 */
export interface PromoBanner {
  id: string;
  /** Public paths: desktop 970 x 250 (shown from 768 px), mobile 320 x 100. Both shipped at 2x. */
  image: { desktop: string; mobile: string };
  alt: { id: string; en: string };
  href: string;
  /** JST calendar dates, YYYY-MM-DD. Both optional. */
  start?: string;
  end?: string;
  order: number;
  /** false keeps an entry in the file but out of the site (placeholders until the real link and dates are known). */
  active?: boolean;
}

export const MAX_ACTIVE = 5;

function isActive(b: PromoBanner): boolean {
  return b.active !== false;
}

function coversDay(b: PromoBanner, day: string): boolean {
  return (!b.start || b.start <= day) && (!b.end || day <= b.end);
}

/** Entries active on `today`, in `order`, at most MAX_ACTIVE. Used in the browser, so an expired promotion drops out without a deploy. */
export function activeBanners(all: PromoBanner[], today: string): PromoBanner[] {
  return all
    .filter((b) => isActive(b) && coversDay(b, today))
    .sort((a, b) => a.order - b.order)
    .slice(0, MAX_ACTIVE);
}

/** Today's JST calendar date, YYYY-MM-DD. */
export function jstToday(now: Date = new Date()): string {
  return new Date(now.getTime() + 9 * 3_600_000).toISOString().slice(0, 10);
}
