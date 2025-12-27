import type { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2",
        {
          "bg-black text-white hover:bg-gray-900 focus:ring-black":
            variant === "primary",
          "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300":
            variant === "secondary",
          "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600":
            variant === "danger",
          "bg-transparent hover:bg-gray-100 text-gray-700":
            variant === "ghost",

          "h-8 px-3 text-sm": size === "sm",
          "h-10 px-4 text-sm": size === "md",
          "h-12 px-6 text-base": size === "lg",

          "opacity-50 cursor-not-allowed": disabled || loading,
        },
        className
      )}
    >
      {loading && (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
      {children}
    </button>
  );
}
