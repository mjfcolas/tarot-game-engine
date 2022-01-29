import {Observable} from "rxjs";
import {PlayableTable} from "./ports/playable-table";
import {CardGamePlayer} from "./player/card-game-player";
import {PlayingCard} from "tarot-card-deck";

export interface CardGameManager {
    begin(): void

    gameIsOver(): Observable<PlayableTable>

    play(player: CardGamePlayer, card: PlayingCard)
}
