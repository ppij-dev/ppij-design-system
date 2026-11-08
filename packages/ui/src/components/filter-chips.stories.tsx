import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { FilterChips } from "./filter-chips";

const meta: Meta<typeof FilterChips> = {
  title: "Admin/FilterChips",
  component: FilterChips,
  argTypes: {
    chips: { control: "object" },
    onClearAll: { action: "clearAll" },
    clearAllLabel: { control: "text" },
    label: { control: "text" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof FilterChips>;

const VALUES = ["Okayama", "Tokyo", "Yokohama", "Kyoto", "Osaka"];

/** The row is controlled by its caller, so a story can remove chips. */
function Chips({ initial = VALUES, counts, clearable = true, ...rest }: { initial?: string[]; counts?: boolean; clearable?: boolean } & Omit<React.ComponentProps<typeof FilterChips>, "chips" | "onClearAll">) {
  const [values, setValues] = React.useState(initial);
  return (
    <FilterChips
      {...rest}
      chips={values.map((value, index) => ({
        label: value,
        value,
        count: counts ? [1032, 58, 12, 3, 2][index] : undefined,
        onRemove: () => setValues((current) => current.filter((item) => item !== value)),
      }))}
      onClearAll={clearable ? () => setValues([]) : undefined}
    />
  );
}

export const OneChip: Story = {
  parameters: {
    docs: {
      description: {
        story: "One chip: the whole chip is the remove control, and its accessible name is `\"Filter aktif: Okayama\"`, so a screen reader hears the group and the value without a separate X button to hunt for. The X is `aria-hidden`.",
      },
    },
  },
  render: () => (
    <div className="max-w-2xl">
      <Chips initial={["Okayama"]} />
    </div>
  ),
};

export const FiveChipsWithCounts: Story = {
  parameters: { docs: { description: { story: "The Statistik warehouse row: five values with their per-value counts in brand red. Colour is not the only difference, because the count is a number beside the label." } } },
  render: () => (
    <div className="max-w-2xl">
      <Chips counts />
    </div>
  ),
};

export const WithoutCounts: Story = {
  parameters: { docs: { description: { story: "The member directory row: the same component with no counts, because that page's filter values are not countable on their own." } } },
  render: () => (
    <div className="max-w-2xl">
      <Chips initial={["Tokyo", "Kyoto"]} />
    </div>
  ),
};

export const ClearAll: Story = {
  parameters: { docs: { description: { story: "Clear-all is a separate control with its own `aria-label`, so a single mis-tap on a chip cannot wipe the row." } } },
  render: () => <div className="max-w-2xl"><Chips counts /></div>,
};

export const NoClearAll: Story = {
  parameters: { docs: { description: { story: "Without `onClearAll` the row ends after the chips; nothing reserves the button's space." } } },
  render: () => (
    <div className="max-w-2xl">
      <Chips counts clearable={false} />
    </div>
  ),
};

export const PhoneWrap: Story = {
  parameters: { docs: { description: { story: "Reviewed at 390 and 320px: the chips wrap onto as many rows as they need and every target is 44px tall." } } },
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Chips counts />
    </div>
  ),
};

export const PhoneHorizontalScroll: Story = {
  parameters: {
    docs: {
      description: {
        story: "The single-row variant the toolbar uses: `flex-nowrap overflow-x-auto` keeps the row on one line on a phone and the focus ring stays visible while scrolling.",
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Chips counts className="flex-nowrap overflow-x-auto pb-1" />
    </div>
  ),
};

export const Empty: Story = {
  parameters: { docs: { description: { story: "No chips and no clear-all: the row renders nothing, so a page can mount it unconditionally." } } },
  render: () => (
    <div className="max-w-2xl">
      <FilterChips chips={[]} />
    </div>
  ),
};

const PLAYGROUND_CHIPS: React.ComponentProps<typeof FilterChips>["chips"] = [
  { label: "Okayama", value: "Okayama", count: 1032, onRemove: () => undefined },
  { label: "Tokyo", value: "Tokyo", count: 58, onRemove: () => undefined },
  { label: "Yokohama", value: "Yokohama", count: 12, onRemove: () => undefined },
];

/** Keeps the chip list in state so a chip can be removed, and re-seeds it when the Controls panel edits `chips`. */
function PlaygroundChips({ chips, onClearAll, ...rest }: React.ComponentProps<typeof FilterChips>) {
  const [list, setList] = React.useState(chips);
  React.useEffect(() => setList(chips), [chips]);
  return (
    <FilterChips
      {...rest}
      chips={list.map((chip) => ({ ...chip, onRemove: () => setList((current) => current.filter((item) => item.value !== chip.value)) }))}
      onClearAll={onClearAll ? () => { setList([]); onClearAll(); } : undefined}
    />
  );
}

export const Playground: Story = {
  args: { chips: PLAYGROUND_CHIPS, label: "Filter aktif", clearAllLabel: "Hapus semua filter" },
  render: (args) => (
    <div className="max-w-2xl">
      <PlaygroundChips {...args} />
    </div>
  ),
};
