import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"
import { Tabs as TabsPrimitive } from "radix-ui"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type TabsAppearance = "default" | "underline" | "segmented"

/**
 * The three tab rows the admin uses: the boxed default, the underlined queue and
 * page tabs, and the segmented mode and side switchers. `default` leaves the
 * list exactly as it shipped.
 */
const tabsAppearanceClass: Record<TabsAppearance, string> = {
  default: "",
  underline: "h-auto w-full justify-start gap-0 overflow-x-auto rounded-none border-b border-brand-border bg-transparent p-0 [scrollbar-width:thin] max-[600px]:[&>[data-slot=tabs-trigger]]:min-h-11 min-[600px]:[&>[data-slot=tabs-trigger]]:min-h-8",
  segmented: "h-auto w-full gap-[3px] rounded-[9px] bg-secondary p-[3px] max-[600px]:[&>[data-slot=tabs-trigger]]:min-h-11 min-[600px]:[&>[data-slot=tabs-trigger]]:min-h-8",
}

function TabsList({
  className,
  variant = "default",
  appearance = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants> & { appearance?: TabsAppearance }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      data-appearance={appearance}
      className={cn(tabsListVariants({ variant }), tabsAppearanceClass[appearance], className)}
      {...props}
    />
  )
}

/** Underline and segmented triggers; the default appearance keeps the shipped trigger. */
const underlineTrigger =
  "group-data-[appearance=underline]/tabs-list:h-auto group-data-[appearance=underline]/tabs-list:flex-none group-data-[appearance=underline]/tabs-list:gap-2 group-data-[appearance=underline]/tabs-list:rounded-none group-data-[appearance=underline]/tabs-list:border-b-2 group-data-[appearance=underline]/tabs-list:border-transparent group-data-[appearance=underline]/tabs-list:px-3 group-data-[appearance=underline]/tabs-list:py-0 group-data-[appearance=underline]/tabs-list:text-sm group-data-[appearance=underline]/tabs-list:font-bold group-data-[appearance=underline]/tabs-list:text-brand-muted group-data-[appearance=underline]/tabs-list:after:hidden group-data-[appearance=underline]/tabs-list:hover:text-brand-red group-data-[appearance=underline]/tabs-list:data-[state=active]:border-brand-red group-data-[appearance=underline]/tabs-list:data-[state=active]:bg-transparent group-data-[appearance=underline]/tabs-list:data-[state=active]:text-brand-red"

const segmentedTrigger =
  "group-data-[appearance=segmented]/tabs-list:h-auto group-data-[appearance=segmented]/tabs-list:rounded-[7px] group-data-[appearance=segmented]/tabs-list:bg-transparent group-data-[appearance=segmented]/tabs-list:px-3 group-data-[appearance=segmented]/tabs-list:text-[13px] group-data-[appearance=segmented]/tabs-list:font-semibold group-data-[appearance=segmented]/tabs-list:text-brand-muted group-data-[appearance=segmented]/tabs-list:after:hidden group-data-[appearance=segmented]/tabs-list:data-[state=active]:text-brand-ink group-data-[appearance=segmented]/tabs-list:data-[state=active]:shadow-[0_2px_6px_rgba(24,34,43,.08)]"

function TabsTrigger({
  className,
  count,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  /** Optional count beside the label; it joins the trigger's accessible name. */
  count?: number
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
        "data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        underlineTrigger,
        segmentedTrigger,
        className
      )}
      {...props}
    >
      {children}
      {count === undefined ? null : (
        <>
          <span className="sr-only">{`, ${count}`}</span>
          <span
            aria-hidden
            className={cn(
              "grid min-w-[18px] place-items-center rounded-full px-1.5 text-[11px] leading-[18px] font-bold",
              count === 0 ? "bg-secondary text-brand-muted" : "bg-brand-red/8 text-brand-red",
            )}
          >
            {count}
          </span>
        </>
      )}
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
