import {GamePhase} from "../../game-phase";
import {TarotPlayer} from "../../player/tarot-player";
import {TarotTable} from "../../table/ports/tarot-table";
import {AnnounceManager} from "../../announce/announce-manager";
import {Announce} from "../../announce/announce";
import {map, Observable} from "rxjs";
import {TakerAnnounce} from "../../announce/taker-announce";
import {TarotGameState} from "../../tarot-game";
import {ChelemAnnounceManager, DefaultChelemAnnounceManager} from "../../chelem";
import {ChelemType} from "../../chelem/chelem";

export class AnnounceGamePhase implements GamePhase<TarotGameState> {
    private readonly chelemAnnounceManager: ChelemAnnounceManager;
    private currentTaker?: TarotPlayer;

    constructor(private readonly players: readonly TarotPlayer[],
                private readonly table: TarotTable,
                private readonly announceManager: AnnounceManager) {
        this.chelemAnnounceManager = new DefaultChelemAnnounceManager();
    }

    public announce(playerThatAnnounce: TarotPlayer, announce?: Announce): void {
        this.announceManager.announce(playerThatAnnounce, announce)
    }

    public announceChelemAfterContract(player: TarotPlayer, type: ChelemType): void {
        if (!this.currentTaker) {
            this.notifyErrorWhileAnnouncingChelem(player);
            return;
        }

        if (!this.chelemAnnounceManager.canAnnounceChelemAfterContract(player, this.currentTaker)) {
            this.notifyErrorWhileAnnouncingChelem(player);
            return;
        }

        try {
            const chelemAnnounce = this.chelemAnnounceManager.announceChelemAfterContract(player, type);
            this.players.forEach(playerToNotify =>
                this.notifyChelemHasBeenAnnounced(playerToNotify, player, type)
            );
        } catch (error) {
            this.notifyErrorWhileAnnouncingChelem(player);
        }
    }

    execute(inputState: TarotGameState): Observable<TarotGameState> {
        this.announceManager.beginAnnounces();
        return this.announceManager.announcesAreComplete().pipe(map((takerAnnounce: TakerAnnounce) => {
            if (!takerAnnounce) {
                return {
                    ...inputState,
                };
            }
            // Stocker le preneur pour les annonces de Chelem
            this.currentTaker = takerAnnounce.taker;
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

    private notifyErrorWhileAnnouncingChelem(player: TarotPlayer): void {
        player.notify({
            type: "ERROR_WHILE_ANNOUNCING_CHELEM"
        });
    }

    private notifyChelemHasBeenAnnounced(playerToNotify: TarotPlayer, playerThatAnnounced: TarotPlayer, chelemType: ChelemType): void {
        playerToNotify.notify({
            type: "CHELEM_HAS_BEEN_ANNOUNCED",
            player: playerThatAnnounced.id,
            chelemType: chelemType
        });
    }

}
