import {PlayingCard} from "tarot-card-deck";
import {Face, PlayingCardType} from "tarot-card-deck/dist/cards/playing-card";
import {isKing, isOudler, isTrumpsButNotOudler} from "../cards/card-types";


export type GetIncorrectCardsSetAside = (allAvailableCards: PlayingCard[], cardsSetAside: PlayingCard[]) => PlayingCard[]

export function getIncorrectCardsSetAside(allAvailableCards: readonly PlayingCard[], cardsSetAside: readonly PlayingCard[]): PlayingCard[] {
    const numberOfCardsSetAside = cardsSetAside.length;
    const numberOfCardsThatAreNotTrumpsNorKingNorOudlers = allAvailableCards.filter(currentCard =>
        currentCard.type !== PlayingCardType.JOKER
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
