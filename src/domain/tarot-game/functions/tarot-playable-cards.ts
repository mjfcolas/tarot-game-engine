import {PlayingCard} from "tarot-card-deck";
import {EXCUSE} from "tarot-card-deck/dist/cards/all-playing-cards";
import {PlayingCardType} from "tarot-card-deck/dist/cards/playing-card";
import {ClassicCard, isClassicCard, isTrumpCard, TrumpCard} from "../cards/card-types";

export function getPlayableTarotCards(alreadyPlayedCards: readonly PlayingCard[], playerCards: readonly PlayingCard[]): readonly PlayingCard[] {
    const masterCard: PlayingCard = getMasterCard(alreadyPlayedCards);
    const masterTrump: TrumpCard = getMasterTrump((alreadyPlayedCards))

    if (!masterCard) {
        return playerCards;
    }

    return resolvePlayableCards(playerCards, masterCard, masterTrump)
}

function getMasterCard(alreadyPlayedCards: readonly PlayingCard[]) {
    let masterCard: PlayingCard;
    for (let potentialMasterCard of alreadyPlayedCards) {
        if (!masterCard && potentialMasterCard !== EXCUSE) {
            masterCard = potentialMasterCard;
        }
    }
    return masterCard;
}

function getMasterTrump(alreadyPlayedCards: readonly PlayingCard[]) {
    let masterTrump: TrumpCard;
    for (let potentialMasterCard of alreadyPlayedCards) {
        if (isTrumpCard(potentialMasterCard) && (!masterTrump || masterTrump.value < (potentialMasterCard as TrumpCard).value)) {
            masterTrump = potentialMasterCard;
        }
    }
    return masterTrump
}

function resolvePlayableCards(playerCards: readonly PlayingCard[], masterCard: PlayingCard, masterTrump: TrumpCard) {
    const askedSuitInPlayerCards: PlayingCard[] = getAskedSuitInPlayerCards(playerCards, masterCard)
    const trumpsOverAskedTrumpInPlayerCards: PlayingCard[] = getTrumpsOverAskedTrumpInPlayerCards(playerCards, masterTrump)
    const allTrumpsInPlayerCards: PlayingCard[] = getAllTrumpsInPlayerCards(playerCards);

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
            .filter(card => card.type === PlayingCardType.EXCUSE)
        playableCards = [...playableCards, ...excuseInPlayerCards]
    }
    return playableCards
}

function getAskedSuitInPlayerCards(playerCards: readonly PlayingCard[], masterCard: PlayingCard) {
    return playerCards
        .filter(card => isClassicCard(masterCard) && isClassicCard(card))
        .filter(card => (card as ClassicCard).suit === (masterCard as ClassicCard).suit);
}

function getTrumpsOverAskedTrumpInPlayerCards(playerCards: readonly PlayingCard[], masterTrump: TrumpCard) {
    return playerCards
        .filter(card => masterTrump && isTrumpCard(card))
        .filter(card => (card as TrumpCard).value > masterTrump.value)
}

function getAllTrumpsInPlayerCards(playerCards: readonly PlayingCard[]) {
    return playerCards
        .filter(card => isTrumpCard(card))
}
