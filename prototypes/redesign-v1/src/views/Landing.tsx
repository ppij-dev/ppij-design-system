import * as React from "react";
import { IconArrowRight, IconIdBadge2, IconLanguage, IconShieldCheck } from "@tabler/icons-react";
import { Button } from "ppij-design-system";
import logoUrl from "../../../../brand/ppij-logo.png";
import { pick, type Locale, type View } from "./Remaining";
import { JapanNetwork } from "./JapanNetwork";
import "./landing.css";

const WORDS = [
  { id: "tumbuh", en: "grow" },
  { id: "berkolaborasi", en: "collaborate" },
  { id: "belajar", en: "learn" },
  { id: "mendukung", en: "support one another" },
  { id: "menginspirasi", en: "inspire one another" },
];

export function EntryView({ locale, onLocale, onView }: { locale: Locale; onLocale: (locale: Locale) => void; onView: (view: View) => void }) {
  const [word, setWord] = React.useState(0);
  const [notice, setNotice] = React.useState(false);
  React.useEffect(() => {
    const timer = window.setInterval(() => setWord((current) => (current + 1) % WORDS.length), 2700);
    return () => window.clearInterval(timer);
  }, []);
  return <div className="entry-page">
    <section className="entry-stage" aria-labelledby="entry-title">
      <div className="entry-stage-grain" aria-hidden="true" />
      <header className="entry-header">
        <a className="entry-brand" href="#entry-title" aria-label="PPI Jepang Portal">
          <img src={logoUrl} alt="PPI Jepang" width="58" height="40" />
          <span>Portal</span>
        </a>
        <div className="entry-header-actions">
          <button type="button" className="entry-language" onClick={() => onLocale(locale === "id" ? "en" : "id")} aria-label={pick(locale, "Ganti bahasa ke English", "Switch language to Bahasa Indonesia")}><IconLanguage size={18} stroke={1.8} />{locale === "id" ? "English" : "Indonesia"}</button>
          <Button variant="outline" className="entry-header-signin" onClick={() => onView("portal")}>{pick(locale, "Masuk", "Sign in")}</Button>
        </div>
      </header>

      <div className="entry-hero">
        <div className="entry-copy">
          <h1 id="entry-title">{locale === "id" ? <>Membuka Dunia untuk Indonesia <span>dan Membuka Indonesia untuk Dunia</span></> : <>Opening the World to Indonesia <span>and Indonesia to the World</span></>}</h1>
          <p className="entry-intro"><span className="entry-intro-lead">{pick(locale, "Dari Jepang, pelajar Indonesia saling", "From Japan, Indonesian students")}</span>{" "}<span className="entry-intro-rotating"><span key={`${locale}-${word}`} className="entry-changing-word" aria-live="off">{pick(locale, WORDS[word].id, WORDS[word].en)}</span>.</span></p>
          <div className="entry-actions">
            <Button className="entry-primary" onClick={() => onView("portal")}>{pick(locale, "Masuk", "Sign in")}<IconArrowRight size={18} aria-hidden="true" /></Button>
            <Button variant="outline" className="entry-secondary" onClick={() => setNotice(true)}>{pick(locale, "Daftar sebagai anggota", "Register as a member")}</Button>
          </div>
          <p className="entry-draft">{pick(locale, "Sudah punya draf pendaftaran? Masuk untuk melanjutkan.", "Already have a registration draft? Sign in to continue.")}</p>
          {notice && <p role="status" className="entry-notice">{pick(locale, "Dalam portal, Daftar membuka alur pendaftaran yang sudah ada.", "In the portal, Register opens the existing registration flow.")}</p>}
        </div>
        <div className="entry-map-wrap">
          <div className="entry-map-aura" aria-hidden="true" />
          <JapanNetwork locale={locale} />
        </div>
      </div>
      <div className="entry-stage-bottom">
        <a href="#entry-more" className="entry-scroll-link">{pick(locale, "Kenali portal anggota", "Explore the member portal")} <IconArrowRight size={16} aria-hidden="true" /></a>
      </div>
    </section>

    <section id="entry-more" className="entry-more" aria-labelledby="entry-more-title">
      <div className="entry-more-head"><h2 id="entry-more-title">{pick(locale, "Satu akun untuk layanan nasional, korda, dan komsat.", "One account for national, regional, and local services.")}</h2><p>{pick(locale, "Portal PPIJ membantu Anda terhubung dengan komisariat dan menemukan berbagai layanan dengan mudah.", "The PPIJ portal helps you connect with your local committee and find services easily.")}</p></div>
      <div className="entry-benefits">
        <div><IconIdBadge2 size={25} stroke={1.65} /><h3>{pick(locale, "Kartu anggota digital", "Digital member card")}</h3><p>{pick(locale, "Tersedia setelah pendaftaran Anda disetujui.", "Available after your registration is approved.")}</p></div>
        <div><IconShieldCheck size={25} stroke={1.65} /><h3>{pick(locale, "Komsat Anda", "Your local committee")}</h3><p>{pick(locale, "Ikuti informasi dan layanan yang relevan dengan tempat Anda belajar.", "Find information and services relevant to where you study.")}</p></div>
        <div><IconArrowRight size={25} stroke={1.65} /><h3>{pick(locale, "Satu login", "One login")}</h3><p>{pick(locale, "Gunakan akun yang sama untuk pendaftaran dan portal anggota.", "Use the same account for registration and the member portal.")}</p></div>
      </div>
      <section className="entry-faq" aria-labelledby="entry-faq-title"><div><h2 id="entry-faq-title">{pick(locale, "Pertanyaan yang sering diajukan", "Frequently asked questions")}</h2><p>{pick(locale, "Jawaban singkat sebelum Anda mulai.", "A few answers before you begin.")}</p></div><div className="entry-faq-list">
        <details><summary>{pick(locale, "Apakah saya perlu membuat akun untuk mendaftar?", "Do I need an account to register?")}</summary><p>{pick(locale, "Ya. Akun yang sama digunakan untuk pendaftaran dan portal anggota.", "Yes. Use the same account for registration and the member portal.")}</p></details>
        <details><summary>{pick(locale, "Bagaimana jika pendaftaran saya belum selesai?", "What if I have not finished registering?")}</summary><p>{pick(locale, "Masuk dengan akun Anda untuk melanjutkan draf pendaftaran.", "Sign in with your account to continue your registration draft.")}</p></details>
        <details><summary>{pick(locale, "Kapan kartu anggota digital tersedia?", "When is the digital member card available?")}</summary><p>{pick(locale, "Kartu anggota tersedia setelah pendaftaran disetujui.", "Your member card is available after registration is approved.")}</p></details>
        <details><summary>{pick(locale, "Di mana saya bisa meminta bantuan?", "Where can I get help?")}</summary><p>{pick(locale, "Hubungi sekretariat PPI Jepang melalui tautan bantuan di bawah.", "Contact the PPI Japan secretariat through the help link below.")}</p></details>
      </div></section>
      <footer className="entry-footer"><span>© PPI Jepang</span><a href="mailto:info@ppijepang.app">{pick(locale, "Butuh bantuan?", "Need help?")}</a></footer>
    </section>
  </div>;
}
