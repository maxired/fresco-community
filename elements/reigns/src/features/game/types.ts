import { GamePhase } from '../../constants';

export type Stat = {
    value: number;
    icon: string;
}

export type Card = {
    card: string;
    bearer: string;
    weight: number;

    answer_yes: string;
    yes_stat1: number;
    yes_stat2: number;
    yes_stat3: number;
    yes_stat4: number;

    answer_no: string;
    no_stat1: number;
    no_stat2: number;
    no_stat3: number;
    no_stat4: number;
}

export type GameDefinition = {
    cards: Card[];
    stats: Stat[];
    assetsUrl: string;
    deathMessage: string;
}


export type GameState = {
    phase: GamePhase;
    selectedCard: Card | null;
    stats: Stat[];
    gameUrl: string | null;
    definition: GameDefinition | null;
}

export type AppState = {
    game: GameState;
}