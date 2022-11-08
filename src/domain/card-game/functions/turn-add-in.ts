import {Observable} from "rxjs";
import {CardGamePlayer} from "../player/card-game-player";
import {PlayingCard} from "tarot-card-deck";

export interface PlayerTurnPlugin {
    apply(turnNumber, player: CardGamePlayer, playerCards: PlayingCard[]): Observable<unknown>
}
