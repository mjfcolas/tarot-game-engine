import {PlayerPoigneeManager} from "./player-poignee-manager";
import {Observable, ReplaySubject} from "rxjs";
import {Poignee} from "./poignee";
import {PlayingCard, PlayingCardType} from "tarot-card-deck";
import {CardGamePlayer} from "../../card-game/player/card-game-player";
import {TarotPlayer} from "../player/tarot-player";

const THRESHOLD_BY_POIGNEE_TYPE: Record<Poignee, number> = {
    "SIMPLE": 10,
    "DOUBLE": 13,
    "TRIPLE": 15
}

export class DefaultPlayerPoigneeManager implements PlayerPoigneeManager {

    private announceIsComplete: boolean = false;
    private readonly poigneeAnnounceObservable: ReplaySubject<Poignee> = new ReplaySubject<Poignee>(1);

    private readonly filterOnTrumpsAndExcuse = (card: PlayingCard) => {
        return card.type === PlayingCardType.TRUMP || card.type === PlayingCardType.EXCUSE
    }

    private readonly filterOnTrumpsOnly = (card: PlayingCard) => {
        return card.type === PlayingCardType.TRUMP
    }

    private readonly potentialPoigneeType: Poignee
    private readonly numberOfEligibleCards: number
    private readonly excuseIsEligibleForPoignee: boolean
    private readonly possibleCardsToShow: PlayingCard[]

    constructor(
        private readonly player: CardGamePlayer,
        private readonly playerCards: PlayingCard[],
        private readonly allPlayers: readonly CardGamePlayer[]) {
        this.numberOfEligibleCards = playerCards.filter(this.filterOnTrumpsAndExcuse).length
        if (this.numberOfEligibleCards >= THRESHOLD_BY_POIGNEE_TYPE[Poignee.SIMPLE] && this.numberOfEligibleCards < THRESHOLD_BY_POIGNEE_TYPE[Poignee.DOUBLE]) {
            this.potentialPoigneeType = Poignee.SIMPLE
        } else if (this.numberOfEligibleCards >= THRESHOLD_BY_POIGNEE_TYPE[Poignee.DOUBLE] && this.numberOfEligibleCards < THRESHOLD_BY_POIGNEE_TYPE[Poignee.TRIPLE]) {
            this.potentialPoigneeType = Poignee.DOUBLE
        } else if (this.numberOfEligibleCards >= THRESHOLD_BY_POIGNEE_TYPE[Poignee.TRIPLE]) {
            this.potentialPoigneeType = Poignee.TRIPLE
        } else {
            this.potentialPoigneeType = null
        }

        if (!this.potentialPoigneeType) {
            this.terminatePoigneeAnnounce(undefined);
            return;
        }

        const cardsContainsExcuse = playerCards.some(card => card.type === PlayingCardType.EXCUSE)
        const justEnoughCardsForPoignee = Object.values(THRESHOLD_BY_POIGNEE_TYPE).includes(this.numberOfEligibleCards)
        this.excuseIsEligibleForPoignee = cardsContainsExcuse && justEnoughCardsForPoignee;

        this.possibleCardsToShow = playerCards.filter(this.excuseIsEligibleForPoignee ? this.filterOnTrumpsAndExcuse : this.filterOnTrumpsOnly);
        DefaultPlayerPoigneeManager.askForPoigneeAnnounce(
            this.player,
            THRESHOLD_BY_POIGNEE_TYPE[this.potentialPoigneeType],
            this.possibleCardsToShow
        )
    }

    announcePoignee(shownCards: PlayingCard[]) {
        if (this.announceIsComplete) {
            DefaultPlayerPoigneeManager.notifyErrorWhileAnnouncing(this.player)
            return;
        }
        const distinctShownCards = new Set(shownCards)
        if (distinctShownCards.size !== THRESHOLD_BY_POIGNEE_TYPE[this.potentialPoigneeType]) {
            DefaultPlayerPoigneeManager.notifyErrorWhileAnnouncing(this.player)
            return;
        }
        const possibleCardsToShowIds = this.possibleCardsToShow.map(card => card.identifier);
        const shownCardsAreAllAuthorized = shownCards.map(card => card.identifier).every(shownCardId => possibleCardsToShowIds.includes(shownCardId))
        if (!shownCardsAreAllAuthorized) {
            DefaultPlayerPoigneeManager.notifyErrorWhileAnnouncing(this.player)
            return;
        }
        this.allPlayers.forEach(currentPlayerToNotify => {
            DefaultPlayerPoigneeManager.notifyPlayerHasAnnouncedPoignee(currentPlayerToNotify, this.player, shownCards)
        })
        this.terminatePoigneeAnnounce(this.potentialPoigneeType);
    }


    declinePoignee() {
        if (this.announceIsComplete) {
            DefaultPlayerPoigneeManager.notifyErrorWhileAnnouncing(this.player)
            return;
        }
        this.terminatePoigneeAnnounce(undefined);
    }

    observePoigneeAnnounce(): Observable<Poignee> {
        return this.poigneeAnnounceObservable;
    }

    private terminatePoigneeAnnounce(potentialPoignee: Poignee) {
        this.poigneeAnnounceObservable.next(potentialPoignee)
        this.poigneeAnnounceObservable.complete()
        this.announceIsComplete = true
    }

    private static askForPoigneeAnnounce(player: TarotPlayer, numberOfCardsToShow: number, possibleCardsToShow: PlayingCard[]): void {
        player.notify({
            type: "ASKED_FOR_POIGNEE_ANNOUNCE",
            numberOfCardsToShow,
            possibleCardsToShow
        })
    }

    private static notifyErrorWhileAnnouncing(player: TarotPlayer): void {
        player.notify({
            type: "ERROR_WHILE_ANNOUNCING_POIGNEE"
        })
    }

    private static notifyPlayerHasAnnouncedPoignee(playerToNotify: TarotPlayer, playerThatHaveAnnounced: TarotPlayer, shownCards: PlayingCard[]): void {
        playerToNotify.notify({
            type: "POIGNEE_HAS_BEEN_ANNOUNCED",
            player: playerThatHaveAnnounced.id,
            shownCards: shownCards
        })
    }

}
