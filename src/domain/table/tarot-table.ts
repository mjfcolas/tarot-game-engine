import {PlayingCard} from "../../../../tarot-card-deck/src";

export interface TarotTable {
    shuffle(): void

    cut(): void

    deal(): void

    gatherDeck(): readonly PlayingCard[]

    getNumberOfRemainingCardsToPlay(): number
}
