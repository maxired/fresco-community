import * as Papa from "papaparse";
import { Card } from "./types";

export const mapCardWithIndex = (card: Card, index: number) => {
  if (card.id !== "" && card.id !== null && card.id !== undefined) {
    return { ...card, id: `${card.id}` };
  }

  return { ...card, id: `index-${index}` };
};

export const parseSectionFromCsv = <T>(csvData: string| undefined) => {

  if (!csvData) return;
  const parsedData = Papa.parse(csvData, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  if (parsedData.errors.length > 0) {
    throw new Error(parsedData.errors[0].message);
  }

  return (parsedData.data as T[])

}

export const parseCardsFromCsv = (
  csvData: string | undefined
): Card[] | undefined => {
  const parsedSection = parseSectionFromCsv<Card>(csvData)
  if(!parsedSection) { return undefined }

  return parsedSection.map(mapCardWithIndex) as Card[];
};
