import type { Meta, StoryObj } from "@storybook/react";
import { toast } from "sonner";
import { Toaster } from "./sonner";
import { Button } from "./button";

const meta: Meta<typeof Toaster> = {
  title: "Portal/Toast",
  component: Toaster,
  argTypes: {
    position: { control: "select", options: ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"] },
    richColors: { control: "boolean" },
    expand: { control: "boolean" },
    closeButton: { control: "boolean" },
    duration: { control: "number" },
    visibleToasts: { control: "number" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Toaster>;

export const Triggers: Story = {
  render: () => (
    <div>
      <Toaster position="top-center" richColors={false} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button onClick={() => toast.success("Perubahan tersimpan.")}>Berhasil</Button>
        <Button variant="outline" onClick={() => toast.error("Gagal menyimpan. Periksa koneksi lalu coba lagi.")}>Galat</Button>
        <Button variant="outline" onClick={() => toast("Anggota diarsipkan.", { action: { label: "Urungkan", onClick: () => toast.success("Arsip dibatalkan.") } })}>Dengan urungkan</Button>
        <Button variant="outline" onClick={() => toast.info("Sinkronisasi selesai: 128 anggota diperbarui.")}>Info</Button>
      </div>
      <p style={{ marginTop: 16, maxWidth: "65ch", color: "var(--color-muted-foreground)", fontSize: 14, lineHeight: 1.6 }}>
        Satu kalimat pendek, satu toast dalam satu waktu. Toast melaporkan
        tindakan yang sudah selesai; galat yang butuh tindakan dan kesalahan
        validasi formulir tidak memakai toast (lihat Guidelines).
      </p>
    </div>
  ),
};

export const Playground: Story = {
  args: { position: "top-center", richColors: false, closeButton: false, duration: 4000 },
  render: (args) => (
    <div>
      <Toaster {...args} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button onClick={() => toast.success("Perubahan tersimpan.")}>Berhasil</Button>
        <Button variant="outline" onClick={() => toast.error("Gagal menyimpan. Periksa koneksi lalu coba lagi.")}>Galat</Button>
        <Button variant="outline" onClick={() => toast.info("Sinkronisasi selesai: 128 anggota diperbarui.")}>Info</Button>
      </div>
    </div>
  ),
};
