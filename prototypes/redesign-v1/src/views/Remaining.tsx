import * as React from "react";
import {
  IconAlertCircle, IconAlertTriangle, IconBan, IconCalendar, IconCheck,
  IconClipboardCheck, IconClockHour4, IconClockX, IconHome, IconIdBadge2,
  IconLink, IconLock, IconLockAccess, IconLogout, IconMail, IconMailOpened,
  IconRefresh, IconShieldCheck, IconShieldLock, IconUserCircle, IconUserPlus,
} from "@tabler/icons-react";
import {
  Alert, AlertDescription, AlertTitle, Badge, Button, Card, Empty,
  EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle,
  PageHeader, PortalShell, StatusCard, Timeline,
} from "ppij-design-system";
import logoUrl from "../../../../brand/ppij-logo.png";

export type Locale = "id" | "en";
export type View = "portal" | "profile" | "verification" | "account" | "entry" | "gate" | "invitation" | "error";
export type MemberState = "active" | "none" | "draft" | "submitted" | "needs_changes" | "resubmitted" | "rejected" | "expiring" | "change_pending" | "expired_grace" | "expired" | "suspended" | "revoked";
export type GateState = "verify_email" | "completion" | "email_bounced";
export type InviteState = "valid" | "expired" | "cancelled" | "used" | "invalid" | "member" | "recovery";
export type ErrorState = "session" | "forbidden" | "notFound" | "generic";

export const memberStates: { value: MemberState; id: string; en: string }[] = [
  { value: "active", id: "Aktif", en: "Active" },
  { value: "none", id: "Belum mendaftar", en: "Not registered" },
  { value: "draft", id: "Draf pendaftaran", en: "Registration draft" },
  { value: "submitted", id: "Menunggu verifikasi", en: "Awaiting review" },
  { value: "needs_changes", id: "Perlu diperbaiki", en: "Changes requested" },
  { value: "resubmitted", id: "Dikirim kembali", en: "Resubmitted" },
  { value: "rejected", id: "Tidak disetujui", en: "Not approved" },
  { value: "expiring", id: "Segera berakhir", en: "Expiring soon" },
  { value: "change_pending", id: "Perubahan menunggu", en: "Change pending" },
  { value: "expired_grace", id: "Masa tenggang", en: "Grace period" },
  { value: "expired", id: "Keanggotaan berakhir", en: "Expired" },
  { value: "suspended", id: "Ditangguhkan", en: "Suspended" },
  { value: "revoked", id: "Dicabut", en: "Revoked" },
];

export const pick = (locale: Locale, id: string, en: string) => locale === "id" ? id : en;

export function PreviewShell({ view, locale, memberState, onView, onLocale, children }: {
  view: View; locale: Locale; memberState: MemberState; onView: (view: View) => void; onLocale: (locale: Locale) => void; children: React.ReactNode;
}) {
  const nav = memberState === "revoked" ? (["portal"] as View[]) :
    ["none", "draft", "submitted", "needs_changes", "resubmitted", "rejected"].includes(memberState)
      ? (["portal", "verification"] as View[]) : (["portal", "profile"] as View[]);
  const navMeta: Record<string, { icon: React.ReactNode; id: string; en: string }> = {
    portal: { icon: <IconHome className="size-5" />, id: "Beranda", en: "Home" },
    profile: { icon: <IconIdBadge2 className="size-5" />, id: "Profil", en: "Profile" },
    verification: { icon: <IconShieldCheck className="size-5" />, id: "Verifikasi", en: "Verification" },
  };
  return <PortalShell
    logoSrc={logoUrl}
    homeHref="#"
    navItems={nav.map((key) => ({ label: pick(locale, navMeta[key].id, navMeta[key].en), icon: navMeta[key].icon, href: "#", current: view === key, onClick: (event) => { event.preventDefault(); onView(key); } }))}
    languages={[{ label: "Bahasa Indonesia", current: locale === "id", onSelect: () => onLocale("id") }, { label: "English", current: locale === "en", onSelect: () => onLocale("en") }]}
    languageLabel={pick(locale, "Bahasa", "Language")}
    accountLabel={pick(locale, "Menu akun", "Account menu")}
    accountItems={[{ label: pick(locale, "Akun", "Account"), href: "#akun" }, { label: pick(locale, "Kebijakan Privasi", "Privacy policy"), href: "#privasi" }, { label: pick(locale, "Syarat Layanan", "Terms of service"), href: "#syarat" }]}
    helpText={pick(locale, "Butuh bantuan? Hubungi pengurus komsatmu atau sekretariat PPI Jepang.", "Need help? Contact your local PPI committee or the PPI Japan secretariat.")}
    legalItems={[{ label: pick(locale, "Kebijakan Privasi", "Privacy policy"), href: "#privasi" }, { label: pick(locale, "Syarat Layanan", "Terms of service"), href: "#syarat" }]}
  >{children}</PortalShell>;
}

