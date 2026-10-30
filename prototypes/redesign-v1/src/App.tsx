import * as React from "react";
import { PortalView } from "./views/Portal";
import { ProfileView } from "./views/Profile";
import { AccountView, EntryView, ErrorView, GateView, InvitationView, MembershipScenario, memberStates, pick, PreviewShell, VerificationView, type ErrorState, type GateState, type InviteState, type Locale, type MemberState, type View } from "./views/Remaining";

const VIEWS: { id: View; idLabel: string; enLabel: string }[] = [
  { id: "portal", idLabel: "Beranda", enLabel: "Home" },
  { id: "profile", idLabel: "Profil", enLabel: "Profile" },
  { id: "verification", idLabel: "Verifikasi", enLabel: "Verification" },
  { id: "account", idLabel: "Akun", enLabel: "Account" },
  { id: "entry", idLabel: "Masuk", enLabel: "Entry" },
  { id: "gate", idLabel: "Akses", enLabel: "Access" },
  { id: "invitation", idLabel: "Undangan", enLabel: "Invitation" },
  { id: "error", idLabel: "Galat", enLabel: "Error" },
];

export function App() {
  const [view, setView] = React.useState<View>("portal");
  const [locale, setLocale] = React.useState<Locale>("id");
  const [memberState, setMemberState] = React.useState<MemberState>("active");
  const [gate, setGate] = React.useState<GateState>("verify_email");
  const [invite, setInvite] = React.useState<InviteState>("valid");
  const [error, setError] = React.useState<ErrorState>("session");
  const [controlsOpen, setControlsOpen] = React.useState(false);
  React.useEffect(() => {
    const navigateHash = () => {
      if (window.location.hash === "#akun") setView("account");
    };
    window.addEventListener("hashchange", navigateHash);
    return () => window.removeEventListener("hashchange", navigateHash);
  }, []);
  const scenario = view === "portal" || view === "verification" || view === "account" ? <ScenarioSelect label={pick(locale, "Status anggota", "Member status")} value={memberState} onChange={(value) => setMemberState(value as MemberState)} options={memberStates.map(({ value, id, en }) => [value, id, en])} locale={locale} />
    : view === "gate" ? <ScenarioSelect label={pick(locale, "Akses", "Access")} value={gate} onChange={(value) => setGate(value as GateState)} options={[["verify_email", "Verifikasi email", "Verify email"], ["completion", "Lengkapi data", "Complete profile"], ["email_bounced", "Email bermasalah", "Email problem"]]} locale={locale} />
    : view === "invitation" ? <ScenarioSelect label={pick(locale, "Undangan", "Invitation")} value={invite} onChange={(value) => setInvite(value as InviteState)} options={[["valid", "Aktif", "Valid"], ["expired", "Kedaluwarsa", "Expired"], ["cancelled", "Dibatalkan", "Cancelled"], ["used", "Digunakan", "Used"], ["invalid", "Tidak valid", "Invalid"], ["member", "Sudah anggota", "Already member"], ["recovery", "Gagal lanjut", "Recovery"]]} locale={locale} />
    : view === "error" ? <ScenarioSelect label={pick(locale, "Galat", "Error")} value={error} onChange={(value) => setError(value as ErrorState)} options={[["session", "Sesi", "Session"], ["forbidden", "Akses", "Forbidden"], ["notFound", "Tidak ditemukan", "Not found"], ["generic", "Umum", "Generic"]]} locale={locale} /> : null;
  const shell = (children: React.ReactNode) => <PreviewShell view={view} locale={locale} memberState={memberState} onView={setView} onLocale={setLocale}>{children}</PreviewShell>;
  return <div className="min-h-screen">
    {view === "portal" && (memberState === "active" ? <PortalView onNavigate={setView} locale={locale} onLocale={setLocale} /> : shell(<MembershipScenario state={memberState} locale={locale} onView={setView} />))}
    {view === "profile" && <ProfileView onNavigate={setView} locale={locale} onLocale={setLocale} />}
    {view === "verification" && shell(<VerificationView locale={locale} state={memberState} onView={setView} />)}
    {view === "account" && shell(<AccountView locale={locale} state={memberState} />)}
    {view === "entry" && shell(<EntryView locale={locale} onView={setView} />)}
    {view === "gate" && shell(<GateView locale={locale} gate={gate} onView={setView} />)}
    {view === "invitation" && shell(<InvitationView locale={locale} state={invite} onView={setView} />)}
    {view === "error" && shell(<ErrorView locale={locale} state={error} onView={setView} />)}
    <div className="fixed right-3 bottom-20 z-50 max-w-[calc(100vw-1.5rem)] rounded-xl bg-neutral-900/95 p-2 text-white shadow-lg md:bottom-4" aria-label={pick(locale, "Kontrol pratinjau", "Preview controls")}>
      <button type="button" aria-expanded={controlsOpen} onClick={() => setControlsOpen((open) => !open)} className="min-h-9 rounded-md px-3 text-xs font-semibold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white">{controlsOpen ? pick(locale, "Tutup pratinjau", "Close preview") : pick(locale, "Jelajahi pratinjau", "Explore preview")}</button>
      {controlsOpen && <div className="mt-2 grid max-h-[65vh] gap-3 overflow-y-auto border-t border-white/15 pt-3 sm:min-w-[340px]">
        <div role="tablist" aria-label={pick(locale, "Pilih halaman", "Choose page")} className="grid grid-cols-2 gap-1 sm:grid-cols-4">{VIEWS.map((item) => <button key={item.id} type="button" role="tab" aria-selected={view === item.id} onClick={() => setView(item.id)} className={view === item.id ? "min-h-9 rounded-md bg-white px-2 text-xs font-semibold text-neutral-900" : "min-h-9 rounded-md px-2 text-xs font-semibold text-white/80 hover:bg-white/10"}>{pick(locale, item.idLabel, item.enLabel)}</button>)}</div>
        <div className="flex flex-wrap items-center gap-2">{scenario}<label className="ml-auto flex items-center gap-2 text-xs font-semibold text-white/80"><span>{pick(locale, "Bahasa", "Language")}</span><select aria-label={pick(locale, "Bahasa pratinjau", "Preview language")} value={locale} onChange={(event) => setLocale(event.target.value as Locale)} className="min-h-9 rounded-md border border-white/20 bg-neutral-800 px-2 text-xs text-white"><option value="id">Indonesia</option><option value="en">English</option></select></label></div>
        <p className="text-[11px] text-white/60">{pick(locale, "Data contoh. Tindakan tidak dikirim ke server.", "Sample data. Actions are not sent to a server.")}</p>
      </div>}
    </div>
  </div>;
}

function ScenarioSelect({ label, value, onChange, options, locale }: { label: string; value: string; onChange: (value: string) => void; options: [string, string, string][]; locale: Locale }) {
  return <label className="flex min-w-0 items-center gap-2 text-xs font-semibold text-white/80"><span>{label}</span><select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-9 max-w-44 rounded-md border border-white/20 bg-neutral-800 px-2 text-xs text-white">{options.map(([key, id, en]) => <option key={key} value={key}>{pick(locale, id, en)}</option>)}</select></label>;
}
