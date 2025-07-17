import { ChelemAnnounce, ChelemResult } from './chelem';

/**
 * Interface pour calculer les primes et pénalités du Chelem
 * 
 * Selon les règles officielles du Tarot :
 * - Chelem annoncé et réalisé : +400 points
 * - Chelem non annoncé mais réalisé : +200 points  
 * - Chelem annoncé mais non réalisé : -200 points
 * - Chelem défensif réussi : +200 points (par défenseur)
 * - Pas de Chelem : 0 points
 */
export interface ChelemScoreCalculator {
    /**
     * Calcule la prime ou pénalité de Chelem
     * 
     * @param chelemAnnounce - L'annonce de Chelem (optionnelle)
     * @param chelemResult - Le résultat du Chelem (optionnel)
     * @returns La prime (positive) ou pénalité (négative) en points
     */
    calculateChelemScore(chelemAnnounce?: ChelemAnnounce, chelemResult?: ChelemResult): number;
}