import { IconWifiOff } from "@tabler/icons-react";

export interface OfflineBannerProps {
  /** Rendered only when true; the consumer owns the online check (the app uses its useOnline hook). */
  show?: boolean;
  /** Defaults to the app's id string; pass the en string or any label to override. */
  label?: string;
}

/**
 * Offline banner, extracted exactly from ppij-identity-sso
 * portal/OfflineBanner.tsx: an amber strip under the header (it sits
 * in PortalShell's banner slot) shown while the browser reports no
 * network. Copy: "Tidak ada koneksi. Data Anda tersimpan." /
 * "No connection. Your data is saved."
 */
export function OfflineBanner({ show = true, label = "Tidak ada koneksi. Data Anda tersimpan." }: OfflineBannerProps) {
  if (!show) return null;
  return (
    <div role="status" className="border-b border-amber-300 bg-amber-50 text-amber-900">
      <p className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-2 text-sm font-semibold">
        <IconWifiOff className="size-4 shrink-0" aria-hidden="true" />
        {label}
      </p>
    </div>
  );
}
