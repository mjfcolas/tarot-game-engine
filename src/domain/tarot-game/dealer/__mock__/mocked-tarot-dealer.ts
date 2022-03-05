import {TarotDealer} from "../tarot-dealer";

export class MockedTarotDealer implements TarotDealer{
    deal = jest.fn();
}
