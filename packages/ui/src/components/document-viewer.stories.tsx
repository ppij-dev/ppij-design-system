import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { IconId } from "@tabler/icons-react";
import { DocumentViewer, type DocumentSide } from "./document-viewer";

const meta: Meta<typeof DocumentViewer> = {
  title: "Admin/DocumentViewer",
  component: DocumentViewer,
};
export default meta;
type Story = StoryObj<typeof DocumentViewer>;

const SIDES: DocumentSide[] = [
  { id: "front", label: "Sisi depan", kind: "image", name: "Kartu pelajar · sisi depan", meta: "Berkas contoh · JPG" },
  { id: "back", label: "Sisi belakang", kind: "image", name: "Kartu pelajar · sisi belakang", meta: "Berkas contoh · JPG" },
];

const FACTS = [
  { label: "Nama", value: "I Nyoman Darma Kotama" },
  { label: "Jenjang", value: "D3" },
  { label: "Institusi / Fakultas", value: "Politeknik Negeri Bali / Teknik Elektro", span: true },
  { label: "Tinggal dari / sampai", value: "04/2024 sampai 03/2028", span: true },
];

/** Stands for the app's real preview: the fetched image or the PDF viewer. */
function PaperStage({ file = "KARTU PELAJAR" }: { file?: string }) {
  return (
    <div className="grid min-h-[178px] w-[min(100%,300px)] content-start gap-[7px] rounded-lg border border-[#d9e0e5] bg-card px-5 py-[18px] shadow-[0_7px_20px_rgba(24,34,43,.08)]">
      <span className="text-[9px] font-extrabold tracking-[.12em] text-[#9d2940]">PLACEHOLDER PRATINJAU</span>
      <IconId aria-hidden className="size-11 text-[#b21834]" />
      <strong className="text-sm tracking-[.04em] text-[#202b33]">{file}</strong>
      <i className="block h-[5px] w-[72%] rounded bg-[#e7ebee]" />
      <i className="block h-[5px] w-[45%] rounded bg-[#e7ebee]" />
      <small className="mt-[3px] text-[10px] text-brand-muted">Tanpa data pribadi</small>
    </div>
  );
}

function Viewer({ initial = "front", ...rest }: { initial?: string } & Partial<React.ComponentProps<typeof DocumentViewer>>) {
  const [value, setValue] = React.useState(initial);
  return <DocumentViewer locale="id" sides={SIDES} value={value} onChange={setValue} {...rest}>{rest.children ?? <PaperStage />}</DocumentViewer>;
}

export const TwoSides: Story = {
  parameters: {
    docs: {
      description: {
        story: "Two sides with an image stage: the side switcher is a `role=\"group\"` of `aria-pressed` buttons, the file row's icon carries the file type as its accessible name, and the stage is a labelled region. The paper in the stage is the app's preview in production; here it names itself a placeholder.",
      },
    },
  },
  render: () => (
    <div className="max-w-xl">
      <Viewer />
    </div>
  ),
};

export const PdfSide: Story = {
  parameters: {
    docs: {
      description: {
        story: "A PDF side: the icon switches to the PDF glyph and its accessible name changes with it, so the type is never carried by the icon shape alone.",
      },
    },
  },
  render: () => (
    <div className="max-w-xl">
      <Viewer
        sides={[
          { id: "front", label: "Sisi depan", kind: "pdf", name: "Kartu pelajar · sisi depan", meta: "Berkas contoh · PDF" },
          { id: "back", label: "Sisi belakang", kind: "image", name: "Kartu pelajar · sisi belakang", meta: "Berkas contoh · JPG" },
        ]}
      />
    </div>
  ),
};

export const WithFacts: Story = {
  parameters: { docs: { description: { story: "The facts list under the stage: a `FactList twoColumn` in the document's own surface, collapsing to one column below 600px." } } },
  render: () => (
    <div className="max-w-xl">
      <Viewer facts={FACTS} />
    </div>
  ),
};

export const Loading: Story = {
  parameters: { docs: { description: { story: "Loading: the stage announces itself with `role=\"status\"` and shows skeletons in the preview's own footprint, so the card does not jump when the file arrives." } } },
  render: () => (
    <div className="max-w-xl">
      <Viewer loading />
    </div>
  ),
};

export const OneSide: Story = {
  parameters: { docs: { description: { story: "One side: no switcher renders, and the file row and stage keep the same frame." } } },
  render: () => (
    <div className="max-w-xl">
      <Viewer sides={[SIDES[0]]} />
    </div>
  ),
};

export const Empty: Story = {
  parameters: { docs: { description: { story: "No sides at all: a quiet line instead of an empty frame, so a review screen can mount the viewer before the documents load." } } },
  render: () => (
    <div className="max-w-xl">
      <DocumentViewer locale="id" sides={[]} value="" onChange={() => undefined}>{(null)}</DocumentViewer>
    </div>
  ),
};

export const LongFileName: Story = {
  parameters: { docs: { description: { story: "A long file name and meta truncate inside the file row instead of pushing the icon or wrapping the frame." } } },
  render: () => (
    <div className="max-w-xl">
      <Viewer
        sides={[
          { id: "front", label: "Sisi depan", kind: "pdf", name: "Kartu pelajar dan surat keterangan mahasiswa aktif Politeknik Negeri Bali 2026", meta: "Berkas contoh · PDF · 2,4 MB diunggah 1 Oktober 2026" },
        ]}
      />
    </div>
  ),
};

export const Phone: Story = {
  parameters: { docs: { description: { story: "Reviewed at 390 and 320px: the side tabs are 44px tall, the file row wraps nothing and the facts list is one column." } } },
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Viewer facts={FACTS} />
    </div>
  ),
};

export const English: Story = {
  parameters: { docs: { description: { story: "The English locale names the stage region and the file type; the side labels are the caller's strings." } } },
  render: () => (
    <div className="max-w-xl">
      <DocumentViewer
        locale="en"
        sides={[
          { id: "front", label: "Front", kind: "image", name: "Student card · front", meta: "Sample file · JPG" },
          { id: "back", label: "Back", kind: "pdf", name: "Student card · back", meta: "Sample file · PDF" },
        ]}
        value="front"
        onChange={() => undefined}
      >
        <PaperStage file="STUDENT CARD" />
      </DocumentViewer>
    </div>
  ),
};
