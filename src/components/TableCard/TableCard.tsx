import type { ComponentProps } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon"
import Delete02Icon from "@hugeicons/core-free-icons/Delete02Icon"
import { cn } from "../../lib/cn"
import { getTablePeople } from "../../store/selectors"
import { useSimulatorStore } from "../../store/simulatorStore"
import type { Table } from "../../types/simulator"
import { Button } from "../Button/Button"
import MoreVerticalIcon from "@hugeicons/core-free-icons/MoreVerticalIcon"
import { Menu } from "@base-ui/react/menu"

export type TableCardProps = ComponentProps<"article"> & {
  table: Table
}

export function TableCard(props: TableCardProps) {
  const { table, className, ...attrs } = props

  const people = useSimulatorStore((state) => state.people)
  const seatPerson = useSimulatorStore((state) => state.seatPerson)
  const removeFromTable = useSimulatorStore((state) => state.removeFromTable)
  const updateTableName = useSimulatorStore((state) => state.updateTableName)
  const deleteTable = useSimulatorStore((state) => state.deleteTable)
  const seated = getTablePeople(people, table.id)

  return (
    <article
      {...attrs}
      className={cn(
        "grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-3xl border border-slate-300 bg-white/82 shadow-sm shadow-slate-950/[0.04] backdrop-blur",
        className,
      )}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        seatPerson(event.dataTransfer.getData("text/plain"), table.id)
      }}
    >
      <div className="flex flex-row justify-start items-center gap-2 border-b border-slate-950/10 bg-slate-950/[0.02] px-4 py-3.5">
        <input className="min-w-0 mr-auto bg-transparent text-[15px] font-[720] text-slate-900 outline-none" value={table.name} onClick={(event) => event.stopPropagation()} onChange={(event) => updateTableName(table.id, event.target.value)} />
        <span className="rounded-full border border-slate-950/10 bg-white px-2.5 py-1 text-xs font-[700] text-slate-600 shadow-sm shadow-slate-950/[0.03]">{seated.length}</span>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button size="square" color="ghost" className="p-2" aria-label="Daha fazla seçenek">
                <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
              </Button>
            }
          />

          <Menu.Portal>
            <Menu.Positioner className="z-[100]" sideOffset={8} align="end">
              <Menu.Popup className="menu-popup">
                <Menu.Item closeOnClick={false} className="menu-item">
                  Kadın: {seated.filter(p => p.gender === "Kadın").length}
                </Menu.Item>

                <Menu.Item closeOnClick={false} className="menu-item">
                  Erkek: {seated.filter(p => p.gender === "Erkek").length}
                </Menu.Item>

                <Menu.Separator className="menu-separator" />

                <Menu.Item
                  onClick={() => {
                    if (window.confirm(`${table.name} silinsin mi?`)) {
                      deleteTable(table.id)
                    }
                  }}
                  className="menu-item text-red-700"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={16} />
                  <span>Masayı sil</span>
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>
      <ul className="min-h-0 space-y-2 overflow-auto p-3.5">
        {seated.length ? (
          seated.map((person) => (
            <li
              key={person.id}
              className="group/TableRow grid min-h-11 cursor-grab grid-cols-[1fr_auto] items-center gap-2 rounded-2xl border border-slate-950/10 bg-gray-50 px-3 py-2 shadow-md shadow-slate-950/[0.03] active:cursor-grabbing"
              draggable
              onDragStart={(event) => {
                event.stopPropagation()
                event.dataTransfer.setData("text/plain", person.id)
              }}
            >
              <strong className="flex flex-row gap-2 items-center break-words text-sm font-[700] text-slate-900">
                <span className="size-6 shrink-0 flex items-center justify-center rounded-full bg-slate-950/[0.1] px-2 text-xs font-[700] text-slate-600">{person.number}</span>
                <span>{person.name}</span>
              </strong>
              <Button className="size-fit p-2 opacity-0 group-hover/TableRow:opacity-100" size="square" color="danger" title="Masadan al" onClick={(event) => { event.stopPropagation(); removeFromTable(person.id); }}>
                <HugeiconsIcon icon={Cancel01Icon} size={12} />
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
