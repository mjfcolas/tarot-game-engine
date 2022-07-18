import {PlayingCard} from "tarot-card-deck";
import {isCavalier, isExcuse, isJack, isKing, isOudler, isQueen} from "../cards/card-types";

export type CountEndGameTakerPoints = (takerWonCards: PlayingCard[], takerHasExcuseAtStartOfGame: boolean) => number

const valueForGivenCard = (playingCard: PlayingCard) => {
    if (isKing(playingCard) || isOudler(playingCard)) {
        return 4.5
    } else if (isQueen(playingCard)) {
        return 3.5
    } else if (isCavalier(playingCard)) {
        return 2.5
    } else if (isJack(playingCard)) {
        return 1.5
    } else {
        return 0.5
    }
}

export function countTarotEndGameTakerPoints(takerWonCards: PlayingCard[], takerHasExcuseAtStartOfGame: boolean): number {
    const scoreWithoutExcuseTakenIntoAccount = takerWonCards
        .map((playingCard: PlayingCard) => valueForGivenCard(playingCard))
        .reduce((sum, current) => sum + current, 0);

    const excuseIsInTakerGame = takerWonCards.some(playingCard => isExcuse(playingCard));
    if (excuseIsInTakerGame && !takerHasExcuseAtStartOfGame) {
        return scoreWithoutExcuseTakenIntoAccount - 4;
    } else if (!excuseIsInTakerGame && takerHasExcuseAtStartOfGame) {
        return scoreWithoutExcuseTakenIntoAccount + 4
    } else {
        return scoreWithoutExcuseTakenIntoAccount;
    }
}
