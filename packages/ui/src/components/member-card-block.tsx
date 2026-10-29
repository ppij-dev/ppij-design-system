import { useLayoutEffect, useEffect, useRef, useState, type CSSProperties } from "react";
import Tilt from "react-parallax-tilt";
import Barcode from "react-barcode";
import { IconCheck } from "@tabler/icons-react";
import { AdminDrawer } from "./admin-drawer";
import { SavingIndicator, type SavingStatus } from "./saving-indicator";
import { cardThemes, resolveCardTheme, type CardTheme } from "../card-themes";
import "./member-card.css";

/**
 * The member card block, ported exactly from ppij-identity-sso
 * portal/MemberCard.tsx (design in member-card.css, themes in
 * ../card-themes.ts). Adaptations for the design system are seams
 * only: membership fields arrive as flat props, the card logo and
 * back map are src props, copy comes from the locale label maps
 * below (the app's i18n strings, verbatim), and theme persistence
 * goes through the CardThemePreference seam (an in-memory store by
 * default; the app passes its preference API).
 */

export type MemberCardState = "active" | "expiring" | "change_pending" | "expired_grace" | "expired" | "suspended";

/** Where the theme choice persists. Production uses the member preference API; the harness substitutes a simulated store. */
export interface CardThemePreference {
  read: (memberId: string) => Promise<string | null>;
  save: (memberId: string, id: string | null) => Promise<void>;
}

const memoryStore = new Map<string, string | null>();
/** Module-level singleton: the load effect keys on this object, so a fresh instance per render would refetch forever. */
const memoryCardThemePreference: CardThemePreference = {
  read: (memberId) => Promise.resolve(memoryStore.get(memberId) ?? null),
  save: (memberId, id) => {
    memoryStore.set(memberId, id);
    return Promise.resolve();
  },
};

export interface MemberCardBlockProps {
  locale: "id" | "en";
  /** Used only as the card theme preference key; never rendered on the card. */
  memberId: string;
  /** Defaults to an in-memory store. The app passes its member preference API. */
  themePreference?: CardThemePreference;
  /** Full name. The card shows it clamped to two lines; assistive technology gets the whole text. */
  name: string;
  /** Membership number, printed on both faces and encoded in the barcode. */
  number: string;
  /** Komsat display name (may carry the "Komsat " prefix; the card strips it). Null for korda-only members. */
  komsat?: string | null;
  /** Korda display name, e.g. "PPI Kansai". Also seeds the automatic theme. */
  korda: string;
  validUntil?: string | null;
  graceUntil?: string | null;
  suspendReason?: string | null;
  state: MemberCardState;
  /** The PPIJ logo shown on the front (the app serves /ppij-logo.png). */
  logoSrc: string;
  /** The decorative Indonesia map on the back (the app serves /id-map.svg). */
  mapSrc: string;
}

interface MemberCardLabels {
  brand: string;
  chip: string;
  chipExpiring: string;
  chipGrace: string;
  chipExpired: string;
  chipSuspended: string;
  pending: string;
  flipToBack: string;
  flipToFront: string;
  barcode: string;
  download: string;
  downloading: string;
  downloadDone: string;
  downloadFailed: string;
  changeTheme: string;
  themeTitle: string;
  themeHint: string;
  themeSaveError: string;
  theme: string;
  themeAuto: string;
  themeAutoShort: string;
  themeGroup: { korda: string; ppij: string; seasons: string; nusantara: string };
  motto: string;
  barcodeHint: string;
  graceBack: string;
  expiredBack: string;
  suspendedBack: string;
  unitLabel: string;
  validLabel: string;
  endedLabel: string;
}

