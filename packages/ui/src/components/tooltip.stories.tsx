import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";
import { Button } from "./button";
import { IconSend } from "@tabler/icons-react";

type TooltipArgs = React.ComponentProps<typeof Tooltip> & {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
};
const meta: Meta<TooltipArgs> = {
  title: "Portal/Tooltip",
  component: Tooltip,
  argTypes: {
    open: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    delayDuration: { control: "number" },
    disableHoverableContent: { control: "boolean" },
    onOpenChange: { action: "openChanged" },
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
    sideOffset: { control: "number" },
  },
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline" aria-label="Kirim undangan"><IconSend size={18} /></Button>
        </TooltipTrigger>
        <TooltipContent>Kirim undangan</TooltipContent>
      </Tooltip>
      <p style={{ fontSize: 12, color: "#5b6168" }}>Hover the button to see the tooltip.</p>
    </TooltipProvider>
  ),
};

export const Playground: StoryObj<TooltipArgs> = {
  args: { defaultOpen: false, delayDuration: 0, side: "top", align: "center", sideOffset: 4 },
  render: function Render({ open, defaultOpen, onOpenChange, side, align, sideOffset, ...root }) {
    const [isOpen, setIsOpen] = React.useState(open ?? defaultOpen ?? false);
    React.useEffect(() => {
      if (open !== undefined) setIsOpen(open);
    }, [open]);
    return (
      <TooltipProvider>
        <Tooltip
          {...root}
          open={isOpen}
          onOpenChange={(next) => {
            setIsOpen(next);
            onOpenChange?.(next);
          }}
        >
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline" aria-label="Kirim undangan"><IconSend size={18} /></Button>
          </TooltipTrigger>
          <TooltipContent side={side} align={align} sideOffset={sideOffset}>Kirim undangan</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
};
