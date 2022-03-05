import {PlayingCard} from "tarot-card-deck";
import {Face, PlayingCardType} from "tarot-card-deck/dist/cards/playing-card";


export type GetAvailableCardsToSetAside = (allAvailableCards: PlayingCard[]) => PlayingCard[]

export function defaultGetAvailableCardsToSetAside(allAvailableCards: PlayingCard[]): PlayingCard[] {
    return allAvailableCards.filter(currentCard =>
        currentCard.type !== PlayingCardType.JOKER
        && currentCard.type !== PlayingCardType.TRUMP
        && (currentCard.type !== PlayingCardType.FACE
            || currentCard.type === PlayingCardType.FACE && currentCard.face !== Face.K));
}
