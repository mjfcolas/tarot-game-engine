import {Announce} from "../announce/announce";

export enum Poignee {
    SINGLE = "SINGLE",
    DOUBLE = "DOUBLE",
    TRIPLE = "TRIPLE",
}

export type Team = "ATTACK" | "DEFENSE"

export type EndGameStatus = {
    announce: Announce,
    attackNumberOfPoints: number,
    poignee?: Poignee,
    petitInLastTrick?: Team,
    attackNumberOfOudlers: number,
}

export type EndGameScore = {
    attackScoreByPlayer: number,
    defenseScoreByPlayer: number
}
export type CountEndGameScore = (endGameStatus: EndGameStatus) => EndGameScore

const contractFromNumberOfOudlers = (numberOfOudlers: number) => {
    switch (numberOfOudlers) {
        case 1:
            return 51;
        case 2:
            return 41;
        case 3:
            return 36;
        case 0:
            return 56;
    }
}

const multiplierFromAnnounce = (announce: Announce) => {
    switch (announce) {
        case Announce.PRISE:
            return 1;
        case Announce.GARDE:
            return 2;
        case Announce.GARDE_SANS:
            return 4;
        case Announce.GARDE_CONTRE:
            return 6;
    }
}

const pointsFromPoignee = (poignee?: Poignee) => {
    switch (poignee) {
        case Poignee.SINGLE:
            return 20;
        case Poignee.DOUBLE:
            return 30;
        case Poignee.TRIPLE:
            return 40;
        default:
            return 0;
    }
}

const pointsFromPetitInLastTrick = (teamThatPutPetitInLastTrick?: Team) => {
    switch (teamThatPutPetitInLastTrick) {
        case "ATTACK":
            return 10;
        case "DEFENSE":
            return -10;
        default:
            return 0;
    }
}

export function countFourPlayersTarotScore(endGameStatus: EndGameStatus): EndGameScore {
    let points = 0;
    const contract = contractFromNumberOfOudlers(endGameStatus.attackNumberOfOudlers)
    const differenceWithContract = endGameStatus.attackNumberOfPoints - contract;
    const attackWon = differenceWithContract >= 0;
    points += attackWon ? 25 : -25;
    points += differenceWithContract;

    const petitInLastTrickPoints = pointsFromPetitInLastTrick(endGameStatus.petitInLastTrick)
    points += petitInLastTrickPoints

    const multiplier = multiplierFromAnnounce(endGameStatus.announce)
    points *= multiplier;

    const poigneePoints = pointsFromPoignee(endGameStatus.poignee)
    points += points > 0 ? poigneePoints : -poigneePoints

    return {
        attackScoreByPlayer: points * 3,
        defenseScoreByPlayer: -points
    }
}

