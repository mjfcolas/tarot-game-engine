import {GamePhase} from "../../game-phase";
import {TarotPlayer} from "../../player/tarot-player";
import {TarotTable} from "../../table/ports/tarot-table";
import {AnnounceManager} from "../../announce/announce-manager";
import {Announce} from "../../announce/announce";
import {map, Observable} from "rxjs";
import {TakerAnnounce} from "../../announce/taker-announce";
import {TarotGameState} from "../../tarot-game";

export class AnnounceGamePhase implements GamePhase<TarotGameState> {

    constructor(private readonly players: readonly TarotPlayer[],
                private readonly table: TarotTable,
                private readonly announceManager: AnnounceManager) {
    }

    public announce(playerThatAnnounce: TarotPlayer, announce?: Announce): void {
        this.announceManager.announce(playerThatAnnounce, announce)
    }

    execute(inputState: TarotGameState): Observable<TarotGameState> {
        this.announceManager.beginAnnounces();
        return this.announceManager.announcesAreComplete().pipe(map((takerAnnounce: TakerAnnounce) => {
            if (!takerAnnounce) {
                return {
                    ...inputState,
                };
            }
            this.players.forEach((playerToNotify) => AnnounceGamePhase.notifyTakerIsKnown(playerToNotify, takerAnnounce))
            switch (takerAnnounce.announce) {
                case Announce.PRISE:
                case Announce.GARDE:
                    this.table.giveDogToPlayerHand(takerAnnounce.taker.id)
                    return {
                        ...inputState,
                        takerAnnounce: takerAnnounce.announce,
                        taker: takerAnnounce.taker,
                        hasToSetAside: true
                    };
                case Announce.GARDE_SANS:
                    this.table.giveDogToPlayerPoints(takerAnnounce.taker.id)
                    return {
                        ...inputState,
                        takerAnnounce: takerAnnounce.announce,
                        taker: takerAnnounce.taker,
                        hasToSetAside: false
                    };
                case Announce.GARDE_CONTRE:
                    const playerThatIsNotTaker = this.players.find(player => player.id !== takerAnnounce.taker.id);
                    this.table.giveDogToPlayerPoints(playerThatIsNotTaker.id)
                    return {
                        ...inputState,
                        takerAnnounce: takerAnnounce.announce,
                        taker: takerAnnounce.taker,
                        hasToSetAside: false
                    };
            }
        }));
    }

    private static notifyTakerIsKnown(playerToNotify: TarotPlayer, takerAnnounce: TakerAnnounce): void {
        playerToNotify.notify({
            type: "TAKER_IS_KNOWN",
            player: takerAnnounce.taker.id,
            announce: takerAnnounce.announce
        })
    }

}
