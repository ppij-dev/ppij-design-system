import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "./page-header";
import { Button } from "./button";
import { IconPlus, IconDownload } from "@tabler/icons-react";

const meta: Meta<typeof PageHeader> = {
  title: "Admin/PageHeader",
  component: PageHeader,
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    eyebrow: { control: "text" },
    actions: { control: false },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof PageHeader>;

export const WithActions: Story = {
  render: () => (
    <PageHeader
      eyebrow="Admin wilayah"
      title="Anggota Okayama"
      description="Daftar anggota terdaftar di komsat Okayama beserta status verifikasinya."
      actions={<><Button variant="outline"><IconDownload size={16} /> Ekspor</Button><Button><IconPlus size={16} /> Tambah anggota</Button></>}
    />
  ),
};
export const TitleOnly: Story = { render: () => <PageHeader title="Pengaturan" /> };
export const LongTitle: Story = {
  render: () => (
    <PageHeader
      title="Verifikasi berkas pendaftaran anggota baru wilayah Kanto dan sekitarnya"
      description="Judul panjang membungkus tanpa mematahkan tata letak, dan tombol tetap dapat dijangkau."
      actions={<Button>Tinjau</Button>}
    />
  ),
};

export const Playground: Story = {
  args: {
    eyebrow: "Admin wilayah",
    title: "Anggota Okayama",
    description: "Daftar anggota terdaftar di komsat Okayama beserta status verifikasinya.",
  },
  render: (args) => (
    <PageHeader
      {...args}
      actions={<><Button variant="outline"><IconDownload size={16} /> Ekspor</Button><Button><IconPlus size={16} /> Tambah anggota</Button></>}
    />
  ),
};
