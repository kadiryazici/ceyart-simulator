import { useState } from "react"
import type { ComponentProps } from "react"
import { cn } from "../../lib/cn"
import { getTableName } from "../../store/selectors"
import { useSimulatorStore } from "../../store/simulatorStore"
import type { Person } from "../../types/simulator"
import { CardActions } from "../CardActions/CardActions"
import { EditPersonModal } from "../EditPersonModal/EditPersonModal"

export type PersonRowProps = ComponentProps<"article"> & {
  person: Person
  actions?: boolean
  onDragStarted?: () => void
  onDragEnded?: (personId: string, point: { x: number; y: number }) => void
}

export function PersonRow(props: PersonRowProps) {
  const {
    person,
    actions = true,
    draggable = true,
    onDragStarted,
    onDragEnded,
    className,
    ...attrs
  } = props
  const tables = useSimulatorStore((state) => state.tables)
  const deletePerson = useSimulatorStore((state) => state.deletePerson)

  const [isEditPersonOpen, setIsEditPersonOpen] = useState(false)

  const tableName = getTableName(tables, person.tableId)

  const statusText = tableName
    ? `Masada: ${tableName}`
    : "Masasız"

  const handleEditOpen = () => {
    setIsEditPersonOpen(true)
  }

  const handleDelete = () => {
    if (window.confirm(`${person.number}. ${person.name} silinsin mi?`)) {
      deletePerson(person.id)
    }
  }

  return (
    <>
      <article
        {...attrs}
        className={cn(
          "rounded-lg group relative grid hover:bg-gray-100 grid-cols-[auto_1fr] items-center gap-3 px-3 py-3 transition",
          draggable ? "active:cursor-grabbing" : "active:cursor-pointer",
          className,
        )}
        draggable={draggable}
        onDragStart={(event) => {
          if (!draggable) return
          event.dataTransfer.effectAllowed = "move"
          event.dataTransfer.setData("text/plain", person.id)
          onDragStarted?.()
        }}
        onDragEnd={(event) => {
          if (!draggable) return
          onDragEnded?.(person.id, {
            x: event.clientX,
            y: event.clientY,
          })
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "shrink-0 flex h-10 w-10 items-center justify-center rounded-full border border-slate-950/10 bg-slate-950/[0.04] text-sm font-[720] text-slate-600",
              person.tableId != null && "bg-green-200 text-green-900 border-green-300"
            )}>
            {person.number}
          </span>

          <div className={cn("grid min-w-0 gap-0.5")}>
            <strong className="break-words text-sm font-[720] text-slate-900">{person.name}</strong>
            <span className="text-xs font-[620] text-slate-500">{person.gender}</span>
            <span className="break-words text-xs font-[680] text-slate-500">{statusText}</span>
          </div>
        </div>

        {actions ? (
          <CardActions
            className="ml-auto opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
            draggable={false}
            onEdit={handleEditOpen}
            onDelete={handleDelete}
            onClick={(event) => event.stopPropagation()}
          />
        ) : null}
      </article>
      {isEditPersonOpen ? <EditPersonModal person={person} onClose={() => setIsEditPersonOpen(false)} /> : null}
    </>
  )
}
