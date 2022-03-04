import {PlayableTable} from "../playable-table";

export class MockedPlayableTable implements PlayableTable {
    getNumberOfRemainingCardsToPlayFor = jest.fn()
    getCardsFor = jest.fn()
    listCardsOf = jest.fn()
    moveFromTableToPointsOf = jest.fn()
    moveCardOfPlayerToTable = jest.fn()
}
