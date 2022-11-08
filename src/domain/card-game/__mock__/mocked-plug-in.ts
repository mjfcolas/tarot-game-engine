import {PlayerTurnPlugin} from "../functions/turn-add-in";
import {CardGamePlayer} from "../player/card-game-player";
import {PlayingCard} from "tarot-card-deck";
import {Observable, Subject} from "rxjs";

export class MockedPlugIn implements PlayerTurnPlugin {

    private currentPluginObservable: Subject<unknown>

    complete(): void {
        this.currentPluginObservable.complete();
    }

    apply(turnNumber, player: CardGamePlayer, playerCards: PlayingCard[]): Observable<unknown> {
        this.currentPluginObservable = new Subject<unknown>();
        return this.currentPluginObservable;
    }
}
