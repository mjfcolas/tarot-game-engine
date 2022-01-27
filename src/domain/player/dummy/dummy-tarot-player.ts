import {TarotPlayer} from "../tarot-player";
import {PlayingCard} from "../../../../../tarot-card-deck/src";
import {PlayerNotification} from "../player-notification";
import {Announce} from "../../announce/announce";

export class DummyTarotPlayer implements TarotPlayer {
    announceDone = jest.fn();
    announceError = jest.fn();
    takerIsKnown = jest.fn();
    gameOver = jest.fn();
    public availableCards: PlayingCard[] = []
    public availableAnnounces: Announce[] = []

    constructor(public readonly id: string) {
    }

    notify(playerNotification: PlayerNotification) {
        if (playerNotification.type === "GOT_AVAILABLE_CARDS") {
            this.availableCards = playerNotification.cards
        }
        if (playerNotification.type === "ASKED_FOR_ANNOUNCE") {
            this.availableAnnounces = playerNotification.availableAnnounces;
        }
        if(playerNotification.type === "ERROR_WHILE_ANNOUNCING"){
            this.announceError()
        }
        if(playerNotification.type === "PLAYER_HAS_ANNOUNCED"){
            this.announceDone(playerNotification.player, playerNotification.announce)
        }
        if(playerNotification.type === "TAKER_IS_KNOWN"){
            this.takerIsKnown(playerNotification.player, playerNotification.announce)
        }
        if(playerNotification.type === "GAME_IS_OVER"){
            this.gameOver()
        }
    }
}
