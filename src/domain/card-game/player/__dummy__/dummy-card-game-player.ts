import {CardGamePlayer} from "../card-game-player";
import {CardGamePlayerNotification} from "../card-game-player-notification";
import {PlayingCard} from "tarot-card-deck";

export class DummyCardGamePlayer implements CardGamePlayer {
    playError = jest.fn();
    askedToPlay = jest.fn();
    playedCardIsKnown = jest.fn();
    turnResultIsKnown = jest.fn()
    availableCardsAreKnown = jest.fn()
    public availableCards: PlayingCard[] = []
    public playableCards: readonly PlayingCard[] = []

    constructor(public readonly id: string) {
    }

    notify(playerNotification: CardGamePlayerNotification) {
        if (playerNotification.type === "GOT_AVAILABLE_CARDS") {
            this.availableCardsAreKnown();
            this.availableCards = playerNotification.cards
        }
        if (playerNotification.type === "ASKED_TO_PLAY") {
            this.askedToPlay();
            this.playableCards = playerNotification.playableCards
        }
        if (playerNotification.type === "ERROR_WHILE_PLAYING") {
            this.playError();
        }
        if (playerNotification.type === "PLAYER_HAS_PLAYED") {
            this.playedCardIsKnown(playerNotification.card, playerNotification.player)
        }
        if (playerNotification.type === "TURN_RESULT_IS_KNOWN") {
            this.turnResultIsKnown(playerNotification.turnWinner)
        }
    }
}
