import {PlayingCard} from "../../../../../tarot-card-deck";
import {PlayerIdentifier} from "../../tarot-game/functions/tarot-turn-resolver";

export type resolveTurn = (playedCards: { playingCard: PlayingCard, playerIdentifier: PlayerIdentifier }[]) => PlayerIdentifier
