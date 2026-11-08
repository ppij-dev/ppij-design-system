import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { SearchFilter, type ActiveFilter } from "./search-filter";
import { DataTable } from "./data-table";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "./table";
import { Badge } from "./badge";
import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

const meta: Meta<typeof SearchFilter> = { title: "Admin/SearchFilter", component: SearchFilter,
  argTypes: {
    searchValue: { control: "text" },
    onSearchChange: { action: "onSearchChange" },
    searchPlaceholder: { control: "text" },
    filters: { control: false },
    advancedFilters: { control: false },
    advancedActiveCount: { control: "number" },
    advancedTitle: { control: "text" },
    activeFilters: { control: "object" },
    onClearAll: { action: "onClearAll" },
    clearAllLabel: { control: "text" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof SearchFilter>;

// name, komsat, universitas, tahun masuk, status
const members = [
  ["I Nyoman Darma Kotama", "Okayama", "Okayama University", "2024", "Aktif"],
  ["Marcus Aurelius Antoninus", "Roma", "Universitas Roma", "2023", "Aktif"],
  ["Lucius Annaeus Seneca", "Corduba", "Universitas Corduba", "2023", "Menunggu"],
  ["Zeno of Citium", "Kition", "Universitas Athena", "2024", "Aktif"],
  ["Diogenes of Sinope", "Sinope", "Universitas Sinope", "2022", "Aktif"],
  ["Epictetus", "Hierapolis", "Universitas Athena", "2025", "Menunggu"],
  ["Cleanthes of Assos", "Assos", "Universitas Athena", "2022", "Aktif"],
];

function FilterSelect({ label, value, onChange, allLabel, options }: { label: string; value: string; onChange: (v: string) => void; allLabel: string; options: string[] }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full"><SelectValue placeholder={label} /></SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">{allLabel}</SelectItem>
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function MemberDirectoryDemo() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("semua");
  const [komsat, setKomsat] = React.useState("semua");
  const [univ, setUniv] = React.useState("semua");
  const [tahun, setTahun] = React.useState("semua");
  const rows = members.filter(([name, city, university, year, state]) => {
    const matchesQuery = (name + " " + city + " " + university).toLowerCase().includes(query.toLowerCase());
    return matchesQuery
      && (status === "semua" || state === status)
      && (komsat === "semua" || city === komsat)
      && (univ === "semua" || university === univ)
      && (tahun === "semua" || year === tahun);
  });
  const active: ActiveFilter[] = [];
  if (query !== "") active.push({ label: "Kata kunci", value: query, onRemove: () => setQuery("") });
  if (status !== "semua") active.push({ label: "Status", value: status, onRemove: () => setStatus("semua") });
  if (komsat !== "semua") active.push({ label: "Komsat", value: komsat, onRemove: () => setKomsat("semua") });
  if (univ !== "semua") active.push({ label: "Universitas", value: univ, onRemove: () => setUniv("semua") });
  if (tahun !== "semua") active.push({ label: "Tahun masuk", value: tahun, onRemove: () => setTahun("semua") });
  const advancedCount = (komsat !== "semua" ? 1 : 0) + (univ !== "semua" ? 1 : 0) + (tahun !== "semua" ? 1 : 0);
  const resetAll = () => { setQuery(""); setStatus("semua"); setKomsat("semua"); setUniv("semua"); setTahun("semua"); };
  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 860 }}>
      <SearchFilter
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="Cari anggota..."
        activeFilters={active}
        onClearAll={resetAll}
        advancedActiveCount={advancedCount}
        filters={
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua status</SelectItem>
              <SelectItem value="Aktif">Aktif</SelectItem>
              <SelectItem value="Menunggu">Menunggu</SelectItem>
            </SelectContent>
          </Select>
        }
        advancedFilters={
          <>
            <FilterSelect label="Komsat" value={komsat} onChange={setKomsat} allLabel="Semua komsat" options={Array.from(new Set(members.map((m) => m[1])))} />
            <FilterSelect label="Universitas" value={univ} onChange={setUniv} allLabel="Semua universitas" options={Array.from(new Set(members.map((m) => m[2])))} />
            <FilterSelect label="Tahun masuk" value={tahun} onChange={setTahun} allLabel="Semua tahun" options={Array.from(new Set(members.map((m) => m[3])))} />
          </>
        }
      />
      <DataTable footerText={"Menampilkan " + rows.length + " dari " + members.length + " anggota"} pageLabel="Halaman 1 dari 1" previousDisabled nextDisabled>
        <Table>
          <TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>Komsat</TableHead><TableHead>Universitas</TableHead><TableHead>Tahun</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow><TableCell colSpan={5} style={{ textAlign: "center", color: "#5b6168" }}>Tidak ada anggota yang cocok dengan filter ini.</TableCell></TableRow>
            ) : rows.map(([n, k, u, y, s]) => (
              <TableRow key={n}><TableCell>{n}</TableCell><TableCell>{k}</TableCell><TableCell>{u}</TableCell><TableCell>{y}</TableCell><TableCell><Badge variant={s === "Aktif" ? "default" : "secondary"}>{s}</Badge></TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
      <p style={{ margin: 0, maxWidth: "65ch", color: "var(--color-muted-foreground)", fontSize: 14, lineHeight: 1.6 }}>
        The bar holds search and one quick filter. Everything else lives
        behind the filter icon and opens in a drawer; the count on the icon
        and the chips below the bar keep the active selection visible.
      </p>
    </div>
  );
}

export const MemberDirectory: Story = { render: () => <MemberDirectoryDemo /> };

export const Playground: Story = {
  args: {
    searchValue: "",
    searchPlaceholder: "Cari anggota...",
    filters: (
      <Select defaultValue="semua">
        <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Semua status</SelectItem>
          <SelectItem value="Aktif">Aktif</SelectItem>
          <SelectItem value="Menunggu">Menunggu</SelectItem>
        </SelectContent>
      </Select>
    ),
    advancedFilters: (
      <div style={{ display: "grid", gap: 6 }}>
        <Label>Komsat</Label>
        <Select defaultValue="semua">
          <SelectTrigger className="w-full"><SelectValue placeholder="Komsat" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua komsat</SelectItem>
            <SelectItem value="Okayama">Okayama</SelectItem>
            <SelectItem value="Tokyo">Tokyo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ),
    advancedActiveCount: 1,
    advancedTitle: "Filter lanjutan",
    activeFilters: [
      { label: "Status", value: "Aktif", onRemove: () => undefined },
      { label: "Komsat", value: "Okayama", onRemove: () => undefined },
    ],
    clearAllLabel: "Hapus semua filter",
  },
  render: (args) => {
    const [search, setSearch] = React.useState(args.searchValue);
    React.useEffect(() => setSearch(args.searchValue), [args.searchValue]);
    return (
      <div style={{ maxWidth: 860 }}>
        <SearchFilter
          {...args}
          searchValue={search}
          onSearchChange={(next) => {
            setSearch(next);
            args.onSearchChange(next);
          }}
        />
      </div>
    );
  },
};
