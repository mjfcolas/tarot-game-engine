import {PlayingCard} from "tarot-card-deck";
import {PlayerIdentifier} from "../../../card-game/player/card-game-player";

export interface TarotTable {
    shuffle(): void

    cut(): void

    gatherDeck(): readonly PlayingCard[]

    giveCardTo(cardIdentifier: string, player: PlayerIdentifier): void

    putCardInDog(cardIdentifier: string): void

    listCardsFor(player: PlayerIdentifier): PlayingCard[]

    giveDogToPlayer(player: PlayerIdentifier): void

    moveToPointsOf(wonCards: PlayingCard[], playerThatGetCards: PlayerIdentifier): void;

}
