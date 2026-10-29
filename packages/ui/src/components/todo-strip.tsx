export interface TodoStripProps {
  heading: string;
  label: string;
  href: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * The Beranda "next steps" strip, extracted exactly from
 * ppij-identity-sso Beranda.tsx (the optional_todo element): a
 * full-width link card spanning both columns. Real copy:
 * heading "Langkah berikutnya", label "Tambahkan minat Anda
 * (opsional)", linking to the profile's interests section.
 */
export function TodoStrip({ heading, label, href, onClick }: TodoStripProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-brand-border bg-card px-4 py-3 text-brand-ink hover:border-brand-red focus-visible:outline-2 focus-visible:outline-brand-red md:col-span-2"
    >
      <span>
        <span className="block text-xs font-semibold tracking-wide text-brand-muted uppercase">{heading}</span>
        <span className="block font-semibold">{label}</span>
      </span>
      <span className="text-sm font-semibold text-brand-red" aria-hidden="true">
        &rsaquo;
      </span>
    </a>
  );
}
