import {PlayingCard} from "../../../../../tarot-card-deck";
import {PlayerIdentifier} from "../player/card-game-player";

export type PlayerWithCard = { playingCard: PlayingCard, playerIdentifier: PlayerIdentifier }
export type resolveTurn = (playedCards: PlayerWithCard[]) => PlayerIdentifier
