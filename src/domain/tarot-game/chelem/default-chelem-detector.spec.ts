import { DefaultChelemDetector } from './default-chelem-detector';
import { ChelemDetector } from './chelem-detector';
import { ChelemResult } from './chelem';
import { Trick } from '../../card-game/card-game-manager';
import { TarotPlayer } from '../player/tarot-player';
import { PlayerIdentifier } from '../../card-game/player/card-game-player';
import { PlayedCard } from '../../card-game/functions/resolve-turn';
import { DECK_78 } from 'tarot-card-deck';

describe('DefaultChelemDetector', () => {
    let detector: ChelemDetector;
    let taker: TarotPlayer;
    let defender1: TarotPlayer;
    let defender2: TarotPlayer;
    let defender3: TarotPlayer;

    beforeEach(() => {
        detector = new DefaultChelemDetector();
        
        // Mock des joueurs
        taker = {
            id: 'taker-id' as PlayerIdentifier,
            notify: jest.fn(),
            play: jest.fn(),
            playError: jest.fn()
        } as TarotPlayer;

        defender1 = {
            id: 'defender1-id' as PlayerIdentifier,
            notify: jest.fn(),
            play: jest.fn(),
            playError: jest.fn()
        } as TarotPlayer;

        defender2 = {
            id: 'defender2-id' as PlayerIdentifier,
            notify: jest.fn(),
            play: jest.fn(),
            playError: jest.fn()
        } as TarotPlayer;

        defender3 = {
            id: 'defender3-id' as PlayerIdentifier,
            notify: jest.fn(),
            play: jest.fn(),
            playError: jest.fn()
        } as TarotPlayer;
    });

    const createTrick = (winnerId: PlayerIdentifier): Trick => ({
        winner: winnerId,
        cards: [
            { playingCard: DECK_78[0], playerIdentifier: taker.id },
            { playingCard: DECK_78[1], playerIdentifier: defender1.id },
            { playingCard: DECK_78[2], playerIdentifier: defender2.id },
            { playingCard: DECK_78[3], playerIdentifier: defender3.id }
        ] as PlayedCard[]
    });

    const createTricksWonBy = (winnerId: PlayerIdentifier, count: number = 18): Trick[] => {
        return Array.from({ length: count }, () => createTrick(winnerId));
    };

    describe('Chelem réalisé par l\'attaque (preneur)', () => {
        it('should detect chelem achieved by attack when taker wins all 18 tricks', () => {
            // Given: 18 levées gagnées par le preneur
            const tricks = createTricksWonBy(taker.id, 18);

            // When: détection du Chelem
            const result: ChelemResult = detector.detectChelemInTricks(tricks, taker);

            // Then: Chelem réalisé par l'attaque
            expect(result.achieved).toBe(true);
            expect(result.byAttack).toBe(true);
            expect(result.announced).toBe(false); // Par défaut, non annoncé
        });

        it('should detect chelem achieved by attack with announced flag', () => {
            // Given: 18 levées gagnées par le preneur
            const tricks = createTricksWonBy(taker.id, 18);

            // When: détection du Chelem (le flag announced sera géré par le système d'annonces)
            const result: ChelemResult = detector.detectChelemInTricks(tricks, taker);

            // Then: Chelem réalisé par l'attaque
            expect(result.achieved).toBe(true);
            expect(result.byAttack).toBe(true);
        });
    });

    describe('Chelem réalisé par la défense', () => {
        it('should detect chelem achieved by defense when a defender wins all 18 tricks', () => {
            // Given: 18 levées gagnées par un défenseur
            const tricks = createTricksWonBy(defender1.id, 18);

            // When: détection du Chelem
            const result: ChelemResult = detector.detectChelemInTricks(tricks, taker);

            // Then: Chelem réalisé par la défense
            expect(result.achieved).toBe(true);
            expect(result.byAttack).toBe(false);
            expect(result.announced).toBe(false);
        });

        it('should detect chelem achieved by defense when multiple defenders win all tricks', () => {
            // Given: 18 levées réparties entre les défenseurs (mais aucune pour le preneur)
            const tricks: Trick[] = [
                ...createTricksWonBy(defender1.id, 6),
                ...createTricksWonBy(defender2.id, 6),
                ...createTricksWonBy(defender3.id, 6)
            ];

            // When: détection du Chelem
            const result: ChelemResult = detector.detectChelemInTricks(tricks, taker);

            // Then: Chelem réalisé par la défense
            expect(result.achieved).toBe(true);
            expect(result.byAttack).toBe(false);
            expect(result.announced).toBe(false);
        });
    });

    describe('Pas de Chelem (cas normal)', () => {
        it('should detect no chelem when tricks are shared between attack and defense', () => {
            // Given: levées partagées entre attaque et défense
            const tricks: Trick[] = [
                ...createTricksWonBy(taker.id, 10),
                ...createTricksWonBy(defender1.id, 4),
                ...createTricksWonBy(defender2.id, 2),
                ...createTricksWonBy(defender3.id, 2)
            ];

            // When: détection du Chelem
            const result: ChelemResult = detector.detectChelemInTricks(tricks, taker);

            // Then: Pas de Chelem
            expect(result.achieved).toBe(false);
            expect(result.byAttack).toBe(false);
            expect(result.announced).toBe(false);
        });

        it('should detect no chelem when taker wins 17 tricks (almost chelem)', () => {
            // Given: preneur gagne 17 levées, défense gagne 1
            const tricks: Trick[] = [
                ...createTricksWonBy(taker.id, 17),
                ...createTricksWonBy(defender1.id, 1)
            ];

            // When: détection du Chelem
            const result: ChelemResult = detector.detectChelemInTricks(tricks, taker);

            // Then: Pas de Chelem
            expect(result.achieved).toBe(false);
            expect(result.byAttack).toBe(false);
            expect(result.announced).toBe(false);
        });

        it('should detect no chelem when defense wins 17 tricks (almost chelem)', () => {
            // Given: défense gagne 17 levées, preneur gagne 1
            const tricks: Trick[] = [
                ...createTricksWonBy(taker.id, 1),
                ...createTricksWonBy(defender1.id, 17)
            ];

            // When: détection du Chelem
            const result: ChelemResult = detector.detectChelemInTricks(tricks, taker);

            // Then: Pas de Chelem
            expect(result.achieved).toBe(false);
            expect(result.byAttack).toBe(false);
            expect(result.announced).toBe(false);
        });
    });

    describe('Cas limites et edge cases', () => {
        it('should throw error when tricks array is empty', () => {
            // Given: tableau de levées vide
            const tricks: Trick[] = [];

            // When/Then: erreur attendue
            expect(() => detector.detectChelemInTricks(tricks, taker))
                .toThrow('Le nombre de levées doit être exactement 18 pour une partie de Tarot à 4 joueurs');
        });

        it('should throw error when tricks array has incorrect number of tricks', () => {
            // Given: nombre incorrect de levées
            const tricks = createTricksWonBy(taker.id, 15);

            // When/Then: erreur attendue
            expect(() => detector.detectChelemInTricks(tricks, taker))
                .toThrow('Le nombre de levées doit être exactement 18 pour une partie de Tarot à 4 joueurs');
        });

        it('should throw error when tricks array has too many tricks', () => {
            // Given: trop de levées
            const tricks = createTricksWonBy(taker.id, 20);

            // When/Then: erreur attendue
            expect(() => detector.detectChelemInTricks(tricks, taker))
                .toThrow('Le nombre de levées doit être exactement 18 pour une partie de Tarot à 4 joueurs');
        });

        it('should handle null taker gracefully', () => {
            // Given: preneur null
            const tricks = createTricksWonBy('some-id' as PlayerIdentifier, 18);

            // When/Then: erreur attendue
            expect(() => detector.detectChelemInTricks(tricks, null as any))
                .toThrow('Le preneur ne peut pas être null ou undefined');
        });

        it('should handle undefined taker gracefully', () => {
            // Given: preneur undefined
            const tricks = createTricksWonBy('some-id' as PlayerIdentifier, 18);

            // When/Then: erreur attendue
            expect(() => detector.detectChelemInTricks(tricks, undefined as any))
                .toThrow('Le preneur ne peut pas être null ou undefined');
        });

        it('should detect chelem when all tricks have same winner (edge case verification)', () => {
            // Given: toutes les levées ont le même gagnant (cas limite de vérification)
            const tricks = createTricksWonBy(taker.id, 18);

            // When: détection du Chelem
            const result: ChelemResult = detector.detectChelemInTricks(tricks, taker);

            // Then: Chelem détecté correctement
            expect(result.achieved).toBe(true);
            expect(result.byAttack).toBe(true);
        });
    });

    describe('Logique de détection interne', () => {
        it('should correctly identify attack vs defense based on taker id', () => {
            // Given: différents scénarios de gagnants
            const testCases = [
                { winnerId: taker.id, expectedByAttack: true },
                { winnerId: defender1.id, expectedByAttack: false },
                { winnerId: defender2.id, expectedByAttack: false },
                { winnerId: defender3.id, expectedByAttack: false }
            ];

            testCases.forEach(({ winnerId, expectedByAttack }) => {
                // When: toutes les levées gagnées par ce joueur
                const tricks = createTricksWonBy(winnerId, 18);
                const result = detector.detectChelemInTricks(tricks, taker);

                // Then: identification correcte du camp
                expect(result.achieved).toBe(true);
                expect(result.byAttack).toBe(expectedByAttack);
            });
        });

        it('should count tricks correctly for mixed scenarios', () => {
            // Given: scénarios mixtes pour vérifier le comptage
            const mixedScenarios = [
                {
                    description: 'Majorité attaque mais pas Chelem',
                    tricks: [
                        ...createTricksWonBy(taker.id, 12),
                        ...createTricksWonBy(defender1.id, 6)
                    ],
                    expectedAchieved: false
                },
                {
                    description: 'Majorité défense mais pas Chelem',
                    tricks: [
                        ...createTricksWonBy(taker.id, 6),
                        ...createTricksWonBy(defender1.id, 12)
                    ],
                    expectedAchieved: false
                },
                {
                    description: 'Répartition équilibrée',
                    tricks: [
                        ...createTricksWonBy(taker.id, 9),
                        ...createTricksWonBy(defender1.id, 9)
                    ],
                    expectedAchieved: false
                }
            ];

            mixedScenarios.forEach(({ description, tricks, expectedAchieved }) => {
                // When: détection sur ce scénario
                const result = detector.detectChelemInTricks(tricks, taker);

                // Then: résultat attendu
                expect(result.achieved).toBe(expectedAchieved);
            });
        });
    });
});