import {PlayingCard} from "tarot-card-deck";
import {Face, PlayingCardType} from "tarot-card-deck/dist/cards/playing-card";
import {isKing, isOudler, isTrumpsButNotOudler} from "../cards/card-types";
import {EXCUSE} from "tarot-card-deck/dist/cards/all-playing-cards";


export type GetIncorrectCardsSetAside = (allAvailableCards: PlayingCard[], cardsSetAside: PlayingCard[]) => PlayingCard[]
export type GetPossibleCardsToSetAside = (allAvailableCards: PlayingCard[], numberOfCardsToSetAside: number) => PlayingCard[]

export function getIncorrectCardsSetAside(allAvailableCards: readonly PlayingCard[], cardsSetAside: readonly PlayingCard[]): PlayingCard[] {
    const numberOfCardsSetAside = cardsSetAside.length;
    const numberOfCardsThatAreNotTrumpsNorKingNorOudlers = allAvailableCards.filter(currentCard =>
        currentCard.type !== PlayingCardType.EXCUSE
        && currentCard.type !== PlayingCardType.TRUMP
        && (currentCard.type !== PlayingCardType.FACE
            || currentCard.type === PlayingCardType.FACE && currentCard.face !== Face.K)).length
    const numberOfTrumpsToSetAside = numberOfCardsSetAside - numberOfCardsThatAreNotTrumpsNorKingNorOudlers;

    const oudlersAndKingSetAside = cardsSetAside.filter(currentCard => isOudler(currentCard) || isKing(currentCard))

    const incorrectTrumpsSetAside = cardsSetAside
        .filter((currentCard: PlayingCard) => isTrumpsButNotOudler(currentCard))
        .slice(numberOfTrumpsToSetAside);

    return [...oudlersAndKingSetAside, ...incorrectTrumpsSetAside];
}

export function getPossibleCardsToSetAside(allAvailableCards: readonly PlayingCard[], numberOfCardsToSetAside: number): PlayingCard[] {
    const cardsThatAreNotTrumpsNorKingNorOudlers: PlayingCard[] = allAvailableCards.filter(currentCard =>
        currentCard.type !== PlayingCardType.EXCUSE
        && currentCard.type !== PlayingCardType.TRUMP
        && (currentCard.type !== PlayingCardType.FACE
            || currentCard.type === PlayingCardType.FACE && currentCard.face !== Face.K))

    const trumpsThatAreNotOudlers: PlayingCard[] = allAvailableCards.filter(currentCard =>
        currentCard.type === PlayingCardType.TRUMP
        && currentCard.value !== 21 && currentCard.value !== 1);

    const trumpsMightBeSetAside = numberOfCardsToSetAside > cardsThatAreNotTrumpsNorKingNorOudlers.length;

    if (trumpsMightBeSetAside) {
        return [...cardsThatAreNotTrumpsNorKingNorOudlers, ...trumpsThatAreNotOudlers]
    } else {
        return cardsThatAreNotTrumpsNorKingNorOudlers;
    }
}
