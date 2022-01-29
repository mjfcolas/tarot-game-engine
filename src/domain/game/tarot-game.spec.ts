import {DummyTarotPlayer} from "../player/dummy/dummy-tarot-player";
import {TarotGame} from "./tarot-game";
import {Announce} from "../announce/announce";
import {MockedAnnounceManager} from "../announce/__mock__/mocked-announce-manager";
import {MockedTarotTable} from "../table/__mock__/mocked-tarot-table";
import {of} from "rxjs";
import {MockedCardGameManager} from "../card-game/__mock__/mocked-card-game-manager";


describe(`Tarot Game`, () => {

    const dummyEndOfGameCallback = jest.fn()
    const players: DummyTarotPlayer[] = [
        new DummyTarotPlayer("1"),
        new DummyTarotPlayer("2"),
        new DummyTarotPlayer("3"),
        new DummyTarotPlayer("4")
    ]
    const announceManager: MockedAnnounceManager = new MockedAnnounceManager();
    const table: MockedTarotTable = new MockedTarotTable();
    const cardGameManager: MockedCardGameManager = new MockedCardGameManager();


    test(`Given players, a table, and an announce manager
    when initializing a game, 
    then initialization is done`, () => {
        announceManager.announcesAreComplete.mockReturnValue(of(undefined));
        new TarotGame(players, table, announceManager, cardGameManager, dummyEndOfGameCallback);

        expect(table.shuffle).toHaveBeenCalled();
        expect(table.cut).toHaveBeenCalled();
        expect(table.deal).toHaveBeenCalled();
        expect(announceManager.beginAnnounces).toHaveBeenCalled();
    })

    test(`Given an initialized game, 
    when announces are over and one player has announced something,
    then expected taker is emitted to all players `, () => {
        announceManager.announcesAreComplete.mockReturnValue(of({
            taker: players[1],
            announce: Announce.PRISE
        }));
        new TarotGame(players, table, announceManager, cardGameManager, dummyEndOfGameCallback);

        expect(players[0].takerIsKnown).toHaveBeenCalledWith(players[1], Announce.PRISE)
        expect(players[1].takerIsKnown).toHaveBeenCalledWith(players[1], Announce.PRISE)
        expect(players[2].takerIsKnown).toHaveBeenCalledWith(players[1], Announce.PRISE)
        expect(players[3].takerIsKnown).toHaveBeenCalledWith(players[1], Announce.PRISE)
    })

    test(`Given an initialized game, 
    when announces are over and nobody has announces something,
    then game over is emitted to all players and end of game callback is called with game results`, () => {
        announceManager.announcesAreComplete.mockReturnValue(of(undefined));
        new TarotGame(players, table, announceManager, cardGameManager, dummyEndOfGameCallback);

        expect(players[0].gameOver).toHaveBeenCalled();
        expect(players[1].gameOver).toHaveBeenCalled();
        expect(players[2].gameOver).toHaveBeenCalled();
        expect(players[3].gameOver).toHaveBeenCalled();
        expect(dummyEndOfGameCallback).toHaveBeenCalled();
    })

    test(`Given an initialized game,
    when taker is determined,
    then card game begin`, () => {
        announceManager.announcesAreComplete.mockReturnValue(of({
            taker: players[1],
            announce: Announce.PRISE
        }));
        new TarotGame(players, table, announceManager, cardGameManager, dummyEndOfGameCallback);

        expect(cardGameManager.begin).toHaveBeenCalled()
    })
});
