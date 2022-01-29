import {PlayableTable} from "../playable-table";

export class MockedPlayableTable implements PlayableTable {
    getNumberOfRemainingCardsToPlay = jest.fn()
    getCardsFor = jest.fn()
    listCardsOf = jest.fn()
    moveToPointsOf = jest.fn()
    moveCardOfPlayerToTable = jest.fn()
}
