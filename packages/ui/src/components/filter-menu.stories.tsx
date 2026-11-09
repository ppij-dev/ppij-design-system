import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { FilterMenu } from "./filter-menu";

const meta: Meta<typeof FilterMenu> = {
  title: "Admin/FilterMenu",
  component: FilterMenu,
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    options: { control: "object" },
    allLabel: { control: "text" },
    onChange: { action: "change" },
    hideLabel: { control: "boolean" },
    disabled: { control: "boolean" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof FilterMenu>;

const KINDS = [
  { value: "baru", label: "Pendaftaran baru" },
  { value: "perbaikan", label: "Perlu perbaikan" },
  { value: "ulang", label: "Pengiriman ulang" },
];

const REASONS = Array.from({ length: 14 }, (_, index) => ({
  value: `alasan-${index + 1}`,
  label: `Alasan penolakan ${index + 1} menurut AD/ART`,
}));

/**
 * Opens the Radix menu so the states below are visible without a click.
 * Radix opens on `pointerdown`, so a plain `click()` would not do it.
 */
function Opened({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const trigger = ref.current?.querySelector("button");
    if (!trigger) return;
    const options = { bubbles: true, cancelable: true, button: 0, buttons: 1, pointerType: "mouse", isPrimary: true } as const;
    trigger.dispatchEvent(new PointerEvent("pointerdown", options));
    trigger.dispatchEvent(new PointerEvent("pointerup", options));
  }, []);
  return <div ref={ref}>{children}</div>;
}

function Filter({ initial = "", ...rest }: { initial?: string } & Omit<React.ComponentProps<typeof FilterMenu>, "value" | "onChange">) {
  const [value, setValue] = React.useState(initial);
  return <FilterMenu {...rest} value={value} onChange={setValue} />;
}

export const NothingSelected: Story = {
  parameters: {
    docs: {
      description: {
        story: "Nothing selected: the trigger shows `allLabel` and its accessible name is `\"Jenis: Semua jenis\"`. The menu is a radio group, so the selected row reports `aria-checked` and the checkmark is decoration on top of it. Captured with the menu open.",
      },
    },
  },
  render: () => (
    <div className="max-w-xs">
      <Opened><Filter label="Jenis" allLabel="Semua jenis" options={KINDS} /></Opened>
    </div>
  ),
};

export const OneValueSelected: Story = {
  parameters: { docs: { description: { story: "One value selected: the checkmark moves and the trigger names the value, while `allLabel` stays available to clear it." } } },
  render: () => (
    <div className="max-w-xs">
      <Opened><Filter label="Jenis" allLabel="Semua jenis" options={KINDS} initial="perbaikan" /></Opened>
    </div>
  ),
};

export const LongOptionList: Story = {
  parameters: { docs: { description: { story: "A long option list scrolls inside Radix's own viewport and keeps its 44/32px row band." } } },
  render: () => (
    <div className="max-w-xs">
      <Opened><Filter label="Alasan" allLabel="Semua alasan" options={REASONS} /></Opened>
    </div>
  ),
};

export const HiddenLabel: Story = {
  parameters: {
    docs: {
      description: {
        story: "The toolbar variant: `hideLabel` keeps the caption for assistive technology but drops it from the layout, so the trigger sits in a filter row without losing its name.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-end gap-2">
      <Filter label="Jenis" allLabel="Semua jenis" options={KINDS} hideLabel initial="baru" />
      <Filter label="Kepemilikan" allLabel="Semua pemilik" options={[{ value: "saya", label: "Saya" }, { value: "lain", label: "Verifikator lain" }]} hideLabel />
    </div>
  ),
};

export const Disabled: Story = {
  parameters: { docs: { description: { story: "Disabled: the trigger keeps its name and value but cannot change them." } } },
  render: () => (
    <div className="max-w-xs">
      <Filter label="Jenis" allLabel="Semua jenis" options={KINDS} initial="baru" disabled />
    </div>
  ),
};

export const Phone: Story = {
  parameters: { docs: { description: { story: "Reviewed at 390 and 320px: the trigger is 44px tall and the option rows are 44px, both wide enough for a thumb." } } },
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Opened><Filter label="Jenis" allLabel="Semua jenis" options={KINDS} /></Opened>
    </div>
  ),
};

/** Holds the value in state so the menu can change it, and re-seeds it when the Controls panel edits `value`. */
function PlaygroundMenu({ value: initial, onChange, ...rest }: React.ComponentProps<typeof FilterMenu>) {
  const [value, setValue] = React.useState(initial);
  React.useEffect(() => setValue(initial), [initial]);
  return <FilterMenu {...rest} value={value} onChange={(next) => { setValue(next); onChange(next); }} />;
}

export const Playground: Story = {
  args: { label: "Jenis", value: "", allLabel: "Semua jenis", options: KINDS, hideLabel: false, disabled: false },
  render: (args) => (
    <div className="max-w-xs">
      <PlaygroundMenu {...args} />
    </div>
  ),
};
