import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";

type PlaygroundArgs = { title?: string; description?: string };

const meta: Meta<PlaygroundArgs> = {
  title: "Portal/Card",
  component: Card,
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 420 }}>
      <CardHeader>
        <CardTitle>Keanggotaan PPIJ</CardTitle>
        <CardDescription>Status pendaftaran anggota</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Badge>Terverifikasi</Badge>
          <span style={{ fontSize: 13, color: "#5b6168" }}>sejak 12 Okt 2026</span>
        </div>
        <p style={{ margin: "10px 0 0" }}>Data anggota tampil di sini. Kartu memakai token warna dan radius dari sistem desain.</p>
      </CardContent>
      <CardFooter>
        <Button>Lihat profil</Button>
      </CardFooter>
    </Card>
  ),
};
export const Playground: Story = {
  args: { title: "Keanggotaan PPIJ", description: "Status pendaftaran anggota" },
  render: ({ title, description, ...args }) => (
    <Card {...args} style={{ maxWidth: 420 }}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0 }}>Data anggota tampil di sini. Kartu memakai token warna dan radius dari sistem desain.</p>
      </CardContent>
      <CardFooter>
        <Button>Lihat profil</Button>
      </CardFooter>
    </Card>
  ),
};
export const Empty: Story = {
  render: () => (
    <Card style={{ maxWidth: 420 }}>
      <CardHeader>
        <CardTitle>Dokumen</CardTitle>
        <CardDescription>Belum ada dokumen yang diunggah.</CardDescription>
      </CardHeader>
    </Card>
  ),
};
export const LongText: Story = {
  render: () => (
    <Card style={{ maxWidth: 420 }}>
      <CardHeader>
        <CardTitle>Pengumuman dengan judul yang sangat panjang untuk menguji bungkus teks pada kartu</CardTitle>
        <CardDescription>Deskripsi panjang yang menjelaskan isi pengumuman secara rinci agar tata letak tetap rapi pada lebar telepon dan desktop.</CardDescription>
      </CardHeader>
    </Card>
  ),
};
