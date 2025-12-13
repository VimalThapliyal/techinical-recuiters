import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring min-h-[44px] min-w-[44px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[#0077b5] text-white hover:bg-[#004182] active:scale-[0.98] font-semibold shadow-sm hover:shadow-md",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 active:scale-[0.98] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 shadow-sm",
        outline:
          "border border-[#e5e7eb] bg-white text-[#111827] hover:bg-[#f9fafb] hover:border-[#0077b5] active:scale-[0.98] font-medium shadow-sm [&.text-white]:!text-white [&.text-white]:!border-white",
        secondary:
          "bg-[#f9fafb] text-[#111827] hover:bg-[#f3f4f6] active:scale-[0.98] font-medium border border-[#e5e7eb]",
        ghost:
          "hover:bg-[#f9fafb] text-[#111827] active:scale-[0.98] font-medium",
        link: "text-[#0077b5] underline-offset-4 hover:underline font-medium p-0 min-h-0 min-w-0",
      },
      size: {
        default: "h-11 px-4 py-2.5 has-[>svg]:px-3",
        sm: "h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 min-h-[36px]",
        lg: "h-12 rounded-lg px-6 has-[>svg]:px-4 min-h-[48px] text-base",
        icon: "size-11",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  const Comp = asChild ? Slot : "button";

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
