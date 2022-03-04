import {PlayingCard} from "tarot-card-deck";

export type getPlayableCards = (alreadyPlayedCards: readonly PlayingCard[], playerCards: readonly PlayingCard[]) => readonly PlayingCard[]