const LABELS: Record<"id" | "en", MemberCardLabels> = {
  id: {
    brand: "PPI Jepang",
    chip: "Aktif",
    chipExpiring: "Berakhir {date}",
    chipGrace: "Masa tenggang",
    chipExpired: "Kedaluwarsa",
    chipSuspended: "Ditangguhkan",
    pending: "Perubahan menunggu persetujuan",
    flipToBack: "Balik kartu untuk menampilkan barcode",
    flipToFront: "Kembali ke depan kartu",
    barcode: "Barcode",
    download: "Unduh",
    downloading: "Menyiapkan...",
    downloadDone: "Kartu disimpan sebagai gambar.",
    downloadFailed: "Kartu belum bisa disimpan. Coba lagi.",
    changeTheme: "Ubah tema",
    themeTitle: "Ubah tema kartu",
    themeHint: "Pilih tampilan yang Anda suka. Tersimpan di akun Anda dan berlaku di semua perangkat. Tema tidak mengubah keanggotaan Anda.",
    themeSaveError: "Gagal menyimpan. Pilihan bertahan untuk sesi ini; pilih lagi untuk mencoba ulang.",
    theme: "Tema kartu",
    themeAuto: "Otomatis · sesuai korda",
    themeAutoShort: "Otomatis",
    themeGroup: { korda: "Korda Jepang", ppij: "PPI Jepang", seasons: "Empat musim Jepang", nusantara: "Nusantara" },
    motto: "Membuka Dunia untuk Indonesia dan Membuka Indonesia untuk Dunia",
    barcodeHint: "Tunjukkan ke pengurus untuk dipindai",
    graceBack: "Masa tenggang sampai {date}. Perpanjang untuk memakai barcode.",
    expiredBack: "Keanggotaan telah berakhir. Perpanjang untuk memakai barcode.",
    suspendedBack: "Barcode dinonaktifkan selama keanggotaan ditangguhkan.",
    unitLabel: "Unit",
    validLabel: "Berlaku s.d.",
    endedLabel: "Berakhir",
  },
  en: {
    brand: "PPI Japan",
    chip: "Active",
    chipExpiring: "Ends {date}",
    chipGrace: "Grace period",
    chipExpired: "Expired",
    chipSuspended: "Suspended",
    pending: "Change awaiting approval",
    flipToBack: "Flip the card to show the barcode",
    flipToFront: "Flip the card back to the front",
    barcode: "Barcode",
    download: "Download",
    downloading: "Preparing...",
    downloadDone: "Card saved as an image.",
    downloadFailed: "The card could not be saved. Try again.",
    changeTheme: "Change theme",
    themeTitle: "Change card theme",
    themeHint: "Choose a look you like. Saved to your account and used on every device. Themes do not change your membership.",
    themeSaveError: "Saving failed. Your choice stays for this session; pick again to retry.",
    theme: "Card theme",
    themeAuto: "Automatic · your korda",
    themeAutoShort: "Automatic",
    themeGroup: { korda: "Japan regions", ppij: "PPI Japan", seasons: "Four seasons in Japan", nusantara: "Nusantara" },
    motto: "Membuka Dunia untuk Indonesia dan Membuka Indonesia untuk Dunia",
    barcodeHint: "Show this to pengurus to scan",
    graceBack: "Grace period until {date}. Renew to use the barcode.",
    expiredBack: "Membership has ended. Renew to use the barcode.",
    suspendedBack: "The barcode is off while the membership is suspended.",
    unitLabel: "Unit",
    validLabel: "Valid to",
    endedLabel: "Ended",
  },
};

type L = MemberCardLabels;

const MAX_X = 10;
const MAX_Y = 14;
const CARD_WIDTH = 350;
/** The download sheet is 398 px wide (CSS) and is captured at 3x. */
const SHEET_PIXEL_RATIO = 3;
const CARD_CLASS: Record<MemberCardState, string> = {
  active: "mc-active",
  expiring: "mc-expiring",
  change_pending: "mc-active",
  expired_grace: "mc-grace",
  expired: "mc-expired",
  suspended: "mc-suspended",
};

