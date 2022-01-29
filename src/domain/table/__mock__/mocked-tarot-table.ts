import {TarotTable} from "../tarot-table";

export class MockedTarotTable implements TarotTable {
    cut = jest.fn();
    deal = jest.fn();
    gatherDeck = jest.fn();
    shuffle = jest.fn()
    getNumberOfRemainingCardsToPlay = jest.fn();
}
