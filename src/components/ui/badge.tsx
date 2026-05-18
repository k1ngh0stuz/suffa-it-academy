import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        cyan: "bg-brand-cyan/15 text-brand-cyan ring-1 ring-brand-cyan/30",
        indigo: "bg-brand-indigo/15 text-brand-indigo ring-1 ring-brand-indigo/30",
        green: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
        yellow: "bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30",
        red: "bg-red-500/15 text-red-400 ring-1 ring-red-500/30",
        gray: "bg-white/10 text-slate-400 ring-1 ring-white/10",
      },
    },
    defaultVariants: { variant: "cyan" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
