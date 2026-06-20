import type { ComponentProps } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon"
import Delete02Icon from "@hugeicons/core-free-icons/Delete02Icon"
import { cn } from "../../lib/cn"
import { getTablePeople } from "../../store/selectors"
import { useSimulatorStore } from "../../store/simulatorStore"
import type { Table } from "../../types/simulator"
import { Button } from "../Button/Button"

export type TableCardProps = ComponentProps<"article"> & {
  table: Table
}

export function TableCard(props: TableCardProps) {
  const { table, className, ...attrs } = props
  const people = useSimulatorStore((state) => state.people)
  const selectedPersonId = useSimulatorStore((state) => state.selectedPersonId)
  const seatPerson = useSimulatorStore((state) => state.seatPerson)
  const removeFromTable = useSimulatorStore((state) => state.removeFromTable)
  const updateTableName = useSimulatorStore((state) => state.updateTableName)
  const deleteTable = useSimulatorStore((state) => state.deleteTable)
  const seated = getTablePeople(people, table.id)

  const handleSeatSelected = () => {
    if (selectedPersonId) {
      seatPerson(selectedPersonId, table.id)
    }
  }

  return (
    <article
      {...attrs}
      className={cn(
        "grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-3xl border bg-white/82 shadow-sm shadow-slate-950/[0.04] backdrop-blur",
        selectedPersonId ? "border-slate-900/20 ring-4 ring-slate-950/[0.04]" : "border-slate-950/10",
        className,
      )}
      onClick={handleSeatSelected}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        seatPerson(event.dataTransfer.getData("text/plain"), table.id)
      }}
    >
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-slate-950/10 bg-slate-950/[0.02] px-4 py-3.5">
        <input className="min-w-0 bg-transparent text-[15px] font-[720] text-slate-900 outline-none" value={table.name} onClick={(event) => event.stopPropagation()} onChange={(event) => updateTableName(table.id, event.target.value)} />
        <span className="rounded-full border border-slate-950/10 bg-white px-2.5 py-1 text-xs font-[700] text-slate-600 shadow-sm shadow-slate-950/[0.03]">{seated.length}</span>
        <Button size="square" color="danger" title="Masayı kaldır" onClick={(event) => { event.stopPropagation(); deleteTable(table.id); }}>
          <HugeiconsIcon icon={Delete02Icon} size={16} />
        </Button>
      </div>
      <ul className="min-h-0 space-y-2 overflow-auto p-3.5">
        {seated.length ? (
          seated.map((person) => (
            <li key={person.id} className="grid min-h-11 grid-cols-[1fr_auto] items-center gap-2 rounded-2xl border border-slate-950/10 bg-white/80 px-3 py-2 shadow-sm shadow-slate-950/[0.03]">
              <strong className="break-words text-sm font-[700] text-slate-900">
                <span className="mr-2 inline-flex h-6 min-w-8 items-center justify-center rounded-full bg-slate-950/[0.05] px-2 text-xs font-[700] text-slate-600">{person.number}</span>
                {person.name}
              </strong>
              <Button size="square" color="danger" title="Masadan al" onClick={(event) => { event.stopPropagation(); removeFromTable(person.id); }}>
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </Button>
            </li>
          ))
        ) : (
          <li className="py-10 text-center text-sm font-[560] text-slate-400">Boş</li>
        )}
      </ul>
    </article>
  );
}
