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

export function isClassicCard(playingCard: PlayingCard): playingCard is ClassicCard{
    return playingCard.type === PlayingCardType.CLASSIC || playingCard.type === PlayingCardType.FACE
}
export function isTrumpCard(playingCard: PlayingCard): playingCard is TrumpCard{
    return playingCard.type === PlayingCardType.TRUMP
}