const statuses: Record<MemberState, { id: string; en: string; bodyId: string; bodyEn: string; actionId?: string; actionEn?: string; tone: "default" | "warning" | "danger" | "info" | "muted"; icon: React.ReactNode; target?: View }> = {
  active: { id: "Keanggotaan aktif", en: "Membership active", bodyId: "Kartu anggota Anda siap digunakan.", bodyEn: "Your member card is ready to use.", tone: "default", icon: <IconCheck /> },
  none: { id: "Mulai pendaftaran anggota", en: "Start your membership registration", bodyId: "Isi data pendaftaran untuk bergabung dengan PPI Jepang.", bodyEn: "Complete your registration to join PPI Japan.", actionId: "Mulai pendaftaran", actionEn: "Start registration", tone: "info", icon: <IconUserPlus />, target: "entry" },
  draft: { id: "Lanjutkan draf pendaftaran", en: "Continue your registration draft", bodyId: "Data yang sudah diisi tetap tersimpan.", bodyEn: "Your earlier answers are saved.", actionId: "Lanjutkan", actionEn: "Continue", tone: "info", icon: <IconClipboardCheck />, target: "entry" },
  submitted: { id: "Pendaftaran sedang ditinjau", en: "Registration under review", bodyId: "Pengurus komsat akan memeriksa pendaftaran Anda. Lihat perkembangan di Verifikasi.", bodyEn: "Your local committee is reviewing your registration. Follow updates in Verification.", actionId: "Lihat verifikasi", actionEn: "View verification", tone: "info", icon: <IconClockHour4 />, target: "verification" },
  needs_changes: { id: "Perubahan diperlukan", en: "Changes requested", bodyId: "Pengurus meminta perbaikan pada pendaftaran Anda. Baca tanggapan sebelum mengirim kembali.", bodyEn: "A reviewer requested changes. Read the feedback before resubmitting.", actionId: "Lihat tanggapan", actionEn: "Read feedback", tone: "warning", icon: <IconAlertCircle />, target: "verification" },
  resubmitted: { id: "Perbaikan sudah dikirim", en: "Changes resubmitted", bodyId: "Pendaftaran Anda kembali dalam peninjauan.", bodyEn: "Your registration is back in review.", actionId: "Lihat verifikasi", actionEn: "View verification", tone: "info", icon: <IconClockHour4 />, target: "verification" },
  rejected: { id: "Pendaftaran belum disetujui", en: "Registration not approved", bodyId: "Lihat keputusan dan penjelasannya di Verifikasi.", bodyEn: "Read the decision and explanation in Verification.", actionId: "Lihat keputusan", actionEn: "View decision", tone: "danger", icon: <IconBan />, target: "verification" },
  expiring: { id: "Keanggotaan segera berakhir", en: "Membership expiring soon", bodyId: "Periksa masa berlaku dan perbarui data bila diperlukan.", bodyEn: "Check your expiry date and update your information if needed.", actionId: "Lihat profil", actionEn: "View profile", tone: "warning", icon: <IconCalendar />, target: "profile" },
  change_pending: { id: "Perubahan sedang ditinjau", en: "Change under review", bodyId: "Data yang disetujui tetap berlaku sampai keputusan dibuat.", bodyEn: "Your approved information remains in effect until a decision is made.", actionId: "Lihat profil", actionEn: "View profile", tone: "info", icon: <IconClockHour4 />, target: "profile" },
  expired_grace: { id: "Keanggotaan dalam masa tenggang", en: "Membership in grace period", bodyId: "Perpanjangan diperlukan agar manfaat anggota tetap tersedia.", bodyEn: "Renew to keep member benefits available.", actionId: "Lihat akun", actionEn: "View account", tone: "warning", icon: <IconAlertTriangle />, target: "account" },
  expired: { id: "Keanggotaan telah berakhir", en: "Membership expired", bodyId: "Hubungi pengurus untuk informasi perpanjangan.", bodyEn: "Contact your committee about renewal.", tone: "muted", icon: <IconClockX /> },
  suspended: { id: "Keanggotaan ditangguhkan", en: "Membership suspended", bodyId: "Hubungi pengurus untuk mengetahui langkah selanjutnya.", bodyEn: "Contact your committee about next steps.", tone: "danger", icon: <IconLockAccess /> },
  revoked: { id: "Keanggotaan dicabut", en: "Membership revoked", bodyId: "Akses manfaat anggota tidak tersedia. Hubungi sekretariat jika memerlukan bantuan.", bodyEn: "Member benefits are unavailable. Contact the secretariat if you need help.", tone: "danger", icon: <IconBan /> },
};

