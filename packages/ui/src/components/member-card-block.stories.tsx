import type { Meta, StoryObj } from "@storybook/react";
import { MemberCardBlock } from "./member-card-block";
// @ts-expect-error Static brand asset; the portal supplies its own served copy.
import logoUrl from "../../../../brand/ppij-logo.png";
// @ts-expect-error Static brand asset; the portal supplies its own served copy.
import mapUrl from "../../../../brand/id-map.svg";

/**
 * The real member card: design from member-card.css, themes from
 * the real catalogue (../card-themes.ts, 27 themes). The artwork
 * PNGs are served by the portal at /card-themes/<id>.png; where
 * they are absent the face falls back to the theme base colour,
 * exactly as the app behaves on an artwork error. Tap the card (or
 * the Barcode button) to flip it; Ubah tema opens the real theme
 * picker.
 */
const meta: Meta<typeof MemberCardBlock> = {
  title: "Portal/MemberCardBlock",
  component: MemberCardBlock,
  args: {
    locale: "id",
    memberId: "PPIJ-2026-000123",
    name: "I Nyoman Darma Kotama",
    number: "PPIJ-2026-000123",
    komsat: "Okayama",
    korda: "PPI Kansai",
    validUntil: "2027-10-31",
    logoSrc: logoUrl,
    mapSrc: mapUrl,
  },
};
export default meta;
type Story = StoryObj<typeof MemberCardBlock>;

export const Active: Story = { args: { state: "active" } };
export const Expiring: Story = { args: { state: "expiring", validUntil: "2026-11-15" } };
export const ChangePending: Story = { args: { state: "change_pending" } };
export const ExpiredGrace: Story = { args: { state: "expired_grace", graceUntil: "2026-12-31" } };
export const Suspended: Story = { args: { state: "suspended", suspendReason: "Menunggu verifikasi dokumen" } };
