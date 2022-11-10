import {PlayingCard} from "tarot-card-deck";
import {PlayerIdentifier} from "../../../card-game/player/card-game-player";
import {PlayableTable} from "../../../card-game/ports/playable-table";

export interface TarotTable extends PlayableTable{
    shuffle(): void

    cut(): void

    gatherDeck(): readonly PlayingCard[]

    giveCardTo(cardIdentifier: string, player: PlayerIdentifier): void

    putCardInDog(cardIdentifier: string): void

    listCardsOf(player: PlayerIdentifier): PlayingCard[]

    listPointsFor(player: PlayerIdentifier): PlayingCard[]

    giveDogToPlayerHand(player: PlayerIdentifier): void

    giveDogToPlayerPoints(player: PlayerIdentifier): void

    moveFromHandToPointsOf(wonCards: PlayingCard[], playerThatGetCards: PlayerIdentifier): void
}
