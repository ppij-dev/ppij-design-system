import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { FileUpload, type FileUploadStatus } from "./file-upload";

const meta: Meta<typeof FileUpload> = {
  title: "Portal/FileUpload",
  component: FileUpload,
  argTypes: {
    label: { control: "text" },
    hint: { control: "text" },
    accept: { control: "text" },
    status: { control: "select", options: ["empty", "uploading", "done", "error"] },
    fileName: { control: "text" },
    progress: { control: "number" },
    errorText: { control: "text" },
    onPick: { action: "pick" },
    onRemove: { action: "remove" },
  },
};
export default meta;
type Story = StoryObj<typeof FileUpload>;

function Demo() {
  const [status, setStatus] = React.useState<FileUploadStatus>("empty");
  const [name, setName] = React.useState<string>("");
  const [progress, setProgress] = React.useState(0);
  const pick = (file: File) => {
    setName(file.name);
    setStatus("uploading");
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setStatus("done");
          return 100;
        }
        return p + 25;
      });
    }, 220);
  };
  return (
    <div style={{ maxWidth: 480 }}>
      <FileUpload
        label="Foto untuk kartu anggota"
        hint="JPG atau PNG, maks 5 MB, latar polos."
        accept="image/png,image/jpeg"
        status={status}
        fileName={name}
        progress={progress}
        onPick={pick}
        onRemove={() => setStatus("empty")}
      />
    </div>
  );
}

export const Playground: Story = {
  args: {
    label: "Foto untuk kartu anggota",
    hint: "JPG atau PNG, maks 5 MB, latar polos.",
    accept: "image/png,image/jpeg",
    status: "empty",
    fileName: "foto-kartu.jpg",
    progress: 40,
    errorText: "Ukuran berkas melebihi 5 MB.",
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <FileUpload {...args} />
    </div>
  ),
};
export const Interactive: Story = { render: () => <Demo /> };

export const ErrorState: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <FileUpload
        label="Dokumen pendukung"
        status="error"
        fileName="berkas-scan.pdf"
        errorText="Ukuran berkas melebihi 5 MB."
        onPick={() => {}}
      />
    </div>
  ),
};
