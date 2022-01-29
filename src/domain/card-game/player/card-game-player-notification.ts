import {PlayingCard} from "../../../../../tarot-card-deck/src";
import {Announce} from "../../tarot-game/announce/announce";
import {TarotPlayer} from "../../tarot-game/player/tarot-player";

export type CardGamePlayerNotification = {
    type: "GOT_AVAILABLE_CARDS"
    cards: PlayingCard[]
} | {
    type: "ASKED_TO_PLAY"
} | {
    type: "ERROR_WHILE_PLAYING"
} | {
    type: "PLAYER_HAS_PLAYED",
    card: PlayingCard
} | {
    type: "TURN_RESULT_IS_KNOWN",
    turnWinner: TarotPlayer
}
