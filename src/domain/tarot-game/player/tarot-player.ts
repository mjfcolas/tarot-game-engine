import {CardGamePlayer} from "../../card-game/player/card-game-player";
import {TarotPlayerNotification} from "./tarot-player-notification";

export type PlayerIdentifier = string;

export interface TarotPlayer extends CardGamePlayer {
    id: PlayerIdentifier

    notify(playerNotification: TarotPlayerNotification)
}
