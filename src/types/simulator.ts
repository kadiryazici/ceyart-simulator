export type Gender = "Kadın" | "Erkek" | "Bilinmiyor";

export type Person = {
  id: string;
  number: number;
  name: string;
  gender: Gender;
  tableId: string | null;
};

export type Table = {
  id: string;
  name: string;
};

export type StatusFilter =
  | "all"
  | "seated"
  | "unseated";

export type GenderFilter = Gender | "all";

export type PersonDraft = {
  name: string;
  gender: Gender;
};

export type PersonUpdateDraft = PersonDraft & {
  number: number;
};

export type SimulatorExport = {
  app: "ceyart-simulator";
  schemaVersion: 1;
  exportedAt: string;
  people: Person[];
  tables: Table[];
  filters: {
    searchQuery: string;
    genderFilter: GenderFilter;
    statusFilter: StatusFilter;
  };
};
