import {PlayableTable} from "../playable-table";

export class MockedPlayableTable implements PlayableTable {
    getNumberOfRemainingCardsToPlayFor = jest.fn()
    getCardsFor = jest.fn()
    listCardsOf = jest.fn()
    moveToPointsOf = jest.fn()
    moveCardOfPlayerToTable = jest.fn()
}
