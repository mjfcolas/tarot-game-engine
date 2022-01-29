import {TarotPlayer} from "./player/tarot-player";
import {Announce} from "./announce/announce";
import {PlayingCard} from "../../../../tarot-card-deck/src";
import {AnnounceManager} from "./announce/announce-manager";
import {CardGameManager} from "../card-game/card-game-manager";
import {TarotTable} from "./table/ports/tarot-table";
import {TarotDealer} from "./dealer/tarot-dealer";

export type GameResult = {
    winner?: TarotPlayer,
}

export type GameResultWithDeck = {
    gameResult: GameResult
    endOfGameDeck: readonly PlayingCard[]
}

export class TarotGame {

    constructor(
        private readonly players: readonly TarotPlayer[],
        private readonly table: TarotTable,
        private readonly dealer: TarotDealer,
        private readonly announceManager: AnnounceManager,
        private readonly cardGameManager: CardGameManager,
        private readonly endOfGameCallback: (gameResult: GameResultWithDeck) => void) {
        this.table.shuffle();
        this.table.cut();
        this.dealer.deal();
        this.resolveTakerAndContinueOrEndGame();
    }

    public announce(playerThatAnnounce: TarotPlayer, announce?: Announce): void {
        this.announceManager.announce(playerThatAnnounce, announce)
    }

    private resolveTakerAndContinueOrEndGame() {
        this.announceManager.announcesAreComplete().subscribe((takerAnnounce) => {
            if (takerAnnounce) {
                this.players.forEach((playerToNotify) => TarotGame.notifyTakerIsKnown(playerToNotify, takerAnnounce.taker, takerAnnounce.announce))
                this.cardGameManager.begin();
            } else {
                this.players.forEach((playerToNotify) => TarotGame.notifyGameIsOver(playerToNotify))
                this.endOfGameCallback(this.noTakerGameResult())
            }
        })
        this.announceManager.beginAnnounces();
    }

    private noTakerGameResult(): GameResultWithDeck {
        return {
            gameResult: undefined,
            endOfGameDeck: this.table.gatherDeck()
        }
    }

    private static notifyTakerIsKnown(playerToNotify: TarotPlayer, playerThatHaveAnnounced: TarotPlayer, announce?: Announce): void {
        playerToNotify.notify({
            type: "TAKER_IS_KNOWN",
            player: playerThatHaveAnnounced,
            announce: announce
        })
    }

    private static notifyGameIsOver(playerToNotify: TarotPlayer): void {
        playerToNotify.notify({
            type: "GAME_IS_OVER"
        })
    }

}
