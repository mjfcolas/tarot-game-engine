import {Announce} from "../announce/announce";
import {countFourPlayersTarotScore, EndGameScore, EndGameStatus} from "./count-tarot-end-game-score";
import {Poignee} from "../poignee/poignee";
import {ChelemAnnounce, ChelemResult, ChelemType} from "../chelem/chelem";

describe('Count tarot end game scores', function () {

    const testCases: { parameters: EndGameStatus, expectedResult: EndGameScore }[] = [{
        parameters: {
            announce: Announce.GARDE,
            attackNumberOfPoints: 49,
            poignee: Poignee.SIMPLE,
            petitInLastTrick: "ATTACK",
            attackNumberOfOudlers: 2,
        },
        expectedResult: {
            attackScoreByPlayer: 318,
            defenseScoreByPlayer: -106
        }
    }, {
        parameters: {
            announce: Announce.GARDE_SANS,
            attackNumberOfPoints: 55,
            poignee: null,
            petitInLastTrick: "DEFENSE",
            attackNumberOfOudlers: 1,
        },
        expectedResult: {
            attackScoreByPlayer: 228,
            defenseScoreByPlayer: -76
        }
    }, {
        parameters: {
            announce: Announce.GARDE_CONTRE,
            attackNumberOfPoints: 55,
            poignee: Poignee.TRIPLE,
            petitInLastTrick: null,
            attackNumberOfOudlers: 3,
        },
        expectedResult: {
            attackScoreByPlayer: 912,
            defenseScoreByPlayer: -304
        }
    }, {
        parameters: {
            announce: Announce.PRISE,
            attackNumberOfPoints: 49,
            poignee: Poignee.SIMPLE,
            petitInLastTrick: "ATTACK",
            attackNumberOfOudlers: 0,
        },
        expectedResult: {
            attackScoreByPlayer: -126,
            defenseScoreByPlayer: 42
        }
    }, {
        parameters: {
            announce: Announce.GARDE,
            attackNumberOfPoints: 52,
            poignee: Poignee.SIMPLE,
            petitInLastTrick: null,
            attackNumberOfOudlers: 2,
        },
        expectedResult: {
            attackScoreByPlayer: 276,
            defenseScoreByPlayer: -92
        }
    }, {
        parameters: {
            announce: Announce.PRISE,
            attackNumberOfPoints: 56,
            poignee: Poignee.DOUBLE,
            petitInLastTrick: null,
            attackNumberOfOudlers: 0,
        },
        expectedResult: {
            attackScoreByPlayer: 165,
            defenseScoreByPlayer: -55
        }
    }]

    test.each(testCases)(`Given %p, when counting scores, then returns %p`, (testCase) => {
        const result = countFourPlayersTarotScore(testCase.parameters);
        const expectedResult = testCase.expectedResult;
        expect(result.attackScoreByPlayer).toBe(expectedResult.attackScoreByPlayer)
        expect(result.defenseScoreByPlayer).toBe(expectedResult.defenseScoreByPlayer)
    })

    describe('Chelem scenarios', () => {
        const chelemTestCases: { parameters: EndGameStatus, expectedResult: EndGameScore, description: string }[] = [
            {
                description: 'Chelem annoncé et réalisé avec Garde',
                parameters: {
                    announce: Announce.GARDE,
                    attackNumberOfPoints: 91,
                    attackNumberOfOudlers: 2,
                    chelemAnnounce: {
                        player: "taker",
                        type: ChelemType.ANNOUNCED
                    },
                    chelemResult: {
                        achieved: true,
                        byAttack: true,
                        announced: true
                    }
                },
                expectedResult: {
                    // (25 + 50) × 2 = 150 (score de base)
                    // +400 (prime Chelem annoncé et réalisé)
                    // Total: 550 points
                    attackScoreByPlayer: 1650, // 550 × 3
                    defenseScoreByPlayer: -550
                }
            },
            {
                description: 'Chelem non annoncé mais réalisé avec Prise',
                parameters: {
                    announce: Announce.PRISE,
                    attackNumberOfPoints: 91,
                    attackNumberOfOudlers: 3,
                    chelemResult: {
                        achieved: true,
                        byAttack: true,
                        announced: false
                    }
                },
                expectedResult: {
                    // (25 + 55) × 1 = 80 (score de base)
                    // +200 (prime Chelem non annoncé)
                    // Total: 280 points
                    attackScoreByPlayer: 840, // 280 × 3
                    defenseScoreByPlayer: -280
                }
            },
            {
                description: 'Chelem annoncé mais raté avec Garde Sans',
                parameters: {
                    announce: Announce.GARDE_SANS,
                    attackNumberOfPoints: 35,
                    attackNumberOfOudlers: 2,
                    chelemAnnounce: {
                        player: "taker",
                        type: ChelemType.ANNOUNCED
                    },
                    chelemResult: {
                        achieved: false,
                        byAttack: true,
                        announced: true
                    }
                },
                expectedResult: {
                    // (25 + 6) × 4 = 124 (score de base, échec car 35 < 41)
                    // -200 (pénalité Chelem annoncé raté)
                    // Total: -124 - 200 = -324 points
                    attackScoreByPlayer: -972, // -324 × 3
                    defenseScoreByPlayer: 324
                }
            },
            {
                description: 'Chelem défensif réussi',
                parameters: {
                    announce: Announce.GARDE,
                    attackNumberOfPoints: 0,
                    attackNumberOfOudlers: 0,
                    chelemResult: {
                        achieved: true,
                        byAttack: false,
                        announced: false
                    }
                },
                expectedResult: {
                    // (25 + 56) × 2 = 162 (score de base, échec total car 0 < 56)
                    // +200 (prime Chelem défensif pour la défense)
                    // Total: -162 - 200 = -362 points pour l'attaque
                    attackScoreByPlayer: -1086, // -362 × 3
                    defenseScoreByPlayer: 362
                }
            },
            {
                description: 'Chelem annoncé et réalisé avec Poignée et Petit au Bout',
                parameters: {
                    announce: Announce.GARDE,
                    attackNumberOfPoints: 91,
                    attackNumberOfOudlers: 2,
                    poignee: Poignee.SIMPLE,
                    petitInLastTrick: "ATTACK",
                    chelemAnnounce: {
                        player: "taker",
                        type: ChelemType.ANNOUNCED
                    },
                    chelemResult: {
                        achieved: true,
                        byAttack: true,
                        announced: true
                    }
                },
                expectedResult: {
                    // (25 + 50 + 10) × 2 = 170 (score de base avec Petit au Bout multiplié)
                    // +20 (Poignée) + 400 (Chelem) = +420 (primes non multipliées)
                    // Total: 170 + 420 = 590 points
                    attackScoreByPlayer: 1770, // 590 × 3
                    defenseScoreByPlayer: -590
                }
            }
        ];

        test.each(chelemTestCases)('$description', (testCase) => {
            const result = countFourPlayersTarotScore(testCase.parameters);
            expect(result.attackScoreByPlayer).toBe(testCase.expectedResult.attackScoreByPlayer);
            expect(result.defenseScoreByPlayer).toBe(testCase.expectedResult.defenseScoreByPlayer);
        });
    });

});
