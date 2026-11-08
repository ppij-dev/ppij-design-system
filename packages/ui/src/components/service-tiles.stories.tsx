import type { Meta, StoryObj } from "@storybook/react";
import { IconSchool, IconUsers, IconCalendar } from "@tabler/icons-react";
import { ServiceTiles } from "./service-tiles";

const meta: Meta<typeof ServiceTiles> = { title: "Portal/ServiceTiles", component: ServiceTiles,
  argTypes: {
    groups: { control: "object" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof ServiceTiles>;

export const Groups: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <ServiceTiles
        groups={[
          { heading: "Layanan nasional", icon: <IconSchool className="size-5" />, tiles: [{ title: "Pemira 2026", href: "#" }, { title: "Informasi beasiswa", href: "#" }, { title: "Layanan konsuler", href: "#" }] },
          { heading: "Korda Kansai", icon: <IconUsers className="size-5" />, tiles: [{ title: "Musyawarah wilayah", href: "#" }] },
          { heading: "Komsat Okayama", icon: <IconCalendar className="size-5" />, tiles: [], emptyText: "Belum ada layanan dari Komsat Okayama." },
        ]}
      />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    groups: [
      { heading: "Layanan nasional", icon: <IconSchool className="size-5" />, tiles: [{ title: "Pemira 2026", href: "#" }, { title: "Informasi beasiswa", href: "#" }] },
      { heading: "Komsat Okayama", icon: <IconCalendar className="size-5" />, tiles: [], emptyText: "Belum ada layanan dari Komsat Okayama." },
    ],
  },
};
