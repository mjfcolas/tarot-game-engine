import {Announce} from "../announce/announce";
import {TarotPlayer} from "./tarot-player";
import {CardGamePlayerNotification} from "../../card-game/player/card-game-player-notification";

export type TarotPlayerNotification = CardGamePlayerNotification | {
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
} | {
    type: "ASKED_FOR_SET_ASIDE"
} | {
    type: "ERROR_WHILE_SETTING_ASIDE"
}
