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
      className={cn("w-full flex", className)}
    >
      {tables.length > 0 ? (
        <div className="grid w-full auto-rows-[400px] grid-cols-3 auto-cols-fr gap-4">
          {tables.map((table) => <TableCard key={table.id} table={table} />)}
        </div>
      ) : (
        <EmptyState className="col-span-full m-auto" />
      )}
    </section>
  );
}
