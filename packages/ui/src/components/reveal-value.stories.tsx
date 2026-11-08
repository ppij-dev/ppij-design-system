import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Badge } from "./badge";
import { FactList } from "./fact-list";
import { RevealValue } from "./reveal-value";

const meta: Meta<typeof RevealValue> = {
  title: "Admin/RevealValue",
  component: RevealValue,
};
export default meta;
type Story = StoryObj<typeof RevealValue>;

const MASK = "••••••••••••";

export const Masked: Story = {
  args: { masked: MASK, clear: "PPIJ-2026-000123", revealed: false, onReveal: () => undefined, onHide: () => undefined },
  parameters: {
    docs: {
      description: {
        story: "The masked state: the dots are decorative and hidden from assistive technology, and \"Nilai tersembunyi\" is announced instead. The value carries `aria-live=\"polite\"`, so the reveal is announced on its own without re-reading the row.",
      },
    },
  },
  render: (args) => <RevealValue {...args} className="text-[13px]" />,
};

export const Revealed: Story = {
  args: { masked: MASK, clear: "PPIJ-2026-000123", revealed: true, onReveal: () => undefined, onHide: () => undefined },
  render: (args) => <RevealValue {...args} className="text-[13px]" />,
};

export const ToggleFocused: Story = {
  args: { masked: MASK, clear: "darma.kotama@example.invalid", revealed: false, onReveal: () => undefined, onHide: () => undefined },
  parameters: {
    docs: {
      description: {
        story: "The toggle is a real button with a visible focus ring; it reports no pressed state because its accessible name already changes from Tampilkan to Sembunyikan. Below 600px it grows to the 44px touch floor.",
      },
    },
  },
  render: (args) => {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      ref.current?.querySelector("button")?.focus();
    }, []);
    return <div ref={ref}><RevealValue {...args} className="text-[13px]" /></div>;
  },
};

export const IconOnly: Story = {
  args: { masked: MASK, clear: "PPIJ-2026-000123", revealed: false, onReveal: () => undefined, onHide: () => undefined, iconOnly: true },
  parameters: { docs: { description: { story: "`iconOnly` hides the text but keeps the accessible name, for a table cell with no room for the label." } } },
  render: (args) => <RevealValue {...args} className="text-[13px]" />,
};

export const InsideFactListRow: Story = {
  parameters: {
    docs: {
      description: {
        story: "The member detail's four masked fields: each masked value keeps its own term, so the row still reads \"Nomor anggota: Nilai tersembunyi, Tampilkan\".",
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <FactList
        variant="rows"
        items={[
          { label: "Nama lengkap", value: "I Nyoman Darma Kotama" },
          { label: "Nomor anggota", value: <RevealValue masked={MASK} clear="PPIJ-2026-000123" revealed={false} onReveal={() => undefined} onHide={() => undefined} /> },
          { label: "NIK", value: <RevealValue masked={MASK} clear="5171••••••••0004" revealed onReveal={() => undefined} onHide={() => undefined} /> },
          { label: "Status", value: <Badge variant="success">Aktif</Badge> },
        ]}
      />
    </div>
  ),
};

export const LongRevealedValue: Story = {
  args: {
    masked: MASK,
    clear: "darma.kotama.wijaya.kusuma@student.politeknik-negeri-bali.example.invalid",
    revealed: true,
    onReveal: () => undefined,
    onHide: () => undefined,
  },
  parameters: { docs: { description: { story: "A long revealed value wraps and keeps the toggle beside it instead of pushing it out of the row." } } },
  render: (args) => (
    <div className="max-w-sm">
      <RevealValue {...args} className="text-[13px]" />
    </div>
  ),
};

export const Phone: Story = {
  args: { masked: MASK, clear: "PPIJ-2026-000123", revealed: false, onReveal: () => undefined, onHide: () => undefined },
  parameters: { docs: { description: { story: "Reviewed at 390 and 320px: the toggle is 44px tall with 12px text, and the masked value stays on one line." } } },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <RevealValue {...args} className="text-[13px]" />
    </div>
  ),
};