export function MembershipScenario({ state, locale, onView }: { state: MemberState; locale: Locale; onView: (view: View) => void }) {
  const item = statuses[state];
  return <div className="grid gap-5">
    <PageHeader title={pick(locale, "Beranda", "Home")} description={pick(locale, "Ringkasan keanggotaan dan aktivitas Anda.", "Your membership and activity at a glance.")} />
    <StatusCard icon={item.icon} title={pick(locale, item.id, item.en)} body={pick(locale, item.bodyId, item.bodyEn)} tone={item.tone} actionLabel={item.actionId ? pick(locale, item.actionId, item.actionEn ?? "") : undefined} onAction={item.target ? () => onView(item.target!) : undefined} />
    {state === "needs_changes" && <Alert><IconAlertCircle /><AlertTitle>{pick(locale, "Tinjau tanggapan pengurus", "Review committee feedback")}</AlertTitle><AlertDescription>{pick(locale, "Bagian domisili perlu diperjelas. Perubahan dikirim melalui alur pendaftaran yang sudah ada.", "Your address needs clarification. Submit changes through the existing registration flow.")}</AlertDescription></Alert>}
    {["none", "draft", "submitted", "needs_changes", "resubmitted", "rejected"].includes(state) && <Card className="gap-4 rounded-xl p-5"><h2 className="font-bold">{pick(locale, "Perjalanan pendaftaran", "Registration progress")}</h2><Timeline items={[{ title: pick(locale, "Akun dibuat", "Account created"), state: "complete" }, { title: pick(locale, "Pendaftaran dikirim", "Registration submitted"), state: state === "none" || state === "draft" ? "upcoming" : "complete" }, { title: pick(locale, "Verifikasi komsat", "Local committee review"), state: state === "submitted" || state === "needs_changes" || state === "resubmitted" ? "current" : state === "rejected" ? "complete" : "upcoming" }, { title: pick(locale, "Keputusan", "Decision"), state: state === "rejected" ? "current" : "upcoming" }]} /></Card>}
    <Empty className="min-h-44"><EmptyHeader><EmptyMedia variant="icon"><IconIdBadge2 /></EmptyMedia><EmptyTitle>{pick(locale, "Kartu anggota belum tersedia", "Member card unavailable")}</EmptyTitle><EmptyDescription>{pick(locale, "Kartu muncul setelah keanggotaan aktif.", "Your card appears when your membership becomes active.")}</EmptyDescription></EmptyHeader></Empty>
  </div>;
}

