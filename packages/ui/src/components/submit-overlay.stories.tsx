import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SubmitOverlay } from "./submit-overlay";
import { Button } from "./button";

const meta: Meta<typeof SubmitOverlay> = { title: "Wizard/SubmitOverlay", component: SubmitOverlay, parameters: { layout: "fullscreen" } };
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
