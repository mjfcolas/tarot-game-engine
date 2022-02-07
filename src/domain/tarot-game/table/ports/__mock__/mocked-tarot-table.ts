import {TarotTable} from "../tarot-table";

export class MockedTarotTable implements TarotTable {
    cut = jest.fn()
    gatherDeck = jest.fn()
    giveCardTo = jest.fn()
    listCardsFor = jest.fn()
    putCardInDog = jest.fn()
    shuffle = jest.fn()
    giveDogToPlayer = jest.fn()
    moveToPointsOf = jest.fn()
}
