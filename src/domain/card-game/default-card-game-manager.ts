import {CardGameManager, Trick} from "./card-game-manager";
import {defaultIfEmpty, forkJoin, Observable, ReplaySubject, Subject} from "rxjs";
import {PlayedCard, ResolveTurn, TurnResult} from "./functions/resolve-turn";
import {GetPlayableCards} from "./functions/playable-cards";
import {PlayableTable} from "./ports/playable-table";
import {CardGamePlayer} from "./player/card-game-player";
import {PlayingCard} from "tarot-card-deck";
import {PlayerTurnPlugin} from "./functions/turn-add-in";


export class DefaultCardGameManager implements CardGameManager {
    private readonly gameIsOverSubject: Subject<Trick[]> = new ReplaySubject(1);
    private readonly gameTricks: Trick[] = [];
    private currentTurnManager: OneTurnManager;
    private readonly playerTurnPlugin: PlayerTurnPlugin[] = []

    constructor(
        private readonly resolveTurn: ResolveTurn,
        private readonly getPlayableCards: GetPlayableCards,
        private readonly table: PlayableTable,
        private readonly players: readonly CardGamePlayer[]
    ) {
    }

    private static notifyEndOfTurn(playerToNotify: CardGamePlayer, turnWinner: CardGamePlayer) {
        playerToNotify.notify({
            type: "TURN_RESULT_IS_KNOWN",
            turnWinner: turnWinner.id
        })
    }

    registerPlayerTurnPlugin(plugin: PlayerTurnPlugin): void {
        this.playerTurnPlugin.push(plugin)
    }

    begin(): void {
        this.beginTurn(this.players[0]);
    }

    gameIsOver(): Observable<Trick[]> {
        return this.gameIsOverSubject;
    }

    play(playerThatPlay: CardGamePlayer, card: PlayingCard) {
        if (!this.currentTurnManager) {
            playerThatPlay.notify({
                type: "ERROR_WHILE_PLAYING"
            })
            return;
        }
        this.currentTurnManager.play(playerThatPlay, card)
    }

    private beginTurn(playerThatBegin: CardGamePlayer): void {
        this.currentTurnManager = new OneTurnManager(
            this.resolveTurn,
            this.getPlayableCards,
            (this.currentTurnManager?.turnNumber | 0) + 1,
            this.playerTurnPlugin,
            this.table,
            this.players
        )
        ;
        this.currentTurnManager.turnIsComplete().subscribe((turnResult) => this.manageEndOfTurn(turnResult))
        this.currentTurnManager.beginTurn(playerThatBegin);
    }

    private manageEndOfTurn(turnResult: TurnResult): void {
        const turnWinner: CardGamePlayer = this.players.find((currentPlayer) => currentPlayer.id === turnResult.winner)
        this.players.forEach((playerToNotify) => DefaultCardGameManager.notifyEndOfTurn(playerToNotify, turnWinner))
        turnResult.wonCardsByPlayer.forEach((wonCardsForPlayer) => this.table.moveFromTableToPointsOf(wonCardsForPlayer.wonCards, wonCardsForPlayer.playerIdentifier))
        this.gameTricks.push({
            cards: turnResult.playedCards,
            winner: turnResult.winner
        })

        if (this.table.getNumberOfRemainingCardsToPlayFor(this.players[0].id) !== 0) {
            this.beginTurn(turnWinner);
        } else {
            this.gameIsOverSubject.next(this.gameTricks);
        }
    }
}

class OneTurnManager {
    private turnResult: Subject<TurnResult> = new ReplaySubject(1);
    private currentOnePlayerTurnManager;
    private readonly playedCards: PlayedCard[] = [];

    constructor(
        private readonly resolveTurn: ResolveTurn,
        private readonly getPlayableCards: GetPlayableCards,
        public readonly turnNumber: number,
        private readonly playerTurnPlugins: PlayerTurnPlugin[],
        private readonly table: PlayableTable,
        private readonly players: readonly CardGamePlayer[]
    ) {
    }


