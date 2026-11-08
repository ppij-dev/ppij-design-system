import type { Meta, StoryObj } from "@storybook/react";
import { BannerCarousel } from "./banner-carousel";
import { SAMPLE_BANNERS } from "../sample-banners";

const meta: Meta<typeof BannerCarousel> = {
  title: "Portal/BannerCarousel",
  component: BannerCarousel,
  argTypes: {
    banners: { control: "object" },
    locale: { control: "select", options: ["id", "en"] },
  },
};
export default meta;
type Story = StoryObj<typeof BannerCarousel>;

export const Live: Story = { args: { banners: SAMPLE_BANNERS } };
export const Single: Story = { args: { banners: [SAMPLE_BANNERS[1]] } };
export const NoneActive: Story = { args: { banners: SAMPLE_BANNERS.map((b) => ({ ...b, end: "2020-01-01" })) } };

export const Playground: Story = {
  args: { banners: SAMPLE_BANNERS, locale: "id" },
};
