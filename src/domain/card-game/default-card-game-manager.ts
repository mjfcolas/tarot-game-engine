import {CardGameManager} from "./card-game-manager";
import {Observable} from "rxjs";
import {TarotPlayer} from "../tarot-game/player/tarot-player";
import {PlayingCard} from "../../../../tarot-card-deck";
import {resolveTurn} from "./functions/resolve-turn";
import {getPlayableCards} from "./functions/playable-cards";
import {PlayableTable} from "./ports/playable-table";
import {CardGamePlayer} from "./player/card-game-player";

export class DefaultCardGameManager implements CardGameManager {

    constructor(
        private readonly resolveTurn: resolveTurn,
        private readonly getPlayableCards: getPlayableCards,
        private readonly table: PlayableTable
    ) {
    }

    begin(): void {
    }

    gameIsOver(): Observable<PlayableTable> {
        return undefined;
    }

    play(player: CardGamePlayer, card: PlayingCard) {

    }
}
