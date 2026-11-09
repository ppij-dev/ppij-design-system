import type { Meta, StoryObj } from "@storybook/react";
import { IdentityChip } from "./identity-chip";
import { PanelCard } from "./panel-card";

const meta: Meta<typeof IdentityChip> = {
  title: "Admin/IdentityChip",
  component: IdentityChip,
  argTypes: {
    name: { control: "text" },
    detail: { control: "text" },
    initials: { control: "text" },
    onClick: { action: "click" },
    collapsed: { control: "boolean" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof IdentityChip>;

export const Expanded: Story = {
  args: { name: "Contoh Pengurus A", detail: "Admin Nasional", initials: "PA", onClick: () => undefined },
  parameters: {
    docs: {
      description: {
        story: "The sidebar footer chip: one button with `aria-haspopup=\"dialog\"` that opens the account sheet. 44px below 600px and 32px from 600px up.",
      },
    },
  },
  render: (args) => (
    <div className="w-[254px] rounded-xl border border-brand-border bg-card p-3.5">
      <IdentityChip {...args} />
    </div>
  ),
};

export const Collapsed: Story = {
  args: { name: "Contoh Pengurus A", detail: "Admin Nasional", initials: "PA", onClick: () => undefined, collapsed: true },
  parameters: {
    docs: {
      description: {
        story: "The collapsed rail: a 44x44 square with the initials, and the accessible name stays the person's name — never \"PA\". The initials are `aria-hidden` for exactly that reason.",
      },
    },
  },
  render: (args) => (
    <div className="w-[86px] rounded-xl border border-brand-border bg-card p-3.5">
      <IdentityChip {...args} />
    </div>
  ),
};

export const LongNameAndRole: Story = {
  args: {
    name: "I Nyoman Darma Kotama Wijaya Kusuma",
    detail: "Admin komsat PPI Okayama dengan kewenangan verifikasi",
    initials: "ID",
    onClick: () => undefined,
  },
  parameters: { docs: { description: { story: "Both lines truncate inside the chip; the accessible name is the full name, so nothing is lost to assistive technology." } } },
  render: (args) => (
    <div className="w-[254px] rounded-xl border border-brand-border bg-card p-3.5">
      <IdentityChip {...args} />
    </div>
  ),
};

export const ForcedNarrow: Story = {
  args: { name: "Contoh Pengurus A", detail: "Admin Nasional", initials: "PA", onClick: () => undefined },
  parameters: { docs: { description: { story: "Reviewed at 320px: the chip keeps one line and the chevron stays inside the rail." } } },
  render: (args) => (
    <div style={{ maxWidth: 200 }} className="rounded-xl border border-brand-border bg-card p-3.5">
      <IdentityChip {...args} />
    </div>
  ),
};

export const InSidebarFooter: Story = {
  parameters: {
    docs: {
      description: {
        story: "The real position: the chip as the sidebar footer inside a `PanelCard padding=\"none\"`, which is how the shell composes it.",
      },
    },
  },
  render: () => (
    <div className="w-[254px]">
      <PanelCard padding="none" className="flex min-h-72 flex-col justify-end py-2.5">
        <IdentityChip name="Contoh Pengurus A" detail="Admin Nasional" initials="PA" onClick={() => undefined} />
      </PanelCard>
    </div>
  ),
};

export const Playground: Story = {
  args: { name: "Contoh Pengurus A", detail: "Admin Nasional", initials: "PA", collapsed: false },
  render: (args) => (
    <div className="w-[254px] rounded-xl border border-brand-border bg-card p-3.5">
      <IdentityChip {...args} />
    </div>
  ),
};
