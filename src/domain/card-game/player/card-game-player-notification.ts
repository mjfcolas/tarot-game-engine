import {PlayingCard} from "../../../../../tarot-card-deck/src";
import {CardGamePlayer} from "./card-game-player";

export type CardGamePlayerNotification = {
    type: "GOT_AVAILABLE_CARDS"
    cards: PlayingCard[]
} | {
    type: "ASKED_TO_PLAY"
} | {
    type: "ERROR_WHILE_PLAYING"
} | {
    type: "PLAYER_HAS_PLAYED",
    player: CardGamePlayer
    card: PlayingCard
} | {
    type: "TURN_RESULT_IS_KNOWN",
    turnWinner: CardGamePlayer
}
