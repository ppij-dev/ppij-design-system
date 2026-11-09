import type { Meta, StoryObj } from "@storybook/react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof Dialog> = {
  title: "Portal/Dialog",
  component: Dialog,
  argTypes: {
    open: { control: "boolean" },
    onOpenChange: { action: "openChange" },
    modal: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Dialog>;

export const Playground: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild><Button>Ganti nama komsat</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ganti nama komsat</DialogTitle>
          <DialogDescription>
            Nama baru tampil di direktori anggota dan kartu anggota digital.
          </DialogDescription>
        </DialogHeader>
        <div style={{ display: "grid", gap: 6 }}>
          <Label htmlFor="playground-komsat">Nama komsat</Label>
          <Input id="playground-komsat" defaultValue="Okayama" />
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
          <Button>Simpan nama</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
export const SmallForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild><Button>Ganti nama komsat</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ganti nama komsat</DialogTitle>
          <DialogDescription>
            Nama baru tampil di direktori anggota dan kartu anggota digital.
          </DialogDescription>
        </DialogHeader>
        <div style={{ display: "grid", gap: 6 }}>
          <Label htmlFor="komsat-name">Nama komsat</Label>
          <Input id="komsat-name" defaultValue="Okayama" />
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
          <Button>Simpan nama</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Notice: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">Lihat pengumuman</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Jadwal pemeliharaan</DialogTitle>
          <DialogDescription>
            Portal tidak dapat diakses pada hari Minggu, 2 November 2026,
            pukul 01.00 sampai 03.00 JST. Data anggota tidak berubah.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild><Button>Mengerti</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
