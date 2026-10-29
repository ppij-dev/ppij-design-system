import type { Meta, StoryObj } from "@storybook/react";
import { WizardHeader } from "./wizard-header";

const meta: Meta<typeof WizardHeader> = { title: "Wizard/WizardHeader", component: WizardHeader, parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj<typeof WizardHeader>;

export const StepHeader: Story = {
  render: () => (
    <div className="mx-auto max-w-5xl px-4">
      <WizardHeader
        stepText="Langkah 3 dari 7"
        title="Pendidikan"
        current={3}
        total={7}
        progressLabel="Progres pendaftaran"
        savingStatus="saved"
        languages={[{ label: "Bahasa Indonesia", current: true }, { label: "English" }]}
        className="-mx-4"
      />
      <p className="py-6 text-sm text-brand-muted">Header sticky di bawah header portal; indikator tersimpan dan menu bahasa di kanan, progres bersegmen di bawahnya.</p>
    </div>
  ),
};
