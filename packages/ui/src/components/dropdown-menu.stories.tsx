import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "./dropdown-menu";
import { Button } from "./button";
import { IconEdit, IconDownload, IconTrash, IconChevronDown } from "@tabler/icons-react";

const meta: Meta<typeof DropdownMenu> = {
  title: "Portal/DropdownMenu",
  component: DropdownMenu,
  argTypes: {
    open: { control: "boolean" },
    onOpenChange: { action: "openChange" },
    modal: { control: "boolean" },
    dir: { control: "select", options: ["ltr", "rtl"] },
  },
};
export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Playground: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Tindakan <IconChevronDown size={16} /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Anggota</DropdownMenuLabel>
        <DropdownMenuItem><IconEdit size={16} /> Edit</DropdownMenuItem>
        <DropdownMenuItem><IconDownload size={16} /> Unduh kartu</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive"><IconTrash size={16} /> Hapus</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
export const Actions: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Tindakan <IconChevronDown size={16} /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Anggota</DropdownMenuLabel>
        <DropdownMenuItem><IconEdit size={16} /> Edit</DropdownMenuItem>
        <DropdownMenuItem><IconDownload size={16} /> Unduh kartu</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive"><IconTrash size={16} /> Hapus</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
