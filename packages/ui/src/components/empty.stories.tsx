import type { Meta, StoryObj } from "@storybook/react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "./empty";
import { Button } from "./button";
import { IconUsers, IconSearch, IconPlus } from "@tabler/icons-react";

type PlaygroundArgs = { title?: string; description?: string; mediaVariant?: "default" | "icon" };

const meta: Meta<PlaygroundArgs> = {
  title: "Portal/Empty",
  component: Empty,
  argTypes: {
    mediaVariant: { control: "select", options: ["default", "icon"] },
    title: { control: "text" },
    description: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
  args: {
    mediaVariant: "icon",
    title: "Belum ada anggota",
    description: "Komsat ini belum memiliki anggota terdaftar.",
  },
  render: ({ mediaVariant, title, description, ...args }) => (
    <Empty {...args} style={{ maxWidth: 480 }}>
      <EmptyHeader>
        <EmptyMedia variant={mediaVariant}><IconUsers /></EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};
export const NoResults: Story = {
  render: () => (
    <Empty style={{ maxWidth: 480 }}>
      <EmptyHeader>
        <EmptyMedia variant="icon"><IconSearch /></EmptyMedia>
        <EmptyTitle>Tidak ada hasil</EmptyTitle>
        <EmptyDescription>Tidak ada anggota yang cocok dengan filter ini. Coba kata kunci lain.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};
export const WithAction: Story = {
  render: () => (
    <Empty style={{ maxWidth: 480 }}>
      <EmptyHeader>
        <EmptyMedia variant="icon"><IconUsers /></EmptyMedia>
        <EmptyTitle>Belum ada anggota</EmptyTitle>
        <EmptyDescription>Komsat ini belum memiliki anggota terdaftar.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button><IconPlus size={16} /> Tambah anggota</Button>
      </EmptyContent>
    </Empty>
  ),
};
