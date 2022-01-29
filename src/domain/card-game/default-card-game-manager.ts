import {CardGameManager} from "./card-game-manager";
import {Observable, ReplaySubject, Subject} from "rxjs";
import {PlayedCard, resolveTurn, TurnResult} from "./functions/resolve-turn";
import {getPlayableCards} from "./functions/playable-cards";
import {PlayableTable} from "./ports/playable-table";
import {CardGamePlayer} from "./player/card-game-player";
import {PlayingCard} from "tarot-card-deck";

export class DefaultCardGameManager implements CardGameManager {
    private readonly gameIsOverSubject: Subject<PlayableTable> = new ReplaySubject(1);
    private currentTurnManager: OneTurnManager;

    constructor(
        private readonly resolveTurn: resolveTurn,
        private readonly getPlayableCards: getPlayableCards,
        private readonly table: PlayableTable,
        private readonly players: readonly CardGamePlayer[]
    ) {
    }

    private static notifyEndOfTurn(playerToNotify: CardGamePlayer, turnWinner: CardGamePlayer) {
        playerToNotify.notify({
            type: "TURN_RESULT_IS_KNOWN",
            turnWinner: turnWinner
        })
    }

    begin(): void {
        this.beginTurn(this.players[0]);
    }

    gameIsOver(): Observable<PlayableTable> {
        return this.gameIsOverSubject;
    }

    play(playerThatPlay: CardGamePlayer, card: PlayingCard) {
        this.currentTurnManager.play(playerThatPlay, card)
    }

    private beginTurn(playerThatBegin: CardGamePlayer): void {
        this.currentTurnManager = new OneTurnManager(this.resolveTurn, this.getPlayableCards, this.table, this.players);
        this.currentTurnManager.turnIsComplete().subscribe((turnResult) => this.manageEndOfTurn(turnResult))
        this.currentTurnManager.beginTurn(playerThatBegin);
    }

    private manageEndOfTurn(turnResult: TurnResult): void {
        const turnWinner: CardGamePlayer = this.players.find((currentPlayer) => currentPlayer.id === turnResult.winner)
        this.players.forEach((playerToNotify) => DefaultCardGameManager.notifyEndOfTurn(playerToNotify, turnWinner))
        turnResult.wonCardsByPlayer.forEach((wonCardsForPlayer) => this.table.moveToPointsOf(wonCardsForPlayer.wonCards, wonCardsForPlayer.playerIdentifier))

        if (this.table.getNumberOfRemainingCardsToPlay() !== 0) {
            this.beginTurn(turnWinner);
        } else {
            this.gameIsOverSubject.next(this.table);
        }
    }
}

class OneTurnManager {
    private turnResult: Subject<TurnResult> = new ReplaySubject(1);
    private currentPlayer: CardGamePlayer;

    private readonly playedCards: PlayedCard[] = [];

    constructor(
        private readonly resolveTurn: resolveTurn,
        private readonly getPlayableCards: getPlayableCards,
        private readonly table: PlayableTable,
        private readonly players: readonly CardGamePlayer[]
    ) {
    }

    private static askToPlay(player: CardGamePlayer) {
        player.notify({
            type: "ASKED_TO_PLAY"
        })
    }

    private static notifyErrorWhilePlaying(player: CardGamePlayer) {
        player.notify({
            type: "ERROR_WHILE_PLAYING"
        })
    }

    private static notifyPlayerHasPlayed(playerToNotify: CardGamePlayer, playerThatPlayed: CardGamePlayer, playedCard: PlayingCard) {
        playerToNotify.notify({
            type: "PLAYER_HAS_PLAYED",
            player: playerThatPlayed,
            card: playedCard
        })
    }

    private static notifyCardsAvailable(playerToNotify: CardGamePlayer, cards: PlayingCard[]) {
        playerToNotify.notify({
            type: "GOT_AVAILABLE_CARDS",
            cards: cards
        })
    }

    beginTurn(playerThatBegin: CardGamePlayer): void {
        this.currentPlayer = playerThatBegin
        OneTurnManager.askToPlay(this.players[0])
    }

    play(playerThatPlay: CardGamePlayer, card: PlayingCard) {
        if (!this.currentPlayer || playerThatPlay.id !== this.currentPlayer.id) {
            return OneTurnManager.notifyErrorWhilePlaying(playerThatPlay);
        }
        const playableCards = this.getPlayableCards(this.playedCards.map((currentPlayedCard) => currentPlayedCard.playingCard), this.table.getCardsFor(playerThatPlay.id))
        if (playableCards.findIndex((playableCard) => card.identifier === playableCard.identifier) < 0) {
            return OneTurnManager.notifyErrorWhilePlaying(playerThatPlay);
        }

        this.playedCards.push({playingCard: card, playerIdentifier: playerThatPlay.id})
        this.players.forEach((playerToNotify) => OneTurnManager.notifyPlayerHasPlayed(playerToNotify, playerThatPlay, card))
        this.table.moveCardOfPlayerToTable(card, playerThatPlay.id);
        OneTurnManager.notifyCardsAvailable(playerThatPlay, this.table.listCardsOf(playerThatPlay.id));

        const currentPlayerIndex = this.players.findIndex(playerToTry => playerThatPlay.id === playerToTry.id);
        const nextPlayerIndex = currentPlayerIndex != this.players.length - 1 ? currentPlayerIndex + 1 : 0;
        if (this.playedCards.length === this.players.length) {
            const turnResult: TurnResult = this.resolveTurn(this.playedCards);
            this.turnResult.next(turnResult);
        } else {
            const nextPlayer = this.players[nextPlayerIndex];
            this.currentPlayer = nextPlayer;
            OneTurnManager.askToPlay(nextPlayer);
        }
    }

    turnIsComplete(): Observable<TurnResult> {
        this.currentPlayer = undefined;
        return this.turnResult
    }
}
