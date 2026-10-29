import * as React from "react"

import { cn } from "../lib/utils"
import { Input } from "./input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select"

/**
 * The curated calling codes from the portal PhoneField (WIZ106-14):
 * Japan and Indonesia pinned under "Sering dipakai", the rest under
 * "Negara lain". Entries are [code, ISO, Indonesian name, English name].
 */
export const PHONE_COUNTRY_CODES: ReadonlyArray<readonly [code: string, iso: string, idName: string, enName: string]> = [
  ["+81", "JP", "Jepang", "Japan"],
  ["+62", "ID", "Indonesia", "Indonesia"],
  ["+60", "MY", "Malaysia", "Malaysia"],
  ["+65", "SG", "Singapura", "Singapore"],
  ["+673", "BN", "Brunei", "Brunei"],
  ["+66", "TH", "Thailand", "Thailand"],
  ["+63", "PH", "Filipina", "Philippines"],
  ["+84", "VN", "Vietnam", "Vietnam"],
  ["+82", "KR", "Korea Selatan", "South Korea"],
  ["+86", "CN", "Tiongkok", "China"],
  ["+61", "AU", "Australia", "Australia"],
  ["+64", "NZ", "Selandia Baru", "New Zealand"],
  ["+1", "US", "Amerika Serikat", "United States"],
  ["+44", "GB", "Inggris Raya", "United Kingdom"],
  ["+31", "NL", "Belanda", "Netherlands"],
  ["+49", "DE", "Jerman", "Germany"],
  ["+33", "FR", "Prancis", "France"],
  ["+966", "SA", "Arab Saudi", "Saudi Arabia"],
  ["+971", "AE", "Uni Emirat Arab", "United Arab Emirates"],
  ["+974", "QA", "Qatar", "Qatar"],
  ["+968", "OM", "Oman", "Oman"],
  ["+20", "EG", "Mesir", "Egypt"],
  ["+90", "TR", "Turki", "Türkiye"],
]

export interface PhoneFieldProps {
  id?: string
  /** Composed value, for example "+81 90-1234-5678". Empty means no number yet. */
  value: string
  onChange: (value: string) => void
  /** Prefix assumed when the stored value carries none: +81 for the member, +62 for the emergency contact. */
  defaultCode?: string
  locale?: "id" | "en"
  className?: string
}

/** Split by the longest matching curated code, so +673 never reads as +67 or +6. */
function splitPhone(stored: string): { code: string; number: string } {
  const codes = PHONE_COUNTRY_CODES.map((c) => c[0]).sort((a, b) => b.length - a.length)
  for (const code of codes) {
    if (stored.startsWith(code)) return { code, number: stored.slice(code.length).trim() }
  }
  return { code: "", number: stored }
}

/**
 * Phone entry, extracted from the wizard PhoneField: a grouped
 * country-code Select (104px, showing "JP +81") paired with the
 * national number input. The pair composes one stored string,
 * "+81 90-1234-5678". Both controls are field height (44px); the
 * label is composed by the parent like every other field.
 */
export function PhoneField({ id, value, onChange, defaultCode = "+81", locale = "id", className }: PhoneFieldProps) {
  const [chosen, setChosen] = React.useState("")
  const split = splitPhone(value)
  const selected = split.code || chosen || defaultCode
  const number = split.number
  const en = locale === "en"
  const compose = (code: string, national: string) => (national.trim() ? `${code} ${national}` : "")
  const item = ([code, iso, idName, enName]: (typeof PHONE_COUNTRY_CODES)[number]) => (
    <SelectItem key={code} value={code} textValue={`${en ? enName : idName} ${code}`}>
      {iso} {code}
    </SelectItem>
  )
  return (
    <div className={cn("grid min-w-0 grid-cols-[104px_minmax(0,1fr)] gap-2", className)}>
      <Select
        value={selected}
        onValueChange={(code) => {
          setChosen(code)
          onChange(compose(code, number))
        }}
      >
        <SelectTrigger aria-label={en ? "Country code" : "Kode negara"} className="h-11 min-h-11 w-full bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" align="start" avoidCollisions={false} className="max-h-72">
          <SelectGroup>
            <SelectLabel>{en ? "Frequently used" : "Sering dipakai"}</SelectLabel>
            {PHONE_COUNTRY_CODES.slice(0, 2).map(item)}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>{en ? "Other countries" : "Negara lain"}</SelectLabel>
            {PHONE_COUNTRY_CODES.slice(2).map(item)}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        className="h-11 min-h-11 min-w-0"
        value={number}
        onChange={(event) => onChange(compose(selected, event.target.value))}
      />
    </div>
  )
}
