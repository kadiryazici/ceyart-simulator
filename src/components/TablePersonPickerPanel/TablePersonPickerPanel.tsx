import type { ComponentProps } from "react"
import { cn } from "../../lib/cn"
import { getTableName } from "../../store/selectors"
import { useSimulatorStore } from "../../store/simulatorStore"
import { PersonRow } from "../PersonRow/PersonRow"
import { SearchInput } from "../SearchInput/SearchInput"
import { useState } from "react"

export type TablePersonPickerPanelProps = ComponentProps<"aside"> & {
  tableId: string
  onPick: (personId: string) => void
}

export function TablePersonPickerPanel(props: TablePersonPickerPanelProps) {
  const { tableId, onPick, className, ...attrs } = props
  const [query, setQuery] = useState("")
  const people = useSimulatorStore((state) => state.people)
  const tables = useSimulatorStore((state) => state.tables)
  const tableName = getTableName(tables, tableId)
  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR")

  const filteredPeople = people.filter((person) => {
    return !normalizedQuery || person.name.toLocaleLowerCase("tr-TR").includes(normalizedQuery)
  })

  return (
    <aside
      {...attrs}
      className={cn("grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] bg-white", className)}
    >
      <div className="sticky top-3 z-10 m-3 mb-0 grid gap-3 border-b border-b-slate-200 p-3">
        <div className="grid gap-1">
          <span className="text-[15px] font-[720] text-slate-900">Kişi ekle</span>
          <span className="text-xs font-[700] text-slate-500">{tableName}</span>
        </div>
        <SearchInput value={query} onValueChange={setQuery} />
      </div>

      <div className="min-h-0 overflow-auto">
        {filteredPeople.length ? (
          filteredPeople.map((person, index) => (
            <div key={person.id}>
              {index > 0 ? <div className="h-px w-full bg-slate-950/10" /> : null}
              <PersonRow
                actions={false}
                draggable={false}
                person={person}
                className="cursor-pointer grid-cols-1"
                onClick={() => onPick(person.id)}
              />
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-sm font-medium text-slate-500">Kişi bulunamadı.</p>
        )}
      </div>
    </aside>
  )
}
