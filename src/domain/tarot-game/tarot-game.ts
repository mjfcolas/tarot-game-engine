import {TarotPlayer} from "./player/tarot-player";
import {Announce} from "./announce/announce";
import {AnnounceManager} from "./announce/announce-manager";
import {CardGameManager} from "../card-game/card-game-manager";
import {TarotTable} from "./table/ports/tarot-table";
import {TarotDealer} from "./dealer/tarot-dealer";
import {PlayingCard} from "tarot-card-deck";
import {getAvailableCardsToSetAside} from "./functions/tarot-available-cards-to-set-aside";
import {PlayerPoints, winnerResolver} from "./functions/tarot-winner-resolver";
import {CardGamePlayer} from "../card-game/player/card-game-player";

export type GameResult = {
    pointsByPlayer: PlayerPoints[]
}

export type GameResultWithDeck = {
    gameResult: GameResult
    endOfGameDeck: readonly PlayingCard[]
}

export class TarotGame {

    private readonly numberOfCardsInDog = 6;
    private taker: TarotPlayer = undefined;

    constructor(
        private readonly players: readonly TarotPlayer[],
        private readonly table: TarotTable,
        private readonly dealer: TarotDealer,
        private readonly announceManager: AnnounceManager,
        private readonly cardGameManager: CardGameManager,
        private readonly getTarotAvailableCardsToSetAside: getAvailableCardsToSetAside,
        private readonly tarotWinnerResolver: winnerResolver,
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
        if (!this.taker || this.taker.id !== playerThatSetAside.id || cardsSetAside.length !== this.numberOfCardsInDog) {
            return TarotGame.notifyErrorWhileSettingAside(playerThatSetAside);
        }
        const availableCardsToSetAside = this.getTarotAvailableCardsToSetAside(this.table.listCardsOf(this.taker.id))
        const forbiddenCardSetAside = cardsSetAside.some(currentCardSetAside => !availableCardsToSetAside.some(availableCard => availableCard.identifier === currentCardSetAside.identifier))
        if (forbiddenCardSetAside) {
            return TarotGame.notifyErrorWhileSettingAside(playerThatSetAside);
        }
        this.table.moveFromHandToPointsOf(cardsSetAside, playerThatSetAside.id);
        this.cardGameManager.gameIsOver().subscribe(_ => this.endOfGameCallback(this.endedGameResult()))
        this.cardGameManager.begin();
    }

    public play(playerThatPlay: TarotPlayer, card: PlayingCard) {
        this.cardGameManager.play(playerThatPlay, card)
    }

    private resolveTakerAndContinueOrEndGame() {
        this.announceManager.announcesAreComplete().subscribe((takerAnnounce) => {
            if (takerAnnounce) {
                this.taker = takerAnnounce.taker;
                this.players.forEach((playerToNotify) => TarotGame.notifyTakerIsKnown(playerToNotify, takerAnnounce.taker, takerAnnounce.announce))
                //TODO Improve tests
                this.table.giveDogToPlayer(this.taker.id)
                TarotGame.notifyCardsAvailable(this.taker, this.table.listCardsOf(this.taker.id))
                TarotGame.notifyPlayerHasToSetAside(this.taker)
            } else {
                this.players.forEach((playerToNotify) => TarotGame.notifyGameIsOver(playerToNotify))
                this.endOfGameCallback(this.noTakerGameResult())
            }
        })
        this.announceManager.beginAnnounces();
    }

    private noTakerGameResult(): GameResultWithDeck {
        return {
            gameResult: undefined,
            endOfGameDeck: this.table.gatherDeck()
        }
    }

    private endedGameResult(): GameResultWithDeck {
        const pointsByPlayer: PlayerPoints[] = this.tarotWinnerResolver(this.players.map(currentPlayer => ({
                playerIdentifier: currentPlayer.id,
                wonCards: this.table.listPointsFor(currentPlayer.id)
            })),
            this.taker.id)
        return {
            gameResult: {
                pointsByPlayer: pointsByPlayer
            },
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

    private static notifyGameIsOver(playerToNotify: TarotPlayer): void {
        playerToNotify.notify({
            type: "GAME_IS_OVER"
        })
    }

    private static notifyCardsAvailable(playerToNotify: TarotPlayer, cards: PlayingCard[]) {
        playerToNotify.notify({
            type: "GOT_AVAILABLE_CARDS",
            cards: cards
        })
    }
}
