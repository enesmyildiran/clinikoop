"use client";
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ checked, onCheckedChange, disabled, children, className, ...props }, ref) => (
    <label className={cn("inline-flex items-center gap-2 cursor-pointer select-none", disabled && "opacity-50 cursor-not-allowed", className)}>
      <CheckboxPrimitive.Root
        ref={ref}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          "w-5 h-5 rounded border border-gray-300 bg-white flex items-center justify-center transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none",
          checked ? "bg-blue-600 border-blue-600" : "hover:border-blue-400",
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="text-white">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
            <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {children && <span>{children}</span>}
    </label>
  )
);
Checkbox.displayName = "Checkbox"; 