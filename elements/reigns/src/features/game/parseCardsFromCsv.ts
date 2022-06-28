import * as Papa from "papaparse";
import { Card } from "./types";

export const mapCardWithIndex = (card: Card, index: number) => {
  if (card.id !== "" && card.id !== null && card.id !== undefined) {
    return { ...card, id: `${card.id}` };
  }

  return { ...card, id: `index-${index}` };
};

export const parseCardsFromCsv = (
  csvData: string | undefined
): Card[] | undefined => {
  if (!csvData) return;
  const parsedData = Papa.parse(csvData, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  if (parsedData.errors.length > 0) {
    throw new Error(parsedData.errors[0].message);
  }

  return (parsedData.data as Card[]).map(mapCardWithIndex) as Card[];
};
