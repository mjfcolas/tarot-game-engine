import {TarotTable} from "../table/tarot-table";
import {TarotPlayer} from "../player/tarot-player";
import {Announce} from "../announce/announce";
import {PlayingCard} from "../../../../tarot-card-deck/src";
import {AnnounceManager} from "../announce/announce-manager";

export type GameResult = {
    winner?: TarotPlayer,
    endOfGameDeck: readonly PlayingCard[]
}

export class TarotGame {

    constructor(
        private readonly players: readonly TarotPlayer[],
        private readonly table: TarotTable,
        private readonly announceManager: AnnounceManager,
        private readonly endOfGameCallback: (gameResult: GameResult) => void) {
        this.table.shuffle();
        this.table.cut();
        this.table.deal();
        this.resolveTakerAndContinueOrEndGame();
        this.announceManager.beginAnnounces();
    }

    public announce(playerThatAnnounce: TarotPlayer, announce?: Announce): void {
        this.announceManager.announce(playerThatAnnounce, announce)
    }


    private resolveTakerAndContinueOrEndGame() {
        this.announceManager.announcesAreComplete().subscribe((takerAnnounce) => {
            if (takerAnnounce) {
                this.players.forEach((playerToNotify) => TarotGame.notifyTakerIsKnown(playerToNotify, takerAnnounce.taker, takerAnnounce.announce))
            } else {
                this.players.forEach((playerToNotify) => TarotGame.notifyGameIsOver(playerToNotify))
                this.endOfGameCallback(this.noTakerGameResult())
            }
        })
    }

    private noTakerGameResult(): GameResult {
        return {
            winner: undefined,
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
