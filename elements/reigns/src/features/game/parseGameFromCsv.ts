import * as Papa from "papaparse";
import { Game } from "./Game";
import { parseCardsFromCsv, parseSectionFromCsv } from "./parseCardsFromCsv";
import { Card, GameDefinition } from "./types";

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

  const mainGameDefinition = parseSectionFromCsv<GameDefinition>(main)?.[0] ?? {
    assetsUrl: "",
    roundName: "",
    gameName: "",
    deathMessage: "",
  };

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
  console.log("parsedDate", parsedData);
  const sectionNameColumn = parsedData.data[0]?.findIndex(
    (value: string) => value === "SECTION"
  );

  const startSectionIndex = parsedData.data.findIndex((line) => {
    return line[sectionNameColumn] === sectionName;
  });

  let endSectionIndex = parsedData.data
    .slice(startSectionIndex + 1)
    .findIndex((line) => {
      console.log(
        "line[sectionNameColumn]",
        line[sectionNameColumn],
        line[sectionNameColumn] === ""
      );
      return line[sectionNameColumn] !== "";
    });

  console.log("maxired endSectionIndex is", endSectionIndex);
  if (endSectionIndex === -1) {
    endSectionIndex = parsedData.data.length;
  }

  const sectionData = parsedData.data
    .slice(startSectionIndex, endSectionIndex + startSectionIndex)
    .map((line) => line.slice(sectionNameColumn + 1));

  console.log("maxired sectionData", sectionData);
  return Papa.unparse(sectionData);
};
