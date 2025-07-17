import { PlayerIdentifier } from '../../card-game/player/card-game-player';

/**
 * Types de Chelem selon les règles officielles du Tarot
 *
 * - ANNOUNCED: Chelem annoncé avant le jeu (prime +400 si réussi, -200 si échoué)
 * - NOT_ANNOUNCED: Chelem réalisé sans annonce préalable (prime +200)
 */
export enum ChelemType {
    ANNOUNCED = 'ANNOUNCED',
    NOT_ANNOUNCED = 'NOT_ANNOUNCED'
}

/**
 * Annonce de Chelem par un joueur
 *
 * Représente l'intention d'un joueur de réaliser toutes les levées.
 * L'annonce se fait après l'annonce du contrat et engage le joueur.
 */
export type ChelemAnnounce = {
    /** Identifiant du joueur qui annonce le Chelem */
    player: PlayerIdentifier;
    /** Type de Chelem (annoncé ou non annoncé) */
    type: ChelemType;
};

/**
 * Résultat d'un Chelem à la fin de la partie
 *
 * Contient toutes les informations nécessaires pour calculer
 * les primes et pénalités selon les règles officielles.
 */
export type ChelemResult = {
    /** Le Chelem a-t-il été réalisé (toutes les levées gagnées) ? */
    achieved: boolean;
    /** Le Chelem a-t-il été réalisé par l'attaque (preneur) ? */
    byAttack: boolean;
    /** Le Chelem avait-il été annoncé ? */
    announced: boolean;
};