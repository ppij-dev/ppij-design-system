import type { ComponentProps } from "react";
import type { TabsAppearance } from "./tabs";
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Card, CardHeader, CardTitle, CardContent } from "./card";

type TabsArgs = ComponentProps<typeof Tabs> & {
  appearance?: TabsAppearance;
  variant?: "default" | "line";
};
const meta: Meta<TabsArgs> = {
  title: "Portal/Tabs",
  component: Tabs,
  argTypes: {
    defaultValue: { control: "text" },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    onValueChange: { action: "valueChanged" },
    appearance: { control: "select", options: ["default", "underline", "segmented"] },
    variant: { control: "select", options: ["default", "line"] },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const ProfileTabs: Story = {
  render: () => (
    <Tabs defaultValue="profil" style={{ maxWidth: 440 }}>
      <TabsList>
        <TabsTrigger value="profil">Profil</TabsTrigger>
        <TabsTrigger value="berkas">Berkas</TabsTrigger>
        <TabsTrigger value="akun">Akun</TabsTrigger>
      </TabsList>
      <TabsContent value="profil">
        <Card><CardHeader><CardTitle>Profil</CardTitle></CardHeader><CardContent>Nama, afiliasi, dan komsat.</CardContent></Card>
      </TabsContent>
      <TabsContent value="berkas">
        <Card><CardHeader><CardTitle>Berkas</CardTitle></CardHeader><CardContent>Dokumen verifikasi yang sudah diunggah.</CardContent></Card>
      </TabsContent>
      <TabsContent value="akun">
        <Card><CardHeader><CardTitle>Akun</CardTitle></CardHeader><CardContent>Email masuk dan keamanan akun.</CardContent></Card>
      </TabsContent>
    </Tabs>
  ),
};

const QUEUE = [
  { value: "baru", label: "Baru", count: 12, body: "12 pengajuan menunggu pemeriksaan pertama." },
  { value: "menunggu", label: "Menunggu anggota", count: 4, body: "Menunggu perbaikan dari anggota." },
  { value: "diproses", label: "Sedang diperiksa", count: 2, body: "Dipegang verifikator lain." },
  { value: "selesai", label: "Selesai", count: 184, body: "Sudah diputuskan pada putaran ini." },
];

export const UnderlineWithCounts: Story = {
  parameters: {
    docs: {
      description: {
        story: "The verifikasi queue tabs: the `underline` appearance with per-tab counts, taken from `.verification-tabs`. The appearance is additive — a `Tabs` that sets neither `appearance` nor `count` renders exactly as it shipped. The count joins the trigger's accessible name (`\"Baru, 12\"`), which the sr-only suffix carries, so a screen reader gets the number without the pill being read twice.",
      },
    },
  },
  render: () => (
    <Tabs defaultValue="baru" style={{ maxWidth: 720 }}>
      <TabsList appearance="underline">
        {QUEUE.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} count={tab.count}>{tab.label}</TabsTrigger>
        ))}
      </TabsList>
      {QUEUE.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <p className="pt-3 text-[13px] text-brand-muted">{tab.body}</p>
        </TabsContent>
      ))}
    </Tabs>
  ),
};

export const CountsAtZero: Story = {
  parameters: {
    docs: {
      description: {
        story: "A zero count still renders, muted instead of red: an empty queue is information, not an absence. The remedy is the same trigger value, so the row never shifts.",
      },
    },
  },
  render: () => (
    <Tabs defaultValue="baru" style={{ maxWidth: 720 }}>
      <TabsList appearance="underline">
        <TabsTrigger value="baru" count={0}>Baru</TabsTrigger>
        <TabsTrigger value="menunggu" count={0}>Menunggu anggota</TabsTrigger>
        <TabsTrigger value="selesai" count={184}>Selesai</TabsTrigger>
      </TabsList>
      <TabsContent value="baru"><p className="pt-3 text-[13px] text-brand-muted">Tidak ada pengajuan baru.</p></TabsContent>
      <TabsContent value="menunggu"><p className="pt-3 text-[13px] text-brand-muted">Tidak ada yang menunggu anggota.</p></TabsContent>
      <TabsContent value="selesai"><p className="pt-3 text-[13px] text-brand-muted">184 pengajuan sudah diputuskan.</p></TabsContent>
    </Tabs>
  ),
};

export const Segmented: Story = {
  parameters: {
    docs: {
      description: {
        story: "The `segmented` appearance: the invite mode switcher (`.member-invite-mode`, equal halves on a grey track) and the student-card side switcher (`.verification-doc-tabs`, boxed). The selected segment is a white card with a soft shadow.",
      },
    },
  },
  render: () => (
    <div className="grid max-w-md gap-5">
      <Tabs defaultValue="undang">
        <TabsList appearance="segmented">
          <TabsTrigger value="undang">Undang anggota</TabsTrigger>
          <TabsTrigger value="cek">Cek status</TabsTrigger>
        </TabsList>
        <TabsContent value="undang"><p className="pt-2 text-[13px] text-brand-muted">Masukkan nama dan email penerima.</p></TabsContent>
        <TabsContent value="cek"><p className="pt-2 text-[13px] text-brand-muted">Lihat undangan yang belum dijawab.</p></TabsContent>
      </Tabs>
      <Tabs defaultValue="depan">
        <TabsList appearance="segmented" className="w-fit">
          <TabsTrigger value="depan">Sisi depan</TabsTrigger>
          <TabsTrigger value="belakang">Sisi belakang</TabsTrigger>
        </TabsList>
        <TabsContent value="depan"><p className="pt-2 text-[13px] text-brand-muted">Pratinjau sisi depan.</p></TabsContent>
        <TabsContent value="belakang"><p className="pt-2 text-[13px] text-brand-muted">Pratinjau sisi belakang.</p></TabsContent>
      </Tabs>
    </div>
  ),
};

