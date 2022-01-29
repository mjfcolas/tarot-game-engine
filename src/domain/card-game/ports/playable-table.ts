import {PlayerIdentifier} from "../player/card-game-player";
import {PlayingCard} from "tarot-card-deck";

export interface PlayableTable {
    getNumberOfRemainingCardsToPlay(): number

    getCardsFor(playerIdentifier: PlayerIdentifier): PlayingCard[]

    moveToPointsOf(wonCards: PlayingCard[], playerThatGetCards: PlayerIdentifier): void;

    listCardsOf(playerIdentifier: PlayerIdentifier): PlayingCard[];

    moveCardOfPlayerToTable(cardToMove: PlayingCard, playerThatPlay: PlayerIdentifier): void;
}
