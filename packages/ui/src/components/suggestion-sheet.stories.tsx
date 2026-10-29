import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SuggestionSheet } from "./suggestion-sheet";
import { Button } from "./button";

const meta: Meta<typeof SuggestionSheet> = { title: "Wizard/SuggestionSheet", component: SuggestionSheet };
export default meta;
type Story = StoryObj<typeof SuggestionSheet>;

export const SuggestInstitution: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("Universitas Udayana");
    return (
      <div>
        <Button variant="outline" onClick={() => setOpen(true)}>Tidak ada di daftar? Gunakan & sarankan institusi ini</Button>
        <SuggestionSheet kind={open ? "institution" : null} onDismiss={() => setOpen(false)} name={name} onNameChange={setName} onConfirm={() => setOpen(false)} prefectureLabel="Okayama" />
      </div>
    );
  },
};
