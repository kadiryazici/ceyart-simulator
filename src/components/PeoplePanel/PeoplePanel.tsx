import { getFilteredPeople } from "../../store/selectors";
import { useSimulatorStore } from "../../store/simulatorStore";
import type { GenderFilter, StatusFilter } from "../../types/simulator";
import { PersonForm } from "../PersonForm/PersonForm";
import { PersonRow } from "../PersonRow/PersonRow";

const statusFilters: Array<{ label: string; value: StatusFilter }> = [
  { label: "Gelen", value: "arrived" },
  { label: "Gelmeyen", value: "not-arrived" },
  { label: "Masasız", value: "unseated" },
];

export function PeoplePanel() {
  const people = useSimulatorStore((state) => state.people);
  const searchQuery = useSimulatorStore((state) => state.searchQuery);
  const genderFilter = useSimulatorStore((state) => state.genderFilter);
  const statusFiltersValue = useSimulatorStore((state) => state.statusFilters);
  const setSearchQuery = useSimulatorStore((state) => state.setSearchQuery);
  const setGenderFilter = useSimulatorStore((state) => state.setGenderFilter);
  const toggleStatusFilter = useSimulatorStore((state) => state.toggleStatusFilter);
  const clearStatusFilters = useSimulatorStore((state) => state.clearStatusFilters);
  const filteredPeople = getFilteredPeople(people, searchQuery, genderFilter, statusFiltersValue);

  return (
    <aside className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] border-r border-slate-200 bg-white lg:h-screen lg:overflow-hidden">
      <div className="grid gap-3 border-b border-slate-200 bg-white p-4">
        <div className="flex min-h-8 items-center justify-between gap-3 font-bold">
          <span>Kişiler</span>
          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs">{filteredPeople.length}</span>
        </div>
        <div className="grid grid-cols-[1fr_112px] gap-2">
          <input className="field" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="İsim ara" type="search" />
          <select className="field" value={genderFilter} onChange={(event) => setGenderFilter(event.target.value as GenderFilter)}>
            <option value="all">Tümü</option>
            <option value="Kadın">Kadın</option>
            <option value="Erkek">Erkek</option>
            <option value="—">Belirsiz</option>
          </select>
        </div>
        <PersonForm />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            type="button"
            className={!statusFiltersValue.length ? "segment-active" : "segment"}
            onClick={clearStatusFilters}
          >
            Tümü
          </button>
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={statusFiltersValue.includes(filter.value) ? "segment-active" : "segment"}
              onClick={() => toggleStatusFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-2 lg:min-h-0 lg:overflow-auto">
        {filteredPeople.length ? (
          filteredPeople.map((person) => <PersonRow key={person.id} person={person} />)
        ) : (
          <p className="py-8 text-center text-sm font-medium text-slate-500">Kişi bulunamadı.</p>
        )}
      </div>
    </aside>
  );
}
