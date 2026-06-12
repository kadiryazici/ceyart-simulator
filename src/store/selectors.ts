import type { GenderFilter, Person, StatusFilter, Table } from "../types/simulator";

export const getTablePeople = (people: Person[], tableId: string) =>
  people.filter((person) => person.tableId === tableId);

export const getFilteredPeople = (
  people: Person[],
  searchQuery: string,
  genderFilter: GenderFilter,
  statusFilter: StatusFilter,
) => {
  const query = searchQuery.trim().toLocaleLowerCase("tr-TR");
  return people.filter((person) => {
    const matchesQuery = !query || person.name.toLocaleLowerCase("tr-TR").includes(query);
    const matchesGender = genderFilter === "all" || person.gender === genderFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "arrived" && person.arrived) ||
      (statusFilter === "not-arrived" && !person.arrived) ||
      (statusFilter === "unseated" && person.arrived && !person.tableId) ||
      (statusFilter === "spent" && person.spent) ||
      (statusFilter === "not-spent" && person.arrived && person.tableId && !person.spent);

    return matchesQuery && matchesGender && matchesStatus;
  });
};

export const getTableName = (tables: Table[], tableId: string | null) => {
  if (!tableId) return null;
  return tables.find((table) => table.id === tableId)?.name ?? "Masada";
};
