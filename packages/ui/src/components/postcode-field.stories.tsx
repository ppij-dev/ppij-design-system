import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PostcodeField } from "./postcode-field";
import { Label } from "./label";

const meta: Meta<typeof PostcodeField> = {
  title: "Wizard/PostcodeField",
  component: PostcodeField,
  argTypes: {
    value: { control: "text" },
    onChange: { action: "changed" },
    onSearch: { action: "searched" },
    searching: { control: "boolean" },
    searchLabel: { control: "text" },
    statusText: { control: "text" },
    candidates: { control: "object" },
    placeholder: { control: "text" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof PostcodeField>;

export const Lookup: Story = {
  render: () => {
    const [value, setValue] = React.useState("700-0001");
    const [status, setStatus] = React.useState<string | undefined>(undefined);
    const [candidates, setCandidates] = React.useState<{ label: string; onSelect: () => void }[]>([]);
    return (
      <div className="grid max-w-md gap-1.5">
        <Label>Kode pos</Label>
        <PostcodeField
          value={value}
          onChange={setValue}
          statusText={status}
          candidates={candidates}
          onSearch={() => {
            setStatus("Okayama, Okayama");
            setCandidates([
              { label: "Kita-ku, Kota Okayama", onSelect: () => setStatus("Kita-ku, Kota Okayama dipilih.") },
              { label: "Naka-ku, Kota Okayama", onSelect: () => setStatus("Naka-ku, Kota Okayama dipilih.") },
            ]);
          }}
        />
      </div>
    );
  },
};

export const Playground: Story = {
  args: {
    value: "700-0001",
    searching: false,
    searchLabel: "Cari alamat",
    placeholder: "700-0001",
    candidates: [
      { label: "Kita-ku, Kota Okayama", onSelect: () => {} },
      { label: "Naka-ku, Kota Okayama", onSelect: () => {} },
    ],
  },
  render: function Render(args) {
    const [value, setValue] = React.useState(args.value);
    const [status, setStatus] = React.useState<string | undefined>(args.statusText);
    React.useEffect(() => setValue(args.value), [args.value]);
    React.useEffect(() => setStatus(args.statusText), [args.statusText]);
    return (
      <div className="grid max-w-md gap-1.5">
        <Label>Kode pos</Label>
        <PostcodeField
          {...args}
          value={value}
          onChange={(next) => {
            setValue(next);
            args.onChange(next);
          }}
          statusText={status}
          candidates={(args.candidates ?? []).map((candidate) => ({
            label: candidate.label,
            onSelect: () => setStatus(candidate.label + " dipilih."),
          }))}
          onSearch={() => {
            args.onSearch();
            setStatus("Okayama, Okayama");
          }}
        />
      </div>
    );
  },
};
