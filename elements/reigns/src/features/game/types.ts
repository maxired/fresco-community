import { GamePhase } from '../../constants';

export interface IStat {
    value: number;
    icon: string;
}

export interface ICard {
    card: string;
    bearer: string;

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

export interface IGameDefinition {
    cards: ICard[];
    stats: IStat[];
    assetsUrl: string;
    deathMessage: string;
}


export interface IGameState {
    phase: GamePhase;
    selectedCard: ICard | null;
    stats: IStat[];
    gameUrl: string | null;
    definition: IGameDefinition | null;
}

export interface IAppState {
    game: IGameState;
}