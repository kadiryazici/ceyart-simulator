import { FormEvent, useState } from "react"
import type { ComponentProps, SubmitEventHandler } from "react"
import { cn } from "../../lib/cn"
import { getTableName } from "../../store/selectors"
import { useSimulatorStore } from "../../store/simulatorStore"
import type { Gender, Person } from "../../types/simulator"
import { Button } from "../Button/Button"
import { CardActions } from "../CardActions/CardActions"

export type PersonRowProps = ComponentProps<"article"> & {
  person: Person
}

export function PersonRow(props: PersonRowProps) {
  const { person, className, ...attrs } = props
  const tables = useSimulatorStore((state) => state.tables)
  const updatePerson = useSimulatorStore((state) => state.updatePerson)
  const deletePerson = useSimulatorStore((state) => state.deletePerson)

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(person.name)
  const [gender, setGender] = useState<Gender>(person.gender)

  const tableName = getTableName(tables, person.tableId)

  const statusText = tableName
    ? `Masada: ${tableName}`
    : "Masasız"

  const handleSave: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    updatePerson(person.id, { name, gender })
    setIsEditing(false)
  }

  const handleEditOpen = () => {
    setName(person.name)
    setGender(person.gender)
    setIsEditing(true)
  }

  const handleDelete = () => {
    if (window.confirm(`${person.number}. ${person.name} silinsin mi?`)) {
      deletePerson(person.id)
    }
  }

  if (isEditing) {
    return (
      <form className="mb-2 grid gap-2 bg-white p-3 shadow-sm shadow-slate-950/[0.04]" onSubmit={handleSave}>
        <input className="field" value={name} onChange={(event) => setName(event.target.value)} />
        <div className="grid grid-cols-[1fr_auto_auto] gap-2">
          <select className="field" value={gender} onChange={(event) => setGender(event.target.value as Gender)}>
            <option value="Bilinmiyor">Bilinmiyor</option>
            <option value="Kadın">Kadın</option>
            <option value="Erkek">Erkek</option>
          </select>
          <Button type="submit" color="primary">Kaydet</Button>
          <Button onClick={() => setIsEditing(false)}>Vazgeç</Button>
        </div>
      </form>
    )
  }

  return (
    <article
      {...attrs}
      className={cn(
        "rounded-lg group relative grid hover:bg-gray-100 grid-cols-[auto_1fr] items-center gap-3 px-3 py-3 transition  active:cursor-grabbing",
        className,
      )}
      draggable
      onDragStart={(event) => event.dataTransfer.setData("text/plain", person.id)}
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

      <CardActions
        className="ml-auto opacity-0 group-hover:opacity-100"
        draggable={false}
        onEdit={handleEditOpen}
        onDelete={handleDelete}
        onClick={(event) => event.stopPropagation()}
      />
    </article>
  )
}
