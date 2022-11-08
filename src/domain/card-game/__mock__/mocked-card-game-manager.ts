import {CardGameManager} from "../card-game-manager";

export class MockedCardGameManager implements CardGameManager {
    begin = jest.fn();
    gameIsOver = jest.fn();
    play = jest.fn();
    registerPlayerTurnPlugin = jest.fn();
}
