import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SuggestionSheet } from "./suggestion-sheet";
import { Button } from "./button";

type SuggestionSheetArgs = React.ComponentProps<typeof SuggestionSheet> & { open?: boolean };
const meta: Meta<SuggestionSheetArgs> = { title: "Wizard/SuggestionSheet", component: SuggestionSheet,
  argTypes: {
    kind: { control: "select", options: ["institution", "major", "minat", "funding"] },
    onDismiss: { action: "onDismiss" },
    name: { control: "text" },
    onNameChange: { action: "onNameChange" },
    onConfirm: { action: "onConfirm" },
    error: { control: "text" },
    prefectureLabel: { control: "text" },
    locale: { control: "select", options: ["id", "en"] },
    // Story-only toggle: SuggestionSheet has no open prop; kind is shown only while open.
    open: { control: "boolean" },
  },
};
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

export const Playground: StoryObj<SuggestionSheetArgs> = {
  args: { open: true, kind: "institution", name: "Universitas Udayana", prefectureLabel: "Okayama", locale: "id" },
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(args.open);
    const [value, setValue] = React.useState(args.name);
    React.useEffect(() => setIsOpen(args.open), [args.open]);
    React.useEffect(() => setValue(args.name), [args.name]);
    return (
      <div>
        <Button variant="outline" onClick={() => setIsOpen(true)}>Buka lembar saran</Button>
        <SuggestionSheet
          {...args}
          kind={isOpen ? args.kind : null}
          name={value}
          onNameChange={(next) => {
            setValue(next);
            args.onNameChange(next);
          }}
          onDismiss={() => {
            setIsOpen(false);
            args.onDismiss();
          }}
          onConfirm={() => {
            setIsOpen(false);
            args.onConfirm();
          }}
        />
      </div>
    );
  },
};
