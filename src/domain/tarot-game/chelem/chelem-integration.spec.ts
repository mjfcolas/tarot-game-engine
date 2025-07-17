import { Announce } from '../announce/announce';
import { TarotGameState } from '../tarot-game';
import { EndGamePhase } from '../phases/end-game/end-game.game-phase';
import { DummyTarotPlayer } from '../player/__dummy__/dummy-tarot-player';
import { MockedTarotTable } from '../table/ports/__mock__/mocked-tarot-table';
import { PoigneeCardGamePlugin } from '../poignee/poignee-card-game-plugin';
import { ChelemDetector, ChelemResult, ChelemAnnounce, ChelemType } from './index';
import { Trick } from '../../card-game/card-game-manager';
import { PlayedCard } from '../../card-game/functions/resolve-turn';
import { SPADE_4, SPADE_C, TRUMP_1, TRUMP_21 } from 'tarot-card-deck';
import { countFourPlayersTarotScore } from '../functions/count-tarot-end-game-score';

describe('Chelem Integration Tests', () => {
    const playerIdentifiers = ['1', '2', '3', '4'];
    let players: DummyTarotPlayer[];
    let mockChelemDetector: jest.Mocked<ChelemDetector>;
    let phase: EndGamePhase;
    let table: MockedTarotTable;
    let poigneePlugin: PoigneeCardGamePlugin;

    const mockedCountEndGameTakerPoints = jest.fn();
    const mockedCountEndOfGameScore = jest.fn();
    const dummyEndOfGameCallback = jest.fn();

    const cardsInTrick: PlayedCard[] = [
        { playerIdentifier: playerIdentifiers[0], playingCard: TRUMP_1 },
        { playerIdentifier: playerIdentifiers[1], playingCard: TRUMP_21 },
        { playerIdentifier: playerIdentifiers[2], playingCard: SPADE_4 },
        { playerIdentifier: playerIdentifiers[3], playingCard: SPADE_C }
    ];

    beforeEach(() => {
        table = new MockedTarotTable();
        players = [
            new DummyTarotPlayer(playerIdentifiers[0]),
            new DummyTarotPlayer(playerIdentifiers[1]),
            new DummyTarotPlayer(playerIdentifiers[2]),
            new DummyTarotPlayer(playerIdentifiers[3])
        ];
        poigneePlugin = new PoigneeCardGamePlugin(players);

        mockChelemDetector = {
            detectChelemInTricks: jest.fn()
        };

        phase = new EndGamePhase(
            players,
            table,
            poigneePlugin,
            mockedCountEndGameTakerPoints,
            mockedCountEndOfGameScore,
            dummyEndOfGameCallback,
            mockChelemDetector
        );

        // Reset mocks
        jest.clearAllMocks();
    });

    describe('Scénarios complets de Chelem', () => {
        test('Chelem annoncé et réalisé par l\'attaque avec Garde', (done) => {
            // Setup
            const chelemAnnounce: ChelemAnnounce = {
                player: players[1].id, // taker
                type: ChelemType.ANNOUNCED
            };

            const chelemResult: ChelemResult = {
                achieved: true,
                byAttack: true,
                announced: true
            };

            mockChelemDetector.detectChelemInTricks.mockReturnValue(chelemResult);

            const tricks: Trick[] = Array.from({length: 18}, () => ({
                winner: players[1].id, // taker wins all tricks
                cards: cardsInTrick
            }));

            table.listPointsFor.mockReturnValue([TRUMP_1, TRUMP_21]);
            mockedCountEndGameTakerPoints.mockReturnValue(91); // All points
            mockedCountEndOfGameScore.mockReturnValue({
                attackScoreByPlayer: 1100, // High score due to Chelem
                defenseScoreByPlayer: -366
            });

            const gameState: TarotGameState = {
                endGameTricks: tricks,
                taker: players[1],
                takerAnnounce: Announce.GARDE,
                chelemAnnounce: chelemAnnounce
            };

            // Execute
            phase.execute(gameState).subscribe(() => {
                // Verify Chelem notification
                expect(players[0].chelemAchieved).toHaveBeenCalledWith(players[1].id, true, true);
                expect(players[1].chelemAchieved).toHaveBeenCalledWith(players[1].id, true, true);
                expect(players[2].chelemAchieved).toHaveBeenCalledWith(players[1].id, true, true);
                expect(players[3].chelemAchieved).toHaveBeenCalledWith(players[1].id, true, true);

                // Verify score calculation includes Chelem
                expect(mockedCountEndOfGameScore).toHaveBeenCalledWith(
                    expect.objectContaining({
                        chelemAnnounce: chelemAnnounce,
                        chelemResult: chelemResult
                    })
                );

                done();
            });
        });

        test('Chelem défensif non annoncé', (done) => {
            // Setup
            const chelemResult: ChelemResult = {
                achieved: true,
                byAttack: false,
                announced: false
            };

            mockChelemDetector.detectChelemInTricks.mockReturnValue(chelemResult);

            const tricks: Trick[] = Array.from({length: 18}, () => ({
                winner: players[0].id, // defense wins all tricks
                cards: cardsInTrick
            }));

            table.listPointsFor.mockReturnValue([]); // Taker gets no points
            mockedCountEndGameTakerPoints.mockReturnValue(0);
            mockedCountEndOfGameScore.mockReturnValue({
                attackScoreByPlayer: -600, // Heavy penalty
                defenseScoreByPlayer: 200
            });

            const gameState: TarotGameState = {
                endGameTricks: tricks,
                taker: players[1],
                takerAnnounce: Announce.PRISE
            };

            // Execute
            phase.execute(gameState).subscribe(() => {
                // Verify defensive Chelem notification
                expect(players[0].chelemAchieved).toHaveBeenCalledWith(players[0].id, false, false);
                expect(players[1].chelemAchieved).toHaveBeenCalledWith(players[0].id, false, false);
                expect(players[2].chelemAchieved).toHaveBeenCalledWith(players[0].id, false, false);
                expect(players[3].chelemAchieved).toHaveBeenCalledWith(players[0].id, false, false);

                done();
            });
        });

        test('Chelem annoncé mais raté', (done) => {
            // Setup
            const chelemAnnounce: ChelemAnnounce = {
                player: players[1].id, // taker
                type: ChelemType.ANNOUNCED
            };

            const chelemResult: ChelemResult = {
                achieved: false,
                byAttack: true,
                announced: true
            };

            mockChelemDetector.detectChelemInTricks.mockReturnValue(chelemResult);

            const tricks: Trick[] = Array.from({length: 18}, (_, index) => ({
                winner: index < 17 ? players[1].id : players[0].id, // Taker loses last trick
                cards: cardsInTrick
            }));

            table.listPointsFor.mockReturnValue([TRUMP_1, TRUMP_21]);
            mockedCountEndGameTakerPoints.mockReturnValue(85); // High but not all points
            mockedCountEndOfGameScore.mockReturnValue({
                attackScoreByPlayer: -800, // Penalty for failed announced Chelem
                defenseScoreByPlayer: 266
            });

            const gameState: TarotGameState = {
                endGameTricks: tricks,
                taker: players[1],
                takerAnnounce: Announce.GARDE_SANS,
                chelemAnnounce: chelemAnnounce
            };

            // Execute
            phase.execute(gameState).subscribe(() => {
                // No Chelem notification since it failed
                expect(players[0].chelemAchieved).not.toHaveBeenCalled();
                expect(players[1].chelemAchieved).not.toHaveBeenCalled();
                expect(players[2].chelemAchieved).not.toHaveBeenCalled();
                expect(players[3].chelemAchieved).not.toHaveBeenCalled();

                // But score calculation should include the failed Chelem
                expect(mockedCountEndOfGameScore).toHaveBeenCalledWith(
                    expect.objectContaining({
                        chelemAnnounce: chelemAnnounce,
                        chelemResult: chelemResult
                    })
                );

                done();
            });
        });
    });

    describe('Tests de calcul de score direct', () => {
        test('Calcul direct : Chelem annoncé et réalisé avec Garde', () => {
            const endGameStatus = {
                announce: Announce.GARDE,
                attackNumberOfOudlers: 3,
                attackNumberOfPoints: 91, // All points for Chelem
                petitInLastTrick: null,
                poignee: null,
                chelemResult: {
                    achieved: true,
                    byAttack: true,
                    announced: true
                },
                chelemAnnounce: {
                    player: players[1].id,
                    type: ChelemType.ANNOUNCED
                }
            };

            const result = countFourPlayersTarotScore(endGameStatus);

            // Vérifier que le bonus de Chelem annoncé (+400) est appliqué
            // Score de base : (25 + 55) × 2 = 160
            // Bonus Chelem : +400
            // Total : 560 × 3 = 1680 pour le preneur
            expect(result.attackScoreByPlayer).toBe(1680);
            expect(result.defenseScoreByPlayer).toBe(-560);
        });

        test('Calcul direct : Chelem défensif', () => {
            const endGameStatus = {
                announce: Announce.PRISE,
                attackNumberOfOudlers: 0,
                attackNumberOfPoints: 0, // No points for taker (defensive Chelem)
                petitInLastTrick: null,
                poignee: null,
                chelemResult: {
                    achieved: true,
                    byAttack: false,
                    announced: false
                },
                chelemAnnounce: undefined
            };

            const result = countFourPlayersTarotScore(endGameStatus);

            // Vérifier que le bonus défensif (+200) est appliqué
            // Score de base : (25 + 56) × 1 = 81
            // Bonus Chelem défensif : +200
            // Total : 281 pour chaque défenseur, -843 pour le preneur
            expect(result.attackScoreByPlayer).toBe(-843);
            expect(result.defenseScoreByPlayer).toBe(281);
        });

        test('Calcul direct : Chelem annoncé mais raté', () => {
            const endGameStatus = {
                announce: Announce.GARDE_CONTRE,
                attackNumberOfOudlers: 2,
                attackNumberOfPoints: 35, // Failed to achieve required points
                petitInLastTrick: null,
                poignee: null,
                chelemResult: {
                    achieved: false,
                    byAttack: true,
                    announced: true
                },
                chelemAnnounce: {
                    player: players[1].id,
                    type: ChelemType.ANNOUNCED
                }
            };

            const result = countFourPlayersTarotScore(endGameStatus);

            // Vérifier que la pénalité de Chelem raté (-200) est appliquée
            // Score de base : (25 + 6) × 6 = 186 (preneur perd)
            // Pénalité Chelem : -200
            // Total : 386 pour chaque défenseur, -1158 pour le preneur
            expect(result.attackScoreByPlayer).toBe(-1158);
            expect(result.defenseScoreByPlayer).toBe(386);
        });
    });
});