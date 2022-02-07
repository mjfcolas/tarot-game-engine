import {PlayingCard} from "tarot-card-deck";
import {PlayerIdentifier} from "../../card-game/player/card-game-player";

export type PointsByPlayer = {
    playerIdentifier: PlayerIdentifier;
    wonCards: PlayingCard[]
}
export type winnerResolver = (playerPoints: PointsByPlayer[]) => PlayerIdentifier

export function tarotWinnerResolver(playerPoints: PointsByPlayer[]) {
    return "";
}
