import { DefaultChelemAnnounceManager } from './default-chelem-announce-manager';
import { ChelemType } from './chelem';
import { TarotPlayer } from '../player/tarot-player';
import { DummyTarotPlayer } from '../player/__dummy__/dummy-tarot-player';

describe('DefaultChelemAnnounceManager', () => {
    let chelemAnnounceManager: DefaultChelemAnnounceManager;
    let taker: TarotPlayer;
    let defender1: TarotPlayer;
    let defender2: TarotPlayer;
    let defender3: TarotPlayer;

    beforeEach(() => {
        chelemAnnounceManager = new DefaultChelemAnnounceManager();
        taker = new DummyTarotPlayer('taker');
        defender1 = new DummyTarotPlayer('defender1');
        defender2 = new DummyTarotPlayer('defender2');
        defender3 = new DummyTarotPlayer('defender3');
    });

    describe('canAnnounceChelemAfterContract', () => {
        it('should return true when the taker wants to announce a Chelem', () => {
            // Given
            const player = taker;

            // When
            const canAnnounce = chelemAnnounceManager.canAnnounceChelemAfterContract(player, taker);

            // Then
            expect(canAnnounce).toBe(true);
        });

        it('should return false when a defender wants to announce a Chelem', () => {
            // Given
            const player = defender1;

            // When
            const canAnnounce = chelemAnnounceManager.canAnnounceChelemAfterContract(player, taker);

            // Then
            expect(canAnnounce).toBe(false);
        });

        it('should return false when player is null', () => {
            // Given
            const player = null;

            // When
            const canAnnounce = chelemAnnounceManager.canAnnounceChelemAfterContract(player, taker);

            // Then
            expect(canAnnounce).toBe(false);
        });

        it('should return false when taker is null', () => {
            // Given
            const player = taker;

            // When
            const canAnnounce = chelemAnnounceManager.canAnnounceChelemAfterContract(player, null);

            // Then
            expect(canAnnounce).toBe(false);
        });
    });

    describe('announceChelemAfterContract', () => {
        it('should create a valid Chelem announce when taker announces ANNOUNCED type', () => {
            // Given
            const player = taker;
            const type = ChelemType.ANNOUNCED;

            // When
            const chelemAnnounce = chelemAnnounceManager.announceChelemAfterContract(player, type);

            // Then
            expect(chelemAnnounce).toEqual({
                player: taker.id,
                type: ChelemType.ANNOUNCED
            });
        });

        it('should create a valid Chelem announce when taker announces NOT_ANNOUNCED type', () => {
            // Given
            const player = taker;
            const type = ChelemType.NOT_ANNOUNCED;

            // When
            const chelemAnnounce = chelemAnnounceManager.announceChelemAfterContract(player, type);

            // Then
            expect(chelemAnnounce).toEqual({
                player: taker.id,
                type: ChelemType.NOT_ANNOUNCED
            });
        });

        it('should throw an error when a defender tries to announce a Chelem', () => {
            // Given
            const player = defender1;
            const type = ChelemType.ANNOUNCED;

            // When & Then
            expect(() => {
                chelemAnnounceManager.announceChelemAfterContractWithTakerValidation(player, taker, type);
            }).toThrow('Seul le preneur peut annoncer un Chelem');
        });

        it('should throw an error when player is null', () => {
            // Given
            const player = null;
            const type = ChelemType.ANNOUNCED;

            // When & Then
            expect(() => {
                chelemAnnounceManager.announceChelemAfterContract(player, type);
            }).toThrow('Joueur invalide pour l\'annonce de Chelem');
        });

        it('should throw an error when type is null', () => {
            // Given
            const player = taker;
            const type = null;

            // When & Then
            expect(() => {
                chelemAnnounceManager.announceChelemAfterContract(player, type);
            }).toThrow('Type de Chelem invalide');
        });

        it('should create valid announce with taker validation when taker announces', () => {
            // Given
            const player = taker;
            const type = ChelemType.ANNOUNCED;

            // When
            const chelemAnnounce = chelemAnnounceManager.announceChelemAfterContractWithTakerValidation(player, taker, type);

            // Then
            expect(chelemAnnounce).toEqual({
                player: taker.id,
                type: ChelemType.ANNOUNCED
            });
        });
    });

    describe('integration with taker validation', () => {
        it('should work correctly when same player instance is used for taker and player', () => {
            // Given
            const sameTakerInstance = taker;

            // When
            const canAnnounce = chelemAnnounceManager.canAnnounceChelemAfterContract(sameTakerInstance, taker);
            const chelemAnnounce = chelemAnnounceManager.announceChelemAfterContract(sameTakerInstance, ChelemType.ANNOUNCED);

            // Then
            expect(canAnnounce).toBe(true);
            expect(chelemAnnounce.player).toBe(taker.id);
            expect(chelemAnnounce.type).toBe(ChelemType.ANNOUNCED);
        });

        it('should work correctly when different player instances with same id are used', () => {
            // Given
            const anotherTakerInstance = new DummyTarotPlayer('taker'); // Same id as taker

            // When
            const canAnnounce = chelemAnnounceManager.canAnnounceChelemAfterContract(anotherTakerInstance, taker);
            const chelemAnnounce = chelemAnnounceManager.announceChelemAfterContract(anotherTakerInstance, ChelemType.ANNOUNCED);

            // Then
            expect(canAnnounce).toBe(true);
            expect(chelemAnnounce.player).toBe(taker.id);
            expect(chelemAnnounce.type).toBe(ChelemType.ANNOUNCED);
        });
    });
});