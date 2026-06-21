import type { ComponentProps } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import Delete02Icon from "@hugeicons/core-free-icons/Delete02Icon"
import Edit02Icon from "@hugeicons/core-free-icons/Edit02Icon"
import { cn } from "../../lib/cn"

export type CardActionsProps = ComponentProps<"div"> & {
  onEdit: () => void
  onDelete: () => void
}

export function CardActions(props: CardActionsProps) {
  const { onEdit, onDelete, className, ...attrs } = props

  return (
    <div
      {...attrs}
      className={cn(
        "flex items-stretch divide-x divide-slate-950/10 overflow-hidden rounded-lg border border-slate-950/10 bg-white/95 text-xs shadow-md shadow-slate-950/15 backdrop-blur",
        className,
      )}
    >
      <button
        type="button"
        className="flex h-6 w-7 items-center justify-center text-slate-500 transition hover:bg-slate-950/[0.05] hover:text-slate-800"
        title="Düzenle"
        onClick={onEdit}
      >
        <HugeiconsIcon icon={Edit02Icon} size={13} />
      </button>
      <button
        type="button"
        className="flex h-6 w-7 items-center justify-center text-red-600 transition hover:bg-red-50 hover:text-red-700"
        title="Sil"
        onClick={onDelete}
      >
        <HugeiconsIcon icon={Delete02Icon} size={13} />
      </button>
    </div>
  )
}
