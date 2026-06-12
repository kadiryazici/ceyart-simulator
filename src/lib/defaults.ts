import type { Table } from "../types/simulator";

export const defaultTables: Table[] = Array.from({ length: 6 }, (_, index) => ({
  id: `t${index + 1}`,
  name: `Masa ${index + 1}`,
  capacity: 8,
}));
