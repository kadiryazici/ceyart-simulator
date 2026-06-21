import { useState } from "react"
import type { ComponentProps } from "react"
import { Menu } from "@base-ui/react/menu"
import { HugeiconsIcon } from "@hugeicons/react"
import Add01Icon from "@hugeicons/core-free-icons/Add01Icon"
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon"
import MoreVerticalIcon from "@hugeicons/core-free-icons/MoreVerticalIcon"
import RefreshIcon from "@hugeicons/core-free-icons/RefreshIcon"
import ShuffleIcon from "@hugeicons/core-free-icons/ShuffleIcon"
import Upload01Icon from "@hugeicons/core-free-icons/Upload01Icon"
import { cn } from "../../lib/cn"
import { Button } from "../Button/Button"
import { DataTransferModal } from "../DataTransferModal/DataTransferModal"
import { PeoplePanel } from "../PeoplePanel/PeoplePanel"
import { TablesPanel } from "../TablesPanel/TablesPanel"
import { useSimulatorStore } from "../../store/simulatorStore"

export type AppShellProps = ComponentProps<"main">

export function AppShell(props: AppShellProps) {
  const { className, ...attrs } = props
  const resetAll = useSimulatorStore((state) => state.resetAll)
  const addTable = useSimulatorStore((state) => state.addTable)
  const randomDistribute = useSimulatorStore((state) => state.randomDistribute)
  const people = useSimulatorStore((state) => state.people)


  const handleRandom = () => {
    randomDistribute()
  }

  const handleReset = () => {
    if (window.confirm("Tüm kişiler ve masa yerleşimi sıfırlansın mı?")) {
      resetAll()
    }
  }

  return (
    <main
      {...attrs}
      className={cn("flex h-screen overflow-hidden bg-gray-100 text-slate-900 lg:grid-cols-[392px_1fr]", className)}
    >
      <PeoplePanel className="shrink-0 w-[400px]" />

      <div className="relative grid *:min-h-0 size-full overflow-hidden">
        <div className="size-full flex items-start *:shrink-0 shrink overflow-y-auto pt-6 px-6 pb-26">
          <TablesPanel className="w-full min-h-full" />
        </div>

        <AppControlBar
          onAddTable={addTable}
          onRandomDistribute={handleRandom}
          onReset={handleReset}
          peopleCount={people.length}
        />
      </div>
    </main>
  );
}

type AppControlBarProps = ComponentProps<"section"> & {
  onAddTable: () => void
  onRandomDistribute: () => void
  onReset: () => void
  peopleCount: number
}

function AppControlBar(props: AppControlBarProps) {
  const {
    onAddTable,
    onRandomDistribute,
    onReset,
    peopleCount,
    className,
    ...attrs
  } = props

  const [transferMode, setTransferMode] = useState<"export" | "import" | null>(null)
  const tableCount = useSimulatorStore((state) => state.tables.length)

  return (
    <section
      {...attrs}
      className={cn(
        "absolute w-fit bottom-6 p-2 ml-auto left-0 right-8 bg-white shadow-md border border-slate-200 rounded-3xl z-40 flex items-center justify-between gap-3",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Button
            size="small"
            rounded="full"
            color="secondary"
            className="font-[760]"
            onClick={onAddTable}
          >
            <HugeiconsIcon icon={Add01Icon} size={17} />
            <span>Masa ekle</span>
          </Button>
        </div>

        <Menu.Root>
          <Menu.Trigger
            render={
              <Button
                size="square"
                rounded="full"
                color="ghost"
                aria-label="Diğer işlemler"
              />
            }
          >
            <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
          </Menu.Trigger>

          <Menu.Portal>
            <Menu.Positioner className="z-[100]" sideOffset={8} align="end">
              <Menu.Popup className="menu-popup">
                <Menu.Item className="menu-item" onClick={() => setTransferMode("export")}>
                  <HugeiconsIcon icon={Download01Icon} size={18} />
                  <span>Dışa aktar</span>
                </Menu.Item>

                <Menu.Item className="menu-item" onClick={() => setTransferMode("import")}>
                  <HugeiconsIcon icon={Upload01Icon} size={18} />
                  <span>İçe aktar</span>
                </Menu.Item>

                <Menu.Separator className="menu-separator" />

                <Menu.Item className="menu-item" onClick={onRandomDistribute}>
                  <HugeiconsIcon icon={ShuffleIcon} size={18} />
                  <span>Rastgele Dağıt</span>
                </Menu.Item>

                <Menu.Separator className="menu-separator" />
                <Menu.Item className="menu-item text-red-700" onClick={onReset}>
                  <HugeiconsIcon icon={RefreshIcon} size={18} />
                  <span>Sıfırla</span>
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>

      {transferMode && <DataTransferModal mode={transferMode} onClose={() => setTransferMode(null)} />}
    </section>
  )
}
