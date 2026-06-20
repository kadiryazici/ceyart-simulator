import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultTables } from "../lib/defaults";
import type { Gender, GenderFilter, Person, PersonDraft, SimulatorExport, StatusFilter, Table } from "../types/simulator";

type SimulatorState = {
  people: Person[];
  tables: Table[];
  selectedPersonId: string | null;
  searchQuery: string;
  genderFilter: GenderFilter;
  statusFilters: StatusFilter[];
  addPerson: (draft: PersonDraft) => void;
  addPeopleFromLines: (lines: string[]) => number;
  updatePerson: (personId: string, draft: PersonDraft) => void;
  deletePerson: (personId: string) => void;
  toggleArrived: (personId: string) => void;
  selectPerson: (personId: string) => void;
  seatPerson: (personId: string, tableId: string) => boolean;
  removeFromTable: (personId: string) => void;
  addTable: () => void;
  updateTableName: (tableId: string, name: string) => void;
  deleteTable: (tableId: string) => void;
  randomDistribute: () => number;
  setSearchQuery: (value: string) => void;
  setGenderFilter: (value: GenderFilter) => void;
  toggleStatusFilter: (value: StatusFilter) => void;
  clearStatusFilters: () => void;
  exportState: () => SimulatorExport;
  importState: (payload: unknown) => boolean;
  resetAll: () => void;
};

const normalizeGender = (gender: string): Gender => {
  if (gender === "Kadın" || gender === "Erkek" || gender === "—") {
    return gender;
  }
  return "—";
};

const normalizeBulkGender = (gender: string): Gender => {
  const value = gender.trim().toLocaleLowerCase("tr-TR");
  if (["kadın", "kadin", "k"].includes(value)) return "Kadın";
  if (["erkek", "e"].includes(value)) return "Erkek";
  return normalizeGender(gender.trim());
};

const parseBulkPersonLine = (line: string): PersonDraft | null => {
  const cleanLine = line.trim();
  if (!cleanLine) return null;

  const [rawName, ...genderParts] = cleanLine.split(/\s+-\s+/);
  const name = rawName.trim();
  if (!name) return null;

  return {
    name,
    gender: genderParts.length ? normalizeBulkGender(genderParts.join(" - ")) : "—",
  };
};

const nextPersonNumber = (people: Person[]) =>
  people.reduce((max, person) => Math.max(max, Number(person.number) || 0), 0) + 1;

const normalizePerson = (person: Partial<Person>, index: number): Person => ({
  id: typeof person.id === "string" && person.id ? person.id : crypto.randomUUID(),
  number: Number(person.number) || index + 1,
  name: typeof person.name === "string" && person.name.trim() ? person.name.trim() : "İsimsiz",
  gender: normalizeGender(String(person.gender ?? "—")),
  arrived: Boolean(person.arrived),
  tableId: typeof person.tableId === "string" && person.tableId ? person.tableId : null,
});

const normalizeTable = (table: Partial<Table>, index: number): Table => ({
  id: typeof table.id === "string" && table.id ? table.id : `t${index + 1}`,
  name: typeof table.name === "string" && table.name.trim() ? table.name.trim() : `Masa ${index + 1}`,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const validStatusFilters: StatusFilter[] = ["arrived", "not-arrived", "unseated"];

const normalizeStatusFilters = (value: unknown): StatusFilter[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is StatusFilter => validStatusFilters.includes(item as StatusFilter));
  }
  return validStatusFilters.includes(value as StatusFilter) ? [value as StatusFilter] : [];
};

const shuffle = <T,>(items: T[]) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
};

