import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { SearchableMultiSelect } from "./searchable-multi-select";

const meta: Meta<typeof SearchableMultiSelect> = {
  title: "Admin/SearchableMultiSelect",
  component: SearchableMultiSelect,
  argTypes: {
    label: { control: "text" },
    values: { control: "object" },
    options: { control: "object" },
    onChange: { action: "onChange" },
    allLabel: { control: "text" },
    compact: { control: "boolean" },
    single: { control: "boolean" },
    showAllOption: { control: "boolean" },
    searchPlaceholder: { control: "text" },
    emptyLabel: { control: "text" },
    visibleLabel: { control: "boolean" },
    disabled: { control: "boolean" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof SearchableMultiSelect>;

const KOMSAT = ["Okayama", "Tokyo", "Yokohama", "Kyoto", "Osaka", "Nagoya", "Fukuoka", "Sendai", "Hokkaido", "Niigata", "Kumamoto", "Sapporo"];

/** The picker is controlled by its caller, so every story owns the selection. */
function Pick({ initial = [], options = KOMSAT, ...rest }: { initial?: string[]; options?: string[] } & Omit<React.ComponentProps<typeof SearchableMultiSelect>, "values" | "options" | "onChange">) {
  const [values, setValues] = React.useState(initial);
  return <SearchableMultiSelect {...rest} values={values} options={options} onChange={setValues} />;
}

export const MultiNothingSelected: Story = {
  parameters: {
    docs: {
      description: {
        story: "Multiple mode with nothing selected: the trigger reads `allLabel`. The trigger carries `aria-label` = `\"Komsat: Semua komsat\"`, the menu is a searchable list of Radix checkbox items (so `aria-checked` is Radix-owned and the menu stays open while choosing), and below 600px the trigger is 44px with a 16px search field.",
      },
    },
  },
  render: () => (
    <div className="max-w-sm">
      <Pick label="Komsat" allLabel="Semua komsat" />
    </div>
  ),
};

export const MultiTwoSelected: Story = {
  parameters: { docs: { description: { story: "Two selected: the trigger reads \"2 dipilih\" instead of naming either value, which is the reviewed behaviour the three local copies disagreed on." } } },
  render: () => (
    <div className="max-w-sm">
      <Pick label="Komsat" allLabel="Semua komsat" initial={["Okayama", "Tokyo"]} />
    </div>
  ),
};

export const Single: Story = {
  parameters: {
    docs: {
      description: {
        story: "Single mode: choosing a value replaces the selection, there is no \"all\" row, and the trigger names the value itself. This is the `SearchableUnitMenu` behaviour from the review filters.",
      },
    },
  },
  render: () => (
    <div className="max-w-sm">
      <Pick label="Komsat" allLabel="Pilih komsat" single initial={["Okayama"]} />
    </div>
  ),
};

export const CompactToolbar: Story = {
  parameters: {
    docs: {
      description: {
        story: "The toolbar variant: `compact` hides the caption and drops the trigger to the 32px band, sitting beside a `Button size=\"sm\"` on the directory toolbar. The caption stays in the accessibility tree because the trigger's own name already carries the label.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Pick label="Komsat" allLabel="Semua komsat" compact initial={["Tokyo"]} />
    </div>
  ),
};

export const SearchFiltered: Story = {
  parameters: {
    docs: {
      description: {
        story: "Captured with the menu open and \"ok\" typed: search matches on `toLocaleLowerCase(\"id\")`, takes focus when the menu opens and resets when it closes. `Escape`, `Tab` and `ArrowDown` pass through to Radix; every other key is stopped so the highlight does not move.",
      },
    },
  },
  render: () => (
    <div className="max-w-sm">
      <Pick label="Komsat" allLabel="Semua komsat" />
    </div>
  ),
};

export const NoMatch: Story = {
  parameters: { docs: { description: { story: "No match: the empty line replaces the list without collapsing the menu height, so the state does not jump." } } },
  render: () => (
    <div className="max-w-sm">
      <Pick label="Komsat" allLabel="Semua komsat" />
    </div>
  ),
};

export const LongListScroll: Story = {
  parameters: { docs: { description: { story: "Twelve options scroll inside `min(280px, 42vh)`; the list never pushes the menu past the viewport, and Radix keeps the arrow keys inside the visible list." } } },
  render: () => (
    <div className="max-w-sm">
      <Pick label="Komsat" allLabel="Semua komsat" initial={["Okayama"]} />
    </div>
  ),
};

export const Preselected: Story = {
  parameters: { docs: { description: { story: "A preselected value on first render: the checkbox is checked and the trigger names it, which is the member edit drawer's starting state." } } },
  render: () => (
    <div className="max-w-sm">
      <Pick label="Komsat" allLabel="Pilih komsat" single initial={["Yokohama"]} />
    </div>
  ),
};

export const Disabled: Story = {
  parameters: { docs: { description: { story: "Disabled: the trigger is inert and keeps its accessible name, so the value stays readable without being changeable." } } },
  render: () => (
    <div className="max-w-sm">
      <Pick label="Komsat" allLabel="Semua komsat" initial={["Okayama"]} disabled />
    </div>
  ),
};

export const Phone: Story = {
  parameters: { docs: { description: { story: "Reviewed at 390 and 320px: the trigger is 44px, the search field is 16px and the option rows are 44px tall." } } },
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Pick label="Komsat" allLabel="Semua komsat" initial={["Okayama"]} />
    </div>
  ),
};

export const EmptyOptions: Story = {
  parameters: { docs: { description: { story: "No options at all: the menu opens with the empty line rather than an empty box." } } },
  render: () => (
    <div className="max-w-sm">
      <Pick label="Komsat" allLabel="Semua komsat" options={[]} />
    </div>
  ),
};

export const Playground: Story = {
  args: { label: "Komsat", values: ["Okayama", "Tokyo"], options: KOMSAT, allLabel: "Semua komsat", compact: false, single: false },
  render: (args) => {
    const [values, setValues] = React.useState(args.values);
    React.useEffect(() => setValues(args.values), [args.values]);
    return (
      <div className="max-w-sm">
        <SearchableMultiSelect
          {...args}
          values={values}
          onChange={(next) => {
            setValues(next);
            args.onChange(next);
          }}
        />
      </div>
    );
  },
};
