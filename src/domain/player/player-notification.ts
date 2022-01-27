import {PlayingCard} from "../../../../tarot-card-deck/src";
import {Announce} from "../announce/announce";
import {TarotPlayer} from "./tarot-player";

export type PlayerNotification = {
    type: "GOT_AVAILABLE_CARDS"
    cards: PlayingCard[]
} | {
    type: "ASKED_FOR_ANNOUNCE"
    availableAnnounces: Announce[]
} | {
    type: "ERROR_WHILE_ANNOUNCING"
} | {
    type: "PLAYER_HAS_ANNOUNCED",
    player: TarotPlayer,
    announce?: Announce
} | {
    type: "TAKER_IS_KNOWN",
    player: TarotPlayer,
    announce?: Announce
} | {
    type: "GAME_IS_OVER"
}
