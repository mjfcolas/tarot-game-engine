import {Observable} from "rxjs";
import {CardGamePlayer, PlayerIdentifier} from "./player/card-game-player";
import {PlayingCard} from "tarot-card-deck";
import {PlayedCard} from "./functions/resolve-turn";
import {PlayerTurnPlugin} from "./functions/turn-add-in";

export type Trick = {
    winner: PlayerIdentifier,
    cards: readonly PlayedCard[]
}

export interface CardGameManager {
    begin(): void

    gameIsOver(): Observable<Trick[]>

    play(player: CardGamePlayer, card: PlayingCard)

    registerPlayerTurnPlugin(plugin: PlayerTurnPlugin): void
}
