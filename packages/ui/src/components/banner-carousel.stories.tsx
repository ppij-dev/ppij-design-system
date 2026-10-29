import type { Meta, StoryObj } from "@storybook/react";
import { BannerCarousel } from "./banner-carousel";
import { SAMPLE_BANNERS } from "../sample-banners";

const meta: Meta<typeof BannerCarousel> = { title: "Portal/BannerCarousel", component: BannerCarousel };
export default meta;
type Story = StoryObj<typeof BannerCarousel>;

export const Live: Story = { args: { banners: SAMPLE_BANNERS } };
export const Single: Story = { args: { banners: [SAMPLE_BANNERS[1]] } };
export const NoneActive: Story = { args: { banners: SAMPLE_BANNERS.map((b) => ({ ...b, end: "2020-01-01" })) } };
