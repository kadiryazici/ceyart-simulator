import { useState } from "react"
import type { ComponentProps } from "react"
import { Drawer } from "@base-ui/react/drawer"
import { HugeiconsIcon } from "@hugeicons/react"
import Add01Icon from "@hugeicons/core-free-icons/Add01Icon"
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon"
import GroupIcon from "@hugeicons/core-free-icons/GroupIcon"
import MoreVerticalIcon from "@hugeicons/core-free-icons/MoreVerticalIcon"
import RefreshIcon from "@hugeicons/core-free-icons/RefreshIcon"
import ShuffleIcon from "@hugeicons/core-free-icons/ShuffleIcon"
import Upload01Icon from "@hugeicons/core-free-icons/Upload01Icon"
import { motion } from "motion/react"
import { cn } from "../../lib/cn"
import { Button } from "../Button/Button"
import { DataTransferModal } from "../DataTransferModal/DataTransferModal"
import { PeoplePanel } from "../PeoplePanel/PeoplePanel"
import { SelectMenu } from "../SelectMenu/SelectMenu"
import { TablePersonPickerPanel } from "../TablePersonPickerPanel/TablePersonPickerPanel"
import { TablesPanel } from "../TablesPanel/TablesPanel"
import { useSimulatorStore } from "../../store/simulatorStore"

export type AppShellProps = ComponentProps<"main">

export function AppShell(props: AppShellProps) {
  const { className, ...attrs } = props
  const resetAll = useSimulatorStore((state) => state.resetAll)
  const addTable = useSimulatorStore((state) => state.addTable)
  const randomDistribute = useSimulatorStore((state) => state.randomDistribute)
  const seatPerson = useSimulatorStore((state) => state.seatPerson)
  const people = useSimulatorStore((state) => state.people)
  const [isPeopleDrawerOpen, setIsPeopleDrawerOpen] = useState(false)
  const [personPickerTableId, setPersonPickerTableId] = useState<string | null>(null)

  const handleRandom = () => {
    randomDistribute()
  }

  const handleReset = () => {
    if (window.confirm("Tüm kişiler ve masa yerleşimi sıfırlansın mı?")) {
      resetAll()
    }
  }

  const handlePersonPick = (personId: string) => {
    if (personPickerTableId) {
      seatPerson(personId, personPickerTableId)
    }

    setPersonPickerTableId(null)
  }

  return (
    <main
      {...attrs}
      className={cn("flex h-dvh overflow-hidden bg-gray-100 text-slate-900 lg:h-screen lg:grid-cols-[392px_1fr]", className)}
    >
      <PeoplePanel
        className="w-[400px] shrink-0"
        open={isPeopleDrawerOpen}
        onOpenChange={setIsPeopleDrawerOpen}
      />
      <TablePersonPickerDrawer
        open={personPickerTableId != null}
        tableId={personPickerTableId}
        onOpenChange={(open) => {
          if (!open) {
            setPersonPickerTableId(null)
          }
        }}
        onPick={handlePersonPick}
      />

      <div className="relative grid *:min-h-0 size-full overflow-hidden">
        <div className="size-full flex items-start *:shrink-0 shrink overflow-y-auto px-3 pb-28 pt-4 sm:px-5 lg:px-6 lg:pt-6">
          <TablesPanel
            className="w-full min-h-full"
            onPersonPickerOpen={setPersonPickerTableId}
          />
        </div>

        <AppControlBar
          onAddTable={addTable}
          onPeopleOpen={() => setIsPeopleDrawerOpen(true)}
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
  onPeopleOpen: () => void
  onRandomDistribute: () => void
  onReset: () => void
  peopleCount: number
}

function AppControlBar(props: AppControlBarProps) {
  const {
    onAddTable,
    onPeopleOpen,
    onRandomDistribute,
    onReset,
    peopleCount,
    className,
    ...attrs
  } = props

  const [transferMode, setTransferMode] = useState<"export" | "import" | null>(null)

  return (
    <section
      {...attrs}
      className={cn(
        "absolute bottom-4 left-3 right-3 z-40 flex w-auto items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-2 shadow-md lg:bottom-6 lg:left-0 lg:right-8 lg:ml-auto lg:w-fit",
        className,
      )}
    >
      <Button
        size="small"
        rounded="full"
        color="primary"
        className="font-[760] lg:hidden mr-auto"
        onClick={onPeopleOpen}
      >
        <HugeiconsIcon icon={GroupIcon} size={17} />
        <span>Kişiler</span>
      </Button>

      <Button
        size="small"
        rounded="full"
        color="secondary"
        className="font-[760]"
        onClick={onAddTable}
      >
        <HugeiconsIcon icon={Add01Icon} size={17} />
        <span className="hidden sm:inline">Masa ekle</span>
      </Button>

      <SelectMenu
        renderTrigger={
          <Button
            size="square"
            rounded="full"
            color="ghost"
            aria-label="Diğer işlemler"
          >
            <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
          </Button>
        }
        items={[
          {
            icon: <HugeiconsIcon icon={Download01Icon} size={18} />,
            label: "Dışa aktar",
            onSelect: () => setTransferMode("export"),
          },
          {
            icon: <HugeiconsIcon icon={Upload01Icon} size={18} />,
            label: "İçe aktar",
            onSelect: () => setTransferMode("import"),
          },
          "divider",
          {
            icon: <HugeiconsIcon icon={ShuffleIcon} size={18} />,
            label: "Rastgele Dağıt",
            onSelect: onRandomDistribute,
          },
          "divider",
          {
            icon: <HugeiconsIcon icon={RefreshIcon} size={18} />,
            label: "Sıfırla",
            type: "danger",
            onSelect: onReset,
          },
        ]}
      />

      {transferMode && <DataTransferModal mode={transferMode} onClose={() => setTransferMode(null)} />}
    </section>
  )
}

type TablePersonPickerDrawerProps = {
  open: boolean
  tableId: string | null
  onOpenChange: (open: boolean) => void
  onPick: (personId: string) => void
}

function TablePersonPickerDrawer(props: TablePersonPickerDrawerProps) {
  const { open, tableId, onOpenChange, onPick } = props

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} swipeDirection="left">
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-50 bg-slate-950/35 opacity-100 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex justify-start">
          <Drawer.Popup
            className="h-full w-[min(400px,calc(100vw-44px))] overflow-hidden bg-white text-slate-900 shadow-2xl shadow-slate-950/25 outline-none [transform:translateX(var(--drawer-swipe-movement-x))] transition-transform duration-300 data-ending-style:translate-x-[-100%] data-ending-style:opacity-[0.9999] data-starting-style:translate-x-[-100%]"
            render={
              <motion.aside
                initial={{ opacity: 0.9999, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              />
            }
          >
            <Drawer.Content className="h-full">
              {tableId ? <TablePersonPickerPanel tableId={tableId} onPick={onPick} /> : null}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
