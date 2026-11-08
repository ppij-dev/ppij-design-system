import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { IconBuildingCommunity, IconMapPin, IconWorld } from "@tabler/icons-react";
import { WorkspaceSelector } from "./workspace-selector";

const meta: Meta<typeof WorkspaceSelector> = {
  title: "Admin/WorkspaceSelector",
  component: WorkspaceSelector,
  argTypes: {
    value: { control: "text" },
    options: { control: "object" },
    onChange: { action: "onChange" },
    label: { control: "text" },
    searchPlaceholder: { control: "text" },
    collapsed: { control: "boolean" },
    variant: { control: "select", options: ["sidebar", "phone"] },
    defaultOpen: { control: "boolean" },
    locale: { control: "select", options: ["id", "en"] },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof WorkspaceSelector>;

const OPTIONS = [
  { id: "national", label: "Nasional", short: "Nasional", kind: "Semua korda dan komsat", icon: <IconWorld className="size-[18px]" /> },
  { id: "kansai", label: "PPI Kansai", short: "Kansai", kind: "Korda" },
  { id: "okayama", label: "Okayama", short: "Okayama", kind: "Komsat" },
  { id: "tokyo", label: "Tokyo", short: "Tokyo", kind: "Komsat" },
  { id: "yokohama", label: "Yokohama", short: "Yokohama", kind: "Komsat" },
];

const MANY = [
  ...OPTIONS,
  { id: "kyoto", label: "Kyoto", short: "Kyoto", kind: "Komsat" },
  { id: "osaka", label: "Osaka", short: "Osaka", kind: "Komsat" },
  { id: "nagoya", label: "Nagoya", short: "Nagoya", kind: "Komsat" },
  { id: "fukuoka", label: "Fukuoka", short: "Fukuoka", kind: "Komsat" },
  { id: "sendai", label: "Sendai", short: "Sendai", kind: "Komsat" },
  { id: "hokkaido", label: "Hokkaido", short: "Hokkaido", kind: "Komsat" },
];

/** The picker is uncontrolled, so a story that shows the menu starts with it open. */
function Picker({ initial = "national", options = OPTIONS, variant = "sidebar", ...rest }: Partial<React.ComponentProps<typeof WorkspaceSelector>> & { initial?: string }) {
  const [value, setValue] = React.useState(initial);
  return <WorkspaceSelector {...rest} value={value} options={options} onChange={setValue} locale="id" variant={variant} label="RUANG KERJA" />;
}

export const SidebarExpanded: Story = {
  parameters: {
    docs: {
      description: {
        story: "The sidebar picker at national scope: a 48px block with the workspace mark, the 11px caption and the 13px value. The trigger reports `aria-expanded` and names the current workspace; the menu is a labelled group of `aria-pressed` buttons with the checkmark on the selected row, and the search field takes focus on open.",
      },
    },
  },
  render: () => (
    <div className="w-[254px] rounded-xl border border-brand-border bg-card p-3.5">
      <Picker />
    </div>
  ),
};

export const SidebarMenuOpen: Story = {
  parameters: {
    docs: {
      description: {
        story: "The menu open, with the search field focused. Escape closes the menu and returns focus to the trigger; a pointer outside closes it too.",
      },
    },
  },
  render: () => (
    <div className="w-[254px] rounded-xl border border-brand-border bg-card p-3.5 pb-72">
      <Picker defaultOpen />
    </div>
  ),
};

export const SidebarCollapsed: Story = {
  parameters: {
    docs: {
      description: {
        story: "The collapsed rail: a 48px square that still names the workspace, with the menu opening beside it at 220px. The selected row keeps its checkmark, so the current scope is readable without the label.",
      },
    },
  },
  render: () => (
    <div className="flex w-[86px] rounded-xl border border-brand-border bg-card p-3.5 pb-72">
      <Picker collapsed defaultOpen />
    </div>
  ),
};

export const SidebarFiltered: Story = {
  parameters: {
    docs: {
      description: {
        story: "Search filters on the label and the kind with `toLocaleLowerCase(\"id\")`, so \"okayama\" and \"komsat\" both match. The search field is the compact `Input`: 13px text from 600px up and 16px below, with the 44px phone floor.",
      },
    },
  },
  render: () => (
    <div className="w-[254px] rounded-xl border border-brand-border bg-card p-3.5 pb-72">
      <Picker options={MANY} defaultOpen />
    </div>
  ),
};

export const OneOption: Story = {
  parameters: { docs: { description: { story: "A scope with one option: the menu still opens, still names the group, and the single row is already pressed." } } },
  render: () => (
    <div className="w-[254px] rounded-xl border border-brand-border bg-card p-3.5 pb-40">
      <Picker initial="okayama" options={[OPTIONS[2]]} defaultOpen />
    </div>
  ),
};

export const LongLabel: Story = {
  parameters: { docs: { description: { story: "A long workspace name truncates in the trigger and stays readable in the menu; the phone trigger keeps its 9rem cap." } } },
  render: () => (
    <div className="grid w-[254px] gap-3 rounded-xl border border-brand-border bg-card p-3.5 pb-40">
      <Picker initial="panjang" options={[{ id: "panjang", label: "PPI Kansai — wilayah Kansai dengan nama korda yang sangat panjang", short: "Kansai", kind: "Korda", icon: <IconMapPin className="size-[18px]" /> }]} />
      <Picker variant="phone" initial="okayama" options={OPTIONS} />
    </div>
  ),
};

export const Phone: Story = {
  args: { variant: "phone" },
  parameters: {
    docs: {
      description: {
        story: "The phone trigger (`.mobile-scope`): 44px below 600px and 32px from 600px up, with the menu anchored under it. The options stay 44px tall on a phone.",
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: 320 }} className="grid justify-items-end gap-2 pb-72">
      <Picker {...args} defaultOpen />
    </div>
  ),
};

export const IconMark: Story = {
  parameters: { docs: { description: { story: "The mark follows the selected workspace icon and falls back to a community glyph." } } },
  render: () => (
    <div className="w-[254px] rounded-xl border border-brand-border bg-card p-3.5">
      <Picker initial="okayama" options={OPTIONS} />
      <p className="mt-3 text-xs text-brand-muted">
        <IconBuildingCommunity className="inline size-4" aria-hidden /> Tanpa ikon khusus, penanda memakai glyph komunitas.
      </p>
    </div>
  ),
};

/** Keeps the Playground interactive: a click selects the row, and the Controls panel still sets the value. */
function PlaygroundPicker(args: React.ComponentProps<typeof WorkspaceSelector>) {
  const [value, setValue] = React.useState(args.value);
  React.useEffect(() => setValue(args.value), [args.value]);
  return (
    <WorkspaceSelector
      {...args}
      value={value}
      onChange={(id) => {
        setValue(id);
        args.onChange(id);
      }}
    />
  );
}

export const Playground: Story = {
  args: { value: "national", options: OPTIONS, variant: "sidebar", locale: "id", collapsed: false, defaultOpen: false },
  render: (args) => (
    <div className="w-[254px] rounded-xl border border-brand-border bg-card p-3.5">
      <PlaygroundPicker {...args} />
    </div>
  ),
};
