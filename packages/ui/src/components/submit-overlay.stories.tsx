import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SubmitOverlay } from "./submit-overlay";
import { Button } from "./button";

type SubmitOverlayArgs = React.ComponentProps<typeof SubmitOverlay> & { open?: boolean };
const meta: Meta<SubmitOverlayArgs> = { title: "Wizard/SubmitOverlay", component: SubmitOverlay, parameters: { layout: "fullscreen" },
  argTypes: {
    phase: { control: "select", options: ["sending", "sent"] },
    title: { control: "text" },
    line: { control: "text" },
    className: { control: "text" },
    // Story-only toggle: SubmitOverlay has no open prop; the story hides the layer when false.
    open: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof SubmitOverlay>;

export const SendingThenSent: Story = {
  render: () => {
    const [phase, setPhase] = React.useState<null | "sending" | "sent">(null);
    return (
      <div className="grid min-h-40 place-items-center">
        <Button
          onClick={() => {
            setPhase("sending");
            window.setTimeout(() => setPhase("sent"), 1400);
            window.setTimeout(() => setPhase(null), 3200);
          }}
        >
          Kirim pendaftaran
        </Button>
        {phase && <SubmitOverlay phase={phase} title={phase === "sent" ? "Terkirim. Membuka Beranda..." : "Mengirim pendaftaran..."} />}
      </div>
    );
  },
};

export const Playground: StoryObj<SubmitOverlayArgs> = {
  args: { open: true, phase: "sending", title: "Mengirim pendaftaran...", line: "Jangan tutup halaman ini." },
  render: ({ open, ...args }) => <>{open ? <SubmitOverlay {...args} /> : null}</>,
};
