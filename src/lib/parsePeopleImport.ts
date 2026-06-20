import type { Gender, PersonDraft } from "../types/simulator";

export type ImportedPersonDraft = PersonDraft & {
  number: number;
};

export function parsePeopleImportText(text: string): ImportedPersonDraft[] {
  return text
    .split("\n")
    .map(parsePeopleImportLine)
    .filter((person): person is ImportedPersonDraft => Boolean(person));
}

function parsePeopleImportLine(line: string): ImportedPersonDraft | null {
  const parts = line
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 3) return null;

  const [numberPart, ...restParts] = parts;
  const genderPart = restParts.at(-1);
  const nameParts = restParts.slice(0, -1);
  const number = Number(numberPart);
  const name = nameParts.join(" ").trim();

  if (!Number.isFinite(number) || !name || !genderPart) return null;

  return {
    number,
    name,
    gender: parseImportedGender(genderPart),
  };
}

function parseImportedGender(value: string): Gender {
  const cleanValue = value.trim().toLocaleLowerCase("tr-TR");

  if (["kadın", "kadin", "k"].includes(cleanValue)) return "Kadın";
  if (["erkek", "e"].includes(cleanValue)) return "Erkek";
  if (["-", "—", "bilinmiyor"].includes(cleanValue)) return "Bilinmiyor";

  return "Bilinmiyor";
}
