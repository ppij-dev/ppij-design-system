import { useState } from "react";
import { IconArrowRight, IconPlus, IconShieldCheck } from "@tabler/icons-react";
import { Badge, Button, PageHeader, SearchFilter } from "ppij-design-system";
import { SearchableMultiSelect } from "./SearchableMultiSelect";
import "./ManagementPage.css";

type Scope = "national" | "korda" | "komsat";
type RecordRow = { name: string; unit: string; parent: string; kind: string; detail: string; status: string; date: string };
const assignments: RecordRow[] = [
  { name: "Contoh Pengurus A", unit: "PPI Jepang", parent: "", kind: "Admin", detail: "Nasional", status: "Aktif", date: "12 Sep 2026" },
  { name: "Contoh Pengurus B", unit: "Korda Kanto", parent: "PPI Jepang", kind: "Admin", detail: "Korda", status: "Aktif", date: "14 Sep 2026" },
  { name: "Contoh Pengurus C", unit: "Komsat Tokyo", parent: "Korda Kanto", kind: "Verifikator", detail: "Komsat", status: "Aktif", date: "18 Sep 2026" },
  { name: "Contoh Pengurus D", unit: "Komsat Yokohama", parent: "Korda Kanto", kind: "Admin", detail: "Komsat", status: "Diundang", date: "30 Okt 2026" },
  { name: "Contoh Pengurus E", unit: "Korda Kansai", parent: "PPI Jepang", kind: "Admin", detail: "Korda", status: "Aktif", date: "1 Okt 2026" },
];
const organization: RecordRow[] = [
  { name: "Korda Kanto", unit: "Korda Kanto", parent: "PPI Jepang", kind: "Korda", detail: "4 komsat · 452 anggota", status: "Aktif", date: "Contoh Pengurus B" },
  { name: "Komsat Tokyo", unit: "Komsat Tokyo", parent: "Korda Kanto", kind: "Komsat", detail: "218 anggota", status: "Aktif", date: "Contoh Pengurus C" },
  { name: "Komsat Yokohama", unit: "Komsat Yokohama", parent: "Korda Kanto", kind: "Komsat", detail: "96 anggota", status: "Aktif", date: "Contoh Pengurus D" },
  { name: "Komsat Chiba", unit: "Komsat Chiba", parent: "Korda Kanto", kind: "Komsat", detail: "74 anggota", status: "Aktif", date: "Belum ditunjuk" },
  { name: "Korda Kansai", unit: "Korda Kansai", parent: "PPI Jepang", kind: "Korda", detail: "306 anggota", status: "Aktif", date: "Contoh Pengurus E" },
  { name: "Komsat Osaka", unit: "Komsat Osaka", parent: "Korda Kansai", kind: "Komsat", detail: "184 anggota", status: "Nonaktif", date: "Contoh Pengurus F" },
];
export function ManagementPage({ kind, scope, open }: { kind: "roles" | "units"; scope: Scope; open: (name: string, kind: string, fields: { label: string; value: string }[]) => void }) {
  const [search, setSearch] = useState("");
  const [unit, setUnit] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const roles = kind === "roles";
  const scoped = (roles ? assignments : organization).filter((item) => scope === "national" || (scope === "korda" ? item.unit === "Korda Kanto" || item.parent === "Korda Kanto" : item.unit === "Komsat Tokyo"));
  const visible = scoped.filter((item) => `${item.name} ${item.unit} ${item.kind}`.toLocaleLowerCase("id").includes(search.toLocaleLowerCase("id")) && (!unit.length || unit.includes(item.unit) || unit.includes(item.parent)) && (!types.length || types.includes(item.kind)));
  const title = roles ? "Admin & Peran" : "Organisasi";
  const action = roles ? "Tunjuk pengurus" : "Tambah unit";
  return <div className="verification-page-island management-page">
    <PageHeader className="management-header" title={title} description={roles ? "Kelola pengurus dan hak akses sesuai cakupan tugas." : "Telusuri struktur korda, komsat, dan penanggung jawab."} actions={<Button size="sm" className="management-action" onClick={() => open(action, roles ? "Alur penunjukan" : "Alur organisasi", [{ label: "Cakupan", value: scope === "national" ? "Nasional" : "Korda Kanto" }])}><IconPlus size={16} />{action}</Button>} />
    <div className="management-context"><IconShieldCheck size={18} /><p>{roles ? "Hak akses berlaku dalam unit yang ditugaskan dan turunannya." : "Struktur organisasi: Nasional → Korda → Komsat."}</p></div>
    <SearchFilter className="verification-filters management-filters" searchValue={search} onSearchChange={setSearch} searchPlaceholder={roles ? "Cari pengurus atau unit" : "Cari nama unit"} filters={<SearchableMultiSelect compact label="Unit" allLabel="Semua unit" values={unit} options={[...new Set(scoped.flatMap((item) => [item.unit, item.parent]).filter(Boolean))]} onChange={setUnit} />} advancedTitle={roles ? "Filter penugasan" : "Filter organisasi"} advancedActiveCount={types.length} advancedFilters={<SearchableMultiSelect label={roles ? "Peran" : "Jenis unit"} allLabel={roles ? "Semua peran" : "Semua jenis"} values={types} options={roles ? ["Admin", "Verifikator"] : ["Korda", "Komsat"]} onChange={setTypes} />} activeFilters={[...unit.map((value) => ({ label: "Unit", value, onRemove: () => setUnit((current) => current.filter((item) => item !== value)) })), ...types.map((value) => ({ label: roles ? "Peran" : "Jenis", value, onRemove: () => setTypes((current) => current.filter((item) => item !== value)) }))]} onClearAll={() => { setUnit([]); setTypes([]); }} />
    <div className="management-list-caption"><h2>{roles ? "Penugasan pengurus" : "Struktur unit"}</h2><span>{visible.length} {roles ? "penugasan" : "unit"} contoh</span></div>
    <div className="management-list">{visible.map((item) => <button type="button" key={item.name} onClick={() => open(item.name, roles ? "Penugasan pengurus" : item.kind, [{ label: roles ? "Peran" : "Jenis", value: item.kind }, { label: "Unit", value: item.unit }, { label: "Induk", value: item.parent || "—" }, { label: roles ? "Ditunjuk" : "Penanggung jawab", value: item.date }, { label: "Status", value: item.status }])}><span><strong>{item.name}</strong><small>{roles ? item.unit : item.parent}</small></span><span><strong>{roles ? item.kind : item.detail}</strong><small>{roles ? item.date : item.date}</small></span><Badge variant={item.status === "Aktif" ? "success" : "secondary"}>{item.status}</Badge><IconArrowRight size={16} /></button>)}{!visible.length && <p className="management-empty">Tidak ada hasil. Coba kata kunci atau filter lain.</p>}</div>
    {!roles && <p className="management-footnote">Prefektur belum ditetapkan: tidak ada pada data contoh ini.</p>}
  </div>;
}
