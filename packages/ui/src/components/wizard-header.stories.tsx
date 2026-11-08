import type { Meta, StoryObj } from "@storybook/react";
import { WizardHeader } from "./wizard-header";

const meta: Meta<typeof WizardHeader> = {
  title: "Wizard/WizardHeader",
  component: WizardHeader,
  parameters: { layout: "fullscreen" },
  argTypes: {
    stepText: { control: "text" },
    title: { control: "text" },
    current: { control: "number" },
    total: { control: "number" },
    progressLabel: { control: "text" },
    savingStatus: { control: "select", options: ["idle", "saving", "saved", "error"] },
    locale: { control: "select", options: ["id", "en"] },
    languages: { control: "object" },
    languageLabel: { control: "text" },
    onLanguageSelect: { action: "onLanguageSelect" },
    className: { control: "text" },
  },
};
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

export const Playground: Story = {
  args: {
    stepText: "Langkah 3 dari 7",
    title: "Pendidikan",
    current: 3,
    total: 7,
    progressLabel: "Progres pendaftaran",
    savingStatus: "saved",
    locale: "id",
    languages: [{ label: "Bahasa Indonesia", current: true }, { label: "English" }],
    languageLabel: "Pilih bahasa",
    className: "-mx-4",
  },
  render: (args) => (
    <div className="mx-auto max-w-5xl px-4">
      <WizardHeader {...args} />
    </div>
  ),
};
