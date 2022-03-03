import {PlayingCard} from "tarot-card-deck";
import {JOKER} from "tarot-card-deck/dist/cards/all-playing-cards";
import {PlayingCardType} from "tarot-card-deck/dist/cards/playing-card";
import {ClassicCard, isClassicCard, isTrumpCard, TrumpCard} from "../cards/card-types";

export function getPlayableTarotCards(alreadyPlayedCards: readonly PlayingCard[], playerCards: readonly PlayingCard[]): readonly PlayingCard[] {
    let masterCard: PlayingCard;
    let masterTrump: TrumpCard;
    for (let potentialMasterCard of alreadyPlayedCards) {
        if (!masterCard && potentialMasterCard !== JOKER) {
            masterCard = potentialMasterCard;
        }
    }
    for (let potentialMasterCard of alreadyPlayedCards) {
        if (isTrumpCard(potentialMasterCard) && (!masterTrump || masterTrump.value < (potentialMasterCard as TrumpCard).value)) {
            masterTrump = potentialMasterCard;
        }
    }

    if (!masterCard) {
        return playerCards;
    }
    const askedSuitInPlayerCards: PlayingCard[] = playerCards
        .filter(card => isClassicCard(masterCard) && isClassicCard(card))
        .filter(card => (card as ClassicCard).suit === (masterCard as ClassicCard).suit);
    const trumpsOverAskedTrumpInPlayerCards: PlayingCard[] = playerCards
        .filter(card => masterTrump && isTrumpCard(card))
        .filter(card => (card as TrumpCard).value > masterTrump.value)
    const allTrumpsInPlayerCards: PlayingCard[] = playerCards
        .filter(card => isTrumpCard(card))

    let playableCards = [...askedSuitInPlayerCards];
    if (playableCards.length === 0) {
        playableCards = [...playableCards, ...trumpsOverAskedTrumpInPlayerCards]
    }
    if (playableCards.length === 0) {
        playableCards = [...playableCards, ...allTrumpsInPlayerCards]
    }
    if (playableCards.length === 0) {
        playableCards = [...playableCards, ...playerCards]
    } else {
        const excuseInPlayerCards: PlayingCard[] = playerCards
            .filter(card => card.type === PlayingCardType.JOKER)
        playableCards = [...playableCards, ...excuseInPlayerCards]
    }
    return playableCards
}
