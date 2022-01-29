import {CardGamePlayerNotification} from "./card-game-player-notification";

export type PlayerIdentifier = string;

export interface CardGamePlayer {
    id: PlayerIdentifier
    notify(playerNotification: CardGamePlayerNotification)
}
