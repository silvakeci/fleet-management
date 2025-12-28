import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { clsx } from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
};

export default function Input({
  label,
  error,
  type = "text",
  showPasswordToggle = false,
  className,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const canTogglePassword = type === "password" && showPasswordToggle;

  return (
    <div className="space-y-1">
      {label ? (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      ) : null}

      <div className="relative">
        <input
          {...props}
          type={canTogglePassword && showPassword ? "text" : type}
          className={clsx(
            "w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition",
            "focus:ring-1 focus:ring-black focus:border-black",
            error
              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300",
            canTogglePassword ? "pr-14" : undefined,
            className
          )}
        />

        {canTogglePassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 px-3 text-xs text-gray-500 hover:text-black"
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        ) : null}
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
