import {Observable} from "rxjs";
import {TarotPlayer} from "../player/tarot-player";
import {PlayingCard} from "../../../../tarot-card-deck";
import {TarotTable} from "../table/tarot-table";

export interface CardGameManager {
    begin(): void

    gameIsOver(): Observable<TarotTable>

    play(player: TarotPlayer, card: PlayingCard)
}
