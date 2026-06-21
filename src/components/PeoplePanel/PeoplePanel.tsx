import { Fragment, useState } from "react"
import type { ComponentProps } from "react"
import { Menu } from "@base-ui/react/menu"
import { HugeiconsIcon } from "@hugeicons/react"
import Add01Icon from "@hugeicons/core-free-icons/Add01Icon"
import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon"
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon"
import FilterIcon from "@hugeicons/core-free-icons/FilterIcon"
import { cn } from "../../lib/cn"
import { getFilteredPeople } from "../../store/selectors"
import { useSimulatorStore } from "../../store/simulatorStore"
import type { StatusFilter } from "../../types/simulator"
import { AddPersonModal } from "../AddPersonModal/AddPersonModal"
import { Button } from "../Button/Button"
import { PersonRow } from "../PersonRow/PersonRow"
import { SearchInput } from "../SearchInput/SearchInput"

const statusFilters: Array<{ label: string; value: StatusFilter }> = [
  { label: "Tümü", value: "all" },
  { label: "Masalı", value: "seated" },
  { label: "Masasız", value: "unseated" },
]

export type PeoplePanelProps = ComponentProps<"aside">

export function PeoplePanel(props: PeoplePanelProps) {
  const { className, ...attrs } = props
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
            <Menu.Root>
              <Menu.Trigger
                render={
                  <Button size="small" rounded="full" className="max-w-32 px-3" aria-label="Kişi filtresi">
                    <HugeiconsIcon icon={FilterIcon} size={16} />
                    <span className="truncate">{activeStatusFilter.label}</span>
                    <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
                  </Button>
                }
              />
              <Menu.Portal>
                <Menu.Positioner className="z-[100]" sideOffset={8} align="end">
                  <Menu.Popup className="menu-popup">
                    {statusFilters.map((filter) => (
                      <Menu.Item
                        key={filter.value}
                        className="menu-item justify-between"
                        onClick={() => setStatusFilter(filter.value)}
                      >
                        <span>{filter.label}</span>
                        {statusFilter === filter.value ? <HugeiconsIcon icon={CheckIcon} size={16} /> : null}
                      </Menu.Item>
                    ))}
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
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
              <PersonRow key={person.id} person={person} />
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
