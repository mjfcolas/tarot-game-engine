import {EMPTY, Observable} from "rxjs";
import {CardGamePlayer, PlayerIdentifier} from "../../card-game/player/card-game-player";
import {PlayingCard} from "tarot-card-deck";
import {PlayerPoigneeManager} from "./player-poignee-manager";
import {PlayerTurnPlugin} from "../../card-game/functions/turn-add-in";
import {TarotPlayer} from "../player/tarot-player";
import {DefaultPlayerPoigneeManager} from "./default-player-poignee-manager";
import {Poignee} from "./poignee";

export class PoigneeCardGamePlugin implements PlayerTurnPlugin {

    private readonly poigneesManagerByPlayers: Map<PlayerIdentifier, PlayerPoigneeManager> = new Map<PlayerIdentifier, PlayerPoigneeManager>()
    private potentialPoignee: Poignee = null

    constructor(
        private readonly players: readonly CardGamePlayer[]
    ) {
    }

    public apply(turnNumber: number, player: CardGamePlayer, playerCards: PlayingCard[]): Observable<unknown> {
        if (turnNumber !== 1) {
            return EMPTY;
        }

        this.poigneesManagerByPlayers.set(player.id, new DefaultPlayerPoigneeManager(player, playerCards, this.players))
        const poigneeObservation = this.poigneesManagerByPlayers.get(player.id).observePoigneeAnnounce();
        poigneeObservation.subscribe(poignee => {
            this.potentialPoignee = this.potentialPoignee || poignee
        })
        return poigneeObservation
    }

    public decline(player: CardGamePlayer): void {
        if (!this.poigneesManagerByPlayers.has(player.id)) {
            PoigneeCardGamePlugin.notifyErrorWhileAnnouncing(player)
            return;
        }
        this.poigneesManagerByPlayers.get(player.id).declinePoignee()
    }

    public announce(player: CardGamePlayer, shownCards: PlayingCard[]): void {
        if (!this.poigneesManagerByPlayers.has(player.id)) {
            PoigneeCardGamePlugin.notifyErrorWhileAnnouncing(player)
            return;
        }
        this.poigneesManagerByPlayers.get(player.id).announcePoignee(shownCards)

    }

    public getPotentialPoignee(): Poignee {
        return this.potentialPoignee;
    }

    private static notifyErrorWhileAnnouncing(player: TarotPlayer): void {
        player.notify({
            type: "ERROR_WHILE_ANNOUNCING_POIGNEE"
        })
    }
}
