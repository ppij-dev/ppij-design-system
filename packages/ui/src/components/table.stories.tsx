import type { Meta, StoryObj } from "@storybook/react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from "./table";
import { Badge } from "./badge";

const meta: Meta<typeof Table> = {
  title: "Portal/Table",
  component: Table,
  argTypes: {
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Table>;

const rows = [
  ["I Nyoman Darma Kotama", "Okayama", "Aktif"],
  ["Marcus Aurelius Antoninus", "Roma", "Aktif"],
  ["Lucius Annaeus Seneca", "Corduba", "Menunggu"],
  ["Zeno of Citium", "Kition", "Aktif"],
  ["Epictetus", "Hierapolis", "Aktif"],
];
export const MemberList: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Table>
        <TableCaption>Daftar anggota komsat</TableCaption>
        <TableHeader>
          <TableRow><TableHead>Nama</TableHead><TableHead>Komsat</TableHead><TableHead>Status</TableHead></TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([n, k, s]) => (
            <TableRow key={n}><TableCell>{n}</TableCell><TableCell>{k}</TableCell><TableCell><Badge variant={s === "Aktif" ? "default" : "secondary"}>{s}</Badge></TableCell></TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
export const Empty: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Table>
        <TableHeader>
          <TableRow><TableHead>Nama</TableHead><TableHead>Komsat</TableHead><TableHead>Status</TableHead></TableRow>
        </TableHeader>
        <TableBody>
          <TableRow><TableCell colSpan={3} style={{ textAlign: "center", color: "#5b6168" }}>Belum ada anggota pada filter ini.</TableCell></TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

export const Playground: Story = {
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Table {...args}>
        <TableCaption>Daftar anggota komsat</TableCaption>
        <TableHeader>
          <TableRow><TableHead>Nama</TableHead><TableHead>Komsat</TableHead><TableHead>Status</TableHead></TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([n, k, s]) => (
            <TableRow key={n}><TableCell>{n}</TableCell><TableCell>{k}</TableCell><TableCell><Badge variant={s === "Aktif" ? "default" : "secondary"}>{s}</Badge></TableCell></TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