export function VerificationView({ locale, state, onView }: { locale: Locale; state: MemberState; onView: (view: View) => void }) {
  const changes = state === "needs_changes";
  const rejected = state === "rejected";
  return <div className="mx-auto grid max-w-3xl gap-5">
    <PageHeader title={pick(locale, "Verifikasi", "Verification")} description={pick(locale, "Lihat perkembangan dan tanggapan atas pendaftaran Anda.", "Follow updates and replies about your registration.")} />
    <StatusCard icon={changes ? <IconAlertCircle /> : rejected ? <IconBan /> : <IconClockHour4 />} title={changes ? pick(locale, "Perubahan diminta", "Changes requested") : rejected ? pick(locale, "Pendaftaran belum disetujui", "Registration not approved") : pick(locale, "Pendaftaran sedang ditinjau", "Registration under review")} body={changes ? pick(locale, "Baca catatan pengurus dan perbaiki bagian yang ditandai.", "Read the committee's notes and fix the marked fields.") : rejected ? pick(locale, "Keputusan dan alasannya tercatat di bawah.", "The decision and reason are shown below.") : pick(locale, "Kami akan memberi tahu Anda ketika ada perkembangan.", "We will notify you when there is an update.")} tone={changes ? "warning" : rejected ? "danger" : "info"} actionLabel={changes ? pick(locale, "Perbaiki pendaftaran", "Edit registration") : undefined} onAction={changes ? () => onView("entry") : undefined} />
    <Card className="gap-5 rounded-xl p-5 sm:p-6"><h2 className="font-bold">{pick(locale, "Riwayat peninjauan", "Review history")}</h2><Timeline items={[{ title: pick(locale, "Pendaftaran dikirim", "Registration submitted"), time: pick(locale, "1 Okt 2026", "1 Oct 2026"), state: "complete" }, { title: pick(locale, "Pemeriksaan otomatis selesai", "Automatic review complete"), time: pick(locale, "1 Okt 2026", "1 Oct 2026"), state: "complete" }, { title: changes ? pick(locale, "Pengurus PPI Okayama meminta perubahan", "PPI Okayama requested changes") : rejected ? pick(locale, "Keputusan pengurus", "Committee decision") : pick(locale, "Peninjauan pengurus PPI Okayama", "PPI Okayama committee review"), description: changes ? pick(locale, "Perjelas alamat domisili dan unggah ulang kartu pelajar yang terbaca.", "Clarify your address and upload a legible student card.") : rejected ? pick(locale, "Pendaftaran belum memenuhi persyaratan keanggotaan.", "The registration did not meet the membership requirements.") : undefined, time: changes || rejected ? pick(locale, "3 Okt 2026", "3 Oct 2026") : undefined, state: "current" }]} /></Card>
    {(state === "submitted" || changes) && <Button variant="outline" className="w-fit" onClick={() => onView("portal")}>{pick(locale, "Kembali ke Beranda", "Back to Home")}</Button>}
  </div>;
}

