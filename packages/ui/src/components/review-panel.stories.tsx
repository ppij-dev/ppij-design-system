import type { Meta, StoryObj } from "@storybook/react";
import { ReviewPanel } from "./review-panel";

const meta: Meta<typeof ReviewPanel> = { title: "Wizard/ReviewPanel", component: ReviewPanel };
export default meta;
type Story = StoryObj<typeof ReviewPanel>;

export const Section: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-5">
      <ReviewPanel title="Data diri">
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <div><dt className="text-sm text-brand-muted">Nama lengkap</dt><dd className="font-medium text-brand-ink">I Nyoman Darma Kotama</dd></div>
          <div><dt className="text-sm text-brand-muted">Tanggal lahir</dt><dd className="font-medium text-brand-ink">2 September 1992</dd></div>
        </dl>
      </ReviewPanel>
      <ReviewPanel title="Pendanaan" incomplete>
        <p className="text-sm text-brand-muted">Sumber pendanaan belum diisi.</p>
      </ReviewPanel>
    </div>
  ),
};
