import {GamePhase} from "../../game-phase";
import {TarotTable} from "../../table/ports/tarot-table";
import {CardGameManager} from "../../../card-game/card-game-manager";
import {PoigneeCardGamePlugin} from "../../poignee/poignee-card-game-plugin";
import {TarotPlayer} from "../../player/tarot-player";
import {PlayingCard} from "tarot-card-deck";
import {map, Observable, of} from "rxjs";
import {isExcuse} from "../../cards/card-types";
import {TarotGameState} from "../../tarot-game";

export class MainGamePhase implements GamePhase<TarotGameState> {

    constructor(private readonly table: TarotTable,
                private readonly cardGameManager: CardGameManager,
                private readonly poigneePlugin: PoigneeCardGamePlugin) {
        this.cardGameManager.registerPlayerTurnPlugin(poigneePlugin)

    }

    public declinePoignee(player: TarotPlayer) {
        this.poigneePlugin.decline(player)
    }

    public announcePoignee(player: TarotPlayer, shownCards: PlayingCard[]) {
        this.poigneePlugin.announce(player, shownCards)
    }

    public play(playerThatPlay: TarotPlayer, card: PlayingCard) {
        this.cardGameManager.play(playerThatPlay, card)
    }

    execute(inputState: TarotGameState): Observable<TarotGameState> {
        if (!inputState.taker) {
            return of(inputState)
        }
        const takerHasExcuseAtStartOfGame = this.table.listCardsOf(inputState.taker.id).some((playingCard: PlayingCard) => isExcuse(playingCard))
        this.cardGameManager.begin();
        return this.cardGameManager.gameIsOver().pipe(map((endGameTricks) => ({
            ...inputState,
            endGameTricks,
            takerHasExcuseAtStartOfGame
        })))
    }
}
