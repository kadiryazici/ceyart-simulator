export type Gender = "Kadın" | "Erkek" | "—";

export type Person = {
  id: string;
  number: number;
  name: string;
  gender: Gender;
  arrived: boolean;
  spent: boolean;
  tableId: string | null;
};

export type Table = {
  id: string;
  name: string;
  capacity: number;
};

export type StatusFilter =
  | "all"
  | "arrived"
  | "not-arrived"
  | "unseated"
  | "spent"
  | "not-spent";

export type GenderFilter = Gender | "all";

export type PersonDraft = {
  name: string;
  gender: Gender;
};
