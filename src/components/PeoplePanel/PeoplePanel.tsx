import { Fragment, useState } from "react"
import type { ComponentProps } from "react"
import { Drawer } from "@base-ui/react/drawer"
import { HugeiconsIcon } from "@hugeicons/react"
import Add01Icon from "@hugeicons/core-free-icons/Add01Icon"
import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon"
import FilterIcon from "@hugeicons/core-free-icons/FilterIcon"
import { motion } from "motion/react"
import { useMediaQuery } from "../../hooks/useMediaQuery"
import { cn } from "../../lib/cn"
import { getFilteredPeople } from "../../store/selectors"
import { useSimulatorStore } from "../../store/simulatorStore"
import type { StatusFilter } from "../../types/simulator"
import { AddPersonModal } from "../AddPersonModal/AddPersonModal"
import { Button } from "../Button/Button"
import { PersonRow } from "../PersonRow/PersonRow"
import { SearchInput } from "../SearchInput/SearchInput"
import { SelectMenu } from "../SelectMenu/SelectMenu"

const statusFilters: Array<{ label: string; value: StatusFilter }> = [
  { label: "Tümü", value: "all" },
  { label: "Masalı", value: "seated" },
  { label: "Masasız", value: "unseated" },
]

export type PeoplePanelProps = ComponentProps<"aside"> & {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  canDragPeople?: boolean
  onPersonDragStart?: () => void
  onPersonDragEnd?: (personId: string, point: { x: number; y: number }) => void
}

export function PeoplePanel(props: PeoplePanelProps) {
  const {
    open = false,
    onOpenChange,
    canDragPeople = true,
    className,
    ...attrs
  } = props
  const isDesktop = useMediaQuery("(min-width: 1024px)", true)

  if (isDesktop) {
    return (
      <PeoplePanelImpl
        {...attrs}
        className={className}
        canDragPeople={canDragPeople}
      />
    )
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} swipeDirection="left">
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-50 bg-slate-950/35 opacity-100 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 lg:hidden" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex justify-start lg:hidden">
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
              <PeoplePanelImpl
                {...attrs}
                className={cn("h-full border-r-0", className)}
                canDragPeople={false}
              />
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

type PeoplePanelImplProps = ComponentProps<"aside"> & {
  canDragPeople?: boolean
  onPersonDragStart?: () => void
  onPersonDragEnd?: (personId: string, point: { x: number; y: number }) => void
}

function PeoplePanelImpl(props: PeoplePanelImplProps) {
  const {
    canDragPeople = true,
    onPersonDragStart,
    onPersonDragEnd,
    className,
    ...attrs
  } = props
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false)
  const people = useSimulatorStore((state) => state.people)
  const searchQuery = useSimulatorStore((state) => state.searchQuery)
  const statusFilter = useSimulatorStore((state) => state.statusFilter)
  const setSearchQuery = useSimulatorStore((state) => state.setSearchQuery)
  const setStatusFilter = useSimulatorStore((state) => state.setStatusFilter)
  const filteredPeople = getFilteredPeople(people, searchQuery, "all", statusFilter)
  const activeStatusFilter = statusFilters.find((filter) => filter.value === statusFilter) ?? statusFilters[0]

  return (
    <aside
      {...attrs}
      className={cn("grid min-h-0 grid-rows-[auto_minmax(0,1fr)] border-r border-slate-950/10 bg-white h-screen", className)}
    >
      <div className="sticky top-3 z-10 m-3 mb-0 grid gap-3 p-3 border-b border-b-slate-200">
        <div className="flex min-h-8 items-center justify-between gap-3">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="text-[15px] font-[720] text-slate-900">Kişiler</span>
            <span className="text-xs font-[700] text-slate-500">({filteredPeople.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <SelectMenu
              renderTrigger={
                <Button size="small" rounded="full" className="max-w-32 px-3" aria-label="Kişi filtresi">
                  <HugeiconsIcon icon={FilterIcon} size={16} />
                  <span className="truncate">{activeStatusFilter.label}</span>
                  <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
                </Button>
              }
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
              items={statusFilters.map((filter) => ({
                value: filter.value,
                label: filter.label,
              }))}
            />
            <Button size="square" aria-label="Kişi ekle" onClick={() => setIsAddPersonOpen(true)}>
              <HugeiconsIcon icon={Add01Icon} size={18} />
            </Button>
          </div>
        </div>
        <SearchInput value={searchQuery} onValueChange={setSearchQuery} />
      </div>

      <div className="lg:min-h-0 lg:overflow-auto">
        {filteredPeople.length ? (
          filteredPeople.map((person, index) => (
            <Fragment key={person.id}>
              {index > 0 && (
                <div className="h-px w-full bg-slate-950/10" />
              )}
              <PersonRow
                key={person.id}
                person={person}
                draggable={canDragPeople}
                onDragStarted={onPersonDragStart}
                onDragEnded={onPersonDragEnd}
              />
            </Fragment>
          ))
        ) : (
          <p className="py-8 text-center text-sm font-medium text-slate-500">Kişi bulunamadı.</p>
        )}
      </div>
      {isAddPersonOpen ? <AddPersonModal onClose={() => setIsAddPersonOpen(false)} /> : null}
    </aside>
  );
}
