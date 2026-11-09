import type { Meta, StoryObj } from "@storybook/react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";
import { Button, buttonVariants } from "./button";
import { cn } from "../lib/utils";

const meta: Meta<typeof AlertDialog> = {
  title: "Portal/AlertDialog",
  component: AlertDialog,
  argTypes: {
    open: { control: "boolean" },
    onOpenChange: { action: "openChange" },
  },
};
export default meta;
type Story = StoryObj<typeof AlertDialog>;

export const Playground: Story = {
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Hapus anggota</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus anggota ini?</AlertDialogTitle>
          <AlertDialogDescription>
            I Nyoman Darma Kotama (PPIJ-2026-000123) akan dihapus dari direktori. Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction className={cn(buttonVariants({ variant: "destructive" }))}>
            Hapus anggota
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
export const DeleteMember: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Hapus anggota</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus anggota ini?</AlertDialogTitle>
          <AlertDialogDescription>
            I Nyoman Darma Kotama (PPIJ-2026-000123) akan dihapus dari
            direktori. Kartu anggota digitalnya berhenti berlaku dan
            tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction className={cn(buttonVariants({ variant: "destructive" }))}>
            Hapus anggota
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
