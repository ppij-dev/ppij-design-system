import type { Meta, StoryObj } from "@storybook/react";
import { MemberCard, MemberCardBack } from "./member-card";

const meta: Meta<typeof MemberCard> = {
  title: "Portal/MemberCard",
  component: MemberCard,
  argTypes: {
    name: { control: "text" },
    memberId: { control: "text" },
    komsat: { control: "text" },
    affiliation: { control: "text" },
    validUntil: { control: "text" },
    statusLabel: { control: "text" },
    statusVariant: { control: "select", options: ["default", "secondary", "destructive", "outline"] },
    validLabel: { control: "text" },
    theme: { control: "select", options: ["red", "ink"] },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof MemberCard>;

export const Active: Story = {
  render: () => (
    <MemberCard name="I Nyoman Darma Kotama" memberId="PPIJ-2026-000123" komsat="Okayama" affiliation="Okayama University" validUntil="Okt 2027" statusLabel="Aktif" />
  ),
};
export const InkThemeExpiring: Story = {
  render: () => (
    <MemberCard name="Zeno of Citium" memberId="PPIJ-2026-000456" komsat="Tokyo" validUntil="Nov 2026" statusLabel="Segera berakhir" theme="ink" />
  ),
};
export const Back: Story = {
  render: () => (
    <MemberCardBack memberId="PPIJ-2026-000123" note="Kartu ini milik PPI Jepang. Jika menemukan kartu ini, hubungi sekretariat PPI Jepang." />
  ),
};

export const Playground: Story = {
  args: {
    name: "I Nyoman Darma Kotama",
    memberId: "PPIJ-2026-000123",
    komsat: "Okayama",
    affiliation: "Okayama University",
    validUntil: "Okt 2027",
    statusLabel: "Aktif",
    statusVariant: "secondary",
    validLabel: "Berlaku hingga",
    theme: "red",
  },
};
