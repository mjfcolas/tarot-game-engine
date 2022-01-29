import {TarotPlayer} from "../tarot-player";
import {PlayingCard} from "../../../../../tarot-card-deck/src";
import {PlayerNotification} from "../player-notification";
import {Announce} from "../../announce/announce";

export class DummyTarotPlayer implements TarotPlayer {
    announceDone = jest.fn();
    announceError = jest.fn();
    playError = jest.fn();
    takerIsKnown = jest.fn();
    gameOver = jest.fn();
    askedToPlay = jest.fn();
    playedCardIsKnown = jest.fn();
    turnResultIsKnown = jest.fn()
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
        if(playerNotification.type === "ASKED_TO_PLAY"){
            this.askedToPlay();
        }
        if(playerNotification.type === "ERROR_WHILE_PLAYING"){
            this.playError();
        }
        if(playerNotification.type === "PLAYER_HAS_PLAYED"){
            this.playedCardIsKnown(playerNotification.card)
        }
        if(playerNotification.type === "TURN_RESULT_IS_KNOWN"){
            this.turnResultIsKnown(playerNotification.turnWinner)
        }
    }
}
