import { useSimulatorStore } from "../../store/simulatorStore";
import { EmptyState } from "../EmptyState/EmptyState";
import { TableCard } from "../TableCard/TableCard";

export function TablesPanel() {
  const tables = useSimulatorStore((state) => state.tables);

  return (
    <section className="min-h-0 overflow-auto p-4">
      {tables.length ? (
        <div className="grid auto-rows-[clamp(320px,46vh,540px)] grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3">
          {tables.map((table) => <TableCard key={table.id} table={table} />)}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