export const LongLabelsScroll: Story = {
  parameters: {
    docs: {
      description: {
        story: "The member directory's phone tabs: the row scrolls horizontally instead of shrinking the labels, and `overflow-x-auto` keeps every trigger reachable by keyboard, because the browser scrolls a focused tab into view. Below 600px the triggers hold the 44px touch floor and keep 13px labels.",
      },
    },
  },
  render: () => (
    <Tabs defaultValue="aktif" style={{ maxWidth: 390 }}>
      <TabsList appearance="underline">
        <TabsTrigger value="aktif" count={1032}>Aktif</TabsTrigger>
        <TabsTrigger value="menunggu" count={12}>Menunggu verifikasi komsat</TabsTrigger>
        <TabsTrigger value="perbaikan" count={3}>Berkas perlu diperbaiki</TabsTrigger>
        <TabsTrigger value="berakhir" count={58}>Berakhir masa berlaku</TabsTrigger>
        <TabsTrigger value="dicabut" count={2}>Dicabut</TabsTrigger>
      </TabsList>
      <TabsContent value="aktif"><p className="pt-3 text-[13px] text-brand-muted">1.032 anggota aktif.</p></TabsContent>
      <TabsContent value="menunggu"><p className="pt-3 text-[13px] text-brand-muted">12 menunggu verifikasi komsat.</p></TabsContent>
      <TabsContent value="perbaikan"><p className="pt-3 text-[13px] text-brand-muted">3 berkas perlu diperbaiki.</p></TabsContent>
      <TabsContent value="berakhir"><p className="pt-3 text-[13px] text-brand-muted">58 kartu berakhir dalam 60 hari.</p></TabsContent>
      <TabsContent value="dicabut"><p className="pt-3 text-[13px] text-brand-muted">2 keanggotaan dicabut.</p></TabsContent>
    </Tabs>
  ),
};

export const KeyboardNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story: "`role=\"tablist\"`, `aria-selected`, roving tabindex and ArrowLeft/ArrowRight all stay Radix-owned, so the new appearances inherit them. Tab reaches the active trigger, the arrow keys move between tabs and Home/End jump to the ends; the focus ring is the system's 3px ring.",
      },
    },
  },
  render: () => (
    <Tabs defaultValue="baru" style={{ maxWidth: 720 }}>
      <TabsList appearance="underline">
        <TabsTrigger value="baru" count={12}>Baru</TabsTrigger>
        <TabsTrigger value="menunggu" count={4}>Menunggu anggota</TabsTrigger>
        <TabsTrigger value="selesai" count={184}>Selesai</TabsTrigger>
      </TabsList>
      <TabsContent value="baru"><p className="pt-3 text-[13px] text-brand-muted">Gunakan tombol panah untuk berpindah tab.</p></TabsContent>
      <TabsContent value="menunggu"><p className="pt-3 text-[13px] text-brand-muted">Menunggu anggota.</p></TabsContent>
      <TabsContent value="selesai"><p className="pt-3 text-[13px] text-brand-muted">Selesai.</p></TabsContent>
    </Tabs>
  ),
};

export const DefaultAppearanceUnchanged: Story = {
  parameters: {
    docs: {
      description: {
        story: "No `appearance` and no `count`: the shipped default look, so an existing consumer sees no change. Compare with `ProfileTabs`, which is the original story.",
      },
    },
  },
  render: () => (
    <Tabs defaultValue="profil" style={{ maxWidth: 440 }}>
      <TabsList>
        <TabsTrigger value="profil">Profil</TabsTrigger>
        <TabsTrigger value="berkas">Berkas</TabsTrigger>
      </TabsList>
      <TabsContent value="profil"><p className="pt-2 text-[13px] text-brand-muted">Tampilan bawaan tidak berubah.</p></TabsContent>
      <TabsContent value="berkas"><p className="pt-2 text-[13px] text-brand-muted">Termasuk tinggi barisnya.</p></TabsContent>
    </Tabs>
  ),
};

export const Playground: StoryObj<TabsArgs> = {
  args: { defaultValue: "profil", orientation: "horizontal", appearance: "default", variant: "default" },
  render: ({ appearance, variant, ...root }) => (
    <Tabs {...root} style={{ maxWidth: 440 }}>
      <TabsList appearance={appearance} variant={variant}>
        <TabsTrigger value="profil">Profil</TabsTrigger>
        <TabsTrigger value="berkas">Berkas</TabsTrigger>
        <TabsTrigger value="akun">Akun</TabsTrigger>
      </TabsList>
      <TabsContent value="profil"><p className="pt-3 text-[13px] text-brand-muted">Nama, afiliasi, dan komsat.</p></TabsContent>
      <TabsContent value="berkas"><p className="pt-3 text-[13px] text-brand-muted">Dokumen verifikasi yang sudah diunggah.</p></TabsContent>
      <TabsContent value="akun"><p className="pt-3 text-[13px] text-brand-muted">Email masuk dan keamanan akun.</p></TabsContent>
    </Tabs>
  ),
};
