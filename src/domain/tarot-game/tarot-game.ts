import {TarotPlayer} from "./player/tarot-player";
import {Announce} from "./announce/announce";
import {AnnounceManager} from "./announce/announce-manager";
import {CardGameManager} from "../card-game/card-game-manager";
import {TarotTable} from "./table/ports/tarot-table";
import {TarotDealer} from "./dealer/tarot-dealer";
import {PlayingCard} from "tarot-card-deck";
import {GetIncorrectCardsSetAside} from "./functions/tarot-available-cards-to-set-aside";
import {CountEndGameScore} from "./functions/count-tarot-end-game-score";
import {isExcuse} from "./cards/card-types";

export type GameResultWithDeck = {
    numberOfPointsForTaker: number
    endOfGameDeck: readonly PlayingCard[]
}

export class TarotGame {

    private readonly numberOfCardsInDog = 6;
    private taker: TarotPlayer = undefined;
    private gameHasBegan = false;
    private takerHasExcuseAtStartOfGame = undefined;

    constructor(
        private readonly players: readonly TarotPlayer[],
        private readonly table: TarotTable,
        private readonly dealer: TarotDealer,
        private readonly announceManager: AnnounceManager,
        private readonly cardGameManager: CardGameManager,
        private readonly verifyCardsSetAside: GetIncorrectCardsSetAside,
        private readonly countEndGameScore: CountEndGameScore,
        private readonly endOfGameCallback: (gameResult: GameResultWithDeck) => void) {
        this.table.shuffle();
        this.table.cut();
        this.dealer.deal(this.numberOfCardsInDog);
        this.resolveTakerAndContinueOrEndGame();
    }

    public announce(playerThatAnnounce: TarotPlayer, announce?: Announce): void {
        this.announceManager.announce(playerThatAnnounce, announce)
    }

    public setAside(playerThatSetAside: TarotPlayer, cardsSetAside: PlayingCard[]) {
        if (this.gameHasBegan || !this.taker || this.taker.id !== playerThatSetAside.id || cardsSetAside.length !== this.numberOfCardsInDog) {
            return TarotGame.notifyErrorWhileSettingAside(playerThatSetAside);
        }
        const forbiddenCardsSetAside = this.verifyCardsSetAside(this.table.listCardsOf(this.taker.id), cardsSetAside)
        if (forbiddenCardsSetAside.length > 0) {
            return TarotGame.notifyErrorWhileSettingAside(playerThatSetAside);
        }
        this.table.moveFromHandToPointsOf(cardsSetAside, playerThatSetAside.id);
        this.takerHasExcuseAtStartOfGame = this.table.listCardsOf(this.taker.id).some((playingCard: PlayingCard) => isExcuse(playingCard))
        this.cardGameManager.gameIsOver().subscribe(_ => this.endGame())
        TarotGame.notifyCardsAvailable(this.taker, this.table.listCardsOf(this.taker.id))
        this.cardGameManager.begin();
        this.gameHasBegan = true;
    }

    public play(playerThatPlay: TarotPlayer, card: PlayingCard) {
        this.cardGameManager.play(playerThatPlay, card)
    }

    private resolveTakerAndContinueOrEndGame() {
        this.announceManager.announcesAreComplete().subscribe((takerAnnounce) => {
            if (takerAnnounce) {
                this.taker = takerAnnounce.taker;
                this.players.forEach((playerToNotify) => TarotGame.notifyTakerIsKnown(playerToNotify, takerAnnounce.taker, takerAnnounce.announce))
                this.table.giveDogToPlayer(this.taker.id)
                TarotGame.notifyCardsAvailable(this.taker, this.table.listCardsOf(this.taker.id))
                TarotGame.notifyPlayerHasToSetAside(this.taker)
            } else {
                this.players.forEach((playerToNotify) => TarotGame.notifyGameIsOver(playerToNotify, null))
                this.endOfGameCallback(this.noTakerGameResult())
            }
        })
        this.announceManager.beginAnnounces();
    }

    private noTakerGameResult(): GameResultWithDeck {
        return {
            numberOfPointsForTaker: undefined,
            endOfGameDeck: this.table.gatherDeck()
        }
    }


    private endGame(): void {
        const endedGameResult: GameResultWithDeck = this.endedGameResult();
        this.players.forEach((playerToNotify) => TarotGame.notifyGameIsOver(playerToNotify, endedGameResult.numberOfPointsForTaker))
        this.endOfGameCallback(endedGameResult)
    }

    private endedGameResult(): GameResultWithDeck {
        const endGameScoreForTaker: number = this.countEndGameScore(
            this.table.listPointsFor(this.taker.id),
            this.takerHasExcuseAtStartOfGame);
        return {
            numberOfPointsForTaker: endGameScoreForTaker,
            endOfGameDeck: this.table.gatherDeck()
        }
    }

    private static notifyTakerIsKnown(playerToNotify: TarotPlayer, playerThatHaveAnnounced: TarotPlayer, announce?: Announce): void {
        playerToNotify.notify({
            type: "TAKER_IS_KNOWN",
            player: playerThatHaveAnnounced,
            announce: announce
        })
    }

    private static notifyPlayerHasToSetAside(playerToNotify: TarotPlayer): void {
        playerToNotify.notify({
            type: "ASKED_FOR_SET_ASIDE"
        })
    }

    private static notifyErrorWhileSettingAside(playerToNotify: TarotPlayer): void {
        playerToNotify.notify({
            type: "ERROR_WHILE_SETTING_ASIDE"
        })
    }

    private static notifyGameIsOver(playerToNotify: TarotPlayer, numberOfPointsForTaker?: number): void {
        playerToNotify.notify({
            type: "GAME_IS_OVER",
            numberOfPointsForTaker: numberOfPointsForTaker
        })
    }

    private static notifyCardsAvailable(playerToNotify: TarotPlayer, cards: PlayingCard[]) {
        playerToNotify.notify({
            type: "GOT_AVAILABLE_CARDS",
            cards: cards
        })
    }
}
