import {GamePhase} from "../../game-phase";
import {TarotPlayer} from "../../player/tarot-player";
import {map, Observable, of, ReplaySubject, Subject} from "rxjs";
import {TarotTable} from "../../table/ports/tarot-table";
import {
    GetIncorrectCardsSetAside,
    GetPossibleCardsToSetAside
} from "../../functions/tarot-available-cards-to-set-aside";
import {PlayingCard} from "tarot-card-deck";
import {TarotGameState} from "../../tarot-game";

export class SetAsideGamePhase implements GamePhase<TarotGameState> {

    private playerThatHasToSetAside: TarotPlayer = undefined;
    private beginGame: Subject<unknown> = new ReplaySubject(1);

    constructor(private readonly table: TarotTable,
                private readonly numberOfCardsInDog: number,
                private readonly getIncorrectCardsSetAside: GetIncorrectCardsSetAside,
                private readonly getPossibleCardsToSetAside: GetPossibleCardsToSetAside,) {
    }

    execute(inputState: TarotGameState): Observable<TarotGameState> {
        if (!inputState.hasToSetAside) {
            return of(inputState)
        }
        this.playerThatHasToSetAside = inputState.taker;

        SetAsideGamePhase.notifyCardsAvailable(inputState.taker, this.table.listCardsOf(inputState.taker.id))
        SetAsideGamePhase.notifyPlayerHasToSetAside(inputState.taker, this.getPossibleCardsToSetAside(this.table.listCardsOf(inputState.taker.id), this.numberOfCardsInDog))

        return this.beginGame.pipe(map(() => ({
            ...inputState
        })));
    }

    public setAside(playerThatSetAside: TarotPlayer, cardsSetAside: PlayingCard[]) {
        if (this.playerThatHasToSetAside?.id !== playerThatSetAside.id || cardsSetAside.length !== this.numberOfCardsInDog) {
            return SetAsideGamePhase.notifyErrorWhileSettingAside(playerThatSetAside);
        }
        const forbiddenCardsSetAside = this.getIncorrectCardsSetAside(this.table.listCardsOf(this.playerThatHasToSetAside.id), cardsSetAside)
        if (forbiddenCardsSetAside.length > 0) {
            return SetAsideGamePhase.notifyErrorWhileSettingAside(playerThatSetAside);
        }
        this.table.moveFromHandToPointsOf(cardsSetAside, playerThatSetAside.id);
        SetAsideGamePhase.notifyCardsAvailable(this.playerThatHasToSetAside, this.table.listCardsOf(this.playerThatHasToSetAside.id))
        this.playerThatHasToSetAside = undefined;
        this.beginGame.next("");
    }

    private static notifyCardsAvailable(playerToNotify: TarotPlayer, cards: PlayingCard[]) {
        playerToNotify.notify({
            type: "GOT_AVAILABLE_CARDS",
            cards: cards
        })
    }

    private static notifyPlayerHasToSetAside(playerToNotify: TarotPlayer, availableCardsToSetAside: PlayingCard[]): void {
        playerToNotify.notify({
            type: "ASKED_FOR_SET_ASIDE",
            possibleCardsToSetAside: availableCardsToSetAside
        })
    }

    private static notifyErrorWhileSettingAside(playerToNotify: TarotPlayer): void {
        playerToNotify.notify({
            type: "ERROR_WHILE_SETTING_ASIDE"
        })
    }
}
