import { TarotPlayer } from '../player/tarot-player';
import { ChelemAnnounce, ChelemType } from './chelem';

/**
 * Gestionnaire des annonces de Chelem
 * 
 * Responsable de la gestion des annonces de Chelem selon les règles officielles :
 * - Seul le preneur peut annoncer un Chelem
 * - L'annonce se fait après l'annonce du contrat
 * - L'annonce engage le joueur à réaliser toutes les levées
 */
export interface ChelemAnnounceManager {
    /**
     * Vérifie si un joueur peut annoncer un Chelem après le contrat
     * 
     * @param player Le joueur qui souhaite annoncer
     * @param taker Le preneur de la donne
     * @returns true si le joueur peut annoncer un Chelem
     */
    canAnnounceChelemAfterContract(player: TarotPlayer, taker: TarotPlayer): boolean;

    /**
     * Annonce un Chelem après le contrat
     * 
     * @param player Le joueur qui annonce
     * @param type Le type de Chelem annoncé
     * @returns L'annonce de Chelem créée
     * @throws Error si le joueur n'est pas autorisé à annoncer
     */
    announceChelemAfterContract(player: TarotPlayer, type: ChelemType): ChelemAnnounce;
}