export const useSimulatorStore = create<SimulatorState>()(
  persist(
    (set, get) => ({
      people: [],
      tables: defaultTables,
      selectedPersonId: null,
      searchQuery: "",
      genderFilter: "all",
      statusFilters: [],
      addPerson: ({ name, gender }) => {
        const cleanName = name.trim();
        if (!cleanName) return;
        set((state) => {
          const number = nextPersonNumber(state.people);
          return {
            people: [
              ...state.people,
              {
                id: crypto.randomUUID(),
                number,
                name: cleanName,
                gender: normalizeGender(gender),
                arrived: false,
                tableId: null,
              },
            ],
          };
        });
      },
      addPeopleFromLines: (lines) => {
        const drafts = lines.map(parseBulkPersonLine).filter((draft): draft is PersonDraft => Boolean(draft));
        if (!drafts.length) return 0;
        set((state) => {
          const startNumber = nextPersonNumber(state.people);
          const peopleToAdd = drafts.map((draft, index) => ({
            id: crypto.randomUUID(),
            number: startNumber + index,
            name: draft.name,
            gender: draft.gender,
            arrived: false,
            tableId: null,
          }));
          return {
            people: [...state.people, ...peopleToAdd],
          };
        });
        return drafts.length;
      },
      updatePerson: (personId, { name, gender }) => {
        const cleanName = name.trim();
        if (!cleanName) return;
        set((state) => ({
          people: state.people.map((person) =>
            person.id === personId
              ? { ...person, name: cleanName, gender: normalizeGender(gender) }
              : person,
          ),
        }));
      },
      deletePerson: (personId) => {
        set((state) => ({
          people: state.people.filter((person) => person.id !== personId),
          selectedPersonId: state.selectedPersonId === personId ? null : state.selectedPersonId,
        }));
      },
      toggleArrived: (personId) => {
        set((state) => ({
          people: state.people.map((person) => {
            if (person.id !== personId) return person;
            const arrived = !person.arrived;
            return { ...person, arrived, tableId: arrived ? person.tableId : null };
          }),
          selectedPersonId: state.people.find((person) => person.id === personId)?.arrived ? null : personId,
        }));
      },
      selectPerson: (personId) => {
        set((state) => ({
          people: state.people.map((person) =>
            person.id === personId ? { ...person, arrived: true } : person,
          ),
          selectedPersonId: state.people.find((person) => person.id === personId)?.tableId ? null : personId,
        }));
      },
      seatPerson: (personId, tableId) => {
        const state = get();
        if (!state.tables.some((table) => table.id === tableId)) return false;
        set((current) => ({
          people: current.people.map((person) =>
            person.id === personId ? { ...person, arrived: true, tableId } : person,
          ),
          selectedPersonId: null,
        }));
        return true;
      },
      removeFromTable: (personId) => {
        set((state) => ({
          people: state.people.map((person) =>
            person.id === personId ? { ...person, tableId: null } : person,
          ),
          selectedPersonId: personId,
        }));
      },
      addTable: () => {
        set((state) => ({
          tables: [
            ...state.tables,
            {
              id: crypto.randomUUID(),
              name: `Masa ${state.tables.length + 1}`,
            },
          ],
        }));
      },
      updateTableName: (tableId, name) => {
        set((state) => ({
          tables: state.tables.map((table) =>
            table.id === tableId ? { ...table, name: name || "Masa" } : table,
          ),
        }));
      },
      deleteTable: (tableId) => {
        set((state) => ({
          tables: state.tables.filter((table) => table.id !== tableId),
          people: state.people.map((person) =>
            person.tableId === tableId ? { ...person, tableId: null } : person,
          ),
        }));
      },
      randomDistribute: () => {
        const state = get();
        if (!state.tables.length) return 0;
        const unseatedArrivals = shuffle(state.people.filter((person) => person.arrived && !person.tableId));
        if (!unseatedArrivals.length) return 0;

        const shuffledTables = shuffle(state.tables);
        const placements = new Map<string, string>();
        unseatedArrivals.forEach((person, index) => {
          placements.set(person.id, shuffledTables[index % shuffledTables.length].id);
        });

        set((current) => ({
          people: current.people.map((person) =>
            placements.has(person.id) ? { ...person, tableId: placements.get(person.id)! } : person,
          ),
          selectedPersonId: null,
        }));
        return placements.size;
      },
      setSearchQuery: (value) => set({ searchQuery: value }),
      setGenderFilter: (value) => set({ genderFilter: value }),
      toggleStatusFilter: (value) =>
        set((state) => ({
          statusFilters: state.statusFilters.includes(value)
            ? state.statusFilters.filter((item) => item !== value)
            : [...state.statusFilters, value],
        })),
      clearStatusFilters: () => set({ statusFilters: [] }),
      exportState: () => {
        const state = get();
        return {
          app: "ceyart-simulator",
          schemaVersion: 1,
          exportedAt: new Date().toISOString(),
          people: state.people,
          tables: state.tables,
          selectedPersonId: state.selectedPersonId,
          filters: {
            searchQuery: state.searchQuery,
            genderFilter: state.genderFilter,
            statusFilters: state.statusFilters,
            statusFilter: state.statusFilters[0] ?? "all",
          },
        };
      },
      importState: (payload) => {
        if (!isRecord(payload) || !Array.isArray(payload.people) || !Array.isArray(payload.tables)) {
          return false;
        }

        const tables = payload.tables.map((table, index) => normalizeTable(isRecord(table) ? table : {}, index));
        const tableIds = new Set(tables.map((table) => table.id));
        const people = payload.people.map((person, index) => normalizePerson(isRecord(person) ? person : {}, index));
        const filters = isRecord(payload.filters) ? payload.filters : {};
        const genderFilter = String(filters.genderFilter ?? "all") as GenderFilter;
        const statusFilters = normalizeStatusFilters(filters.statusFilters ?? filters.statusFilter);
        const selectedPersonId = typeof payload.selectedPersonId === "string" ? payload.selectedPersonId : null;

        set({
          people: people.map((person) => ({
            ...person,
            tableId: person.tableId && tableIds.has(person.tableId) ? person.tableId : null,
          })),
          tables,
          selectedPersonId: selectedPersonId && people.some((person) => person.id === selectedPersonId) ? selectedPersonId : null,
          searchQuery: typeof filters.searchQuery === "string" ? filters.searchQuery : "",
          genderFilter: ["all", "Kadın", "Erkek", "—"].includes(genderFilter) ? genderFilter : "all",
          statusFilters,
        });
        return true;
      },
      resetAll: () =>
        set({
          people: [],
          tables: defaultTables,
          selectedPersonId: null,
          searchQuery: "",
          genderFilter: "all",
          statusFilters: [],
        }),
    }),
    {
      name: "ceyart-simulator-state-v2",
      version: 2,
      partialize: (state) => ({
        people: state.people,
        tables: state.tables,
        selectedPersonId: state.selectedPersonId,
        searchQuery: state.searchQuery,
        genderFilter: state.genderFilter,
        statusFilters: state.statusFilters,
      }),
      merge: (persisted, current) => {
        if (!isRecord(persisted)) return current;
        return {
          ...current,
          ...persisted,
          people: Array.isArray(persisted.people)
            ? persisted.people.map((person, index) => normalizePerson(isRecord(person) ? person : {}, index))
            : current.people,
          tables: Array.isArray(persisted.tables)
            ? persisted.tables.map((table, index) => normalizeTable(isRecord(table) ? table : {}, index))
            : current.tables,
          statusFilters: normalizeStatusFilters(persisted.statusFilters ?? persisted.statusFilter),
        };
      },
    },
  ),
);
