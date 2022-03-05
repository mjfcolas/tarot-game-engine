import {Face, PlayingCardType, Suit} from "tarot-card-deck/dist/cards/playing-card";
import {PlayingCard} from "tarot-card-deck";

export type ClassicCard = {
    identifier: string;
    value: number;
    suit: Suit;
    type: PlayingCardType.CLASSIC;
} | {
    identifier: string;
    face: Face;
    suit: Suit;
    type: PlayingCardType.FACE;
};

export type TrumpCard = {
    identifier: string;
    value: number;
    type: PlayingCardType.TRUMP;
}

export function isClassicCard(playingCard: PlayingCard): playingCard is ClassicCard {
    return playingCard.type === PlayingCardType.CLASSIC || playingCard.type === PlayingCardType.FACE
}

export function isTrumpCard(playingCard: PlayingCard): playingCard is TrumpCard {
    return playingCard.type === PlayingCardType.TRUMP
}

export const isOudler = (playingCard: PlayingCard) => playingCard.type === PlayingCardType.JOKER
    || playingCard.type === PlayingCardType.TRUMP && (playingCard.value === 1 || playingCard.value === 21);
export const isExcuse = (playingCard: PlayingCard) => playingCard.type === PlayingCardType.JOKER
export const isKing = (playingCard: PlayingCard) => (playingCard.type === PlayingCardType.FACE && playingCard.face === Face.K);
export const isQueen = (playingCard: PlayingCard) => (playingCard.type === PlayingCardType.FACE && playingCard.face === Face.Q);
export const isCavalier = (playingCard: PlayingCard) => (playingCard.type === PlayingCardType.FACE && playingCard.face === Face.C);
export const isJack = (playingCard: PlayingCard) => (playingCard.type === PlayingCardType.FACE && playingCard.face === Face.J);
export const isTrump = (playingCard: PlayingCard) => (playingCard.type === PlayingCardType.TRUMP);
export const isTrumpsButNotOudler = (playingCard: PlayingCard) => isTrump(playingCard) && !isOudler(playingCard);
