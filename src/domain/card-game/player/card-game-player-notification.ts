import {PlayerIdentifier} from "./card-game-player";
import {PlayingCard} from "tarot-card-deck";

export type CardGamePlayerNotification = {
    type: "GOT_AVAILABLE_CARDS"
    cards: PlayingCard[]
} | {
    type: "ASKED_TO_PLAY"
    playableCards: readonly PlayingCard[]
} | {
    type: "ERROR_WHILE_PLAYING"
} | {
    type: "PLAYER_HAS_PLAYED",
    player: PlayerIdentifier
    card: PlayingCard
} | {
    type: "TURN_RESULT_IS_KNOWN",
    turnWinner: PlayerIdentifier
}
