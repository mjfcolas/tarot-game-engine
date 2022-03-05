import {PlayingCard} from "tarot-card-deck";

export type GetPlayableCards = (alreadyPlayedCards: readonly PlayingCard[], playerCards: readonly PlayingCard[]) => readonly PlayingCard[]