/** Only the states with a valid membership show the barcode. */
export const hasBarcode = (state: MemberCardState) => state === "active" || state === "expiring" || state === "change_pending";

const INTL_LOCALE = { id: "id-ID", en: "en-GB" } as const;

/** Day and short month, e.g. "31 Mar" (chip). Year added for the validity line, e.g. "31 Mar 2027". */
function shortDate(value: string | null | undefined, locale: "id" | "en", withYear: boolean): string {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00+09:00`);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    timeZone: "Asia/Tokyo",
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" as const } : {}),
  }).format(date);
}

/** Unit line: "Sendai · PPI Kanto". The stored unit names carry type prefixes ("Komsat Sendai");
 * the card shows the real names without them. A korda member without komsat shows just the korda. */
function unitLine(p: MemberCardBlockProps): string {
  const komsat = p.komsat?.replace(/^Komsat\s+/, "") ?? "";
  return p.komsat ? `${komsat} · ${p.korda}` : p.korda;
}

function chipText(state: MemberCardState, p: MemberCardBlockProps, l: L): string {
  switch (state) {
    case "active":
    case "change_pending":
      return l.chip;
    case "expiring":
      return l.chipExpiring.replace("{date}", shortDate(p.validUntil, p.locale, false));
    case "expired_grace":
      return l.chipGrace;
    case "expired":
      return l.chipExpired;
    case "suspended":
      return l.chipSuspended;
  }
}

function backNote(state: MemberCardState, p: MemberCardBlockProps, l: L): string {
  switch (state) {
    case "expired_grace":
      return l.graceBack.replace("{date}", shortDate(p.graceUntil, p.locale, true));
    case "expired":
      return l.expiredBack;
    case "suspended":
      return l.suspendedBack;
    default:
      return "";
  }
}

type Shine = CSSProperties | undefined;

interface FaceProps extends MemberCardBlockProps {
  shineStyle?: Shine;
  theme?: CardTheme;
  artworkFailed?: boolean;
  onArtworkError?: () => void;
}

/** Front face: logo, chip, name, number, unit line and validity. */
function Front(p: FaceProps) {
  const l = LABELS[p.locale];
  const state = p.state;
  const ended = state === "expired" || state === "expired_grace";
  return (
    <div className={`mc-face mc-front ${CARD_CLASS[state]}`} data-theme={p.theme?.id} style={{ "--mc-base": p.theme?.base } as CSSProperties}>
      {p.theme && !p.artworkFailed ? (
        <svg className="mc-art" viewBox={p.theme.viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
          <image href={p.theme.asset} width={p.theme.width} height={p.theme.height} onError={p.onArtworkError} />
        </svg>
      ) : null}
      <div className="mc-shine" aria-hidden="true" style={p.shineStyle} />
      <div className="mc-row">
        <img className="mc-logo" src={p.logoSrc} alt={l.brand} width={92} height={63} />
        <span className="mc-chip">{chipText(state, p, l)}</span>
      </div>
      <div className="mc-id">
        <span className="mc-name">{p.name}</span>
        {state === "suspended" ? (
          <span className="mc-note">{p.suspendReason ?? ""}</span>
        ) : (
          <span className="mc-number">{p.number}</span>
        )}
        {state === "change_pending" ? <span className="mc-note">{l.pending}</span> : null}
      </div>
      <div className="mc-row mc-foot">
        <div className="mc-col">
          <span className="mc-label">{l.unitLabel}</span>
          <span className="mc-val">{unitLine(p)}</span>
        </div>
        {state !== "suspended" && p.validUntil ? (
          <div className="mc-col mc-right">
            <span className="mc-label">{ended ? l.endedLabel : l.validLabel}</span>
            <span className="mc-val">{shortDate(p.validUntil, p.locale, true)}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Back face: motto, barcode of the membership number, printed number, hint and decorative map. */
function Back(p: FaceProps) {
  const l = LABELS[p.locale];
  const state = p.state;
  return (
    <div className={`mc-face mc-back ${CARD_CLASS[state]}`}>
      <div className="mc-shine" aria-hidden="true" style={p.shineStyle} />
      {state !== "suspended" ? <img className="mc-map" src={p.mapSrc} alt="" aria-hidden="true" /> : null}
      <div className="mc-stripe">
        <span>{l.motto}</span>
      </div>
      <div className="mc-codewrap">
        {hasBarcode(state) ? (
          <>
            <div className="mc-quiet">
              <Barcode value={p.number} format="CODE128" width={1.25} height={58} displayValue={false} margin={0} background="#ffffff" lineColor="#000000" />
            </div>
            <span className="mc-number mc-small">{p.number}</span>
            <span className="mc-hint">{l.barcodeHint}</span>
          </>
        ) : (
          <span className="mc-hint mc-backnote">{backNote(state, p, l)}</span>
        )}
      </div>
    </div>
  );
}

/**
 * Phone tilt follows the change in orientation from the pose the phone is held in. Android and desktop
 * browsers deliver the events with no prompt; iOS needs a prompt, so it is skipped by user agent and the
 * touch-drag tilt of the library is the fallback. The permission API is never called.
 */
const isIOS = () =>
  typeof navigator !== "undefined" &&
  (/iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
const sensorWithoutPrompt = () => typeof window !== "undefined" && "DeviceOrientationEvent" in window && !isIOS();
const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);
const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface CardFaceProps extends FaceProps {
  flipped: boolean;
  onFlip: (next: boolean) => void;
}

/** The tilting, flipping card. One button: click, tap, Enter and Space flip it. */
function MemberCardFace(props: CardFaceProps) {
  const { name, flipped, onFlip } = props;
  const l = LABELS[props.locale];
  const still = reduceMotion();
  const [shine, setShine] = useState({ x: 25, y: 15 });
  const [gyro, setGyro] = useState<{ x: number; y: number } | null>(null);
  const frame = useRef(0);
  const fitRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // The card is drawn at 350 px and scaled as a whole on narrow screens, so nothing reflows.
  useLayoutEffect(() => {
    const el = fitRef.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, el.clientWidth / CARD_WIDTH));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (still || !sensorWithoutPrompt()) return;
    let base: { b: number; g: number } | null = null;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      base ??= { b: e.beta, g: e.gamma };
      base.b += (e.beta - base.b) * 0.03;
      base.g += (e.gamma - base.g) * 0.03;
      const x = clamp(-(e.beta - base.b) * 0.6, -MAX_X, MAX_X);
      const y = clamp((e.gamma - base.g) * 0.6, -MAX_Y, MAX_Y);
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        setGyro({ x, y });
        setShine({ x: Math.round(50 + (y / MAX_Y) * 45), y: Math.round(50 - (x / MAX_X) * 45) });
      });
    };
    window.addEventListener("deviceorientation", onOrient);
    return () => {
      window.removeEventListener("deviceorientation", onOrient);
      cancelAnimationFrame(frame.current);
    };
  }, [still]);

  // Each face carries its own shine so it turns with the card (the library's glare layer does not).
  const shineStyle: Shine = still
    ? undefined
    : {
        background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.5), rgba(255,255,255,0) 40%), radial-gradient(circle at ${100 - shine.x}% ${100 - shine.y}%, rgba(120,128,138,0.08), rgba(120,128,138,0) 60%)`,
      };
  const flipLabel = flipped ? l.flipToFront : l.flipToBack;

  return (
    <div ref={fitRef} className="mc-fit" style={{ height: (221 + 28) * scale }}>
      <button
        type="button"
        className="mc-hit"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
        aria-pressed={flipped}
        onClick={() => onFlip(!flipped)}
        onPointerMove={(e) => {
          if (still) return;
          const r = e.currentTarget.getBoundingClientRect();
          setShine({
            x: Math.round(((e.clientX - r.left) / r.width) * 100),
            y: Math.round(((e.clientY - r.top) / r.height) * 100),
          });
        }}
        onPointerLeave={() => setShine({ x: 25, y: 15 })}
      >
        {/* Accessible name: the full member name and what activation does. The visible text of the
            shown face follows it. The name is not an aria-label so the visible text stays part of the name. */}
        <span className="mc-sr-only">{`${name}. ${flipLabel}`}</span>
        <Tilt
          className="mc-tilt"
          tiltEnable={!still}
          tiltMaxAngleX={MAX_X}
          tiltMaxAngleY={MAX_Y}
          perspective={900}
          glareEnable={false}
          gyroscope={false}
          tiltAngleXManual={gyro ? gyro.x : null}
          tiltAngleYManual={gyro ? gyro.y : null}
          scale={1.02}
        >
          <div className={`mc-flip${flipped ? " is-flipped" : ""}`}>
            <div className="mc-face-wrap mc-front-wrap" inert={flipped} aria-hidden={flipped}>
              <Front {...props} shineStyle={shineStyle} />
            </div>
            <div className="mc-face-wrap mc-back-wrap" inert={!flipped} aria-hidden={!flipped}>
              <Back {...props} shineStyle={shineStyle} />
            </div>
          </div>
        </Tilt>
      </button>
    </div>
  );
}

