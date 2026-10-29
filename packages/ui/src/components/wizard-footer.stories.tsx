import type { Meta, StoryObj } from "@storybook/react";
import { WizardFooter } from "./wizard-footer";

const meta: Meta<typeof WizardFooter> = { title: "Wizard/WizardFooter", component: WizardFooter, parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj<typeof WizardFooter>;

export const Bar: Story = {
  render: () => (
    <div className="min-h-40">
      <p className="mx-auto max-w-2xl px-4 py-6 text-sm text-brand-muted">Bar navigasi tetap di bawah viewport; di halaman wizard, konten diberi bantalan bawah agar tidak tertutup bar.</p>
      <WizardFooter onBack={() => {}} onContinue={() => {}} />
    </div>
  ),
};

export const Submitting: Story = {
  render: () => (
    <div className="min-h-40">
      <WizardFooter onBack={() => {}} onContinue={() => {}} continueLabel="Kirim Pendaftaran" showArrow={false} continueLoading />
    </div>
  ),
};