    private static notifyPlayerHasPlayed(playerToNotify: CardGamePlayer, playerThatPlayed: CardGamePlayer, playedCard: PlayingCard) {
        playerToNotify.notify({
            type: "PLAYER_HAS_PLAYED",
            player: playerThatPlayed.id,
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
        this.currentOnePlayerTurnManager
            = this.instantiateOnePlayerTurnManager(playerThatBegin)
    }

    play(playerThatPlay: CardGamePlayer, card: PlayingCard) {

        const potentiallyPlayedCard: PlayedCard = this.currentOnePlayerTurnManager.play(playerThatPlay, card)
        if (!potentiallyPlayedCard) {
            return;
        }

        this.playedCards.push(potentiallyPlayedCard)
        this.players.forEach((playerToNotify) => OneTurnManager.notifyPlayerHasPlayed(playerToNotify, playerThatPlay, card))
        this.table.moveCardOfPlayerToTable(card, playerThatPlay.id);
        OneTurnManager.notifyCardsAvailable(playerThatPlay, this.table.listCardsOf(playerThatPlay.id));

        const currentPlayerIndex = this.players.findIndex(playerToTry => playerThatPlay.id === playerToTry.id);
        const nextPlayerIndex = currentPlayerIndex != this.players.length - 1 ? currentPlayerIndex + 1 : 0;
        const allPlayersHasPlayedTurn: boolean = this.playedCards.length === this.players.length;
        if (allPlayersHasPlayedTurn) {
            const turnResult: TurnResult = this.resolveTurn(this.playedCards);
            this.turnResult.next(turnResult);
        } else {
            const nextPlayer = this.players[nextPlayerIndex];
            this.currentOnePlayerTurnManager
                = this.instantiateOnePlayerTurnManager(nextPlayer)
        }
    }

    turnIsComplete(): Observable<TurnResult> {
        return this.turnResult
    }

    private instantiateOnePlayerTurnManager(player: CardGamePlayer) {
        return new OnePlayerTurnManager(
            this.turnNumber,
            player,
            this.table.listCardsOf(player.id),
            this.playedCards,
            this.getPlayableCards,
            this.playerTurnPlugins)
    }
}

class OnePlayerTurnManager {
    private pluginsAreEnded: boolean = false;

    constructor(
        private readonly turnNumber: number,
        private readonly currentPlayer: CardGamePlayer,
        private readonly currentPlayerCards: PlayingCard[],
        private readonly playedCards: PlayedCard[],
        private readonly getPlayableCards: GetPlayableCards,
        private readonly plugins: PlayerTurnPlugin[]) {
        forkJoin(plugins.map(currentPlugin => {
            return currentPlugin.apply(
                    turnNumber,
                    currentPlayer,
                    currentPlayerCards)
            })
        ).pipe(defaultIfEmpty(null))
            .subscribe(() => {
                this.pluginsAreEnded = true
                const playableCards = this.getPlayableCardsForPlayer();
                OnePlayerTurnManager.askToPlay(this.currentPlayer, playableCards)
            });
    }

    private static notifyErrorWhilePlaying(player: CardGamePlayer) {
        player.notify({
            type: "ERROR_WHILE_PLAYING"
        })
    }

    private static askToPlay(player: CardGamePlayer, playableCards: readonly PlayingCard[]) {
        player.notify({
            type: "ASKED_TO_PLAY",
            playableCards: playableCards
        })
    }

    play(playerThatPlay: CardGamePlayer, card: PlayingCard): PlayedCard | null {
        if (!this.pluginsAreEnded) {
            OnePlayerTurnManager.notifyErrorWhilePlaying(playerThatPlay);
            return null
        }
        if (!this.currentPlayer || playerThatPlay.id !== this.currentPlayer.id) {
            OnePlayerTurnManager.notifyErrorWhilePlaying(playerThatPlay);
            return null
        }
        const playableCards = this.getPlayableCardsForPlayer()
        if (!playableCards.some((playableCard) => card.identifier === playableCard.identifier)) {
            OnePlayerTurnManager.notifyErrorWhilePlaying(playerThatPlay);
            return null
        }

        return {playingCard: card, playerIdentifier: playerThatPlay.id}
    }

    private getPlayableCardsForPlayer(): readonly PlayingCard[] {
        return this.getPlayableCards(this.playedCards.map((currentPlayedCard) => currentPlayedCard.playingCard), this.currentPlayerCards)
    }
}
