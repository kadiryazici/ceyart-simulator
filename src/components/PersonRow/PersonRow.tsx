import { FormEvent, useState } from "react"
import type { ComponentProps } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon"
import CircleIcon from "@hugeicons/core-free-icons/CircleIcon"
import Delete02Icon from "@hugeicons/core-free-icons/Delete02Icon"
import Edit02Icon from "@hugeicons/core-free-icons/Edit02Icon"
import { cn } from "../../lib/cn"
import { getTableName } from "../../store/selectors"
import { useSimulatorStore } from "../../store/simulatorStore"
import type { Gender, Person } from "../../types/simulator"
import { Button } from "../Button/Button"

export type PersonRowProps = ComponentProps<"article"> & {
  person: Person
}

export function PersonRow(props: PersonRowProps) {
  const { person, className, ...attrs } = props
  const tables = useSimulatorStore((state) => state.tables)
  const selectedPersonId = useSimulatorStore((state) => state.selectedPersonId)
  const toggleArrived = useSimulatorStore((state) => state.toggleArrived)
  const selectPerson = useSimulatorStore((state) => state.selectPerson)
  const updatePerson = useSimulatorStore((state) => state.updatePerson)
  const deletePerson = useSimulatorStore((state) => state.deletePerson)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(person.name)
  const [gender, setGender] = useState<Gender>(person.gender)
  const tableName = getTableName(tables, person.tableId)
  const tableNote = tableName ? `${tableName} masasında` : person.arrived ? "Masaya alınmadı" : "Gelmedi"

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updatePerson(person.id, { name, gender })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm(`${person.number}. ${person.name} silinsin mi?`)) {
      deletePerson(person.id)
    }
  }

  if (isEditing) {
    return (
      <form className="mb-2 grid gap-2 rounded-2xl border border-slate-950/10 bg-white p-3 shadow-sm shadow-slate-950/[0.04]" onSubmit={handleSave}>
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
        "mb-2 grid min-h-[72px] cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border p-3 transition",
        selectedPersonId === person.id
          ? "border-slate-900/15 bg-white shadow-sm shadow-slate-950/[0.05]"
          : "border-transparent bg-transparent hover:border-slate-950/10 hover:bg-white/75",
        person.tableId && "opacity-65",
        className,
      )}
      draggable={person.arrived && !person.tableId}
      onClick={() => selectPerson(person.id)}
      onDragStart={(event) => event.dataTransfer.setData("text/plain", person.id)}
    >
      <Button
        size="square"
        className={cn(
          person.arrived
            ? "h-8 w-8 border-emerald-200/80 bg-emerald-50 text-emerald-700 shadow-emerald-950/[0.04] hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            : "h-8 w-8 bg-white/75 text-transparent hover:bg-white",
        )}
        title="Geldi"
        onClick={(event) => { event.stopPropagation(); toggleArrived(person.id) }}
      >
        <HugeiconsIcon icon={person.arrived ? CheckmarkCircle02Icon : CircleIcon} size={17} />
      </Button>
      <div className="min-w-0">
        <strong className="break-words text-sm font-[720] text-slate-900">
          <span className="mr-2 inline-flex h-6 min-w-8 items-center justify-center rounded-full border border-slate-950/10 bg-slate-950/[0.04] px-2 text-xs font-[700] text-slate-600">{person.number}</span>
          {person.name}
        </strong>
        <div className="mt-1 flex flex-wrap gap-2 text-xs font-[620] text-slate-500">
          <span className="rounded-full bg-slate-950/[0.04] px-2 py-1">{person.gender}</span>
          <span>{person.arrived ? "Geldi" : "Bekleniyor"}</span>
        </div>
        <span className="mt-1 block break-words text-xs font-[680] text-slate-500">{tableNote}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-[700] text-slate-500">{tableName || "Seç"}</span>
        <Button size="square" title="Düzenle" onClick={(event) => { event.stopPropagation(); setName(person.name); setGender(person.gender); setIsEditing(true) }}>
          <HugeiconsIcon icon={Edit02Icon} size={16} />
        </Button>
        <Button size="square" color="danger" title="Sil" onClick={(event) => { event.stopPropagation(); handleDelete() }}>
          <HugeiconsIcon icon={Delete02Icon} size={16} />
        </Button>
      </div>
    </article>
  )
}
