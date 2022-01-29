import {PlayingCard} from "../../../../../../tarot-card-deck/src";
import {CardGamePlayer} from "../card-game-player";
import {CardGamePlayerNotification} from "../card-game-player-notification";

export class DummyCardGamePlayer implements CardGamePlayer {
    playError = jest.fn();
    askedToPlay = jest.fn();
    playedCardIsKnown = jest.fn();
    turnResultIsKnown = jest.fn()
    public availableCards: PlayingCard[] = []

    constructor(public readonly id: string) {
    }

    notify(playerNotification: CardGamePlayerNotification) {
        if (playerNotification.type === "GOT_AVAILABLE_CARDS") {
            this.availableCards = playerNotification.cards
        }
        if (playerNotification.type === "ASKED_TO_PLAY") {
            this.askedToPlay();
        }
        if (playerNotification.type === "ERROR_WHILE_PLAYING") {
            this.playError();
        }
        if (playerNotification.type === "PLAYER_HAS_PLAYED") {
            this.playedCardIsKnown(playerNotification.card)
        }
        if (playerNotification.type === "TURN_RESULT_IS_KNOWN") {
            this.turnResultIsKnown(playerNotification.turnWinner)
        }
    }
}
