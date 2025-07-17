import { ChelemDetector } from './chelem-detector';
import { ChelemResult } from './chelem';
import { Trick } from '../../card-game/card-game-manager';
import { TarotPlayer } from '../player/tarot-player';

/**
 * Implémentation par défaut du détecteur de Chelem
 * 
 * Analyse les 18 levées d'une partie de Tarot à 4 joueurs
 * pour déterminer si un Chelem a été réalisé.
 */
export class DefaultChelemDetector implements ChelemDetector {
    
    /**
     * Détecte si un Chelem a été réalisé en analysant les levées
     * 
     * @param tricks - Les 18 levées de la partie
     * @param taker - Le joueur preneur (attaque)
     * @returns Le résultat de la détection du Chelem
     * @throws Error si le nombre de levées n'est pas 18 ou si le preneur est invalide
     */
    detectChelemInTricks(tricks: Trick[], taker: TarotPlayer): ChelemResult {
        this.validateInputs(tricks, taker);

        // Compter les levées gagnées par l'attaque et la défense
        const attackTricks = this.countAttackTricks(tricks, taker);
        const defenseTricks = tricks.length - attackTricks;

        // Déterminer si un Chelem a été réalisé
        const chelemAchieved = attackTricks === 18 || defenseTricks === 18;
        const chelemByAttack = attackTricks === 18;

        return {
            achieved: chelemAchieved,
            byAttack: chelemByAttack,
            announced: false // Le flag announced sera géré par le système d'annonces
        };
    }

    /**
     * Valide les paramètres d'entrée
     * 
     * @param tricks - Les levées à valider
     * @param taker - Le preneur à valider
     * @throws Error si les paramètres sont invalides
     */
    private validateInputs(tricks: Trick[], taker: TarotPlayer): void {
        if (!taker) {
            throw new Error('Le preneur ne peut pas être null ou undefined');
        }

        if (!tricks || tricks.length !== 18) {
            throw new Error('Le nombre de levées doit être exactement 18 pour une partie de Tarot à 4 joueurs');
        }
    }

    /**
     * Compte le nombre de levées gagnées par l'attaque (preneur)
     * 
     * @param tricks - Les levées à analyser
     * @param taker - Le joueur preneur
     * @returns Le nombre de levées gagnées par l'attaque
     */
    private countAttackTricks(tricks: Trick[], taker: TarotPlayer): number {
        return tricks.filter(trick => trick.winner === taker.id).length;
    }
}