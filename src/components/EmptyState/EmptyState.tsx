import type { ComponentProps } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import Add01Icon from "@hugeicons/core-free-icons/Add01Icon"
import DiningTableIcon from "@hugeicons/core-free-icons/DiningTableIcon"
import { cn } from "../../lib/cn"
import { useSimulatorStore } from "../../store/simulatorStore"
import { Button } from "../Button/Button"

export type EmptyStateProps = ComponentProps<"div">

export function EmptyState(props: EmptyStateProps) {
  const { className, ...attrs } = props
  const addTable = useSimulatorStore((state) => state.addTable)

  return (
    <div
      {...attrs}
      className={cn("grid max-w-md h-fit justify-items-center text-center", className)}
    >

      <div className="mb-6 grid h-24 w-24 place-items-center rounded-3xl border border-dashed border-slate-950/15 bg-white text-slate-700">
        <HugeiconsIcon icon={DiningTableIcon} size={42} strokeWidth={1.7} />
      </div>
      <h2 className="text-xl font-[760] text-slate-900">Henüz masa yok</h2>
      <p className="mt-2 text-sm font-[520] leading-6 text-slate-500">
        Yerleşime başlamak için ilk masayı ekle. Kişileri sol panelden seçip masaya taşıyabilirsin.
      </p>
      <Button color="primary" className="mt-5" onClick={addTable}>
        <HugeiconsIcon icon={Add01Icon} size={18} />
        <span>Masa ekle</span>
      </Button>
    </div>
  );
}
