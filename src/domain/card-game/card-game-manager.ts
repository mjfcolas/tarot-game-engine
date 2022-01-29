import {Observable} from "rxjs";
import {TarotPlayer} from "../tarot-game/player/tarot-player";
import {PlayingCard} from "../../../../tarot-card-deck";
import {PlayableTable} from "./ports/playable-table";
import {CardGamePlayer} from "./player/card-game-player";

export interface CardGameManager {
    begin(): void

    gameIsOver(): Observable<PlayableTable>

    play(player: CardGamePlayer, card: PlayingCard)
}
