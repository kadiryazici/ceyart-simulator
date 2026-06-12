import { FormEvent, useState } from "react";
import { useSimulatorStore } from "../../store/simulatorStore";
import type { Gender } from "../../types/simulator";

export function PersonForm() {
  const addPerson = useSimulatorStore((state) => state.addPerson);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("—");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    addPerson({ name, gender });
    setName("");
    setGender("—");
  };

  return (
    <form className="grid grid-cols-[1fr_104px_auto] gap-2 max-sm:grid-cols-1" onSubmit={handleSubmit}>
      <input className="field" value={name} onChange={(event) => setName(event.target.value)} placeholder="Yeni kişi adı" />
      <select className="field" value={gender} onChange={(event) => setGender(event.target.value as Gender)}>
        <option value="—">Belirsiz</option>
        <option value="Kadın">Kadın</option>
        <option value="Erkek">Erkek</option>
      </select>
      <button type="submit" className="btn-primary">
        Ekle
      </button>
    </form>
  );
}
