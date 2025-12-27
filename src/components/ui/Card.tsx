import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({ className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={clsx(
        "rounded-2xl border bg-white shadow-sm",
        className
      )}
    />
  );
}
