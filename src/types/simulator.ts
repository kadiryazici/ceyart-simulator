export type Gender = "Kadın" | "Erkek" | "—";

export type Person = {
  id: string;
  number: number;
  name: string;
  gender: Gender;
  arrived: boolean;
  tableId: string | null;
};

export type Table = {
  id: string;
  name: string;
};

export type StatusFilter =
  | "arrived"
  | "not-arrived"
  | "unseated";

export type GenderFilter = Gender | "all";

export type PersonDraft = {
  name: string;
  gender: Gender;
};

export type SimulatorExport = {
  app: "ceyart-simulator";
  schemaVersion: 1;
  exportedAt: string;
  people: Person[];
  tables: Table[];
  selectedPersonId: string | null;
  filters: {
    searchQuery: string;
    genderFilter: GenderFilter;
    statusFilters: StatusFilter[];
    statusFilter?: StatusFilter | "all";
  };
};
