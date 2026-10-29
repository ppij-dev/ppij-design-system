import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { IconClockHour4 } from "@tabler/icons-react";
import { EditablePanel } from "./editable-panel";
import { AdminDrawer } from "./admin-drawer";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { PhoneField } from "./phone-field";
import { Spinner } from "./spinner";

/**
 * The editable pattern, end to end: the panel reads, Edit opens
 * the AdminDrawer (right drawer on desktop, bottom sheet on the
 * phone), and saving returns to reading. One editor at a time.
 */
function EditableDemo() {
  const [nickname, setNickname] = React.useState("Darma");
  const [phone, setPhone] = React.useState("+81 90-1234-5678");
  const [draftName, setDraftName] = React.useState(nickname);
  const [draftPhone, setDraftPhone] = React.useState(phone);
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const save = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setNickname(draftName);
      setPhone(draftPhone);
      setOpen(false);
      setSaved(true);
    }, 700);
  };
  return (
    <div className="grid max-w-xl gap-3">
      <EditablePanel
        title="Kontak"
        description="Nama panggilan, telepon, dan LINE diperbarui langsung."
        onEdit={() => { setDraftName(nickname); setDraftPhone(phone); setSaved(false); setOpen(true); }}
      >
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div className="grid gap-0.5">
            <dt className="text-sm text-brand-muted">Nama panggilan</dt>
            <dd className="font-medium text-brand-ink">{nickname}</dd>
          </div>
          <div className="grid gap-0.5">
            <dt className="text-sm text-brand-muted">Nomor telepon atau WhatsApp</dt>
            <dd className="font-medium text-brand-ink">{phone}</dd>
          </div>
        </dl>
      </EditablePanel>
      {saved ? <p role="status" className="text-sm font-medium text-brand-ink">Perubahan disimpan.</p> : null}
      <AdminDrawer
        open={open}
        onOpenChange={setOpen}
        locale="id"
        title="Kontak"
        description="Perubahan pada bagian ini disimpan langsung."
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="button" onClick={save} disabled={saving} aria-busy={saving}>
              {saving ? <><Spinner />Menyimpan…</> : "Simpan perubahan"}
            </Button>
          </>
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label>Nama panggilan</Label>
            <Input value={draftName} onChange={(e) => setDraftName(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Nomor telepon atau WhatsApp</Label>
            <PhoneField value={draftPhone} onChange={setDraftPhone} defaultCode="+81" />
          </div>
        </div>
      </AdminDrawer>
    </div>
  );
}

const meta: Meta = { title: "Portal/EditablePanel" };
export default meta;
type Story = StoryObj;

export const EditInDrawer: Story = { render: () => <EditableDemo /> };

export const PendingReview: Story = {
  render: () => (
    <div className="max-w-xl">
      <EditablePanel
        title="Data diri"
        description="Perubahan nama, tanggal lahir, dan komsat ditinjau pengurus. Data saat ini tetap berlaku sampai disetujui."
        pending
        onEdit={() => {}}
        proposal={
          <Alert>
            <IconClockHour4 aria-hidden="true" />
            <AlertTitle>Perubahan menunggu peninjauan</AlertTitle>
            <AlertDescription>
              <p>Data saat ini tetap berlaku sampai pengurus menyetujui perubahan.</p>
              <dl className="mt-2 grid gap-2 sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-brand-ink">Nama lengkap</dt>
                  <dd>I Nyoman Darma Kotama</dd>
                </div>
                <div>
                  <dt className="font-medium text-brand-ink">Komsat</dt>
                  <dd>Okayama</dd>
                </div>
              </dl>
            </AlertDescription>
          </Alert>
        }
      >
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div className="grid gap-0.5">
            <dt className="text-sm text-brand-muted">Nama lengkap</dt>
            <dd className="font-medium text-brand-ink">I Nyoman Darma Kotama</dd>
          </div>
          <div className="grid gap-0.5">
            <dt className="text-sm text-brand-muted">Komsat</dt>
            <dd className="font-medium text-brand-ink">Okayama</dd>
          </div>
        </dl>
      </EditablePanel>
    </div>
  ),
};
