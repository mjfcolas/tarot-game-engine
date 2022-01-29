import {PlayingCard} from "../../../../../tarot-card-deck/src";
import {DealtCards} from "../../tarot-game/dealer/default-tarot-dealer";

export type dealCards = (deck: PlayingCard[], numberOfPlayers: number, numberOfCardsInDog) => DealtCards
