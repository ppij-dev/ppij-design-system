import { useRef, useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, Input } from "ppij-design-system";
import "./SearchableMultiSelect.css";

export function SearchableMultiSelect({ label, values, options, onChange, allLabel, compact = false, single = false }: { label: string; values: string[]; options: string[]; onChange: (values: string[]) => void; allLabel: string; compact?: boolean; single?: boolean }) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const matches = options.filter((option) => option.toLocaleLowerCase("id").includes(query.trim().toLocaleLowerCase("id")));
  const selectedLabel = values.length === 0 ? allLabel : values.length === 1 ? values[0] : `${values.length} dipilih`;
  return <div className={`member-multi-control${compact ? " is-compact" : ""}`}>
    {!compact && <span className="member-multi-label">{label}</span>}
    <DropdownMenu onOpenChange={(open) => { if (open) window.requestAnimationFrame(() => searchRef.current?.focus()); else setQuery(""); }}>
      <DropdownMenuTrigger asChild><Button type="button" variant="outline" className="member-multi-trigger" aria-label={`${label}: ${selectedLabel}`}><span>{selectedLabel}</span><IconChevronDown size={16} /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="member-multi-menu">
        <div className="member-multi-search"><Input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (!["Escape", "Tab", "ArrowDown"].includes(event.key)) event.stopPropagation(); }} placeholder={`Cari ${label.toLocaleLowerCase("id")}`} aria-label={`Cari ${label.toLocaleLowerCase("id")}`} /></div>
        <div className="member-multi-options">{matches.length ? matches.map((option) => <DropdownMenuCheckboxItem key={option} checked={values.includes(option)} onCheckedChange={(checked) => onChange(single ? (checked ? [option] : []) : checked ? [...values, option] : values.filter((value) => value !== option))} onSelect={single ? undefined : (event) => event.preventDefault()}>{option}</DropdownMenuCheckboxItem>) : <p>Tidak ada pilihan yang cocok.</p>}</div>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>;
}
