import type { ComponentProps } from "react"
import { cn } from "../../lib/cn"

type ButtonSize = "normal" | "small" | "square"
type ButtonRounded = "full" | "default" | "none"
type ButtonColor = "primary" | "secondary" | "tertiary" | "danger"

export type ButtonProps = ComponentProps<"button"> & {
  color?: ButtonColor
  rounded?: ButtonRounded
  size?: ButtonSize
}

const baseClassName =
  "inline-flex items-center justify-center border shadow-sm transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"

const sizeClassNames: Record<ButtonSize, string> = {
  normal: "min-h-10 gap-2 px-3.5 text-sm font-[650]",
  small: "min-h-9 gap-1.5 px-3 text-sm font-[720]",
  square: "h-9 w-9 text-slate-500",
}

const roundedClassNames: Record<ButtonRounded, string> = {
  full: "rounded-full",
  default: "rounded-xl",
  none: "rounded-none",
}

const colorClassNames: Record<ButtonColor, string> = {
  primary:
    "border-blue-600 bg-blue-600 text-white shadow-blue-950/15 hover:border-blue-700 hover:bg-blue-700 hover:text-white",
  secondary:
    "border-slate-950 bg-slate-950 text-white shadow-slate-950/15 hover:border-slate-800 hover:bg-slate-800 hover:text-white",
  tertiary:
    "border-slate-950/10 bg-white/80 text-slate-700 shadow-slate-950/[0.03] hover:border-slate-950/15 hover:bg-white hover:text-slate-950",
  danger:
    "border-red-200/80 bg-red-50/90 text-red-700 shadow-red-950/[0.03] hover:border-red-200 hover:bg-red-100 hover:text-red-800",
}

export function Button(props: ButtonProps) {
  const { className, color = "tertiary", rounded = "default", size = "normal", type = "button", ...attrs } = props

  return (
    <button
      className={cn(baseClassName, sizeClassNames[size], roundedClassNames[rounded], colorClassNames[color], className)}
      type={type}
      {...attrs}
    />
  )
}
