import {PlayingCard} from "tarot-card-deck";
import {Face, PlayingCardType} from "tarot-card-deck/dist/cards/playing-card";


export type GetIncorrectCardsSetAside = (allAvailableCards: PlayingCard[], cardsSetAside: PlayingCard[]) => PlayingCard[]

const isOudler = (playingCard: PlayingCard) => playingCard.type === PlayingCardType.JOKER
    || playingCard.type === PlayingCardType.TRUMP && (playingCard.value === 1 || playingCard.value === 21);
const isKing = (playingCard: PlayingCard) => (playingCard.type === PlayingCardType.FACE && playingCard.face === Face.K);
const isTrump = (playingCard: PlayingCard) => (playingCard.type === PlayingCardType.TRUMP);
const isTrumpsButNotOudler = (playingCard: PlayingCard) => isTrump(playingCard) && !isOudler(playingCard);

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
