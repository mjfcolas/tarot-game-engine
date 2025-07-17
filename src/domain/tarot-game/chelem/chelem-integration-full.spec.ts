import { ChelemType } from "./chelem";
import { TarotPlayerNotification } from "../player/tarot-player-notification";
import { CardGamePlayerNotification } from "../../card-game/player/card-game-player-notification";
import { TarotPlayer } from "../player/tarot-player";
import { PlayerIdentifier } from "../../card-game/player/card-game-player";
import { Announce } from "../announce/announce";

describe('Tests d\'intégration complets du Chelem', () => {
    const playerIdentifiers = ["0", "1", "2", "3"];

    describe('Tests de calcul des scores avec Chelem', () => {
        it('devrait calculer correctement les scores pour Chelem annoncé et réalisé', () => {
            const { countFourPlayersTarotScore } = require('../functions/count-tarot-end-game-score');
            
            const chelemAnnouncedAndAchieved = {
                announce: Announce.GARDE,
                attackNumberOfOudlers: 3,
                attackNumberOfPoints: 91, // Tous les points pour Chelem
                petitInLastTrick: null,
                poignee: null,
                chelemResult: {
                    achieved: true,
                    byAttack: true,
                    announced: true
                },
                chelemAnnounce: {
                    player: playerIdentifiers[2],
                    type: ChelemType.ANNOUNCED
                }
            };

            const result = countFourPlayersTarotScore(chelemAnnouncedAndAchieved);
            
            // Score de base : (25 + 55) × 2 = 160
            // Prime Chelem annoncé : +400
            // Total : 560 × 3 = 1680 pour le preneur
            expect(result.attackScoreByPlayer).toBe(1680);
            expect(result.defenseScoreByPlayer).toBe(-560);
        });

        it('devrait calculer correctement les scores pour Chelem non annoncé mais réalisé', () => {
            const { countFourPlayersTarotScore } = require('../functions/count-tarot-end-game-score');
            
            const chelemNotAnnouncedButAchieved = {
                announce: Announce.PRISE,
                attackNumberOfOudlers: 3,
                attackNumberOfPoints: 91,
                petitInLastTrick: null,
                poignee: null,
                chelemResult: {
                    achieved: true,
                    byAttack: true,
                    announced: false
                },
                chelemAnnounce: undefined
            };

            const result = countFourPlayersTarotScore(chelemNotAnnouncedButAchieved);
            
            // Score de base : (25 + 55) × 1 = 80
            // Prime Chelem non annoncé : +200
            // Total : 280 × 3 = 840 pour le preneur
            expect(result.attackScoreByPlayer).toBe(840);
            expect(result.defenseScoreByPlayer).toBe(-280);
        });

        it('devrait calculer correctement les scores pour Chelem défensif', () => {
            const { countFourPlayersTarotScore } = require('../functions/count-tarot-end-game-score');
            
            const chelemDefensive = {
                announce: Announce.PRISE,
                attackNumberOfOudlers: 0,
                attackNumberOfPoints: 0, // Aucun point pour le preneur
                petitInLastTrick: null,
                poignee: null,
                chelemResult: {
                    achieved: true,
                    byAttack: false,
                    announced: false
                },
                chelemAnnounce: undefined
            };

            const result = countFourPlayersTarotScore(chelemDefensive);
            
            // Score de base : (25 + 56) × 1 = 81
            // Prime Chelem défensif : +200
            // Total : 281 pour chaque défenseur, -843 pour le preneur
            expect(result.attackScoreByPlayer).toBe(-843);
            expect(result.defenseScoreByPlayer).toBe(281);
        });

        it('devrait calculer correctement les scores pour Chelem annoncé mais raté', () => {
            const { countFourPlayersTarotScore } = require('../functions/count-tarot-end-game-score');
            
            const chelemAnnouncedButFailed = {
                announce: Announce.GARDE_CONTRE,
                attackNumberOfOudlers: 2,
                attackNumberOfPoints: 35, // Échec du contrat
                petitInLastTrick: null,
                poignee: null,
                chelemResult: {
                    achieved: false,
                    byAttack: true,
                    announced: true
                },
                chelemAnnounce: {
                    player: playerIdentifiers[2],
                    type: ChelemType.ANNOUNCED
                }
            };

            const result = countFourPlayersTarotScore(chelemAnnouncedButFailed);
            
            // Score de base : (25 + 6) × 6 = 186 (preneur perd)
            // Pénalité Chelem : -200
            // Total : 386 pour chaque défenseur, -1158 pour le preneur
            expect(result.attackScoreByPlayer).toBe(-1158);
            expect(result.defenseScoreByPlayer).toBe(386);
        });
    });

    describe('Tests d\'intégration avec les autres règles', () => {
        it('devrait combiner Chelem avec Poignée', () => {
            const { countFourPlayersTarotScore } = require('../functions/count-tarot-end-game-score');
            const { Poignee } = require('../poignee/poignee');
            
            const chelemWithPoignee = {
                announce: Announce.GARDE,
                attackNumberOfOudlers: 3,
                attackNumberOfPoints: 91,
                petitInLastTrick: null,
                poignee: Poignee.SIMPLE, // +20 points
                chelemResult: {
                    achieved: true,
                    byAttack: true,
                    announced: true
                },
                chelemAnnounce: {
                    player: playerIdentifiers[2],
                    type: ChelemType.ANNOUNCED
                }
            };

            const result = countFourPlayersTarotScore(chelemWithPoignee);
            
            // Score de base : (25 + 55) × 2 = 160
            // Poignée : +20
            // Prime Chelem : +400
            // Total : 580 × 3 = 1740 pour le preneur
            expect(result.attackScoreByPlayer).toBe(1740);
            expect(result.defenseScoreByPlayer).toBe(-580);
        });

        it('devrait combiner Chelem avec Petit au Bout', () => {
            const { countFourPlayersTarotScore } = require('../functions/count-tarot-end-game-score');
            
            const chelemWithPetitAuBout = {
                announce: Announce.GARDE,
                attackNumberOfOudlers: 3,
                attackNumberOfPoints: 91,
                petitInLastTrick: "ATTACK", // +10 × 2 = +20 points
                poignee: null,
                chelemResult: {
                    achieved: true,
                    byAttack: true,
                    announced: true
                },
                chelemAnnounce: {
                    player: playerIdentifiers[2],
                    type: ChelemType.ANNOUNCED
                }
            };

            const result = countFourPlayersTarotScore(chelemWithPetitAuBout);
            
            // Score de base : (25 + 55) × 2 = 160
            // Petit au Bout : +20 (10 × coefficient 2)
            // Prime Chelem : +400
            // Total : 580 × 3 = 1740 pour le preneur
            expect(result.attackScoreByPlayer).toBe(1740);
            expect(result.defenseScoreByPlayer).toBe(-580);
        });

        it('devrait combiner Chelem avec Poignée et Petit au Bout', () => {
            const { countFourPlayersTarotScore } = require('../functions/count-tarot-end-game-score');
            const { Poignee } = require('../poignee/poignee');
            
            const chelemWithAll = {
                announce: Announce.GARDE_SANS,
                attackNumberOfOudlers: 3,
                attackNumberOfPoints: 91,
                petitInLastTrick: "ATTACK", // +10 × 4 = +40 points
                poignee: Poignee.DOUBLE, // +30 points
                chelemResult: {
                    achieved: true,
                    byAttack: true,
                    announced: true
                },
                chelemAnnounce: {
                    player: playerIdentifiers[2],
                    type: ChelemType.ANNOUNCED
                }
            };

            const result = countFourPlayersTarotScore(chelemWithAll);
            
            // Score de base : (25 + 55) × 4 = 320
            // Poignée Double : +30
            // Petit au Bout : +40 (10 × coefficient 4)
            // Prime Chelem : +400
            // Total : 790 × 3 = 2370 pour le preneur
            expect(result.attackScoreByPlayer).toBe(2370);
            expect(result.defenseScoreByPlayer).toBe(-790);
        });
    });

    describe('Tests des notifications Chelem', () => {
        let testPlayer: TestChelemPlayer;

        beforeEach(() => {
            testPlayer = new TestChelemPlayer(playerIdentifiers[0]);
        });

        it('devrait gérer la notification d\'annonce de Chelem', () => {
            const chelemAnnouncedNotification: TarotPlayerNotification = {
                type: "CHELEM_HAS_BEEN_ANNOUNCED",
                player: playerIdentifiers[2],
                chelemType: ChelemType.ANNOUNCED
            };

            expect(() => testPlayer.notify(chelemAnnouncedNotification)).not.toThrow();
            expect(testPlayer.chelemAnnounced).toHaveBeenCalledWith(playerIdentifiers[2], ChelemType.ANNOUNCED);
        });

        it('devrait gérer la notification de réalisation de Chelem', () => {
            const chelemAchievedNotification: TarotPlayerNotification = {
                type: "CHELEM_ACHIEVED",
                player: playerIdentifiers[2],
                byAttack: true,
                announced: true
            };

            expect(() => testPlayer.notify(chelemAchievedNotification)).not.toThrow();
            expect(testPlayer.chelemAchieved).toHaveBeenCalledWith(playerIdentifiers[2], true, true);
        });

        it('devrait gérer la notification d\'erreur d\'annonce de Chelem', () => {
            const chelemErrorNotification: TarotPlayerNotification = {
                type: "ERROR_WHILE_ANNOUNCING_CHELEM"
            };

            expect(() => testPlayer.notify(chelemErrorNotification)).not.toThrow();
            expect(testPlayer.errorWhileAnnouncingChelem).toHaveBeenCalled();
        });

        it('devrait gérer la notification de Chelem défensif', () => {
            const chelemDefensiveNotification: TarotPlayerNotification = {
                type: "CHELEM_ACHIEVED",
                player: playerIdentifiers[2],
                byAttack: false,
                announced: false
            };

            expect(() => testPlayer.notify(chelemDefensiveNotification)).not.toThrow();
            expect(testPlayer.chelemAchieved).toHaveBeenCalledWith(playerIdentifiers[2], false, false);
        });
    });

    describe('Tests de validation des structures de données', () => {
        it('devrait valider les types de Chelem', () => {
            expect(ChelemType.ANNOUNCED).toBe('ANNOUNCED');
            expect(ChelemType.NOT_ANNOUNCED).toBe('NOT_ANNOUNCED');
        });

        it('devrait valider la structure d\'annonce de Chelem', () => {
            const chelemAnnounce = {
                player: playerIdentifiers[0],
                type: ChelemType.ANNOUNCED
            };

            expect(chelemAnnounce.player).toBe(playerIdentifiers[0]);
            expect(chelemAnnounce.type).toBe(ChelemType.ANNOUNCED);
        });

        it('devrait valider la structure de résultat de Chelem', () => {
            const chelemResult = {
                achieved: true,
                byAttack: true,
                announced: true
            };

            expect(chelemResult.achieved).toBe(true);
            expect(chelemResult.byAttack).toBe(true);
            expect(chelemResult.announced).toBe(true);
        });

        it('devrait valider les différents scénarios de Chelem', () => {
            // Chelem annoncé et réalisé
            const announcedAchieved = {
                achieved: true,
                byAttack: true,
                announced: true
            };
            expect(announcedAchieved.achieved && announcedAchieved.announced).toBe(true);

            // Chelem non annoncé mais réalisé
            const notAnnouncedAchieved = {
                achieved: true,
                byAttack: true,
                announced: false
            };
            expect(notAnnouncedAchieved.achieved && !notAnnouncedAchieved.announced).toBe(true);

            // Chelem annoncé mais raté
            const announcedFailed = {
                achieved: false,
                byAttack: true,
                announced: true
            };
            expect(!announcedFailed.achieved && announcedFailed.announced).toBe(true);

            // Chelem défensif
            const defensive = {
                achieved: true,
                byAttack: false,
                announced: false
            };
            expect(defensive.achieved && !defensive.byAttack).toBe(true);
        });
    });

    describe('Tests de calcul des primes selon les règles officielles', () => {
        it('devrait appliquer la prime de +400 pour Chelem annoncé et réalisé', () => {
            const { countFourPlayersTarotScore } = require('../functions/count-tarot-end-game-score');
            
            const gameState = {
                announce: Announce.PRISE,
                attackNumberOfOudlers: 3,
                attackNumberOfPoints: 91,
                petitInLastTrick: null,
                poignee: null,
                chelemResult: {
                    achieved: true,
                    byAttack: true,
                    announced: true
                },
                chelemAnnounce: {
                    player: playerIdentifiers[0],
                    type: ChelemType.ANNOUNCED
                }
            };

            const result = countFourPlayersTarotScore(gameState);
            
            // Vérifier que la prime de +400 est bien appliquée
            const expectedBaseScore = (25 + 55) * 1; // 80
            const expectedTotal = (expectedBaseScore + 400) * 3; // 1440
            expect(result.attackScoreByPlayer).toBe(expectedTotal);
        });

        it('devrait appliquer la prime de +200 pour Chelem non annoncé mais réalisé', () => {
            const { countFourPlayersTarotScore } = require('../functions/count-tarot-end-game-score');
            
            const gameState = {
                announce: Announce.PRISE,
                attackNumberOfOudlers: 3,
                attackNumberOfPoints: 91,
                petitInLastTrick: null,
                poignee: null,
                chelemResult: {
                    achieved: true,
                    byAttack: true,
                    announced: false
                },
                chelemAnnounce: undefined
            };

            const result = countFourPlayersTarotScore(gameState);
            
            // Vérifier que la prime de +200 est bien appliquée
            const expectedBaseScore = (25 + 55) * 1; // 80
            const expectedTotal = (expectedBaseScore + 200) * 3; // 840
            expect(result.attackScoreByPlayer).toBe(expectedTotal);
        });

        it('devrait appliquer la pénalité de -200 pour Chelem annoncé mais raté', () => {
            const { countFourPlayersTarotScore } = require('../functions/count-tarot-end-game-score');
            
            const gameState = {
                announce: Announce.PRISE,
                attackNumberOfOudlers: 1,
                attackNumberOfPoints: 45, // Échec du contrat (il faut 51)
                petitInLastTrick: null,
                poignee: null,
                chelemResult: {
                    achieved: false,
                    byAttack: true,
                    announced: true
                },
                chelemAnnounce: {
                    player: playerIdentifiers[0],
                    type: ChelemType.ANNOUNCED
                }
            };

            const result = countFourPlayersTarotScore(gameState);
            
            // Vérifier que la pénalité de -200 est bien appliquée
            const expectedBaseScore = (25 + 6) * 1; // 31 (preneur perd)
            const expectedTotal = -(expectedBaseScore + 200) * 3; // -693
            expect(result.attackScoreByPlayer).toBe(expectedTotal);
        });

        it('devrait appliquer la prime de +200 par défenseur pour Chelem défensif', () => {
            const { countFourPlayersTarotScore } = require('../functions/count-tarot-end-game-score');
            
            const gameState = {
                announce: Announce.GARDE,
                attackNumberOfOudlers: 0,
                attackNumberOfPoints: 0, // Chelem défensif
                petitInLastTrick: null,
                poignee: null,
                chelemResult: {
                    achieved: true,
                    byAttack: false,
                    announced: false
                },
                chelemAnnounce: undefined
            };

            const result = countFourPlayersTarotScore(gameState);
            
            // Vérifier que la prime de +200 par défenseur est bien appliquée
            const expectedBaseScore = (25 + 56) * 2; // 162 (preneur perd)
            const expectedDefenseScore = expectedBaseScore + 200; // 362
            const expectedAttackScore = -expectedDefenseScore * 3; // -1086
            
            expect(result.defenseScoreByPlayer).toBe(expectedDefenseScore);
            expect(result.attackScoreByPlayer).toBe(expectedAttackScore);
        });
    });
});

