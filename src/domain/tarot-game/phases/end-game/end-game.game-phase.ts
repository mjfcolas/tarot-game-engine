import {GamePhase} from "../../game-phase";
import {TarotPlayer} from "../../player/tarot-player";
import {TarotTable} from "../../table/ports/tarot-table";
import {PoigneeCardGamePlugin} from "../../poignee/poignee-card-game-plugin";
import {CountEndGameTakerPoints} from "../../functions/count-tarot-end-game-taker-points";
import {CountEndGameScore, EndGameScore, Team} from "../../functions/count-tarot-end-game-score";
import {Observable, of} from "rxjs";
import {PlayingCard, TRUMP_1} from "tarot-card-deck";
import {isOudler, isTrumpCard} from "../../cards/card-types";
import {Trick} from "../../../card-game/card-game-manager";
import {GameResultWithDeck, PlayerWithScore, TarotGameState} from "../../tarot-game";

export class EndGamePhase implements GamePhase<TarotGameState> {

    constructor(private readonly players: readonly TarotPlayer[],
                private readonly table: TarotTable,
                private readonly poigneePlugin: PoigneeCardGamePlugin,
                private readonly countEndGameTakerPoints: CountEndGameTakerPoints,
                private readonly countEndGameScore: CountEndGameScore,
                private readonly endOfGameCallback: (gameResult: GameResultWithDeck) => void) {
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


        const endGameScores: EndGameScore = this.countEndGameScore({
            announce: tarotGameState.takerAnnounce,
            poignee: this.poigneePlugin.getPotentialPoignee(),
            petitInLastTrick: this.resolveTeamThatPlayedPetitInLastTrick(tarotGameState.endGameTricks[tarotGameState.endGameTricks.length - 1], tarotGameState.taker),
            attackNumberOfOudlers: wonCardsByTaker.filter(card => isOudler(card) && isTrumpCard(card)).length + (tarotGameState.takerHasExcuseAtStartOfGame ? 1 : 0),
            attackNumberOfPoints: endGamePointsForTaker
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

    private resolveTeamThatPlayedPetitInLastTrick(lastTrick: Trick, taker: TarotPlayer): Team {
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
}
