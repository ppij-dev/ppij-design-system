import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../src/docs/*.mdx", "../src/components/*.stories.tsx"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-docs"],
  framework: { name: "@storybook/react-vite", options: {} },
  staticDirs: ["../public"],
  viteFinal: async (config) => {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    return config;
  },
};
export default config;
