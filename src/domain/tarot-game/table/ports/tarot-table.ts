import {PlayingCard} from "tarot-card-deck";
import {PlayerIdentifier} from "../../../card-game/player/card-game-player";

export interface TarotTable {
    shuffle(): void

    cut(): void

    gatherDeck(): readonly PlayingCard[]

    giveCardTo(cardIdentifier: string, player: PlayerIdentifier): void

    putCardInDog(cardIdentifier: string): void

    listCardsOf(player: PlayerIdentifier): PlayingCard[]

    listPointsFor(player: PlayerIdentifier): PlayingCard[]

    giveDogToPlayer(player: PlayerIdentifier): void

    moveFromHandToPointsOf(wonCards: PlayingCard[], playerThatGetCards: PlayerIdentifier): void
}
