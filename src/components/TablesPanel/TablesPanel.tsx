import type { ComponentProps } from "react"
import { cn } from "../../lib/cn"
import { useSimulatorStore } from "../../store/simulatorStore"
import { EmptyState } from "../EmptyState/EmptyState"
import { TableCard } from "../TableCard/TableCard"

export type TablesPanelProps = ComponentProps<"section"> & {
  onPersonPickerOpen?: (tableId: string) => void
}

export function TablesPanel(props: TablesPanelProps) {
  const { onPersonPickerOpen, className, ...attrs } = props
  const tables = useSimulatorStore((state) => state.tables)

  return (
    <section
      {...attrs}
      className={cn("w-full flex", className)}
    >
      {tables.length > 0 ? (
        <div className="grid w-full auto-rows-[minmax(320px,auto)] grid-cols-1 auto-cols-fr gap-4 md:grid-cols-2 xl:auto-rows-[400px] xl:grid-cols-3">
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onPersonPickerOpen={onPersonPickerOpen}
            />
          ))}
        </div>
      ) : (
        <EmptyState className="col-span-full m-auto" />
      )}
    </section>
  );
}
