import type { GenderFilter, Person, StatusFilter, Table } from "../types/simulator";

export const getTablePeople = (people: Person[], tableId: string) =>
  people.filter((person) => person.tableId === tableId);

export const getFilteredPeople = (
  people: Person[],
  searchQuery: string,
  genderFilter: GenderFilter,
  statusFilters: StatusFilter[],
) => {
  const query = searchQuery.trim().toLocaleLowerCase("tr-TR");
  return people.filter((person) => {
    const matchesQuery = !query || person.name.toLocaleLowerCase("tr-TR").includes(query);
    const matchesGender = genderFilter === "all" || person.gender === genderFilter;
    const matchesStatus = statusFilters.every((statusFilter) => {
      if (statusFilter === "arrived") return person.arrived;
      if (statusFilter === "not-arrived") return !person.arrived;
      if (statusFilter === "unseated") return !person.tableId;
      return true;
    });

    return matchesQuery && matchesGender && matchesStatus;
  });
};

export const getTableName = (tables: Table[], tableId: string | null) => {
  if (!tableId) return null;
  return tables.find((table) => table.id === tableId)?.name ?? "Masada";
};
