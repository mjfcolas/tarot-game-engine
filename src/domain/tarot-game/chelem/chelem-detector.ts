import { Trick } from '../../card-game/card-game-manager';
import { TarotPlayer } from '../player/tarot-player';
import { ChelemResult } from './chelem';

/**
 * Interface pour détecter si un Chelem a été réalisé
 * 
 * Analyse les levées d'une partie pour déterminer si un camp
 * a gagné toutes les levées (Chelem).
 */
export interface ChelemDetector {
    /**
     * Détecte si un Chelem a été réalisé en analysant les levées
     * 
     * @param tricks - Les 18 levées de la partie
     * @param taker - Le joueur preneur (attaque)
     * @returns Le résultat de la détection du Chelem
     */
    detectChelemInTricks(tricks: Trick[], taker: TarotPlayer): ChelemResult;
}