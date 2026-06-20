import { FormEvent, useState } from "react"
import type { ComponentProps } from "react"
import { cn } from "../../lib/cn"
import { useSimulatorStore } from "../../store/simulatorStore"
import type { Gender } from "../../types/simulator"
import { Button } from "../Button/Button"

export type PersonFormProps = Omit<ComponentProps<"form">, "onSubmit">

export function PersonForm(props: PersonFormProps) {
  const { className, ...attrs } = props
  const addPerson = useSimulatorStore((state) => state.addPerson)
  const [name, setName] = useState("")
  const [gender, setGender] = useState<Gender>("Bilinmiyor")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) return
    addPerson({ name, gender })
    setName("")
    setGender("Bilinmiyor")
  }

  return (
    <form
      {...attrs}
      className={cn("grid grid-cols-[1fr_104px_auto] gap-2", className)}
      onSubmit={handleSubmit}
    >
      <input className="field" value={name} onChange={(event) => setName(event.target.value)} placeholder="Yeni kişi adı" />
      <select className="field" value={gender} onChange={(event) => setGender(event.target.value as Gender)}>
        <option value="Bilinmiyor">Bilinmiyor</option>
        <option value="Kadın">Kadın</option>
        <option value="Erkek">Erkek</option>
      </select>
      <Button type="submit" color="primary">
        Ekle
      </Button>
    </form>
  );
}
