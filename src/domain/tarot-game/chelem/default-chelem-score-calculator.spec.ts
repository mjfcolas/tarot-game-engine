import { DefaultChelemScoreCalculator } from './default-chelem-score-calculator';
import { ChelemAnnounce, ChelemResult, ChelemType } from './chelem';

describe('DefaultChelemScoreCalculator', () => {
    let calculator: DefaultChelemScoreCalculator;

    beforeEach(() => {
        calculator = new DefaultChelemScoreCalculator();
    });

    describe('calculateChelemScore', () => {
        describe('Chelem annoncé et réalisé par l\'attaque', () => {
            it('devrait retourner +400 points', () => {
                // Given
                const chelemAnnounce: ChelemAnnounce = {
                    player: 'player1',
                    type: ChelemType.ANNOUNCED
                };
                const chelemResult: ChelemResult = {
                    achieved: true,
                    byAttack: true,
                    announced: true
                };

                // When
                const score = calculator.calculateChelemScore(chelemAnnounce, chelemResult);

                // Then
                expect(score).toBe(400);
            });
        });

        describe('Chelem non annoncé mais réalisé par l\'attaque', () => {
            it('devrait retourner +200 points', () => {
                // Given
                const chelemResult: ChelemResult = {
                    achieved: true,
                    byAttack: true,
                    announced: false
                };

                // When
                const score = calculator.calculateChelemScore(undefined, chelemResult);

                // Then
                expect(score).toBe(200);
            });
        });

        describe('Chelem annoncé mais non réalisé par l\'attaque', () => {
            it('devrait retourner -200 points', () => {
                // Given
                const chelemAnnounce: ChelemAnnounce = {
                    player: 'player1',
                    type: ChelemType.ANNOUNCED
                };
                const chelemResult: ChelemResult = {
                    achieved: false,
                    byAttack: true,
                    announced: true
                };

                // When
                const score = calculator.calculateChelemScore(chelemAnnounce, chelemResult);

                // Then
                expect(score).toBe(-200);
            });
        });

        describe('Chelem défensif réussi', () => {
            it('devrait retourner +200 points quand la défense réalise le chelem', () => {
                // Given
                const chelemResult: ChelemResult = {
                    achieved: true,
                    byAttack: false,
                    announced: false
                };

                // When
                const score = calculator.calculateChelemScore(undefined, chelemResult);

                // Then
                expect(score).toBe(200);
            });

            it('devrait retourner +200 points même si l\'attaque avait annoncé un chelem', () => {
                // Given
                const chelemAnnounce: ChelemAnnounce = {
                    player: 'player1',
                    type: ChelemType.ANNOUNCED
                };
                const chelemResult: ChelemResult = {
                    achieved: true,
                    byAttack: false,
                    announced: true
                };

                // When
                const score = calculator.calculateChelemScore(chelemAnnounce, chelemResult);

                // Then
                expect(score).toBe(200);
            });
        });

        describe('Pas de Chelem', () => {
            it('devrait retourner 0 points quand aucun chelem n\'est réalisé', () => {
                // Given
                const chelemResult: ChelemResult = {
                    achieved: false,
                    byAttack: true,
                    announced: false
                };

                // When
                const score = calculator.calculateChelemScore(undefined, chelemResult);

                // Then
                expect(score).toBe(0);
            });

            it('devrait retourner 0 points quand il n\'y a ni annonce ni résultat', () => {
                // When
                const score = calculator.calculateChelemScore();

                // Then
                expect(score).toBe(0);
            });

            it('devrait retourner 0 points quand il y a seulement une annonce mais pas de résultat', () => {
                // Given
                const chelemAnnounce: ChelemAnnounce = {
                    player: 'player1',
                    type: ChelemType.ANNOUNCED
                };

                // When
                const score = calculator.calculateChelemScore(chelemAnnounce);

                // Then
                expect(score).toBe(0);
            });
        });

        describe('Cas d\'erreur et edge cases', () => {
            it('devrait retourner 0 points quand le résultat indique non annoncé mais qu\'il y a une annonce', () => {
                // Given
                const chelemAnnounce: ChelemAnnounce = {
                    player: 'player1',
                    type: ChelemType.ANNOUNCED
                };
                const chelemResult: ChelemResult = {
                    achieved: true,
                    byAttack: true,
                    announced: false // Incohérence : il y a une annonce mais le résultat dit non annoncé
                };

                // When
                const score = calculator.calculateChelemScore(chelemAnnounce, chelemResult);

                // Then
                expect(score).toBe(0);
            });

            it('devrait retourner 0 points quand le résultat indique annoncé mais qu\'il n\'y a pas d\'annonce', () => {
                // Given
                const chelemResult: ChelemResult = {
                    achieved: true,
                    byAttack: true,
                    announced: true // Incohérence : pas d'annonce mais le résultat dit annoncé
                };

                // When
                const score = calculator.calculateChelemScore(undefined, chelemResult);

                // Then
                expect(score).toBe(0);
            });

            it('devrait gérer le cas où l\'annonce est NOT_ANNOUNCED', () => {
                // Given
                const chelemAnnounce: ChelemAnnounce = {
                    player: 'player1',
                    type: ChelemType.NOT_ANNOUNCED
                };
                const chelemResult: ChelemResult = {
                    achieved: true,
                    byAttack: true,
                    announced: false
                };

                // When
                const score = calculator.calculateChelemScore(chelemAnnounce, chelemResult);

                // Then
                expect(score).toBe(200);
            });
        });

        describe('Scénarios complexes', () => {
            it('devrait prioriser le résultat byAttack sur l\'annonce pour déterminer qui a réalisé le chelem', () => {
                // Given - L'attaque annonce mais la défense réalise le chelem
                const chelemAnnounce: ChelemAnnounce = {
                    player: 'player1',
                    type: ChelemType.ANNOUNCED
                };
                const chelemResult: ChelemResult = {
                    achieved: true,
                    byAttack: false, // La défense réalise le chelem
                    announced: true
                };

                // When
                const score = calculator.calculateChelemScore(chelemAnnounce, chelemResult);

                // Then
                expect(score).toBe(200); // Chelem défensif, pas pénalité pour l'attaque
            });
        });
    });
});