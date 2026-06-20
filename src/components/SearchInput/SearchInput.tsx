import type { ComponentProps } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon"
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon"
import { cn } from "../../lib/cn"
import { Button } from "../Button/Button"

export type SearchInputProps = Omit<ComponentProps<"input">, "onChange" | "value"> & {
  onValueChange: (value: string) => void
  value: string
}

export function SearchInput(props: SearchInputProps) {
  const { className, onValueChange, placeholder = "Kişi ara", value, ...attrs } = props

  return (
    <div
      className={cn(
        "grid min-h-10 grid-cols-[auto_1fr_auto] items-center gap-2 rounded-2xl bg-slate-950/[0.045] px-2.5 shadow-[inset_0_1px_2px_rgba(15,23,42,0.08),inset_0_0_0_1px_rgba(15,23,42,0.04)] transition focus-within:bg-slate-950/[0.035] focus-within:ring-4 focus-within:ring-slate-950/[0.04]",
        className,
      )}
    >
      <HugeiconsIcon icon={Search01Icon} size={17} className="text-slate-400" />
      <input
        {...attrs}
        className="min-w-0 bg-transparent text-sm font-[560] text-slate-900 outline-none placeholder:text-slate-400"
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
      {value ? (
        <Button
          size="square"
          className="h-7 w-7 border-transparent bg-transparent text-slate-400 shadow-none hover:border-transparent hover:bg-slate-950/[0.05] hover:text-slate-700"
          aria-label="Aramayı temizle"
          onClick={() => onValueChange("")}
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} />
        </Button>
      ) : (
        <span className="h-7 w-7" aria-hidden="true" />
      )}
    </div>
  );
}
