import {PlayingCard} from "tarot-card-deck";


export type getAvailableCardsToSetAside = (allAvailableCards: PlayingCard[]) => PlayingCard[]

export function defaultGetAvailableCardsToSetAside(allAvailableCards: PlayingCard[]): PlayingCard[]{
    return [];
}
