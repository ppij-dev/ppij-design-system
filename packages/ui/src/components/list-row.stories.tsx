import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { IconChevronRight, IconIdBadge2, IconUsers } from "@tabler/icons-react";
import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import { ListRow } from "./list-row";

const meta: Meta<typeof ListRow> = {
  title: "Admin/ListRow",
  component: ListRow,
  argTypes: { tone: { control: "select", options: ["default", "danger", "muted"] } },
};
export default meta;
type Story = StoryObj<typeof ListRow>;

const IconChip = ({ children }: { children: React.ReactNode }) => (
  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-brand-red/8 text-brand-red [&_svg]:size-[18px]">{children}</span>
);

export const Default: Story = {
  args: { title: "Tinjau 12 pendaftaran baru", subtitle: "Komsat Okayama", meta: "2 Nov 2026" },
  render: (args) => (
    <div className="max-w-3xl">
      <ListRow {...args} leading={<IconChip><IconUsers stroke={1.75} aria-hidden /></IconChip>} trailing={<IconChevronRight className="size-4 text-brand-muted" aria-hidden />} onSelect={() => undefined} />
    </div>
  ),
};

export const WithBadge: Story = {
  args: { title: "Budi Santoso", subtitle: "Pendaftaran terkirim", meta: "2 Nov 2026" },
  render: (args) => (
    <div className="max-w-3xl">
      <ListRow {...args} badge={<Badge variant="secondary">Baru</Badge>} trailing={<IconChevronRight className="size-4 text-brand-muted" aria-hidden />} onSelect={() => undefined} />
    </div>
  ),
};

export const WithLeadingAvatars: Story = {
  render: () => (
    <div className="max-w-3xl">
      {[
        { name: "Budi Santoso", unit: "Okayama", date: "2 Nov 2026" },
        { name: "Sari Dewi", unit: "Tokyo", date: "1 Nov 2026" },
        { name: "Kenji Tanaka", unit: "Yokohama", date: "28 Okt 2026" },
      ].map((person) => (
        <ListRow
          key={person.name}
          leading={<Avatar className="size-9"><AvatarFallback className="bg-secondary text-xs font-bold text-brand-ink">{person.name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>}
          title={person.name}
          subtitle={person.unit}
          meta={person.date}
          trailing={<IconChevronRight className="size-4 text-brand-muted" aria-hidden />}
          onSelect={() => undefined}
        />
      ))}
    </div>
  ),
};

export const DangerTone: Story = {
  args: { title: "Pencabutan keanggotaan menunggu keputusan", subtitle: "Hanya Admin Nasional", meta: "3 Nov 2026", tone: "danger" },
  render: (args) => (
    <div className="max-w-3xl">
      <ListRow {...args} leading={<IconChip><IconIdBadge2 stroke={1.75} aria-hidden /></IconChip>} onSelect={() => undefined} />
    </div>
  ),
};

export const Selected: Story = {
  args: { title: "Sari Dewi", subtitle: "Tokyo", selected: true },
  parameters: {
    docs: { description: { story: "The selected row highlights its surface and reports `aria-pressed` as a button, `aria-current` as a link. Both rows below stay one tab stop each." } },
  },
  render: (args) => (
    <div className="max-w-3xl">
      <ListRow {...args} onSelect={() => undefined} />
      <ListRow title="Kenji Tanaka" subtitle="Yokohama" />
    </div>
  ),
};

export const AsLink: Story = {
  args: { title: "Organisasi", subtitle: "12 korda, 184 komsat", meta: "Diperbarui 28 Okt 2026", href: "#organisasi", selected: true },
  parameters: { docs: { description: { story: "With `href` the row is an `<a>` and the selected state reports `aria-current`." } } },
  render: (args) => (
    <div className="max-w-3xl">
      <ListRow {...args} trailing={<IconChevronRight className="size-4 text-brand-muted" aria-hidden />} />
    </div>
  ),
};

export const LongText: Story = {
  args: {
    title: "I Nyoman Darma Kotama Wijaya Kusuma dari Politeknik Negeri Bali dengan nama institusi yang sangat panjang",
    subtitle: "Korespondensi terakhir lewat alamat email kampus yang sudah tidak aktif sejak Oktober 2026",
    meta: "2 Nov 2026",
  },
  parameters: { docs: { description: { story: "Long values wrap inside the row instead of pushing the trailing control out of the card." } } },
  render: (args) => (
    <div className="max-w-3xl">
      <ListRow {...args} trailing={<Button size="sm" variant="outline">Periksa</Button>} onSelect={() => undefined} />
    </div>
  ),
};

export const PhoneCard: Story = {
  parameters: {
    docs: {
      description: {
        story: "The phone member-directory variant: the row keeps the shared anatomy and the page adds the card surface with `className`. Rows keep their hairline by default, so a list card reads as one table on desktop.",
      },
    },
  },
  render: () => (
    <div className="grid max-w-2xl gap-2.5">
      <ListRow
        className="rounded-xl border border-brand-border bg-card px-3.5 py-3.5 max-[600px]:border"
        title="Budi Santoso"
        subtitle="Okayama · Pendaftaran terkirim"
        meta="2 Nov 2026"
        badge={<Badge variant="secondary">Baru</Badge>}
        trailing={<IconChevronRight className="size-4 text-brand-muted" aria-hidden />}
        onSelect={() => undefined}
      />
      <ListRow
        className="rounded-xl border border-brand-border bg-card px-3.5 py-3.5"
        title="Sari Dewi"
        subtitle="Tokyo · Berkas perlu diperbaiki"
        meta="1 Nov 2026"
        badge={<Badge variant="warning">Perlu tindakan</Badge>}
        trailing={<IconChevronRight className="size-4 text-brand-muted" aria-hidden />}
        onSelect={() => undefined}
      />
    </div>
  ),
};
