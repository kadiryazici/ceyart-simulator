import type { ComponentProps } from "react"
import { cn } from "../../lib/cn"
import { useSimulatorStore } from "../../store/simulatorStore"
import { EmptyState } from "../EmptyState/EmptyState"
import { TableCard } from "../TableCard/TableCard"

export type TablesPanelProps = ComponentProps<"section">

export function TablesPanel(props: TablesPanelProps) {
  const { className, ...attrs } = props
  const tables = useSimulatorStore((state) => state.tables)

  return (
    <section
      {...attrs}
      className={cn("h-full min-h-0 overflow-auto p-6 pb-28", className)}
    >
      {tables.length ? (
        <div className="grid auto-rows-[clamp(320px,46vh,540px)] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {tables.map((table) => <TableCard key={table.id} table={table} />)}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