export function AccountView({ locale, state }: { locale: Locale; state: MemberState }) {
  const [notice, setNotice] = React.useState("");
  return <div className="mx-auto grid max-w-3xl gap-5">
    <PageHeader title={pick(locale, "Akun", "Account")} description={pick(locale, "Kelola keamanan akun dan hak atas data Anda.", "Manage account security and your data rights.")} />
    <Card className="gap-4 rounded-xl p-5 sm:p-6"><div className="flex items-start gap-3"><IconUserCircle className="size-8 shrink-0 text-brand-red" /><div><h2 className="font-bold">I Nyoman Darma Kotama</h2><p className="text-sm text-brand-muted">darma.kotama@example.com</p></div></div><dl className="grid gap-3 border-t border-brand-border pt-4 sm:grid-cols-2"><div><dt className="text-sm text-brand-muted">{pick(locale, "Nama lengkap", "Full name")}</dt><dd className="font-semibold">I Nyoman Darma Kotama</dd></div><div><dt className="text-sm text-brand-muted">{pick(locale, "Email", "Email")}</dt><dd className="font-semibold">darma.kotama@example.com</dd></div>{["active", "expiring", "change_pending"].includes(state) && <div><dt className="text-sm text-brand-muted">{pick(locale, "Nomor anggota", "Member number")}</dt><dd className="font-mono font-semibold">PPIJ-2026-000123</dd></div>}</dl></Card>
    <Card className="gap-4 rounded-xl p-5 sm:p-6"><div className="flex gap-3"><IconShieldLock className="size-6 shrink-0 text-brand-red" /><div><h2 className="font-bold">{pick(locale, "Keamanan akun", "Account security")}</h2><p className="mt-1 text-sm text-brand-muted">{pick(locale, "Kata sandi dan alamat email dikelola melalui login PPI Jepang.", "Your password and email address are managed through PPI Japan login.")}</p></div></div>{state !== "revoked" && <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setNotice(pick(locale, "Contoh: alur ubah kata sandi dibuka di Keycloak.", "Preview: the password flow opens in Keycloak."))}>{pick(locale, "Ubah kata sandi", "Change password")}</Button><Button variant="outline" onClick={() => setNotice(pick(locale, "Contoh: alur ubah email dibuka di Keycloak.", "Preview: the email flow opens in Keycloak."))}>{pick(locale, "Ubah email", "Change email")}</Button></div>}</Card>
    <Card className="gap-3 rounded-xl p-5 sm:p-6"><div className="flex gap-3"><IconLock className="size-6 shrink-0 text-brand-red" /><div><h2 className="font-bold">{pick(locale, "Privasi dan data Anda", "Your privacy and data")}</h2><p className="mt-1 text-sm text-brand-muted">{pick(locale, "Anda dapat meminta salinan atau penghapusan data pribadi melalui sekretariat.", "You can request a copy or deletion of your personal data through the secretariat.")}</p><a className="mt-3 inline-block text-sm font-semibold text-brand-red underline underline-offset-4" href="mailto:info@ppijepang.app?subject=Permohonan%20Privasi%20PPI%20Jepang">{pick(locale, "Hubungi sekretariat", "Contact the secretariat")}</a></div></div></Card>
    {notice && <p role="status" className="text-sm text-brand-muted">{notice}</p>}
    <Button className="w-fit" onClick={() => setNotice(pick(locale, "Contoh: sesi diakhiri melalui portal.", "Preview: the portal ends your session."))}><IconLogout className="size-4" />{pick(locale, "Keluar", "Sign out")}</Button>
  </div>;
}

export function EntryView({ locale, onView }: { locale: Locale; onView: (view: View) => void }) {
  const [notice, setNotice] = React.useState(false);
  return <div className="mx-auto grid max-w-3xl gap-6 py-5 sm:py-10"><div className="grid gap-3"><span className="flex size-12 items-center justify-center rounded-full bg-secondary text-brand-red"><IconIdBadge2 className="size-6" /></span><h1 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">{pick(locale, "Satu akun untuk keanggotaan PPI Jepang", "One account for PPI Japan membership")}</h1><p className="max-w-prose text-brand-muted">{pick(locale, "Masuk untuk melihat kartu anggota, memperbarui profil, dan mengikuti layanan PPI Jepang. Belum menjadi anggota? Mulai pendaftaran dengan akun yang sama.", "Sign in to view your member card, update your profile, and use PPI Japan services. New here? Start registration with the same account.")}</p></div><div className="flex flex-wrap gap-3"><Button onClick={() => onView("portal")}>{pick(locale, "Masuk", "Sign in")}</Button><Button variant="outline" onClick={() => setNotice(true)}>{pick(locale, "Mulai pendaftaran", "Start registration")}</Button></div>{notice && <Alert><IconClipboardCheck /><AlertTitle>{pick(locale, "Lanjut ke pendaftaran", "Continue to registration")}</AlertTitle><AlertDescription>{pick(locale, "Dalam portal, tombol ini membuka wizard pendaftaran yang sudah ada.", "In the portal, this opens the existing registration wizard.")}</AlertDescription></Alert>}<div className="border-t border-brand-border pt-5 text-sm text-brand-muted"><p>{pick(locale, "Pendaftaran dilanjutkan melalui wizard yang sudah ada.", "Registration continues in the existing wizard.")}</p></div></div>;
}

