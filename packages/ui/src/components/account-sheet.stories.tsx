import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { IconLifebuoy, IconSettings, IconUserCircle } from "@tabler/icons-react";
import { Button } from "./button";
import { AccountSheet, type AccountSheetProps } from "./account-sheet";

const meta: Meta<typeof AccountSheet> = {
  title: "Admin/AccountSheet",
  component: AccountSheet,
};
export default meta;
type Story = StoryObj<typeof AccountSheet>;

const SWITCH = (
  <div className="grid gap-1.5">
    <small className="text-[10px] font-extrabold tracking-[.12em] text-brand-muted">BUKA</small>
    <div className="grid grid-cols-2 gap-[3px] rounded-[9px] bg-secondary p-[3px]">
      <button type="button" className="min-h-8 rounded-[7px] text-[13px] font-semibold text-brand-muted">Portal</button>
      <button type="button" aria-current="page" className="min-h-8 rounded-[7px] bg-card text-[13px] font-semibold text-brand-ink shadow-[0_2px_6px_rgba(24,34,43,.08)]">Admin</button>
    </div>
  </div>
);

const ROWS = [
  { label: "Profil & akun", sublabel: "Menuju /akun di produksi", icon: <IconUserCircle aria-hidden />, onSelect: () => undefined },
  { label: "Pengaturan", sublabel: "Bahasa, notifikasi, tampilan", icon: <IconSettings aria-hidden />, onSelect: () => undefined },
  { label: "Bantuan", icon: <IconLifebuoy aria-hidden />, onSelect: () => undefined },
];

/** The sheet is controlled by its caller, so each story opens it from a trigger. */
function SheetDemo(props: Omit<AccountSheetProps, "open" | "onOpenChange">) {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="min-h-40">
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Buka profil
      </Button>
      <AccountSheet {...props} open={open} onOpenChange={setOpen} />
    </div>
  );
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Who is signed in, the context switch, the account rows and sign out, as a bottom sheet at every width. `role=\"dialog\"` with the locale name, Escape and the backdrop close it, focus starts on the 44px close button and returns to the trigger, and every row is an ordinary button of at least 44px.",
      },
    },
  },
  render: () => (
    <SheetDemo
      name="Contoh Pengurus A"
      detail="Admin Nasional"
      initials="PA"
      items={[{ ...ROWS[0] }]}
      switchSlot={SWITCH}
      signOutLabel="Keluar"
      onSignOut={() => undefined}
      locale="id"
    />
  ),
};

export const ThreeRows: Story = {
  parameters: {
    docs: {
      description: {
        story: "Three rows with sublabels and Tabler icons: the row that leads somewhere states its destination, the row that only switches settings states nothing.",
      },
    },
  },
  render: () => (
    <SheetDemo name="Contoh Pengurus A" detail="Admin Nasional" initials="PA" items={ROWS} switchSlot={SWITCH} signOutLabel="Keluar" onSignOut={() => undefined} locale="id" />
  ),
};

export const DangerSignOut: Story = {
  parameters: {
    docs: {
      description: {
        story: "Sign out is the danger row: a destructive label, its own hairline above it and the log-out icon. `tone=\"danger\"` does the same for any other row that removes access.",
      },
    },
  },
  render: () => (
    <SheetDemo
      name="Contoh Pengurus A"
      detail="Admin Komsat Okayama"
      initials="PA"
      items={[{ ...ROWS[0] }, { ...ROWS[2], tone: "danger" as const, sublabel: "Pencabutan akses dicatat di log audit" }]}
      switchSlot={SWITCH}
      signOutLabel="Keluar dari akun"
      onSignOut={() => undefined}
      locale="id"
    />
  ),
};

export const NoSwitchSlot: Story = {
  parameters: { docs: { description: { story: "No context switch: a member with one context gets the head and the rows only, and nothing reserves the slot's space." } } },
  render: () => <SheetDemo name="Sari Dewi" detail="Anggota" initials="SD" items={ROWS} signOutLabel="Keluar" onSignOut={() => undefined} locale="id" />,
};

export const LongNameAndRole: Story = {
  parameters: { docs: { description: { story: "A long name and role truncate inside the head; the sheet keeps its width and the close button keeps its 44px target." } } },
  render: () => (
    <SheetDemo
      name="I Nyoman Darma Kotama Wijaya Kusuma"
      detail="Admin komsat PPI Okayama dengan kewenangan verifikasi dan pencabutan"
      initials="ID"
      items={ROWS}
      switchSlot={SWITCH}
      signOutLabel="Keluar"
      onSignOut={() => undefined}
      locale="id"
    />
  ),
};

export const English: Story = {
  parameters: { docs: { description: { story: "The English locale names the dialog and the close button; the rows are the caller's strings." } } },
  render: () => (
    <SheetDemo
      name="Contoh Pengurus A"
      detail="National admin"
      initials="PA"
      items={[
        { label: "Profile & account", sublabel: "Goes to /akun in production", icon: <IconUserCircle aria-hidden />, onSelect: () => undefined },
        { label: "Settings", sublabel: "Language, notifications, appearance", icon: <IconSettings aria-hidden />, onSelect: () => undefined },
      ]}
      signOutLabel="Sign out"
      onSignOut={() => undefined}
      locale="en"
    />
  ),
};
