import {PlayingCard} from "../../../../../../tarot-card-deck/src";
import {PlayerIdentifier} from "../../player/tarot-player";

export interface TarotTable {
    shuffle(): void

    cut(): void

    gatherDeck(): readonly PlayingCard[]

    giveCardTo(cardIdentifier: string, player: PlayerIdentifier): void

    putCardInDog(cardIdentifier: string): void

    listCardsFor(player: PlayerIdentifier): PlayingCard[]
}
