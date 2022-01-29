import {CardGameManager} from "./card-game-manager";
import {Observable, ReplaySubject, Subject} from "rxjs";
import {PlayingCard} from "../../../../tarot-card-deck";
import {PlayerWithCard, resolveTurn} from "./functions/resolve-turn";
import {getPlayableCards} from "./functions/playable-cards";
import {PlayableTable} from "./ports/playable-table";
import {CardGamePlayer, PlayerIdentifier} from "./player/card-game-player";

export class DefaultCardGameManager implements CardGameManager {
    private readonly gameIsOverSubject: Subject<PlayableTable> = new ReplaySubject(1);
    private currentTurnManager: OneTurnManager;

    constructor(
        private readonly resolveTurn: resolveTurn,
        private readonly getPlayableCards: getPlayableCards,
        private readonly table: PlayableTable,
        private readonly players: CardGamePlayer[]
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
        this.currentTurnManager.turnIsComplete().subscribe((turnWinner) => this.manageEndOfTurn(turnWinner))
        this.currentTurnManager.beginTurn(playerThatBegin);
    }

    private manageEndOfTurn(turnWinner: CardGamePlayer): void {
        this.players.forEach((playerToNotify) => DefaultCardGameManager.notifyEndOfTurn(playerToNotify, turnWinner))
        if (this.table.getNumberOfRemainingCardsToPlay() !== 0) {
            this.beginTurn(turnWinner);
        } else {
            this.gameIsOverSubject.next(this.table);
        }
    }
}

class OneTurnManager {
    private turnWinner: Subject<CardGamePlayer> = new ReplaySubject(1);
    private currentPlayer: CardGamePlayer;

    private readonly playedCards: PlayerWithCard[] = [];

    constructor(
        private readonly resolveTurn: resolveTurn,
        private readonly getPlayableCards: getPlayableCards,
        private readonly table: PlayableTable,
        private readonly players: CardGamePlayer[]
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

        const currentPlayerIndex = this.players.findIndex(playerToTry => playerThatPlay.id === playerToTry.id);
        const nextPlayerIndex = currentPlayerIndex != this.players.length - 1 ? currentPlayerIndex + 1 : 0;
        if (this.playedCards.length === this.players.length) {
            const turnWinnerIdentifier: PlayerIdentifier = this.resolveTurn(this.playedCards);
            const turnWinner = this.players.find((players) => players.id === turnWinnerIdentifier)
            this.turnWinner.next(turnWinner);
        } else {
            const nextPlayer = this.players[nextPlayerIndex];
            this.currentPlayer = nextPlayer;
            OneTurnManager.askToPlay(nextPlayer);
        }
    }

    turnIsComplete(): Observable<CardGamePlayer> {
        this.currentPlayer = undefined;
        return this.turnWinner
    }
}
