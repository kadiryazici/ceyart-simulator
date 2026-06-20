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
  const [transferMode, setTransferMode] = useState<"export" | "import" | null>(null)
  const arrivedCount = people.filter((person) => person.arrived).length

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
      className={cn("grid min-h-screen bg-[#f7f7f5] text-slate-900 lg:h-screen lg:grid-cols-[392px_1fr] lg:overflow-hidden", className)}
    >
      <PeoplePanel />
      <section className="relative h-full min-h-0">
        <TablesPanel />
        <div className="pointer-events-none fixed bottom-6 left-[416px] right-6 z-40 flex items-center justify-between gap-3">
          <div className="pointer-events-auto flex min-h-12 items-center divide-x divide-slate-950/10 rounded-full border border-slate-950/10 bg-white/80 px-1.5 shadow-xl shadow-slate-950/[0.06] backdrop-blur-xl backdrop-saturate-150">
            <div className="px-3 text-sm font-[720] text-slate-800">Kişi: {people.length}</div>
            <div className="px-3 text-sm font-[720] text-slate-800">Gelen: {arrivedCount}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="pointer-events-auto flex min-h-12 items-center gap-1 rounded-full border border-slate-950/10 bg-white/80 p-1.5 shadow-xl shadow-slate-950/[0.06] backdrop-blur-xl backdrop-saturate-150">
              <Button
                size="small"
                rounded="full"
                color="secondary"
                className="font-[760]"
                onClick={addTable}
              >
                <HugeiconsIcon icon={Add01Icon} size={17} />
                <span>Ekle</span>
              </Button>
              <Button size="small" rounded="full" onClick={handleRandom}>
                <HugeiconsIcon icon={ShuffleIcon} size={17} />
                <span>Dağıt</span>
              </Button>
            </div>
            <Menu.Root>
              <Menu.Trigger
                render={
                  <Button
                    size="square"
                    rounded="full"
                    className="pointer-events-auto h-12 w-12 bg-white/80 text-slate-600 shadow-xl shadow-slate-950/[0.06] backdrop-blur-xl backdrop-saturate-150 hover:bg-white/90 hover:text-slate-950"
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
                    <Menu.Item className="menu-item text-red-700" onClick={handleReset}>
                      <HugeiconsIcon icon={RefreshIcon} size={18} />
                      <span>Sıfırla</span>
                    </Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </div>
        </div>
      </section>
      {transferMode ? <DataTransferModal mode={transferMode} onClose={() => setTransferMode(null)} /> : null}
    </main>
  );
}
