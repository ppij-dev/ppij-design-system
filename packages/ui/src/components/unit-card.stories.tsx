import type { Meta, StoryObj } from "@storybook/react";
import { UnitCard } from "./unit-card";
import { Button } from "./button";

const meta: Meta<typeof UnitCard> = {
  title: "Admin/UnitCard",
  component: UnitCard,
  argTypes: {
    name: { control: "text" },
    kind: { control: "text" },
    memberCount: { control: "number" },
    leadName: { control: "text" },
    statusLabel: { control: "text" },
    statusVariant: { control: "select", options: ["default", "success", "warning", "secondary"] },
    href: { control: "text" },
    actions: { control: false },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof UnitCard>;

export const UnitsGrid: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", maxWidth: 920 }}>
      <UnitCard name="Okayama" kind="Komsat" memberCount={128} leadName="I Nyoman Darma Kotama" statusLabel="Aktif" href="#" />
      <UnitCard name="Tokyo" kind="Komsat" memberCount={342} leadName="Marcus Aurelius Antoninus" statusLabel="Aktif" href="#" />
      <UnitCard name="Osaka" kind="Komsat" memberCount={87} leadName="Lucius Annaeus Seneca" statusLabel="Aktif" href="#" />
      <UnitCard name="Kansai" kind="Wilayah" memberCount={429} leadName="Zeno of Citium" statusLabel="Aktif" href="#" />
      <UnitCard name="Nagoya" kind="Komsat" memberCount={12} statusLabel="Perlu perhatian" statusVariant="warning" href="#" />
    </div>
  ),
};

export const WithActions: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <UnitCard
        name="Okayama"
        kind="Komsat"
        memberCount={128}
        leadName="I Nyoman Darma Kotama"
        statusLabel="Aktif"
        actions={<Button size="sm" variant="outline">Kelola</Button>}
      />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    name: "Okayama",
    kind: "Komsat",
    memberCount: 128,
    leadName: "I Nyoman Darma Kotama",
    statusLabel: "Aktif",
    statusVariant: "success",
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <UnitCard {...args} />
    </div>
  ),
};
