import {CardGameManager} from "./card-game-manager";
import {Observable} from "rxjs";
import {TarotPlayer} from "../player/tarot-player";
import {PlayingCard} from "../../../../tarot-card-deck";
import {PlayerIdentifier} from "./turn/turn-resolver";
import {TarotTable} from "../table/tarot-table";

export class DefaultCardGameManager implements CardGameManager {

    constructor(
        private readonly resolveTurn: (playedCards: { playingCard: PlayingCard, playerIdentifier: PlayerIdentifier }[]) => PlayerIdentifier,
        private readonly getPlayableCards: (playedCards: PlayingCard[], availableCards: PlayingCard[]) => PlayingCard[],
        private readonly table: TarotTable
    ) {
    }

    begin(): void {
    }

    gameIsOver(): Observable<TarotTable> {
        return undefined;
    }

    play(player: TarotPlayer, card: PlayingCard) {

    }
}
