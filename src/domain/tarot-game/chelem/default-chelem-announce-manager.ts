import { ChelemAnnounceManager } from './chelem-announce-manager';
import { TarotPlayer } from '../player/tarot-player';
import { ChelemAnnounce, ChelemType } from './chelem';

/**
 * Implémentation par défaut du gestionnaire d'annonces de Chelem
 *
 * Applique les règles officielles du Tarot :
 * - Seul le preneur peut annoncer un Chelem
 * - L'annonce se fait après l'annonce du contrat
 * - L'annonce engage le joueur à réaliser toutes les levées
 */
export class DefaultChelemAnnounceManager implements ChelemAnnounceManager {

    /**
     * Demande au preneur s'il souhaite annoncer un Chelem
     *
     * @param player Le preneur à qui demander
     */
    private static askForChelemAnnounce(player: TarotPlayer): void {
        player.notify({
            type: "ASKED_FOR_CHELEM_ANNOUNCE"
        });
    }

    /**
     * Notifie qu'un Chelem a été annoncé
     *
     * @param playerToNotify Le joueur à notifier
     * @param playerThatAnnounced Le joueur qui a annoncé
     * @param chelemType Le type de Chelem annoncé
     */
    private static notifyChelemHasBeenAnnounced(playerToNotify: TarotPlayer, playerThatAnnounced: TarotPlayer, chelemType: ChelemType): void {
        playerToNotify.notify({
            type: "CHELEM_HAS_BEEN_ANNOUNCED",
            player: playerThatAnnounced.id,
            chelemType: chelemType
        });
    }

    /**
     * Notifie une erreur lors de l'annonce de Chelem
     *
     * @param player Le joueur à notifier
     */
    private static notifyErrorWhileAnnouncingChelem(player: TarotPlayer): void {
        player.notify({
            type: "ERROR_WHILE_ANNOUNCING_CHELEM"
        });
    }
    
    /**
     * Vérifie si un joueur peut annoncer un Chelem après le contrat
     * 
     * Selon les règles officielles, seul le preneur peut annoncer un Chelem.
     * 
     * @param player Le joueur qui souhaite annoncer
     * @param taker Le preneur de la donne
     * @returns true si le joueur peut annoncer un Chelem
     */
    canAnnounceChelemAfterContract(player: TarotPlayer, taker: TarotPlayer): boolean {
        // Vérifications de base
        if (!player || !taker) {
            return false;
        }

        // Seul le preneur peut annoncer un Chelem
        return player.id === taker.id;
    }

    /**
     * Annonce un Chelem après le contrat
     * 
     * Crée une annonce de Chelem valide si le joueur est autorisé.
     * 
     * @param player Le joueur qui annonce
     * @param type Le type de Chelem annoncé
     * @returns L'annonce de Chelem créée
     * @throws Error si le joueur n'est pas autorisé à annoncer
     */
    announceChelemAfterContract(player: TarotPlayer, type: ChelemType): ChelemAnnounce {
        // Validation des paramètres
        if (!player) {
            throw new Error('Joueur invalide pour l\'annonce de Chelem');
        }

        if (!type) {
            throw new Error('Type de Chelem invalide');
        }

        // Note: Dans cette méthode, nous ne pouvons pas vérifier directement si le joueur
        // est le preneur car nous n'avons pas accès au taker ici.
        // Cette validation sera faite au niveau de la phase d'annonce.
        // Pour l'instant, nous créons l'annonce et la validation sera faite ailleurs.

        return {
            player: player.id,
            type: type
        };
    }

    /**
     * Méthode privée pour valider qu'un joueur est bien le preneur
     * 
     * @param player Le joueur à valider
     * @param taker Le preneur de la donne
     * @throws Error si le joueur n'est pas le preneur
     */
    private validatePlayerIsTaker(player: TarotPlayer, taker: TarotPlayer): void {
        if (!this.canAnnounceChelemAfterContract(player, taker)) {
            throw new Error('Seul le preneur peut annoncer un Chelem');
        }
    }

    /**
     * Version sécurisée de l'annonce qui valide le preneur
     * 
     * @param player Le joueur qui annonce
     * @param taker Le preneur de la donne
     * @param type Le type de Chelem annoncé
     * @returns L'annonce de Chelem créée
     * @throws Error si le joueur n'est pas autorisé à annoncer
     */
    announceChelemAfterContractWithTakerValidation(player: TarotPlayer, taker: TarotPlayer, type: ChelemType): ChelemAnnounce {
        this.validatePlayerIsTaker(player, taker);
        return this.announceChelemAfterContract(player, type);
    }
}