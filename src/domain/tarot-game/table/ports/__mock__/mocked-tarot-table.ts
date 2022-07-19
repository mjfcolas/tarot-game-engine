import {TarotTable} from "../tarot-table";

export class MockedTarotTable implements TarotTable {
    cut = jest.fn()
    gatherDeck = jest.fn()
    giveCardTo = jest.fn()
    listCardsOf = jest.fn()
    putCardInDog = jest.fn()
    shuffle = jest.fn()
    giveDogToPlayerHand = jest.fn()
    moveFromTableToPointsOf = jest.fn()
    moveFromHandToPointsOf = jest.fn()
    listPointsFor = jest.fn()
    giveDogToPlayerPoints = jest.fn()
}