export function GateView({ locale, gate, onView }: { locale: Locale; gate: GateState; onView: (view: View) => void }) {
  const [sent, setSent] = React.useState(false);
  const [wizardNotice, setWizardNotice] = React.useState(false);
  const data = {
    verify_email: { icon: IconMail, id: "Cek email Anda", en: "Check your email", bodyId: "Buka tautan verifikasi yang kami kirim. Periksa folder spam bila belum terlihat.", bodyEn: "Open the verification link we sent. Check your spam folder if you cannot find it.", actionId: "Buka akun", actionEn: "Open account", target: "account" as View },
    completion: { icon: IconClipboardCheck, id: "Lengkapi data", en: "Complete your profile", bodyId: "Lengkapi data wajib agar Anda dapat menggunakan portal anggota.", bodyEn: "Complete the required information to use the member portal.", actionId: "Lanjutkan ke wizard", actionEn: "Continue to wizard", target: "entry" as View },
    email_bounced: { icon: IconAlertTriangle, id: "Email bermasalah", en: "Email delivery problem", bodyId: "Alamat email Anda tidak dapat menerima pesan. Perbarui alamat agar pemberitahuan penting sampai.", bodyEn: "Your email address cannot receive messages. Update it to receive important notices.", actionId: "Ubah email", actionEn: "Change email", target: "account" as View },
  }[gate];
  const Icon = data.icon;
  return <div className="mx-auto grid max-w-2xl gap-5 py-4"><Card className="gap-5 rounded-xl p-6 sm:p-8"><Icon className="size-8 text-brand-red" /><div><h1 className="text-2xl font-bold">{pick(locale, data.id, data.en)}</h1><p className="mt-2 max-w-prose text-sm leading-6 text-brand-muted">{pick(locale, data.bodyId, data.bodyEn)}</p></div>{gate === "verify_email" && <Button variant="outline" className="w-fit" onClick={() => setSent(true)}>{pick(locale, "Kirim ulang email verifikasi", "Resend verification email")}</Button>}{sent && <p role="status" className="text-sm text-brand-muted">{pick(locale, "Contoh: email verifikasi dikirim. Periksa kotak masuk dan spam.", "Preview: verification email sent. Check your inbox and spam.")}</p>}<Button className="w-fit" onClick={() => gate === "completion" ? setWizardNotice(true) : onView(data.target)}>{pick(locale, data.actionId, data.actionEn)}</Button>{wizardNotice && <p role="status" className="text-sm text-brand-muted">{pick(locale, "Dalam portal, tombol ini membuka wizard yang sudah ada.", "In the portal, this opens the existing wizard.")}</p>}</Card></div>;
}

