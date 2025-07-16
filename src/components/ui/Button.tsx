import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Boyutlar
          size === "sm" && "px-3 py-1.5 text-sm rounded-md",
          size === "md" && "px-4 py-2 text-base rounded-lg",
          size === "lg" && "px-6 py-3 text-lg rounded-xl",
          size === "icon" && "w-9 h-9 p-0 flex items-center justify-center rounded-full",
          // Varyantlar
          variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
          variant === "secondary" && "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300",
          variant === "outline" && "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50",
          variant === "ghost" && "bg-transparent text-gray-600 hover:bg-gray-100",
          "font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button"; 