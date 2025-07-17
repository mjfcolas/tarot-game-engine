import {GamePhase} from "../../game-phase";
import {TarotPlayer} from "../../player/tarot-player";
import {TarotTable} from "../../table/ports/tarot-table";
import {PoigneeCardGamePlugin} from "../../poignee/poignee-card-game-plugin";
import {CountEndGameTakerPoints} from "../../functions/count-tarot-end-game-taker-points";
import {CountEndGameScore, EndGameScore, Team} from "../../functions/count-tarot-end-game-score";
import {Observable, of} from "rxjs";
import {PlayingCard, TRUMP_1, EXCUSE} from "tarot-card-deck";
import {isOudler, isTrumpCard} from "../../cards/card-types";
import {Trick} from "../../../card-game/card-game-manager";
import {GameResultWithDeck, PlayerWithScore, TarotGameState} from "../../tarot-game";
import {ChelemDetector, DefaultChelemDetector, ChelemAnnounce} from "../../chelem";

export class EndGamePhase implements GamePhase<TarotGameState> {

    constructor(private readonly players: readonly TarotPlayer[],
                private readonly table: TarotTable,
                private readonly poigneePlugin: PoigneeCardGamePlugin,
                private readonly countEndGameTakerPoints: CountEndGameTakerPoints,
                private readonly countEndGameScore: CountEndGameScore,
                private readonly endOfGameCallback: (gameResult: GameResultWithDeck) => void,
                private readonly chelemDetector: ChelemDetector = new DefaultChelemDetector()) {
    }

    execute(inputState: TarotGameState): Observable<TarotGameState> {
        if (!inputState.taker) {
            this.players.forEach((playerToNotify) => EndGamePhase.notifyGameAborted(playerToNotify))
            this.endOfGameCallback(this.noTakerGameResult())
        } else {
            const endedGameResult: GameResultWithDeck = this.endedGameResult(inputState);
            this.players.forEach((playerToNotify) => EndGamePhase.notifyGameIsOver(
                playerToNotify,
                endedGameResult))
            this.endOfGameCallback(endedGameResult)
        }
        return of(inputState);
    }

    private noTakerGameResult(): GameResultWithDeck {
        return {
            numberOfPointsForAttack: undefined,
            numberOfPointsForDefense: undefined,
            finalScores: this.players.map(currentPlayer => ({
                player: currentPlayer.id,
                score: 0
            })),
            endOfGameDeck: this.table.gatherDeck()
        }
    }

    private endedGameResult(tarotGameState: TarotGameState): GameResultWithDeck {
        const wonCardsByTaker: PlayingCard[] = this.table.listPointsFor(tarotGameState.taker.id);
        const endGamePointsForTaker: number = this.countEndGameTakerPoints(
            wonCardsByTaker,
            tarotGameState.takerHasExcuseAtStartOfGame);

        // Détection automatique du Chelem si pas déjà présent dans le state
        let chelemResult = tarotGameState.chelemResult;
        if (!chelemResult && tarotGameState.endGameTricks) {
            chelemResult = this.chelemDetector.detectChelemInTricks(
                tarotGameState.endGameTricks,
                tarotGameState.taker
            );
        }

        // Notifier les joueurs si un Chelem a été réalisé avec succès
        if (chelemResult && chelemResult.achieved) {
            this.notifyChelemAchieved(tarotGameState, chelemResult);
        }

        const endGameScores: EndGameScore = this.countEndGameScore({
            announce: tarotGameState.takerAnnounce,
            poignee: this.poigneePlugin.getPotentialPoignee(),
            petitInLastTrick: this.resolveTeamThatPlayedPetitInLastTrick(
                tarotGameState.endGameTricks,
                tarotGameState.taker,
                tarotGameState.chelemAnnounce
            ),
            attackNumberOfOudlers: wonCardsByTaker.filter(card => isOudler(card) && isTrumpCard(card)).length + (tarotGameState.takerHasExcuseAtStartOfGame ? 1 : 0),
            attackNumberOfPoints: endGamePointsForTaker,
            chelemAnnounce: tarotGameState.chelemAnnounce,
            chelemResult: chelemResult
        })

        const finalScores: PlayerWithScore[] = this.players.map(currentPlayer => ({
            player: currentPlayer.id,
            score: currentPlayer === tarotGameState.taker ? endGameScores.attackScoreByPlayer : endGameScores.defenseScoreByPlayer
        }))
        const totalNumberOfPointsInGame = 91;
        return {
            numberOfPointsForAttack: endGamePointsForTaker,
            numberOfPointsForDefense: totalNumberOfPointsInGame - endGamePointsForTaker,
            finalScores: finalScores,
            endOfGameDeck: this.table.gatherDeck()
        }
    }

    private resolveTeamThatPlayedPetitInLastTrick(
        allTricks: Trick[],
        taker: TarotPlayer,
        chelemAnnounce?: ChelemAnnounce
    ): Team {
        if (!allTricks || allTricks.length === 0) {
            return null;
        }

        const lastTrick = allTricks[allTricks.length - 1];
        
        // Règle spéciale Chelem : Si l'Excuse est jouée en dernier,
        // le Petit sera considéré "au Bout" s'il est mené à l'avant-dernier pli
        if (chelemAnnounce && allTricks.length >= 2) {
            const excuseInLastTrick = lastTrick.cards.some(playedCard => playedCard.playingCard === EXCUSE);
            
            if (excuseInLastTrick) {
                // Vérifier si le Petit est dans l'avant-dernier pli
                const secondToLastTrick = allTricks[allTricks.length - 2];
                const petitInSecondToLastTrick = secondToLastTrick.cards.some(playedCard => playedCard.playingCard === TRUMP_1);
                
                if (petitInSecondToLastTrick) {
                    return secondToLastTrick.winner === taker.id ? "ATTACK" : "DEFENSE";
                }
            }
        }
        
        // Règle standard : Petit dans le dernier pli
        const petitInLastTrick = lastTrick.cards.some(playedCard => playedCard.playingCard === TRUMP_1);
        if (!petitInLastTrick) {
            return null;
        }

        return lastTrick.winner === taker.id ? "ATTACK" : "DEFENSE";
    }

    private static notifyGameAborted(playerToNotify: TarotPlayer): void {
        playerToNotify.notify({
            type: "GAME_IS_ABORTED",
        })
    }

    private static notifyGameIsOver(playerToNotify: TarotPlayer, gameResultWithDeck: GameResultWithDeck): void {
        playerToNotify.notify({
            type: "GAME_IS_OVER",
            numberOfPointsForAttack: gameResultWithDeck.numberOfPointsForAttack,
            numberOfPointsForDefense: gameResultWithDeck.numberOfPointsForDefense,
            finalScores: gameResultWithDeck.finalScores
        })
    }

    private notifyChelemAchieved(tarotGameState: TarotGameState, chelemResult: any): void {
        // Déterminer le joueur qui a réalisé le Chelem
        const chelemPlayer = chelemResult.byAttack
            ? tarotGameState.taker.id
            : this.players.find(p => p.id !== tarotGameState.taker.id)!.id;
        
        // Notifier tous les joueurs
        this.players.forEach(player => {
            player.notify({
                type: "CHELEM_ACHIEVED",
                player: chelemPlayer,
                byAttack: chelemResult.byAttack,
                announced: !!tarotGameState.chelemAnnounce
            });
        });
    }
}