export function InvitationView({ locale, state, onView }: { locale: Locale; state: InviteState; onView: (view: View) => void }) {
  const data = {
    valid: { icon: IconMailOpened, id: "Undangan dari PPI Okayama", en: "Invitation from PPI Okayama", bodyId: "Anda diundang untuk bergabung. Gunakan akun PPI Jepang untuk melanjutkan pendaftaran.", bodyEn: "You are invited to join. Use your PPI Japan account to continue registration.", actionId: "Terima dan mulai", actionEn: "Accept and start" },
    expired: { icon: IconClockX, id: "Undangan telah kedaluwarsa", en: "Invitation expired", bodyId: "Minta tautan undangan baru kepada pengirim.", bodyEn: "Ask the sender for a new invitation link." },
    cancelled: { icon: IconBan, id: "Undangan dibatalkan", en: "Invitation cancelled", bodyId: "Tautan ini tidak lagi dapat digunakan.", bodyEn: "This link can no longer be used." },
    used: { icon: IconUserPlus, id: "Undangan sudah digunakan", en: "Invitation already used", bodyId: "Masuk dengan akun yang digunakan saat menerima undangan.", bodyEn: "Sign in with the account used to accept the invitation.", actionId: "Ke Beranda", actionEn: "Go to Home" },
    invalid: { icon: IconLink, id: "Tautan undangan tidak valid", en: "Invalid invitation link", bodyId: "Periksa kembali tautan atau minta undangan baru.", bodyEn: "Check the link or ask for a new invitation." },
    member: { icon: IconUserPlus, id: "Anda sudah menjadi anggota", en: "You are already a member", bodyId: "Undangan ini tidak diperlukan untuk akun Anda.", bodyEn: "Your account does not need this invitation.", actionId: "Ke Beranda", actionEn: "Go to Home" },
    recovery: { icon: IconAlertCircle, id: "Belum dapat melanjutkan", en: "Unable to continue", bodyId: "Coba buka kembali undangan ini untuk melanjutkan.", bodyEn: "Try opening this invitation again to continue.", actionId: "Coba lagi", actionEn: "Try again" },
  }[state];
  const Icon = data.icon;
  return <div className="mx-auto max-w-2xl py-4"><Card className="gap-5 rounded-xl p-6 sm:p-8"><Icon className="size-9 text-brand-red" /><div><h1 className="text-2xl font-bold">{pick(locale, data.id, data.en)}</h1><p className="mt-2 max-w-prose text-brand-muted">{pick(locale, data.bodyId, data.bodyEn)}</p></div>{state === "valid" && <p className="rounded-lg bg-secondary p-3 text-sm text-brand-ink">{pick(locale, "Pengurus PPI Okayama akan meninjau pendaftaran Anda.", "The PPI Okayama committee will review your registration.")}</p>}{data.actionId && <Button className="w-fit" onClick={() => onView(state === "valid" ? "entry" : state === "recovery" ? "invitation" : "portal")}>{pick(locale, data.actionId, data.actionEn ?? "")}</Button>}</Card></div>;
}

export function ErrorView({ locale, state, onView }: { locale: Locale; state: ErrorState; onView: (view: View) => void }) {
  const data = {
    session: { icon: IconLock, id: "Sesi berakhir", en: "Session ended", bodyId: "Masuk kembali untuk melanjutkan.", bodyEn: "Sign in again to continue.", actionId: "Masuk", actionEn: "Sign in" },
    forbidden: { icon: IconLockAccess, id: "Akses tidak tersedia", en: "Access unavailable", bodyId: "Akun Anda tidak memiliki akses ke halaman ini.", bodyEn: "Your account cannot access this page.", actionId: "Ke Beranda", actionEn: "Go to Home" },
    notFound: { icon: IconLink, id: "Halaman tidak ditemukan", en: "Page not found", bodyId: "Periksa alamat halaman atau kembali ke Beranda.", bodyEn: "Check the page address or return to Home.", actionId: "Ke Beranda", actionEn: "Go to Home" },
    generic: { icon: IconAlertCircle, id: "Data belum dapat dimuat", en: "Unable to load data", bodyId: "Terjadi gangguan sementara. Coba lagi.", bodyEn: "Something went wrong. Please try again.", actionId: "Coba lagi", actionEn: "Try again" },
  }[state];
  const Icon = data.icon;
  return <div className="mx-auto max-w-2xl py-4"><Empty className="min-h-72"><EmptyHeader><EmptyMedia variant="icon"><Icon /></EmptyMedia><EmptyTitle className="text-xl">{pick(locale, data.id, data.en)}</EmptyTitle><EmptyDescription>{pick(locale, data.bodyId, data.bodyEn)}</EmptyDescription></EmptyHeader><EmptyContent><Button onClick={() => onView(state === "session" ? "entry" : "portal")}>{state === "generic" && <IconRefresh className="size-4" />}{pick(locale, data.actionId, data.actionEn)}</Button></EmptyContent></Empty></div>;
}
