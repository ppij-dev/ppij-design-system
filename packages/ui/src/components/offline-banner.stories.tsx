import type { Meta, StoryObj } from "@storybook/react";
import { IconClipboardCheck, IconHome } from "@tabler/icons-react";
import { OfflineBanner } from "./offline-banner";
import { PortalShell } from "./portal-shell";
// @ts-expect-error Static brand asset; the portal supplies its own served copy.
import logoUrl from "../../../../brand/ppij-logo.png";

const meta: Meta<typeof OfflineBanner> = { title: "Portal/OfflineBanner", component: OfflineBanner };
export default meta;
type Story = StoryObj<typeof OfflineBanner>;

export const Strip: Story = { args: {} };
export const English: Story = { args: { label: "No connection. Your data is saved." } };
export const InShell: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <PortalShell
      logoSrc={logoUrl}
      navItems={[
        { label: "Beranda", href: "#", icon: <IconHome className="size-5" stroke={1.75} />, current: true },
        { label: "Verifikasi", href: "#", icon: <IconClipboardCheck className="size-5" stroke={1.75} /> },
      ]}
      languages={[{ label: "Bahasa Indonesia", current: true }, { label: "English" }]}
      accountItems={[{ label: "Akun", href: "#" }, { label: "Kebijakan Privasi", href: "#" }, { label: "Syarat Layanan", href: "#" }]}
      banner={<OfflineBanner />}
      helpText="Butuh bantuan? Hubungi pengurus komsatmu atau sekretariat PPI Jepang."
      legalItems={[{ label: "Kebijakan Privasi", href: "#" }, { label: "Syarat Layanan", href: "#" }]}
    >
      <h1 className="text-2xl font-bold text-brand-ink">Halo, Darma</h1>
    </PortalShell>
  ),
};
