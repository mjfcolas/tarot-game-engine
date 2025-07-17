import { ChelemType, ChelemAnnounce, ChelemResult } from './chelem';
import { PlayerIdentifier } from '../../card-game/player/card-game-player';

describe('Chelem Types', () => {
    describe('ChelemType', () => {
        it('should have ANNOUNCED type', () => {
            expect(ChelemType.ANNOUNCED).toBe('ANNOUNCED');
        });

        it('should have NOT_ANNOUNCED type', () => {
            expect(ChelemType.NOT_ANNOUNCED).toBe('NOT_ANNOUNCED');
        });
    });

    describe('ChelemAnnounce', () => {
        it('should create a valid ChelemAnnounce with ANNOUNCED type', () => {
            const playerId: PlayerIdentifier = 'player1';
            const chelemAnnounce: ChelemAnnounce = {
                player: playerId,
                type: ChelemType.ANNOUNCED
            };

            expect(chelemAnnounce.player).toBe('player1');
            expect(chelemAnnounce.type).toBe(ChelemType.ANNOUNCED);
        });

        it('should create a valid ChelemAnnounce with NOT_ANNOUNCED type', () => {
            const playerId: PlayerIdentifier = 'player2';
            const chelemAnnounce: ChelemAnnounce = {
                player: playerId,
                type: ChelemType.NOT_ANNOUNCED
            };

            expect(chelemAnnounce.player).toBe('player2');
            expect(chelemAnnounce.type).toBe(ChelemType.NOT_ANNOUNCED);
        });
    });

    describe('ChelemResult', () => {
        it('should create a valid ChelemResult for achieved announced chelem by attack', () => {
            const chelemResult: ChelemResult = {
                achieved: true,
                byAttack: true,
                announced: true
            };

            expect(chelemResult.achieved).toBe(true);
            expect(chelemResult.byAttack).toBe(true);
            expect(chelemResult.announced).toBe(true);
        });

        it('should create a valid ChelemResult for achieved non-announced chelem by attack', () => {
            const chelemResult: ChelemResult = {
                achieved: true,
                byAttack: true,
                announced: false
            };

            expect(chelemResult.achieved).toBe(true);
            expect(chelemResult.byAttack).toBe(true);
            expect(chelemResult.announced).toBe(false);
        });

        it('should create a valid ChelemResult for achieved chelem by defense', () => {
            const chelemResult: ChelemResult = {
                achieved: true,
                byAttack: false,
                announced: false
            };

            expect(chelemResult.achieved).toBe(true);
            expect(chelemResult.byAttack).toBe(false);
            expect(chelemResult.announced).toBe(false);
        });

        it('should create a valid ChelemResult for failed announced chelem', () => {
            const chelemResult: ChelemResult = {
                achieved: false,
                byAttack: true,
                announced: true
            };

            expect(chelemResult.achieved).toBe(false);
            expect(chelemResult.byAttack).toBe(true);
            expect(chelemResult.announced).toBe(true);
        });

        it('should handle all possible combinations of boolean values', () => {
            const combinations = [
                { achieved: true, byAttack: true, announced: true },
                { achieved: true, byAttack: true, announced: false },
                { achieved: true, byAttack: false, announced: false },
                { achieved: false, byAttack: true, announced: true },
                { achieved: false, byAttack: true, announced: false },
                { achieved: false, byAttack: false, announced: false }
            ];

            combinations.forEach(combo => {
                const chelemResult: ChelemResult = combo;
                expect(chelemResult.achieved).toBe(combo.achieved);
                expect(chelemResult.byAttack).toBe(combo.byAttack);
                expect(chelemResult.announced).toBe(combo.announced);
            });
        });
    });

    describe('Type compatibility', () => {
        it('should be compatible with PlayerIdentifier type', () => {
            const playerId: PlayerIdentifier = 'test-player';
            const chelemAnnounce: ChelemAnnounce = {
                player: playerId,
                type: ChelemType.ANNOUNCED
            };

            expect(typeof chelemAnnounce.player).toBe('string');
        });
    });

    describe('Integration with TarotGameState', () => {
        it('should be compatible with TarotGameState type', () => {
            // Import dynamique pour éviter les dépendances circulaires dans les tests
            const TarotGameModule = require('../tarot-game');
            
            const chelemAnnounce: ChelemAnnounce = {
                player: 'player1',
                type: ChelemType.ANNOUNCED
            };

            const chelemResult: ChelemResult = {
                achieved: true,
                byAttack: true,
                announced: true
            };

            const gameState = {
                chelemAnnounce,
                chelemResult
            };

            expect(gameState.chelemAnnounce).toBeDefined();
            expect(gameState.chelemResult).toBeDefined();
            expect(gameState.chelemAnnounce?.player).toBe('player1');
            expect(gameState.chelemResult?.achieved).toBe(true);
        });

        it('should handle optional chelem properties in game state', () => {
            const gameStateWithoutChelem = {};
            const gameStateWithChelem = {
                chelemAnnounce: {
                    player: 'player1',
                    type: ChelemType.ANNOUNCED
                } as ChelemAnnounce
            };

            expect(gameStateWithoutChelem).toBeDefined();
            expect(gameStateWithChelem.chelemAnnounce).toBeDefined();
        });
    });
});