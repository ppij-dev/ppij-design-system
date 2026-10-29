import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CardUpload, type CardSideState } from "./card-upload";

const meta: Meta<typeof CardUpload> = { title: "Wizard/CardUpload", component: CardUpload };
export default meta;
type Story = StoryObj<typeof CardUpload>;

export const Capture: Story = {
  render: () => {
    const [front, setFront] = React.useState<CardSideState>("empty");
    const [back, setBack] = React.useState<CardSideState>("empty");
    const simulate = (set: (s: CardSideState) => void) => () => {
      set("uploading");
      window.setTimeout(() => set("saved"), 900);
    };
    return (
      <div className="max-w-xl">
        <CardUpload
          front={{ label: "Sisi depan", state: front, fileName: "kartu-depan.jpg", onCapture: simulate(setFront), onPick: simulate(setFront), onRemove: () => setFront("empty") }}
          back={{ label: "Sisi belakang", optional: true, state: back, fileName: "kartu-belakang.jpg", onCapture: simulate(setBack), onPick: simulate(setBack), onRemove: () => setBack("empty") }}
          note="Foto kartu hanya untuk verifikasi keanggotaan dan dihapus 30 hari setelah keputusan pendaftaran."
        />
      </div>
    );
  },
};
