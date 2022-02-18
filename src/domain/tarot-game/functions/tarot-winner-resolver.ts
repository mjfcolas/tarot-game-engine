import {PlayingCard} from "tarot-card-deck";
import {PlayerIdentifier} from "../../card-game/player/card-game-player";

export type CardsEarnedByPlayer = {
    playerIdentifier: PlayerIdentifier;
    wonCards: PlayingCard[]
}
export type PlayerPoints = {
    player: PlayerIdentifier,
    numberOfPoints: number
}

export type winnerResolver = (playerPoints: CardsEarnedByPlayer[], taker: PlayerIdentifier) => PlayerPoints[]

export function tarotWinnerResolver(playerPoints: CardsEarnedByPlayer[]): PlayerPoints[] {
    return [];
}
