import {Announce} from "../../announce/announce";
import {TarotGameState} from "../../tarot-game";
import {SPADE_4, SPADE_C, TRUMP_1, TRUMP_21, EXCUSE} from "tarot-card-deck";
import {Trick} from "../../../card-game/card-game-manager";
import {EndGamePhase} from "./end-game.game-phase";
import {DummyTarotPlayer} from "../../player/__dummy__/dummy-tarot-player";
import {MockedTarotTable} from "../../table/ports/__mock__/mocked-tarot-table";
import {PoigneeCardGamePlugin} from "../../poignee/poignee-card-game-plugin";
import {PlayedCard} from "../../../card-game/functions/resolve-turn";
import {ChelemDetector, ChelemResult, ChelemAnnounce, ChelemType} from "../../chelem";

describe(`End of game`, () => {

    const mockedCountEndGameTakerPoints = jest.fn();
    const mockedCountEndOfGameScore = jest.fn();
    const dummyEndOfGameCallback = jest.fn()

    const playerIdentifiers = [
        "1", "2", "3", "4"
    ]

    let players: DummyTarotPlayer[];
    let phase: EndGamePhase;
    let table: MockedTarotTable;
    let poigneePlugin: PoigneeCardGamePlugin

    beforeEach(() => {
        table = new MockedTarotTable();
        players = [
            new DummyTarotPlayer(playerIdentifiers[0]),
            new DummyTarotPlayer(playerIdentifiers[1]),
            new DummyTarotPlayer(playerIdentifiers[2]),
            new DummyTarotPlayer(playerIdentifiers[3])
        ]
        poigneePlugin = new PoigneeCardGamePlugin(players)

        phase = new EndGamePhase(players, table, poigneePlugin, mockedCountEndGameTakerPoints, mockedCountEndOfGameScore, dummyEndOfGameCallback)
    })


    const cardsInTrick: PlayedCard[] = [{
        playerIdentifier: playerIdentifiers[0],
        playingCard: TRUMP_1
    }, {
        playerIdentifier: playerIdentifiers[1],
        playingCard: TRUMP_21
    }, {
        playerIdentifier: playerIdentifiers[2],
        playingCard: SPADE_4
    }, {
        playerIdentifier: playerIdentifiers[3],
        playingCard: SPADE_C
    }];

    const takerEndOfGameScore = 5;
    const defenseEndOfGameScore = 86;
    const attackScoreByPlayer = -300;
    const defenseScoreByPlayer = 100;
    const wonCardsByTaker = [
        TRUMP_1, TRUMP_21, SPADE_C, SPADE_4
    ]
    const expectedEndOfGameResult = {
        numberOfPointsForAttack: takerEndOfGameScore,
        numberOfPointsForDefense: defenseEndOfGameScore,
        finalScores: [
            {
                player: playerIdentifiers[0],
                score: defenseScoreByPlayer
            },
            {
                player: playerIdentifiers[1],
                score: attackScoreByPlayer
            }, {
                player: playerIdentifiers[2],
                score: defenseScoreByPlayer
            }, {
                player: playerIdentifiers[3],
                score: defenseScoreByPlayer
            }
        ],
        endOfGameDeck: undefined
    }

    test(`Given a taker and a collection of tricks that have been played,
    when game is over,
    then end of game callback is triggered with expected winner and all players are notified`, (done) => {
        table.listPointsFor.mockReturnValue(wonCardsByTaker)
        
        // Créer 18 levées pour satisfaire la validation du ChelemDetector
        const tricks: Trick[] = Array.from({length: 18}, (_, index) => ({
            winner: index === 17 ? players[0].id : players[1].id, // Dernière levée gagnée par la défense
            cards: cardsInTrick
        }));

        mockedCountEndGameTakerPoints.mockReturnValue(takerEndOfGameScore)
        mockedCountEndOfGameScore.mockReturnValue({
            attackScoreByPlayer,
            defenseScoreByPlayer
        })

        const inputStateWithTakerAndCollectionOfTricks: TarotGameState = {
            endGameTricks: tricks,
            taker: players[1],
            takerAnnounce: Announce.PRISE
        }

        phase.execute(inputStateWithTakerAndCollectionOfTricks).subscribe(() => {
            expect(dummyEndOfGameCallback).toHaveBeenCalledWith(expectedEndOfGameResult);
            expect(players[0].gameOver).toHaveBeenCalledWith(takerEndOfGameScore);
            expect(players[1].gameOver).toHaveBeenCalledWith(takerEndOfGameScore);
            expect(players[2].gameOver).toHaveBeenCalledWith(takerEndOfGameScore);
            expect(players[3].gameOver).toHaveBeenCalledWith(takerEndOfGameScore);
            expect(mockedCountEndOfGameScore).toHaveBeenCalledWith({
                announce: Announce.PRISE,
                attackNumberOfOudlers: 2,
                attackNumberOfPoints: 5,
                petitInLastTrick: "DEFENSE",
                poignee: null,
                chelemAnnounce: undefined,
                chelemResult: {
                    achieved: false,
                    byAttack: false,
                    announced: false
                }
            })
            done()
        })
    })

    test(`Given no taker, 
    when game is over, 
    then game aborted is emitted to all players and end of game callback is called with game results`, (done) => {

        const inputStateWithNoTaker: TarotGameState = {
            taker: undefined,
        }

        phase.execute(inputStateWithNoTaker).subscribe(() => {
            expect(dummyEndOfGameCallback).toHaveBeenCalled();
            expect(players[0].gameAborted).toHaveBeenCalled();
            expect(players[1].gameAborted).toHaveBeenCalled();
            expect(players[2].gameAborted).toHaveBeenCalled();
            expect(players[3].gameAborted).toHaveBeenCalled();
            done()
        })
    })

    describe('Chelem Integration', () => {
        let mockChelemDetector: jest.Mocked<ChelemDetector>;

        beforeEach(() => {
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
        });

        test(`Given a game state with Chelem detected by attack,
        when game is over,
        then all players are notified of Chelem achievement`, (done) => {
            table.listPointsFor.mockReturnValue(wonCardsByTaker);
            
            const chelemResult: ChelemResult = {
                achieved: true,
                byAttack: true,
                announced: false
            };
            
            mockChelemDetector.detectChelemInTricks.mockReturnValue(chelemResult);
            
            // Créer 18 levées pour satisfaire la validation du ChelemDetector
            const tricks: Trick[] = Array.from({length: 18}, () => ({
                winner: players[1].id, // taker wins all tricks (Chelem)
                cards: cardsInTrick
            }));

            mockedCountEndGameTakerPoints.mockReturnValue(takerEndOfGameScore);
            mockedCountEndOfGameScore.mockReturnValue({
                attackScoreByPlayer,
                defenseScoreByPlayer
            });

            const inputStateWithChelem: TarotGameState = {
                endGameTricks: tricks,
                taker: players[1],
                takerAnnounce: Announce.PRISE
            };

            phase.execute(inputStateWithChelem).subscribe(() => {
                // Vérifier que tous les joueurs ont été notifiés du Chelem
                expect(players[0].chelemAchieved).toHaveBeenCalledWith(players[1].id, true, false);
                expect(players[1].chelemAchieved).toHaveBeenCalledWith(players[1].id, true, false);
                expect(players[2].chelemAchieved).toHaveBeenCalledWith(players[1].id, true, false);
                expect(players[3].chelemAchieved).toHaveBeenCalledWith(players[1].id, true, false);
                
                // Vérifier que le détecteur a été appelé
                expect(mockChelemDetector.detectChelemInTricks).toHaveBeenCalledWith(tricks, players[1]);
                
                done();
            });
        });

        test(`Given a game state with announced Chelem by defense,
        when game is over,
        then all players are notified of defensive Chelem achievement`, (done) => {
            table.listPointsFor.mockReturnValue(wonCardsByTaker);
            
            const chelemResult: ChelemResult = {
                achieved: true,
                byAttack: false,
                announced: true
            };
            
            const chelemAnnounce: ChelemAnnounce = {
                player: players[0].id,
                type: ChelemType.ANNOUNCED
            };
            
            mockChelemDetector.detectChelemInTricks.mockReturnValue(chelemResult);
            
            // Créer 18 levées pour satisfaire la validation du ChelemDetector
            const tricks: Trick[] = Array.from({length: 18}, () => ({
                winner: players[0].id, // defense wins all tricks (Chelem défensif)
                cards: cardsInTrick
            }));

            mockedCountEndGameTakerPoints.mockReturnValue(takerEndOfGameScore);
            mockedCountEndOfGameScore.mockReturnValue({
                attackScoreByPlayer,
                defenseScoreByPlayer
            });

            const inputStateWithDefensiveChelem: TarotGameState = {
                endGameTricks: tricks,
                taker: players[1],
                takerAnnounce: Announce.PRISE,
                chelemAnnounce: chelemAnnounce
            };

            phase.execute(inputStateWithDefensiveChelem).subscribe(() => {
                // Vérifier que tous les joueurs ont été notifiés du Chelem défensif
                expect(players[0].chelemAchieved).toHaveBeenCalledWith(players[0].id, false, true);
                expect(players[1].chelemAchieved).toHaveBeenCalledWith(players[0].id, false, true);
                expect(players[2].chelemAchieved).toHaveBeenCalledWith(players[0].id, false, true);
                expect(players[3].chelemAchieved).toHaveBeenCalledWith(players[0].id, false, true);
                
                done();
            });
        });

        test(`Given a game state with existing Chelem result,
        when game is over,
        then detector is not called and existing result is used`, (done) => {
            table.listPointsFor.mockReturnValue(wonCardsByTaker);
            
            const existingChelemResult: ChelemResult = {
                achieved: true,
                byAttack: true,
                announced: true
            };
            
            // Créer 18 levées pour satisfaire la validation du ChelemDetector
            const tricks: Trick[] = Array.from({length: 18}, () => ({
                winner: players[1].id, // taker wins all tricks
                cards: cardsInTrick
            }));

            mockedCountEndGameTakerPoints.mockReturnValue(takerEndOfGameScore);
            mockedCountEndOfGameScore.mockReturnValue({
                attackScoreByPlayer,
                defenseScoreByPlayer
            });

            const chelemAnnounce: ChelemAnnounce = {
                player: players[1].id,
                type: ChelemType.ANNOUNCED
            };

            const inputStateWithExistingChelem: TarotGameState = {
                endGameTricks: tricks,
                taker: players[1],
                takerAnnounce: Announce.PRISE,
                chelemResult: existingChelemResult,
                chelemAnnounce: chelemAnnounce
            };

            phase.execute(inputStateWithExistingChelem).subscribe(() => {
                // Vérifier que le détecteur n'a pas été appelé
                expect(mockChelemDetector.detectChelemInTricks).not.toHaveBeenCalled();
                
                // Vérifier que les joueurs ont été notifiés avec le résultat existant
                expect(players[0].chelemAchieved).toHaveBeenCalledWith(players[1].id, true, true);
                
                done();
            });
        });

        test(`Given a game state with no Chelem,
        when game is over,
        then no Chelem notification is sent`, (done) => {
            table.listPointsFor.mockReturnValue(wonCardsByTaker);
            
            // Pas de Chelem détecté
            mockChelemDetector.detectChelemInTricks.mockReturnValue(null);
            
            // Créer 18 levées pour satisfaire la validation du ChelemDetector
            const tricks: Trick[] = Array.from({length: 18}, (_, index) => ({
                winner: index < 17 ? players[1].id : players[0].id, // Pas de Chelem
                cards: cardsInTrick
            }));

            mockedCountEndGameTakerPoints.mockReturnValue(takerEndOfGameScore);
            mockedCountEndOfGameScore.mockReturnValue({
                attackScoreByPlayer,
                defenseScoreByPlayer
            });

            const inputStateWithoutChelem: TarotGameState = {
                endGameTricks: tricks,
                taker: players[1],
                takerAnnounce: Announce.PRISE
            };

            phase.execute(inputStateWithoutChelem).subscribe(() => {
                // Vérifier qu'aucune notification de Chelem n'a été envoyée
                expect(players[0].chelemAchieved).not.toHaveBeenCalled();
                expect(players[1].chelemAchieved).not.toHaveBeenCalled();
                expect(players[2].chelemAchieved).not.toHaveBeenCalled();
                expect(players[3].chelemAchieved).not.toHaveBeenCalled();
                
                done();
            });
        });
    });

    describe('Chelem Special Rules - Petit au Bout', () => {
        let mockChelemDetector: jest.Mocked<ChelemDetector>;

        beforeEach(() => {
            // Reset all mocks
            jest.clearAllMocks();
            
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
        });

        test(`Given Chelem announced and Excuse played in last trick with Petit in second-to-last trick,
        when game is over,
        then Petit au Bout is awarded to the team that won the second-to-last trick`, (done) => {
            table.listPointsFor.mockReturnValue(wonCardsByTaker);
            
            const chelemAnnounce: ChelemAnnounce = {
                player: players[1].id, // taker announces Chelem
                type: ChelemType.ANNOUNCED
            };

            // Créer 18 levées avec Petit dans l'avant-dernier pli et Excuse dans le dernier
            const tricks: Trick[] = Array.from({length: 18}, (_, index) => {
                if (index === 16) { // Avant-dernier pli avec Petit
                    return {
                        winner: players[1].id, // taker wins with Petit
                        cards: [
                            { playerIdentifier: players[0].id, playingCard: SPADE_4 },
                            { playerIdentifier: players[1].id, playingCard: TRUMP_1 }, // Petit
                            { playerIdentifier: players[2].id, playingCard: SPADE_C },
                            { playerIdentifier: players[3].id, playingCard: TRUMP_21 }
                        ]
                    };
                } else if (index === 17) { // Dernier pli avec Excuse
                    return {
                        winner: players[1].id, // taker wins
                        cards: [
                            { playerIdentifier: players[0].id, playingCard: SPADE_4 },
                            { playerIdentifier: players[1].id, playingCard: EXCUSE }, // Excuse en dernier
                            { playerIdentifier: players[2].id, playingCard: SPADE_C },
                            { playerIdentifier: players[3].id, playingCard: TRUMP_21 }
                        ]
                    };
                } else {
                    return {
                        winner: players[1].id, // taker wins all other tricks
                        cards: cardsInTrick
                    };
                }
            });

            mockedCountEndGameTakerPoints.mockReturnValue(91); // All points for Chelem
            mockedCountEndOfGameScore.mockReturnValue({
                attackScoreByPlayer: 1680, // Chelem announced and achieved
                defenseScoreByPlayer: -560
            });

            const inputStateWithChelemAndExcuse: TarotGameState = {
                endGameTricks: tricks,
                taker: players[1],
                takerAnnounce: Announce.GARDE,
                chelemAnnounce: chelemAnnounce
            };

            phase.execute(inputStateWithChelemAndExcuse).subscribe(() => {
                // Vérifier que le calcul de score a été appelé avec Petit au Bout pour l'attaque
                expect(mockedCountEndOfGameScore).toHaveBeenLastCalledWith({
                    announce: Announce.GARDE,
                    attackNumberOfOudlers: 2,
                    attackNumberOfPoints: 91,
                    petitInLastTrick: "ATTACK", // Petit au Bout pour l'attaque (règle spéciale)
                    poignee: null,
                    chelemAnnounce: chelemAnnounce,
                    chelemResult: undefined // Pas de détection automatique car pas de tricks complets
                });
                
                done();
            });
        });

        test(`Given Chelem announced and Excuse played in last trick with Petit in second-to-last trick won by defense,
        when game is over,
        then Petit au Bout is awarded to defense`, (done) => {
            table.listPointsFor.mockReturnValue(wonCardsByTaker);
            
            const chelemAnnounce: ChelemAnnounce = {
                player: players[1].id, // taker announces Chelem
                type: ChelemType.ANNOUNCED
            };

            // Créer 18 levées avec Petit dans l'avant-dernier pli gagné par la défense
            const tricks: Trick[] = Array.from({length: 18}, (_, index) => {
                if (index === 16) { // Avant-dernier pli avec Petit gagné par la défense
                    return {
                        winner: players[0].id, // defense wins with Petit
                        cards: [
                            { playerIdentifier: players[0].id, playingCard: TRUMP_1 }, // Petit
                            { playerIdentifier: players[1].id, playingCard: SPADE_4 },
                            { playerIdentifier: players[2].id, playingCard: SPADE_C },
                            { playerIdentifier: players[3].id, playingCard: TRUMP_21 }
                        ]
                    };
                } else if (index === 17) { // Dernier pli avec Excuse
                    return {
                        winner: players[1].id, // taker wins
                        cards: [
                            { playerIdentifier: players[0].id, playingCard: SPADE_4 },
                            { playerIdentifier: players[1].id, playingCard: EXCUSE }, // Excuse en dernier
                            { playerIdentifier: players[2].id, playingCard: SPADE_C },
                            { playerIdentifier: players[3].id, playingCard: TRUMP_21 }
                        ]
                    };
                } else {
                    return {
                        winner: players[1].id, // taker wins all other tricks
                        cards: cardsInTrick
                    };
                }
            });

            mockedCountEndGameTakerPoints.mockReturnValue(87); // Almost all points but not Chelem
            mockedCountEndOfGameScore.mockReturnValue({
                attackScoreByPlayer: -400, // Chelem failed
                defenseScoreByPlayer: 400
            });

            const inputStateWithFailedChelem: TarotGameState = {
                endGameTricks: tricks,
                taker: players[1],
                takerAnnounce: Announce.GARDE,
                chelemAnnounce: chelemAnnounce
            };

            phase.execute(inputStateWithFailedChelem).subscribe(() => {
                // Vérifier que le calcul de score a été appelé avec Petit au Bout pour la défense
                expect(mockedCountEndOfGameScore).toHaveBeenLastCalledWith({
                    announce: Announce.GARDE,
                    attackNumberOfOudlers: 2,
                    attackNumberOfPoints: 87,
                    petitInLastTrick: "DEFENSE", // Petit au Bout pour la défense (règle spéciale)
                    poignee: null,
                    chelemAnnounce: chelemAnnounce,
                    chelemResult: undefined // Pas de détection automatique car pas de tricks complets
                });
                
                done();
            });
        });

        test(`Given standard game without Chelem announced and Petit in last trick,
        when game is over,
        then standard Petit au Bout rule applies`, (done) => {
            table.listPointsFor.mockReturnValue(wonCardsByTaker);

            // Créer 18 levées avec Petit dans le dernier pli (règle standard)
            const tricks: Trick[] = Array.from({length: 18}, (_, index) => {
                if (index === 17) { // Dernier pli avec Petit
                    return {
                        winner: players[0].id, // defense wins with Petit
                        cards: [
                            { playerIdentifier: players[0].id, playingCard: TRUMP_1 }, // Petit
                            { playerIdentifier: players[1].id, playingCard: SPADE_4 },
                            { playerIdentifier: players[2].id, playingCard: SPADE_C },
                            { playerIdentifier: players[3].id, playingCard: TRUMP_21 }
                        ]
                    };
                } else {
                    return {
                        winner: players[1].id, // taker wins other tricks
                        cards: cardsInTrick
                    };
                }
            });

            mockedCountEndGameTakerPoints.mockReturnValue(takerEndOfGameScore);
            mockedCountEndOfGameScore.mockReturnValue({
                attackScoreByPlayer,
                defenseScoreByPlayer
            });

            const inputStateStandardGame: TarotGameState = {
                endGameTricks: tricks,
                taker: players[1],
                takerAnnounce: Announce.PRISE
                // Pas de chelemAnnounce
            };

            phase.execute(inputStateStandardGame).subscribe(() => {
                // Vérifier que le calcul de score a été appelé avec Petit au Bout standard
                expect(mockedCountEndOfGameScore).toHaveBeenLastCalledWith({
                    announce: Announce.PRISE,
                    attackNumberOfOudlers: 2,
                    attackNumberOfPoints: takerEndOfGameScore,
                    petitInLastTrick: "DEFENSE", // Petit au Bout standard (dernier pli)
                    poignee: null,
                    chelemAnnounce: undefined,
                    chelemResult: undefined
                });
                
                done();
            });
        });
    });
});
