import {TarotPlayer} from "../tarot-player";
import {TarotPlayerNotification} from "../tarot-player-notification";
import {Announce} from "../../announce/announce";
import {DummyCardGamePlayer} from "../../../card-game/player/__dummy__/dummy-card-game-player";
import {CardGamePlayerNotification} from "../../../card-game/player/card-game-player-notification";
import {PlayingCard} from "tarot-card-deck";

export class DummyTarotPlayer extends DummyCardGamePlayer implements TarotPlayer {
    announceDone = jest.fn();
    announceError = jest.fn();
    playError = jest.fn();
    takerIsKnown = jest.fn();
    gameOver = jest.fn();
    gameAborted = jest.fn();
    askedToPlay = jest.fn();
    playedCardIsKnown = jest.fn();
    turnResultIsKnown = jest.fn()
    hasToSetAside = jest.fn();
    setAsideError = jest.fn();
    public availableCards: PlayingCard[] = []
    public availableAnnounces: Announce[] = []

    constructor(public readonly id: string) {
        super(id)
    }

    notify(playerNotification: TarotPlayerNotification) {
        super.notify(playerNotification as CardGamePlayerNotification)
        if (playerNotification.type === "ASKED_FOR_ANNOUNCE") {
            this.availableAnnounces = playerNotification.availableAnnounces;
        }
        if (playerNotification.type === "ERROR_WHILE_ANNOUNCING") {
            this.announceError()
        }
        if (playerNotification.type === "PLAYER_HAS_ANNOUNCED") {
            this.announceDone(playerNotification.player, playerNotification.announce)
        }
        if (playerNotification.type === "TAKER_IS_KNOWN") {
            this.takerIsKnown(playerNotification.player, playerNotification.announce)
        }
        if (playerNotification.type === "GAME_IS_OVER") {
            this.gameOver(playerNotification.numberOfPointsForAttack)
        }
        if (playerNotification.type === "GAME_IS_ABORTED") {
            this.gameAborted()
        }
        if(playerNotification.type === "ASKED_FOR_SET_ASIDE"){
            this.hasToSetAside(playerNotification.possibleCardsToSetAside)
        }
        if(playerNotification.type === "ERROR_WHILE_SETTING_ASIDE"){
            this.setAsideError();
        }
    }
}
