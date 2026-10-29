import type { Meta, StoryObj } from "@storybook/react";
import { InvitationCard } from "./invitation-card";

const meta: Meta<typeof InvitationCard> = { title: "Portal/InvitationCard", component: InvitationCard };
export default meta;
type Story = StoryObj<typeof InvitationCard>;

export const RoleInvitation: Story = {
  args: {
    heading: "Undangan peran",
    body: "Anda diundang sebagai Pengurus di Komsat Okayama. Berlaku sampai 30 November 2026.",
    actionLabel: "Lihat undangan",
    href: "#",
  },
};
