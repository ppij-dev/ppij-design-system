import type { Meta, StoryObj } from "@storybook/react";
import {
  IconAlertTriangle, IconCircleCheck, IconClock, IconInfoCircle, IconPencil, IconShieldLock, IconUsers,
} from "@tabler/icons-react";
import { Button } from "./button";
import { Callout } from "./callout";

const meta: Meta<typeof Callout> = {
  title: "Portal/Callout",
  component: Callout,
  argTypes: {
    tone: { control: "select", options: ["info", "success", "warning", "danger", "neutral"] },
    density: { control: "select", options: ["default", "compact"] },
  },
};
export default meta;
type Story = StoryObj<typeof Callout>;

export const Tones: Story = {
  parameters: {
    docs: {
      description: {
        story: "Five tones, one per urgency step. Measured text contrast against each tone's own surface: info 5.7:1, success 6.5:1, warning 6.5:1, danger 8.2:1, neutral 5.9:1 — all above the 4.5:1 body floor. The drawer-stamp's #6b757e measured 4.42:1 on #f7f8f9, so the shared neutral tone uses #56636d instead.",
      },
    },
  },
  render: () => (
    <div className="grid max-w-2xl gap-3">
      <Callout tone="info" icon={<IconInfoCircle stroke={1.75} aria-hidden />}>Pratinjau memakai data sintetis. Angka dan tanggal di halaman ini bukan data produksi.</Callout>
      <Callout tone="success" icon={<IconCircleCheck stroke={1.75} aria-hidden />}>Pengajuan ini sudah selesai. Keputusan tidak tersedia.</Callout>
      <Callout tone="warning" icon={<IconAlertTriangle stroke={1.75} aria-hidden />}>Sedang diperiksa oleh verifikator lain. Keputusan bisa dibuat setelah mengambil alih pemeriksaan.</Callout>
      <Callout tone="danger" icon={<IconAlertTriangle stroke={1.75} aria-hidden />}>Alamat domisili perlu diperjelas sebelum pengajuan dikirim ulang.</Callout>
      <Callout tone="neutral" icon={<IconUsers stroke={1.75} aria-hidden />}>Data sintetis untuk meninjau tampilan direktori.</Callout>
    </div>
  ),
};

export const WithTitleAndBody: Story = {
  parameters: { docs: { description: { story: "A title at 13px bold with a 12px body underneath, matching `.drawer-note`." } } },
  render: () => (
    <div className="max-w-2xl">
      <Callout tone="warning" title="Berkas belum lengkap" icon={<IconAlertTriangle stroke={1.75} aria-hidden />}>
        Kartu pelajar terbaca sebagian. Unggah ulang berkas yang jelas sebelum keputusan dibuat.
      </Callout>
    </div>
  ),
};

export const WithAction: Story = {
  parameters: {
    docs: {
      description: {
        story: "The \"Lengkapi data studi\" prompt from `.member-detail-prompt`: the action sits under the body and lines up with the text when the callout has an icon. Below 600px the caller's Button grows to the 44px touch floor; the story passes `w-full` to match the phone drawer.",
      },
    },
  },
  render: () => (
    <div className="max-w-2xl">
      <Callout
        tone="warning"
        icon={<IconClock stroke={1.75} aria-hidden />}
        title="Tanggal studi belum ditentukan"
        action={<Button size="sm" variant="outline" className="max-[600px]:w-full"><IconPencil className="size-4" aria-hidden />Lengkapi data studi</Button>}
      >
        Kategori anggota menunggu tanggal mulai dan selesai studi.
      </Callout>
    </div>
  ),
};

export const LongBody: Story = {
  parameters: { docs: { description: { story: "A long body wraps without pushing the icon or the action out of line." } } },
  render: () => (
    <div className="max-w-2xl">
      <Callout tone="info" icon={<IconShieldLock stroke={1.75} aria-hidden />} title="Kewenangan pemeriksaan">
        Halaman ini hanya menampilkan pratinjau. Keputusan akhir, pencabutan, dan penangguhan dijalankan oleh layanan keanggotaan lewat alur produksi; pratinjau tidak menyimpan perubahan, tidak mengirim email, dan tidak mencatat siapa pun ke dalam log audit.
      </Callout>
    </div>
  ),
};

