import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#111827] transition-all duration-200 placeholder:text-[#9ca3af] focus:border-[#0077b5] focus:outline-none focus:ring-2 focus:ring-[#0077b5]/20 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#f9fafb]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
