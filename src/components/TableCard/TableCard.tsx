import { getTablePeople } from "../../store/selectors";
import { useSimulatorStore } from "../../store/simulatorStore";
import type { Table } from "../../types/simulator";

type TableCardProps = {
  table: Table;
};

export function TableCard({ table }: TableCardProps) {
  const people = useSimulatorStore((state) => state.people);
  const selectedPersonId = useSimulatorStore((state) => state.selectedPersonId);
  const seatPerson = useSimulatorStore((state) => state.seatPerson);
  const removeFromTable = useSimulatorStore((state) => state.removeFromTable);
  const updateTableName = useSimulatorStore((state) => state.updateTableName);
  const deleteTable = useSimulatorStore((state) => state.deleteTable);
  const seated = getTablePeople(people, table.id);
  const emptySeats = Math.max(0, table.capacity - seated.length);

  const handleSeatSelected = () => {
    if (selectedPersonId) {
      seatPerson(selectedPersonId, table.id);
    }
  };

  return (
    <article
      className={["grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-lg border bg-white", selectedPersonId ? "border-blue-300 shadow-[0_0_0_3px_rgba(37,99,235,0.12)]" : "border-slate-200"].join(" ")}
      onClick={handleSeatSelected}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        seatPerson(event.dataTransfer.getData("text/plain"), table.id);
      }}
    >
      <div className="grid grid-cols-[1fr_auto] items-center gap-2 border-b border-slate-200 bg-slate-50 p-3">
        <input className="min-w-0 bg-transparent font-bold outline-none" value={table.name} onClick={(event) => event.stopPropagation()} onChange={(event) => updateTableName(table.id, event.target.value)} />
        <span className="text-xs font-bold text-slate-500">{seated.length}/{table.capacity}</span>
      </div>
      <ul className="min-h-0 space-y-2 overflow-auto p-3">
        {seated.length ? (
          seated.map((person) => (
            <li key={person.id} className="grid min-h-10 grid-cols-[1fr_auto] items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2">
              <strong className="break-words text-sm">
                <span className="mr-2 inline-flex h-6 min-w-8 items-center justify-center rounded-full bg-slate-200 px-2 text-xs text-slate-600">{person.number}</span>
                {person.name}
              </strong>
              <button type="button" className="icon-btn-danger" title="Masadan al" onClick={(event) => { event.stopPropagation(); removeFromTable(person.id); }}>×</button>
            </li>
          ))
        ) : (
          <li className="py-8 text-center text-sm font-medium text-slate-500">Boş</li>
        )}
      </ul>
      <div className="flex items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 p-3">
        <span className="text-xs font-bold text-slate-500">{emptySeats} boş yer</span>
        <button type="button" className="icon-btn-danger" title="Masayı kaldır" onClick={(event) => { event.stopPropagation(); deleteTable(table.id); }}>×</button>
      </div>
    </article>
  );
}
