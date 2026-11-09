import type { Meta, StoryObj } from "@storybook/react";
// @ts-expect-error Static brand asset; the app supplies its own served copy.
import logoUrl from "../../../../brand/ppij-logo.png";
import { Button } from "./button";
import { AdminTopBar } from "./admin-top-bar";

const meta: Meta<typeof AdminTopBar> = {
  title: "Admin/AdminTopBar",
  component: AdminTopBar,
  argTypes: {
    variant: { control: "select", options: ["desktop", "phone"] },
    locale: { control: "select", options: ["id", "en"] },
    path: { control: "object" },
    title: { control: "text" },
    meta: { control: "object" },
    actions: { control: false },
    onNotificationsClick: { action: "onNotificationsClick" },
    notificationCount: { control: "number" },
    identity: { control: "object" },
    onIdentityClick: { action: "onIdentityClick" },
    brand: { control: "object" },
    leading: { control: false },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof AdminTopBar>;

const IDENTITY = { name: "Contoh Pengurus A", initials: "PA" };
const BRAND = { src: logoUrl, alt: "PPI Jepang", label: "Admin PPIJ" };
const WORKSPACE = <span className="flex min-h-8 items-center gap-1.5 rounded-[7px] border border-brand-border bg-card px-2.5 text-xs font-bold text-brand-ink">Okayama</span>;

export const DesktopPath: Story = {
  args: {
    variant: "desktop",
    path: [{ label: "Admin", href: "#admin" }, { label: "Organisasi", href: "#organisasi" }],
    title: "Komsat Okayama",
    locale: "id",
  },
  parameters: {
    docs: {
      description: {
        story: "The three-level trail: Admin > Organisasi > Komsat Okayama. The path is a labelled `nav` with an ordered list; the title ends it and reports `aria-current=\"page\"`. Only the shell's own header is a landmark, and the bar renders exactly one header per breakpoint because the shell mounts one variant.",
      },
    },
  },
  render: (args) => <AdminTopBar {...args} />,
};

export const DesktopWithDateAndBell: Story = {
  args: {
    variant: "desktop",
    path: [{ label: "Admin", href: "#admin" }],
    title: "Dasbor",
    meta: ["Sabtu, 31 Oktober 2026", "Waktu Jepang"],
    notificationCount: 12,
    identity: IDENTITY,
    onIdentityClick: () => undefined,
    onNotificationsClick: () => undefined,
    actions: <Button size="sm" variant="outline">Ekspor CSV</Button>,
    locale: "id",
  },
  parameters: {
    docs: {
      description: {
        story: "Quiet facts hide below 1100px so the bar stays calm, while the bell and the identity keep their place. The bell carries the locale name and the unread count (`Notifikasi, 12`); the identity carries the person's name and opens the account sheet. Below 600px the bar raises an action to the 44px touch floor.",
      },
    },
  },
  render: (args) => <AdminTopBar {...args} />,
};

export const PhoneBrand: Story = {
  args: {
    variant: "phone",
    path: [{ label: "Admin" }],
    title: "Dasbor",
    brand: BRAND,
    leading: WORKSPACE,
    identity: IDENTITY,
    onIdentityClick: () => undefined,
    locale: "id",
  },
  parameters: {
    docs: {
      description: {
        story: "The phone bar: the brand lock-up, one workspace slot and the 44x44 identity target that opens the account sheet. It renders its own `<header>` instead of the desktop one, so the shell never doubles the landmark.",
      },
    },
  },
  render: (args) => <AdminTopBar {...args} />,
};

export const LongPageTitle: Story = {
  args: {
    variant: "desktop",
    path: [{ label: "Admin", href: "#admin" }, { label: "Anggota", href: "#anggota" }],
    title: "Pendaftaran anggota dengan riwayat verifikasi panjang dan catatan perbaikan",
    meta: ["Sabtu, 31 Oktober 2026"],
    identity: IDENTITY,
    onIdentityClick: () => undefined,
    onNotificationsClick: () => undefined,
    locale: "id",
  },
  parameters: { docs: { description: { story: "A long page title truncates in the trail instead of pushing the actions off the bar; the full title stays available as the page heading." } } },
  render: (args) => <AdminTopBar {...args} />,
};

export const NoActions: Story = {
  args: {
    variant: "desktop",
    path: [{ label: "Admin", href: "#admin" }],
    title: "Bantuan",
    identity: IDENTITY,
    locale: "id",
  },
  parameters: { docs: { description: { story: "No actions and no bell: the trail stays left, the identity right, and nothing shifts." } } },
  render: (args) => <AdminTopBar {...args} />,
};

export const English: Story = {
  args: {
    variant: "desktop",
    path: [{ label: "Admin", href: "#admin" }],
    title: "Dashboard",
    meta: ["Saturday, 31 October 2026"],
    notificationCount: 3,
    identity: IDENTITY,
    onIdentityClick: () => undefined,
    onNotificationsClick: () => undefined,
    locale: "en",
  },
  parameters: { docs: { description: { story: "The English locale names the breadcrumb landmark, the bell and the identity button." } } },
  render: (args) => <AdminTopBar {...args} />,
};

export const Playground: Story = {
  args: {
    variant: "desktop",
    path: [{ label: "Admin", href: "#admin" }, { label: "Organisasi", href: "#organisasi" }],
    title: "Komsat Okayama",
    meta: ["Sabtu, 31 Oktober 2026", "Waktu Jepang"],
    notificationCount: 12,
    identity: IDENTITY,
    locale: "id",
  },
};
