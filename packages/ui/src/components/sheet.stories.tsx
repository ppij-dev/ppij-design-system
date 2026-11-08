import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "./sheet";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

type SheetArgs = React.ComponentProps<typeof Sheet> & {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
};
const meta: Meta<SheetArgs> = {
  title: "Admin/Sheet",
  component: Sheet,
  argTypes: {
    open: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    modal: { control: "boolean" },
    onOpenChange: { action: "openChanged" },
    side: { control: "select", options: ["right", "left", "top", "bottom"] },
    showCloseButton: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Sheet>;

export const EditPanel: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Edit profil</Button></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profil</SheetTitle>
          <SheetDescription>Perubahan tersimpan ke profil anggota.</SheetDescription>
        </SheetHeader>
        <div style={{ display: "grid", gap: 10, padding: "0 16px" }}>
          <div style={{ display: "grid", gap: 6 }}><Label>Nama</Label><Input defaultValue="I Nyoman Darma Kotama" /></div>
          <div style={{ display: "grid", gap: 6 }}><Label>Komsat</Label><Input defaultValue="Okayama" /></div>
        </div>
        <SheetFooter>
          <SheetClose asChild><Button>Simpan</Button></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Playground: StoryObj<SheetArgs> = {
  args: { defaultOpen: false, modal: true, side: "right", showCloseButton: true },
  render: function Render({ open, defaultOpen, onOpenChange, side, showCloseButton, ...root }) {
    const [isOpen, setIsOpen] = React.useState(open ?? defaultOpen ?? false);
    React.useEffect(() => {
      if (open !== undefined) setIsOpen(open);
    }, [open]);
    return (
      <Sheet
        {...root}
        open={isOpen}
        onOpenChange={(next) => {
          setIsOpen(next);
          onOpenChange?.(next);
        }}
      >
        <SheetTrigger asChild><Button variant="outline">Edit profil</Button></SheetTrigger>
        <SheetContent side={side} showCloseButton={showCloseButton}>
          <SheetHeader>
            <SheetTitle>Edit profil</SheetTitle>
            <SheetDescription>Perubahan tersimpan ke profil anggota.</SheetDescription>
          </SheetHeader>
          <div style={{ display: "grid", gap: 10, padding: "0 16px" }}>
            <div style={{ display: "grid", gap: 6 }}><Label>Nama</Label><Input defaultValue="I Nyoman Darma Kotama" /></div>
            <div style={{ display: "grid", gap: 6 }}><Label>Komsat</Label><Input defaultValue="Okayama" /></div>
          </div>
          <SheetFooter>
            <SheetClose asChild><Button>Simpan</Button></SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  },
};
