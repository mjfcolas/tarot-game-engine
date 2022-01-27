import {PlayerNotification} from "./player-notification";

export interface TarotPlayer {
    id: string
    notify(playerNotification: PlayerNotification)
}
