import {PlayerIdentifier} from "../player/card-game-player";
import {PlayingCard} from "tarot-card-deck";

export type PlayedCard = { playingCard: PlayingCard, playerIdentifier: PlayerIdentifier }
export type WonCardsByPlayer = {
    playerIdentifier: PlayerIdentifier;
    wonCards: PlayingCard[]
}
export type TurnResult = {
    winner: PlayerIdentifier;
    wonCardsByPlayer: readonly WonCardsByPlayer[]
}
export type resolveTurn = (playedCards: PlayedCard[]) => TurnResult
