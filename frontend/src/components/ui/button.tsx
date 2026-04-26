import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Wise-inspired pill button (DESIGN.md §4).
 * - default: lime green (#9fe870) bg, dark green (#163300) text, pill radius, scale-on-hover
 * - subtle: translucent dark-green bg, foreground text, pill
 * - Physical scale(1.05) hover, scale(0.95) active on all variants
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-semibold outline-none select-none transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.05] active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[#b0f086]",
        subtle:
          "bg-[rgba(22,51,0,0.08)] text-foreground hover:bg-[rgba(22,51,0,0.12)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[#d5f0c1]",
        outline:
          "border border-[rgba(14,15,12,0.12)] bg-background text-foreground hover:bg-muted",
        ghost: "text-foreground hover:bg-muted",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-[#b82a30]",
        link: "text-primary-foreground underline-offset-4 hover:underline hover:scale-100 active:scale-100",
      },
      size: {
        default: "h-11 rounded-full px-5 text-[15px] has-[>svg]:px-4",
        sm: "h-9 rounded-full px-4 text-sm has-[>svg]:px-3",
        xs: "h-7 rounded-full px-3 text-xs has-[>svg]:px-2",
        lg: "h-12 rounded-full px-6 text-base has-[>svg]:px-5",
        xl: "h-14 rounded-full px-8 text-base has-[>svg]:px-6",
        icon: "size-11 rounded-full",
        "icon-sm": "size-9 rounded-full",
        "icon-lg": "size-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