export const Compact: Story = {
  args: { density: "compact" },
  parameters: { docs: { description: { story: "The admin drawer stamp and note: a 12px body with 10px padding, used inside an `AdminDrawer density=\"compact\"`." } } },
  render: () => (
    <div className="grid max-w-2xl gap-2.5">
      <Callout density="compact" tone="neutral" icon={<IconUsers stroke={1.75} aria-hidden />}>Data sintetis untuk meninjau tampilan direktori.</Callout>
      <Callout density="compact" tone="warning" title="Catatan verifikator" icon={<IconAlertTriangle stroke={1.75} aria-hidden />}>
        Perjelas alamat domisili dan unggah ulang kartu pelajar yang terbaca.
      </Callout>
    </div>
  ),
};

export const DangerValidation: Story = {
  parameters: {
    docs: {
      description: {
        story: "The only tone that claims `role=\"alert\"`, so a screen reader interrupts for a real problem. Taken from `.member-edit-error-form`.",
      },
    },
  },
  render: () => (
    <div className="max-w-2xl">
      <Callout tone="danger" icon={<IconAlertTriangle stroke={1.75} aria-hidden />}>
        Alasan penangguhan wajib diisi minimal 4 karakter.
      </Callout>
    </div>
  ),
};

export const MigratedNotes: Story = {
  name: "Visual diff: the nine migrated notes",
  parameters: {
    docs: {
      description: {
        story: "The nine local rules this component replaces, side by side as the visual diff: the review flag, claim, read-only and sample note, the section note, the drawer stamp and drawer note, and the member audit and study-prompt notes. Batch F deletes each of these rules; this story is the before-and-after record.",
      },
    },
  },
  render: () => (
    <div className="grid max-w-2xl gap-3">
      <Callout tone="warning" density="compact" icon={<IconAlertTriangle stroke={1.75} aria-hidden />}>`.verification-flag` — 6 berkas perlu diperiksa sebelum keputusan.</Callout>
      <Callout tone="warning" title="Sedang diperiksa verifikator lain" action={<Button size="sm" variant="outline">Ambil alih pemeriksaan</Button>}>`.verification-claim` — keputusan hanya bisa dibuat setelah mengambil alih.</Callout>
      <Callout tone="success" icon={<IconCircleCheck stroke={1.75} aria-hidden />}>`.verification-readonly` — Menunggu perbaikan dari anggota.</Callout>
      <Callout tone="neutral" icon={<IconUsers stroke={1.75} aria-hidden />}>`.verification-sample-note` — Dokumen contoh, tanpa data pribadi.</Callout>
      <Callout tone="info" icon={<IconInfoCircle stroke={1.75} aria-hidden />}>`.section-note` — Angka pada tabel ini mencakup 6 bulan terakhir.</Callout>
      <Callout tone="neutral" density="compact" icon={<IconUsers stroke={1.75} aria-hidden />}>`.drawer-stamp` — Data sintetis untuk meninjau tampilan.</Callout>
      <Callout tone="warning" density="compact" title="Perlu tindakan">`.drawer-note` — Lengkapi tanggal studi sebelum mengubah kategori.</Callout>
      <Callout tone="neutral" icon={<IconShieldLock stroke={1.75} aria-hidden />}>`.member-detail-audit` — <strong className="text-[#29343b]">Reveal tercatat di log audit.</strong></Callout>
      <Callout tone="warning" icon={<IconClock stroke={1.75} aria-hidden />} title="Tanggal studi belum ditentukan" action={<Button size="sm" variant="outline">Lengkapi data studi</Button>}>`.member-detail-prompt` — Kategori menunggu tanggal mulai dan selesai studi.</Callout>
    </div>
  ),
};
