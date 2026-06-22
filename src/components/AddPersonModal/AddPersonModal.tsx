import { FormEvent, useEffect, useState } from "react"
import type { ComponentProps } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon"
import { cn } from "../../lib/cn"
import { useSimulatorStore } from "../../store/simulatorStore"
import type { Gender } from "../../types/simulator"
import { Button } from "../Button/Button"

export type AddPersonModalProps = ComponentProps<"div"> & {
  onClose: () => void
}

const genderOptions: Gender[] = ["Erkek", "Kadın"]

export function AddPersonModal(props: AddPersonModalProps) {
  const { onClose, className, ...attrs } = props
  const addPerson = useSimulatorStore((state) => state.addPerson)
  const [name, setName] = useState("")
  const [gender, setGender] = useState<Gender>("Erkek")

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) return
    addPerson({ name, gender })
    onClose()
  }

  return (
    <div
      {...attrs}
      className={cn("fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-6 backdrop-blur-sm", className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-person-title"
      onMouseDown={onClose}
    >
      <form className="grid w-full max-w-sm gap-4 rounded-[28px] border border-slate-950/10 bg-white/95 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl" onSubmit={handleSubmit} onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between gap-3">
          <h2 id="add-person-title" className="text-lg font-[760] text-slate-900">Kişi ekle</h2>
          <Button size="square" onClick={onClose} aria-label="Kapat">
            <HugeiconsIcon icon={Cancel01Icon} size={17} />
          </Button>
        </div>
        <label className="grid gap-2">
          <span className="text-sm font-[700] text-slate-500 lg:text-xs">İsim</span>
          <input className="field" value={name} onChange={(event) => setName(event.target.value)} placeholder="Kişi adı" autoFocus />
        </label>
        <div className="grid gap-2">
          <span className="text-sm font-[700] text-slate-500 lg:text-xs">Cinsiyet</span>
          <div className="grid grid-cols-2 rounded-2xl bg-slate-950/[0.04] p-1">
            {genderOptions.map((option) => (
              <Button
                key={option}
                size="small"
                className={cn(
                  gender === option
                    ? "bg-white px-2 text-sm font-[700] text-slate-900 shadow-sm shadow-slate-950/[0.04] lg:text-xs"
                    : "border-transparent bg-transparent px-2 text-sm font-[650] text-slate-500 shadow-none hover:border-transparent hover:bg-slate-950/[0.04] hover:text-slate-700 lg:text-xs",
                )}
                onClick={() => setGender(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
        <Button type="submit" color="primary">
          Ekle
        </Button>
      </form>
    </div>
  );
}
