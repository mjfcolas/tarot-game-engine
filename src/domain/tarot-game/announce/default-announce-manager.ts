import {AnnounceManager} from "./announce-manager";
import {TarotPlayer} from "../player/tarot-player";
import {Announce, pruneAnnouncesLowerThanGivenAnnounce} from "./announce";
import {TakerAnnounce} from "./taker-announce";
import {Observable, ReplaySubject, Subject} from "rxjs";

export class DefaultAnnounceManager implements AnnounceManager {

    private potentialTakerAnnounce: TakerAnnounce = null;

    private taker: Subject<TakerAnnounce> = new ReplaySubject(1);
    private availableAnnounces: Announce[] = Object.values(Announce);
    private currentPlayer: TarotPlayer;

    constructor(
        private readonly players: readonly TarotPlayer[]
    ) {
    }

    private static askForAnnounce(player: TarotPlayer, availableAnnounces: Announce[]): void {
        player.notify({
            type: "ASKED_FOR_ANNOUNCE",
            availableAnnounces: availableAnnounces
        })
    }

    private static notifyErrorWhileAnnouncing(player: TarotPlayer): void {
        player.notify({
            type: "ERROR_WHILE_ANNOUNCING"
        })
    }

    private static notifyPlayerHasAnnounced(playerToNotify: TarotPlayer, playerThatHaveAnnounced: TarotPlayer, announce?: Announce): void {
        playerToNotify.notify({
            type: "PLAYER_HAS_ANNOUNCED",
            player: playerThatHaveAnnounced,
            announce: announce
        })
    }

    beginAnnounces(): void {
        this.currentPlayer = this.players[0];
        DefaultAnnounceManager.askForAnnounce(this.currentPlayer, this.availableAnnounces)
    }

    announce(playerThatAnnounce: TarotPlayer, announce?: Announce): void {
        if (!this.currentPlayer || playerThatAnnounce.id !== this.currentPlayer.id) {
            return DefaultAnnounceManager.notifyErrorWhileAnnouncing(playerThatAnnounce);
        }
        if (announce && this.availableAnnounces.findIndex((availableAnnounce) => availableAnnounce === announce) < 0) {
            return DefaultAnnounceManager.notifyErrorWhileAnnouncing(playerThatAnnounce);
        }

        this.availableAnnounces = pruneAnnouncesLowerThanGivenAnnounce(announce)
        this.players.forEach((playerToNotify) => DefaultAnnounceManager.notifyPlayerHasAnnounced(playerToNotify, playerThatAnnounce, announce))

        if(announce){
            this.potentialTakerAnnounce = {
                taker: playerThatAnnounce,
                announce: announce
            }
        }

        const nextPlayerIndex = this.players.findIndex(playerToTry => playerThatAnnounce.id === playerToTry.id) + 1;
        if (nextPlayerIndex === this.players.length) {
            this.currentPlayer = undefined;
            this.taker.next(this.potentialTakerAnnounce)
            this.taker.complete()
        } else {
            const nextPlayer = this.players[nextPlayerIndex];
            this.currentPlayer = nextPlayer;
            DefaultAnnounceManager.askForAnnounce(nextPlayer, this.availableAnnounces);
        }
    }

    announcesAreComplete(): Observable<TakerAnnounce> {
        this.currentPlayer = undefined;
        return this.taker
    }

}
