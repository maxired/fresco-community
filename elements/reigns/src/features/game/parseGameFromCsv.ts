import * as Papa from "papaparse";
import { parseCardsFromCsv, parseSectionFromCsv } from "./parseCardsFromCsv";
import { GameDefinition } from "./types";

export const parseGameFromCsv = (
  csvData: string | undefined
): GameDefinition | undefined => {
  if (!csvData) return;
  const parsedData = Papa.parse<string[]>(csvData, {
    skipEmptyLines: true,
  });

  if (parsedData.errors.length > 0) {
    throw new Error(parsedData.errors[0].message);
  }

  const main = getCSVSection(parsedData, "main");
  const csvStats = getCSVSection(parsedData, "stats");
  const csvCards = getCSVSection(parsedData, "cards");

  const mainGameDefinition = parseSectionFromCsv<GameDefinition>(main)?.[0] ?? {} as GameDefinition

  const gameDefinition: GameDefinition = {
    ...mainGameDefinition,
    cards: parseCardsFromCsv(csvCards) || [],
    stats: parseSectionFromCsv(csvStats) || [],
  };

  return gameDefinition;
};

const getCSVSection = (
  parsedData: Papa.ParseResult<string[]>,
  sectionName: string
) => {
  const sectionNameColumn = parsedData.data[0]?.findIndex(
    (value: string) => value === "SECTION"
  );

  const startSectionIndex = parsedData.data.findIndex((line) => {
    return line[sectionNameColumn] === sectionName;
  });

  let endSectionIndex = parsedData.data
    .slice(startSectionIndex + 1)
    .findIndex((line) => line[sectionNameColumn] !== "");

  if (endSectionIndex === -1) {
    endSectionIndex = parsedData.data.length;
  }

  const sectionData = parsedData.data
    .slice(startSectionIndex, endSectionIndex + startSectionIndex)
    .map((line) => line.slice(sectionNameColumn + 1));

  return Papa.unparse(sectionData);
};
