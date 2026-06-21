import type { GenderFilter, Person, StatusFilter, Table } from "../types/simulator";
import { useSimulatorStore } from "./simulatorStore";

export const getTablePeople = (people: Person[], tableId: string) =>
  people.filter((person) => person.tableId === tableId);

export const getFilteredPeople = (
  people: Person[],
  searchQuery: string,
  genderFilter: GenderFilter,
  statusFilter: StatusFilter,
) => {
  const query = searchQuery.trim().toLocaleLowerCase("tr-TR");
  const tables = useSimulatorStore((state) => state.tables)


  return people.filter((person) => {
    const matchesQuery = !query || person.name.toLocaleLowerCase("tr-TR").includes(query);
    const matchesGender = genderFilter === "all" || person.gender === genderFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "seated" && person.tableId != null) ||
      (statusFilter === "unseated" && person.tableId == null)

    return matchesQuery && matchesGender && matchesStatus;
  });
};

export const getTableName = (tables: Table[], tableId: string | null) => {
  if (!tableId) return null;
  return tables.find((table) => table.id === tableId)?.name ?? "Masada";
};