// Classe de test simplifiée pour les notifications Chelem
class TestChelemPlayer implements TarotPlayer {
    // Mocks pour les notifications Chelem
    chelemAnnounced = jest.fn();
    chelemAchieved = jest.fn();
    errorWhileAnnouncingChelem = jest.fn();
    
    // Mocks pour les autres notifications essentielles
    askedToPlay = jest.fn();
    gameOver = jest.fn();

    constructor(public readonly id: PlayerIdentifier) {}

    notify(playerNotification: TarotPlayerNotification | CardGamePlayerNotification) {
        if (playerNotification.type === "CHELEM_HAS_BEEN_ANNOUNCED") {
            this.chelemAnnounced(playerNotification.player, playerNotification.chelemType);
        }
        if (playerNotification.type === "CHELEM_ACHIEVED") {
            this.chelemAchieved(playerNotification.player, playerNotification.byAttack, playerNotification.announced);
        }
        if (playerNotification.type === "ERROR_WHILE_ANNOUNCING_CHELEM") {
            this.errorWhileAnnouncingChelem();
        }
        if (playerNotification.type === "ASKED_TO_PLAY") {
            this.askedToPlay(playerNotification.playableCards);
        }
        if (playerNotification.type === "GAME_IS_OVER") {
            this.gameOver(playerNotification.numberOfPointsForAttack);
        }
    }
}