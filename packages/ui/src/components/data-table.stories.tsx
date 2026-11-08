import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { DataTable } from "./data-table";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "./table";
import { Badge } from "./badge";
import { Button } from "./button";
import { IconFilter, IconSearch } from "@tabler/icons-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "./empty";

const meta: Meta<typeof DataTable> = {
  title: "Admin/DataTable",
  component: DataTable,
  argTypes: {
    searchValue: { control: "text" },
    onSearchChange: { action: "onSearchChange" },
    searchPlaceholder: { control: "text" },
    actions: { control: false },
    children: { control: false },
    footerText: { control: "text" },
    pageLabel: { control: "text" },
    onPrevious: { action: "onPrevious" },
    onNext: { action: "onNext" },
    previousDisabled: { control: "boolean" },
    nextDisabled: { control: "boolean" },
    previousLabel: { control: "text" },
    nextLabel: { control: "text" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof DataTable>;

const all = [
  ["I Nyoman Darma Kotama", "Okayama", "Aktif"],
  ["Marcus Aurelius Antoninus", "Roma", "Aktif"],
  ["Lucius Annaeus Seneca", "Corduba", "Menunggu"],
  ["Zeno of Citium", "Kition", "Aktif"],
  ["Diogenes of Sinope", "Sinope", "Aktif"],
  ["Epictetus", "Hierapolis", "Aktif"],
  ["Cleanthes of Assos", "Assos", "Menunggu"],
];
function Demo() {
  const [q, setQ] = React.useState("");
  const rows = all.filter((r) => r.join(" ").toLowerCase().includes(q.toLowerCase()));
  return (
    <DataTable
      searchValue={q}
      onSearchChange={setQ}
      searchPlaceholder="Cari anggota..."
      actions={<Button variant="outline"><IconFilter size={16} /> Filter</Button>}
      footerText={"Menampilkan " + rows.length + " dari " + all.length + " anggota"}
    >
      <Table>
        <TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>Komsat</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
        <TableBody>
          {rows.map(([n, k, s]) => (
            <TableRow key={n}><TableCell>{n}</TableCell><TableCell>{k}</TableCell><TableCell><Badge variant={s === "Aktif" ? "default" : "secondary"}>{s}</Badge></TableCell></TableRow>
          ))}
        </TableBody>
      </Table>
    </DataTable>
  );
}
export const Directory: Story = { render: () => <Demo /> };

function PaginatedDemo() {
  const [page, setPage] = React.useState(1);
  const pageSize = 3;
  const totalPages = Math.ceil(all.length / pageSize);
  const rows = all.slice((page - 1) * pageSize, page * pageSize);

  return (
    <DataTable
      footerText={`Menampilkan ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, all.length)} dari ${all.length} anggota`}
      pageLabel={`Halaman ${page} dari ${totalPages}`}
      onPrevious={() => setPage((current) => Math.max(1, current - 1))}
      onNext={() => setPage((current) => Math.min(totalPages, current + 1))}
      previousDisabled={page === 1}
      nextDisabled={page === totalPages}
    >
      <Table>
        <TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>Komsat</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
        <TableBody>{rows.map(([n, k, s]) => (
          <TableRow key={n}><TableCell>{n}</TableCell><TableCell>{k}</TableCell><TableCell><Badge variant={s === "Aktif" ? "default" : "secondary"}>{s}</Badge></TableCell></TableRow>
        ))}</TableBody>
      </Table>
    </DataTable>
  );
}
export const MultiplePages: Story = { render: () => <PaginatedDemo /> };

export const NoResults: Story = {
  render: () => (
    <DataTable searchValue="zzz" onSearchChange={() => {}} searchPlaceholder="Cari anggota..." footerText="Menampilkan 0 dari 7 anggota">
      <div style={{ padding: 16 }}>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><IconSearch /></EmptyMedia>
            <EmptyTitle>Tidak ada hasil</EmptyTitle>
            <EmptyDescription>Tidak ada anggota yang cocok dengan kata kunci ini.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </DataTable>
  ),
};

/** Playground keeps the search text local so typing filters the rows, and still reports to the args. */
function PlaygroundTable(args: React.ComponentProps<typeof DataTable>) {
  const [q, setQ] = React.useState(args.searchValue ?? "");
  React.useEffect(() => {
    setQ(args.searchValue ?? "");
  }, [args.searchValue]);
  const rows = all.filter((r) => r.join(" ").toLowerCase().includes(q.toLowerCase()));
  return (
    <DataTable
      {...args}
      searchValue={q}
      onSearchChange={(value) => {
        setQ(value);
        args.onSearchChange?.(value);
      }}
    >
      <Table>
        <TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>Komsat</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
        <TableBody>
          {rows.map(([n, k, s]) => (
            <TableRow key={n}><TableCell>{n}</TableCell><TableCell>{k}</TableCell><TableCell><Badge variant={s === "Aktif" ? "default" : "secondary"}>{s}</Badge></TableCell></TableRow>
          ))}
        </TableBody>
      </Table>
    </DataTable>
  );
}

export const Playground: Story = {
  args: {
    searchValue: "",
    searchPlaceholder: "Cari anggota...",
    actions: <Button variant="outline"><IconFilter size={16} /> Filter</Button>,
    footerText: "Menampilkan 7 dari 7 anggota",
    pageLabel: "Halaman 1 dari 3",
    previousLabel: "Sebelumnya",
    nextLabel: "Berikutnya",
    previousDisabled: true,
    nextDisabled: false,
  },
  render: (args) => <PlaygroundTable {...args} />,
};
