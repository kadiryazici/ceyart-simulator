import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultTables } from "../lib/defaults";
import type { Gender, GenderFilter, Person, PersonDraft, StatusFilter, Table } from "../types/simulator";

type SimulatorState = {
  people: Person[];
  tables: Table[];
  selectedPersonId: string | null;
  searchQuery: string;
  genderFilter: GenderFilter;
  statusFilter: StatusFilter;
  tableCapacityDraft: number;
  addPerson: (draft: PersonDraft) => void;
  addPeopleFromLines: (lines: string[]) => number;
  updatePerson: (personId: string, draft: PersonDraft) => void;
  deletePerson: (personId: string) => void;
  toggleArrived: (personId: string) => void;
  toggleSpent: (personId: string) => void;
  selectPerson: (personId: string) => void;
  seatPerson: (personId: string, tableId: string) => boolean;
  removeFromTable: (personId: string) => void;
  addTable: () => void;
  updateTableName: (tableId: string, name: string) => void;
  deleteTable: (tableId: string) => void;
  randomDistribute: () => number;
  setSearchQuery: (value: string) => void;
  setGenderFilter: (value: GenderFilter) => void;
  setStatusFilter: (value: StatusFilter) => void;
  setTableCapacityDraft: (value: number) => void;
  resetAll: () => void;
};

const normalizeGender = (gender: string): Gender => {
  if (gender === "Kadın" || gender === "Erkek" || gender === "—") {
    return gender;
  }
  return "—";
};

const nextPersonNumber = (people: Person[]) =>
  people.reduce((max, person) => Math.max(max, Number(person.number) || 0), 0) + 1;

const tablePeople = (people: Person[], tableId: string) =>
  people.filter((person) => person.tableId === tableId);

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
      statusFilter: "all",
      tableCapacityDraft: 8,
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
                spent: false,
                tableId: null,
              },
            ],
          };
        });
      },
      addPeopleFromLines: (lines) => {
        const names = lines.map((line) => line.trim()).filter(Boolean);
        if (!names.length) return 0;
        set((state) => {
          const startNumber = nextPersonNumber(state.people);
          const peopleToAdd = names.map((name, index) => ({
            id: crypto.randomUUID(),
            number: startNumber + index,
            name,
            gender: "—" as const,
            arrived: false,
            spent: false,
            tableId: null,
          }));
          return {
            people: [...state.people, ...peopleToAdd],
          };
        });
        return names.length;
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
      toggleSpent: (personId) => {
        set((state) => ({
          people: state.people.map((person) =>
            person.id === personId ? { ...person, spent: !person.spent } : person,
          ),
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
        const table = state.tables.find((item) => item.id === tableId);
        if (!table) return false;
        const currentCount = tablePeople(state.people, tableId).filter((person) => person.id !== personId).length;
        if (currentCount >= table.capacity) return false;
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
              capacity: Math.max(1, state.tableCapacityDraft),
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
        const seats = state.tables.flatMap((table) => {
          const emptySeatCount = Math.max(0, table.capacity - tablePeople(state.people, table.id).length);
          return Array.from({ length: emptySeatCount }, () => table.id);
        });
        const unseatedArrivals = shuffle(state.people.filter((person) => person.arrived && !person.tableId));
        const shuffledSeats = shuffle(seats);
        const placements = new Map<string, string>();
        unseatedArrivals.slice(0, shuffledSeats.length).forEach((person, index) => {
          placements.set(person.id, shuffledSeats[index]);
        });
        if (!placements.size) return 0;
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
      setStatusFilter: (value) => set({ statusFilter: value }),
      setTableCapacityDraft: (value) => set({ tableCapacityDraft: Math.max(1, value || 1) }),
      resetAll: () =>
        set({
          people: [],
          tables: defaultTables,
          selectedPersonId: null,
          searchQuery: "",
          genderFilter: "all",
          statusFilter: "all",
          tableCapacityDraft: 8,
        }),
    }),
    {
      name: "ceyart-simulator-state-v1",
      version: 1,
      partialize: (state) => ({
        people: state.people,
        tables: state.tables,
        selectedPersonId: state.selectedPersonId,
        searchQuery: state.searchQuery,
        genderFilter: state.genderFilter,
        statusFilter: state.statusFilter,
        tableCapacityDraft: state.tableCapacityDraft,
      }),
    },
  ),
);
