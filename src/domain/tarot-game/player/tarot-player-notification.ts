import {Announce} from "../announce/announce";
import {CardGamePlayerNotification} from "../../card-game/player/card-game-player-notification";
import {PlayerIdentifier} from "../../card-game/player/card-game-player";
import {PlayingCard} from "tarot-card-deck";
import {PlayerWithScore} from "../tarot-game";
import {ChelemType} from "../chelem/chelem";

export type TarotPlayerNotification = CardGamePlayerNotification | {
    type: "ASKED_FOR_ANNOUNCE"
    availableAnnounces: Announce[]
} | {
    type: "ERROR_WHILE_ANNOUNCING"
} | {
    type: "PLAYER_HAS_ANNOUNCED",
    player: PlayerIdentifier,
    announce?: Announce
} | {
    type: "TAKER_IS_KNOWN",
    player: PlayerIdentifier,
    announce?: Announce
} | {
    type: "GAME_IS_ABORTED"
} | {
    type: "GAME_IS_OVER",
    numberOfPointsForAttack: number,
    numberOfPointsForDefense: number,
    finalScores: readonly PlayerWithScore[]
} | {
    type: "ASKED_FOR_SET_ASIDE",
    possibleCardsToSetAside: PlayingCard[]
} | {
    type: "ERROR_WHILE_SETTING_ASIDE"
} | {
    type: "ASKED_FOR_POIGNEE_ANNOUNCE",
    numberOfCardsToShow: number,
    possibleCardsToShow: PlayingCard[]
} | {
    type: "ERROR_WHILE_ANNOUNCING_POIGNEE"
} | {
    type: "POIGNEE_HAS_BEEN_ANNOUNCED",
    player: PlayerIdentifier,
    shownCards: PlayingCard[]
} | {
    type: "ASKED_FOR_CHELEM_ANNOUNCE"
} | {
    type: "CHELEM_HAS_BEEN_ANNOUNCED",
    player: PlayerIdentifier,
    chelemType: ChelemType
} | {
    type: "CHELEM_ACHIEVED",
    player: PlayerIdentifier,
    byAttack: boolean,
    announced: boolean
} | {
    type: "ERROR_WHILE_ANNOUNCING_CHELEM"
}