/**
 * The member card with its actions. "Barcode" and the tap on the card share one flip state.
 * Buttons appear only while a barcode is available (ACTIVE, expiring, change pending).
 */
export function MemberCardBlock(props: MemberCardBlockProps) {
  return <MemberCardContent key={props.memberId} {...props} />;
}

/** One selectable theme preview: the real clipped artwork on its base, with a labelled selected state. */
function ThemeTile({ locale, theme, selected, onPick }: { locale: "id" | "en"; theme: CardTheme | null; selected: boolean; onPick: () => void }) {
  const l = LABELS[locale];
  return (
    <button type="button" role="radio" aria-checked={selected} data-theme-id={theme?.id ?? null} onClick={onPick} className={`mc-tile${selected ? " mc-tile-on" : ""}`}>
      {theme ? (
        <span className="mc-thumb" style={{ background: theme.base }} aria-hidden="true">
          <svg viewBox={theme.viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
            <image href={theme.asset} width={theme.width} height={theme.height} />
          </svg>
        </span>
      ) : (
        <span className="mc-thumb mc-thumb-auto" aria-hidden="true">{l.themeAutoShort}</span>
      )}
      <span className="mc-tile-label">{theme ? (locale === "id" ? theme.labelId : theme.labelEn) : l.themeAuto}</span>
      {selected ? <IconCheck className="mc-tile-check" aria-hidden="true" /> : null}
    </button>
  );
}

function MemberCardContent(props: MemberCardBlockProps) {
  const { locale, state, memberId } = props;
  const l = LABELS[locale];
  // Server preference: korda default renders immediately, the saved choice applies when the
  // read resolves, and saving shows the shared autosave indicator. A failed save keeps the
  // in-session choice with a recoverable error.
  const [pref, setPref] = useState<{ value: string | null; loaded: boolean }>({ value: null, loaded: false });
  const [saveState, setSaveState] = useState<SavingStatus>("idle");
  const preference = props.themePreference ?? memoryCardThemePreference;
  useEffect(() => {
    let alive = true;
    preference.read(memberId)
      .then((value) => { if (alive) setPref({ value, loaded: true }); })
      .catch(() => { if (alive) setPref((old) => ({ ...old, loaded: true })); });
    return () => { alive = false; };
  }, [memberId, preference]);
  const selected = pref.loaded ? pref.value : null;
  const [themeOpen, setThemeOpen] = useState(false);
  const pickTheme = (id: string | null) => {
    setPref({ value: id, loaded: true });
    setSaveState("saving");
    preference.save(memberId, id)
      .then(() => setSaveState("saved"))
      .catch(() => setSaveState("error"));
  };
  const theme = resolveCardTheme(props.korda, selected);
  const [failedTheme, setFailedTheme] = useState<string | null>(null);
  const artworkFailed = failedTheme === theme.id;
  const faceProps = { ...props, theme, artworkFailed, onArtworkError: () => setFailedTheme(theme.id) };
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const sheet = useRef<HTMLDivElement>(null);

  async function download() {
    if (!sheet.current || busy) return;
    setBusy(true);
    setMsg(null);
    try {
      // Preload the selected artwork before cloning either face. A failed image becomes a plain card.
      if (!artworkFailed) {
        const loaded = await new Promise<boolean>((resolve) => {
          const img = new Image();
          const timer = window.setTimeout(() => finish(false), 5000);
          function finish(ok: boolean) { window.clearTimeout(timer); img.onload = null; img.onerror = null; resolve(ok); }
          img.onload = () => finish(true);
          img.onerror = () => finish(false);
          img.src = theme.asset;
        });
        if (!loaded) {
          setFailedTheme(theme.id);
          await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        }
      }
      // Loaded on the first tap only, so the library is not part of the first load of Beranda.
      const { toBlob } = await import("html-to-image");
      const blob = await toBlob(sheet.current, {
        pixelRatio: SHEET_PIXEL_RATIO,
        cacheBust: true,
        imagePlaceholder: `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>')}`,
        backgroundColor: "#f6f6f4",
      });
      if (!blob) throw new Error("empty image");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "kartu-anggota-ppij.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setMsg({ ok: true, text: l.downloadDone });
    } catch {
      setMsg({ ok: false, text: l.downloadFailed });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mc-block" data-card-state={state}>
      <MemberCardFace {...faceProps} flipped={flipped} onFlip={setFlipped} />
      {hasBarcode(state) ? (
        <>
          <div className="mc-actions">
            <button
              type="button"
              className="mc-btn mc-btn-primary"
              aria-pressed={flipped}
              onClick={() => setFlipped(!flipped)}
            >
              {l.barcode}
            </button>
            <button type="button" className="mc-btn" disabled={busy} onClick={download}>
              {busy ? l.downloading : l.download}
            </button>
            <button type="button" className="mc-btn" aria-haspopup="dialog" aria-expanded={themeOpen} onClick={() => setThemeOpen(true)}>
              {l.changeTheme}
            </button>
          </div>
          <p className={`mc-msg${msg && !msg.ok ? " mc-msg-err" : ""}`} role="status" aria-live="polite">
            {msg?.text}
          </p>
          {/* Flat copy of both faces for the download: no tilt, no shine, off screen. */}
          <div className="mc-sheet-wrap" aria-hidden="true">
            <div className="mc-sheet" ref={sheet}>
              <Front {...faceProps} />
              <Back {...faceProps} />
            </div>
          </div>
        </>
      ) : null}
      <AdminDrawer
        open={themeOpen}
        onOpenChange={setThemeOpen}
        locale={locale}
        title={l.themeTitle}
        description={l.themeHint}
      >
        <div className="mb-3 flex justify-end">
          <SavingIndicator status={saveState} locale={locale} errorText={l.themeSaveError} />
        </div>
        <div role="radiogroup" aria-label={l.theme} className="mc-theme-grid">
          <ThemeTile locale={locale} theme={null} selected={selected === null} onPick={() => pickTheme(null)} />
          {(["korda", "ppij", "seasons", "nusantara"] as const).map((group) => (
            <div key={group} className="mc-theme-group">
              <h3>{l.themeGroup[group]}</h3>
              <div className="mc-theme-tiles">
                {cardThemes.filter((item) => item.group === group).map((item) => (
                  <ThemeTile key={item.id} locale={locale} theme={item} selected={selected === item.id} onPick={() => pickTheme(item.id)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </AdminDrawer>
    </div>
  );
}
