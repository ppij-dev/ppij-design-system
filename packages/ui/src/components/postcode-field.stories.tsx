import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PostcodeField } from "./postcode-field";
import { Label } from "./label";

const meta: Meta<typeof PostcodeField> = { title: "Wizard/PostcodeField", component: PostcodeField };
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
