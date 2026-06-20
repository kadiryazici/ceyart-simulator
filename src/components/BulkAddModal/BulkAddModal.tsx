import { FormEvent, useMemo, useState } from "react"
import type { ComponentProps } from "react"
import { cn } from "../../lib/cn"
import { useSimulatorStore } from "../../store/simulatorStore"
import { Button } from "../Button/Button"

export type BulkAddModalProps = ComponentProps<"div"> & {
  onClose: () => void
}

export function BulkAddModal(props: BulkAddModalProps) {
  const { onClose, className, ...attrs } = props
  const addPeopleFromLines = useSimulatorStore((state) => state.addPeopleFromLines)
  const [value, setValue] = useState("")
  const candidateCount = useMemo(
    () => value.split("\n").map((line) => line.trim()).filter(Boolean).length,
    [value],
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const added = addPeopleFromLines(value.split("\n"))
    if (added) {
      setValue("")
      onClose()
    }
  }

  return (
    <div
      {...attrs}
      className={cn("fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4", className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-add-title"
    >
      <form className="grid w-full max-w-xl gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-2xl" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="bulk-add-title" className="text-lg font-bold">Listeden ekle</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">Her satır yeni bir katılımcı olarak eklenir. Cinsiyet için: İsim - Kadın/Erkek.</p>
          </div>
          <Button size="square" onClick={onClose} aria-label="Kapat">×</Button>
        </div>
        <textarea
          className="min-h-72 resize-y rounded-lg border border-slate-300 bg-white p-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={"Elif Arslan - Kadın\nKadir Yazıcı - Erkek\nZeynep X"}
          autoFocus
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-slate-500">{candidateCount} kişi eklenecek</span>
          <div className="flex gap-2">
            <Button onClick={onClose}>Vazgeç</Button>
            <Button type="submit" color="primary" disabled={!candidateCount}>Ekle</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
