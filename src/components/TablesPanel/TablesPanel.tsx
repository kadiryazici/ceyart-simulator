import { useState } from "react";
import { useSimulatorStore } from "../../store/simulatorStore";
import { TableCard } from "../TableCard/TableCard";

export function TablesPanel() {
  const tables = useSimulatorStore((state) => state.tables);
  const selectedPersonId = useSimulatorStore((state) => state.selectedPersonId);
  const tableCapacityDraft = useSimulatorStore((state) => state.tableCapacityDraft);
  const setTableCapacityDraft = useSimulatorStore((state) => state.setTableCapacityDraft);
  const addTable = useSimulatorStore((state) => state.addTable);
  const randomDistribute = useSimulatorStore((state) => state.randomDistribute);
  const people = useSimulatorStore((state) => state.people);
  const [message, setMessage] = useState("");
  const selectedPerson = people.find((person) => person.id === selectedPersonId);

  const handleRandom = () => {
    const placed = randomDistribute();
    setMessage(placed ? `${placed} kişi rastgele dağıtıldı` : "Dağıtılacak uygun kişi veya boş yer yok");
  };

  return (
    <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-slate-200 bg-slate-50 p-3 max-md:grid-cols-1">
        <div className="min-w-0">
          <div className="font-bold">Masalar</div>
          <div className="truncate text-xs font-bold text-slate-500">{selectedPerson ? `${selectedPerson.name} seçili` : message || "Kişi seçilmedi"}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            className="field w-24"
            type="number"
            min={1}
            max={30}
            value={tableCapacityDraft}
            onChange={(event) => setTableCapacityDraft(Number(event.target.value))}
            aria-label="Masa kapasitesi"
          />
          <button type="button" className="btn" onClick={handleRandom}>Rastgele dağıt</button>
          <button type="button" className="btn-primary" onClick={addTable}>Masa ekle</button>
        </div>
      </div>
      <div className="grid min-h-0 auto-rows-[clamp(380px,54vh,620px)] grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3 overflow-auto p-3">
        {tables.map((table) => <TableCard key={table.id} table={table} />)}
      </div>
    </section>
  );
}
