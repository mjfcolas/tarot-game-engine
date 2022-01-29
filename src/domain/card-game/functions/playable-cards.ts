import {PlayingCard} from "../../../../../tarot-card-deck";

export type getPlayableCards = (alreadyPlayedCards: PlayingCard[], playerCards: PlayingCard[]) => PlayingCard[]
