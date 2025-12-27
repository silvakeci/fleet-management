import type { SelectHTMLAttributes } from "react";
import { clsx } from "clsx";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export default function Select({ label, error, className, children, ...props }: Props) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        {...props}
        className={clsx(
          "w-full h-10 rounded-lg border px-3 text-sm bg-white outline-none transition",
          "focus:ring-1 focus:ring-black focus:border-black",
          error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300",
          className
        )}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
