import { FormEvent, useState } from "react";
import { getTableName } from "../../store/selectors";
import { useSimulatorStore } from "../../store/simulatorStore";
import type { Gender, Person } from "../../types/simulator";

type PersonRowProps = {
  person: Person;
};

export function PersonRow({ person }: PersonRowProps) {
  const tables = useSimulatorStore((state) => state.tables);
  const selectedPersonId = useSimulatorStore((state) => state.selectedPersonId);
  const toggleArrived = useSimulatorStore((state) => state.toggleArrived);
  const toggleSpent = useSimulatorStore((state) => state.toggleSpent);
  const selectPerson = useSimulatorStore((state) => state.selectPerson);
  const updatePerson = useSimulatorStore((state) => state.updatePerson);
  const deletePerson = useSimulatorStore((state) => state.deletePerson);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(person.name);
  const [gender, setGender] = useState<Gender>(person.gender);
  const tableName = getTableName(tables, person.tableId);
  const tableNote = tableName ? `${tableName} masasında` : person.arrived ? "Masaya alınmadı" : "Gelmedi";

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updatePerson(person.id, { name, gender });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`${person.number}. ${person.name} silinsin mi?`)) {
      deletePerson(person.id);
    }
  };

  if (isEditing) {
    return (
      <form className="mb-2 grid gap-2 rounded-lg border border-blue-200 bg-blue-50 p-2" onSubmit={handleSave}>
        <input className="field" value={name} onChange={(event) => setName(event.target.value)} />
        <div className="grid grid-cols-[1fr_auto_auto] gap-2">
          <select className="field" value={gender} onChange={(event) => setGender(event.target.value as Gender)}>
            <option value="—">Belirsiz</option>
            <option value="Kadın">Kadın</option>
            <option value="Erkek">Erkek</option>
          </select>
          <button type="submit" className="btn-primary">Kaydet</button>
          <button type="button" className="btn" onClick={() => setIsEditing(false)}>Vazgeç</button>
        </div>
      </form>
    );
  }

  return (
    <article
      className={[
        "mb-2 grid min-h-16 cursor-pointer grid-cols-[auto_auto_1fr_auto] items-center gap-2 rounded-lg border p-2",
        selectedPersonId === person.id ? "border-blue-300 bg-blue-50" : "border-transparent bg-white hover:border-blue-200 hover:bg-slate-50",
        person.tableId ? "opacity-70" : "",
      ].join(" ")}
      draggable={person.arrived && !person.tableId}
      onClick={() => selectPerson(person.id)}
      onDragStart={(event) => event.dataTransfer.setData("text/plain", person.id)}
    >
      <button type="button" className={person.arrived ? "check-on" : "check"} title="Geldi" onClick={(event) => { event.stopPropagation(); toggleArrived(person.id); }}>
        ✓
      </button>
      <button type="button" className={person.spent ? "money-on" : "check"} title="Harcama yaptı" onClick={(event) => { event.stopPropagation(); toggleSpent(person.id); }}>
        ₺
      </button>
      <div className="min-w-0">
        <strong className="break-words text-sm">
          <span className="mr-2 inline-flex h-6 min-w-8 items-center justify-center rounded-full bg-slate-200 px-2 text-xs text-slate-600">{person.number}</span>
          {person.name}
        </strong>
        <div className="mt-1 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-1">{person.gender}</span>
          <span>{person.arrived ? "Geldi" : "Bekleniyor"}</span>
          <span>{person.spent ? "Harcadı" : "Harcamadı"}</span>
        </div>
        <span className="mt-1 block break-words text-xs font-bold text-slate-500">{tableNote}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-bold text-slate-500">{tableName || "Seç"}</span>
        <button type="button" className="icon-btn" title="Düzenle" onClick={(event) => { event.stopPropagation(); setName(person.name); setGender(person.gender); setIsEditing(true); }}>✎</button>
        <button type="button" className="icon-btn-danger" title="Sil" onClick={(event) => { event.stopPropagation(); handleDelete(); }}>×</button>
      </div>
    </article>
  );
}
