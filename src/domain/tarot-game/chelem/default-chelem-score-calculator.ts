import { ChelemScoreCalculator } from './chelem-score-calculator';
import { ChelemAnnounce, ChelemResult, ChelemType } from './chelem';

/**
 * Implémentation par défaut du calculateur de score de Chelem
 * 
 * Applique les règles officielles du Tarot français :
 * - Chelem annoncé et réalisé par l'attaque : +400 points
 * - Chelem non annoncé mais réalisé par l'attaque : +200 points
 * - Chelem annoncé mais non réalisé par l'attaque : -200 points
 * - Chelem défensif réussi : +200 points
 * - Pas de Chelem ou cas incohérents : 0 points
 */
export class DefaultChelemScoreCalculator implements ChelemScoreCalculator {
    
    calculateChelemScore(chelemAnnounce?: ChelemAnnounce, chelemResult?: ChelemResult): number {
        // Cas où il n'y a pas de résultat de Chelem
        if (!chelemResult) {
            return 0;
        }

        // Cas où aucun Chelem n'a été réalisé
        if (!chelemResult.achieved) {
            // Si un Chelem était annoncé mais non réalisé par l'attaque
            if (chelemAnnounce && chelemResult.announced && chelemResult.byAttack) {
                return -200;
            }
            return 0;
        }

        // Vérification de cohérence entre l'annonce et le résultat
        const hasAnnounce = !!chelemAnnounce;
        const isAnnouncedType = chelemAnnounce?.type === ChelemType.ANNOUNCED;
        
        // Pour les annonces NOT_ANNOUNCED, on considère que c'est cohérent avec announced: false
        if (chelemAnnounce?.type === ChelemType.NOT_ANNOUNCED) {
            if (chelemResult.announced) {
                // Incohérence : annonce NOT_ANNOUNCED mais résultat dit annoncé
                return 0;
            }
        } else if (hasAnnounce !== chelemResult.announced) {
            // Incohérence détectée pour les autres cas
            return 0;
        }

        // Chelem réalisé par la défense (Chelem défensif)
        if (!chelemResult.byAttack) {
            return 200;
        }

        // Chelem réalisé par l'attaque
        if (chelemResult.announced && chelemAnnounce) {
            // Chelem annoncé et réalisé par l'attaque
            return 400;
        } else if (!chelemResult.announced) {
            // Chelem non annoncé mais réalisé par l'attaque
            return 200;
        }

        // Cas par défaut (ne devrait pas arriver)
        return 0;
    }
}