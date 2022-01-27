import {PlayingCard} from "../../../../tarot-card-deck/src";

export interface CardDealer{
    deal(deck: PlayingCard[], numberOfPlayers: number, numberOfCardsInDog): DealtCards
}

export type DealtCards = {
    playersDecks: PlayingCard[][]
    dog: PlayingCard[]
}
