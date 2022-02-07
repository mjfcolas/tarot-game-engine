import {DummyTarotPlayer} from "./player/__dummy__/dummy-tarot-player";
import {TarotGame} from "./tarot-game";
import {Announce} from "./announce/announce";
import {MockedAnnounceManager} from "./announce/__mock__/mocked-announce-manager";
import {of} from "rxjs";
import {MockedCardGameManager} from "../card-game/__mock__/mocked-card-game-manager";
import {MockedTarotDealer} from "./dealer/__mock__/mocked-tarot-dealer";
import {MockedTarotTable} from "./table/ports/__mock__/mocked-tarot-table";
import {DECK_78} from "tarot-card-deck";


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
    const dealer: MockedTarotDealer = new MockedTarotDealer();
    const cardGameManager: MockedCardGameManager = new MockedCardGameManager();
    const mockedGetAvailableCardsToSetAside = jest.fn();

    test(`Given players, a table, and an announce manager
    when initializing a game, 
    then initialization is done`, () => {
        announceManager.announcesAreComplete.mockReturnValue(of(undefined));
        new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetAvailableCardsToSetAside, dummyEndOfGameCallback);

        expect(table.shuffle).toHaveBeenCalled();
        expect(table.cut).toHaveBeenCalled();
        expect(dealer.deal).toHaveBeenCalled();
        expect(announceManager.beginAnnounces).toHaveBeenCalled();
    })

    test(`Given an initialized game, 
    when announces are over and one player has announced something,
    then expected taker is emitted to all players `, () => {
        announceManager.announcesAreComplete.mockReturnValue(of({
            taker: players[1],
            announce: Announce.PRISE
        }));
        new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetAvailableCardsToSetAside, dummyEndOfGameCallback);

        expect(players[0].takerIsKnown).toHaveBeenCalledWith(players[1], Announce.PRISE)
        expect(players[1].takerIsKnown).toHaveBeenCalledWith(players[1], Announce.PRISE)
        expect(players[2].takerIsKnown).toHaveBeenCalledWith(players[1], Announce.PRISE)
        expect(players[3].takerIsKnown).toHaveBeenCalledWith(players[1], Announce.PRISE)
    })

    test(`Given an initialized game, 
    when announces are over and nobody has announces something,
    then game over is emitted to all players and end of game callback is called with game results`, () => {
        announceManager.announcesAreComplete.mockReturnValue(of(undefined));
        new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetAvailableCardsToSetAside, dummyEndOfGameCallback);

        expect(players[0].gameOver).toHaveBeenCalled();
        expect(players[1].gameOver).toHaveBeenCalled();
        expect(players[2].gameOver).toHaveBeenCalled();
        expect(players[3].gameOver).toHaveBeenCalled();
        expect(dummyEndOfGameCallback).toHaveBeenCalled();
    })

    test(`Given an initialized game,
    when taker is determined,
    then taker is notify that he has to set aside cards`, () => {
        announceManager.announcesAreComplete.mockReturnValue(of({
            taker: players[1],
            announce: Announce.PRISE
        }));
        new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetAvailableCardsToSetAside, dummyEndOfGameCallback);

        expect(players[1].hasToSetAside).toHaveBeenCalled()
    })

    test(`Given a determined taker,
    when the taker set asides correct cards,
    then card game begin`, () => {
        announceManager.announcesAreComplete.mockReturnValue(of({
            taker: players[1],
            announce: Announce.PRISE
        }));
        mockedGetAvailableCardsToSetAside.mockReturnValue(DECK_78.slice(0, 12))
        const tarotGame = new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetAvailableCardsToSetAside, dummyEndOfGameCallback);
        tarotGame.setAside(players[1], DECK_78.slice(0, 6));
        expect(cardGameManager.begin).toHaveBeenCalled()
    })

    test(`Given a determined taker,
    when the taker set asides disallowed cards,
    then the player is notified that he cannot perform this action`, () => {
        announceManager.announcesAreComplete.mockReturnValue(of({
            taker: players[1],
            announce: Announce.PRISE
        }));
        mockedGetAvailableCardsToSetAside.mockReturnValue(DECK_78.slice(0, 12))
        const tarotGame = new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetAvailableCardsToSetAside, dummyEndOfGameCallback);

        tarotGame.setAside(players[1], DECK_78.slice(10, 6));
        expect(players[1].setAsideError).toHaveBeenCalled()
    })

    test(`Given a determined taker,
    when the taker set asides an incorrect number of cards,
    then the player is notified that he cannot perform this action`, () => {
        announceManager.announcesAreComplete.mockReturnValue(of({
            taker: players[1],
            announce: Announce.PRISE
        }));
        mockedGetAvailableCardsToSetAside.mockReturnValue(DECK_78.slice(0, 12))
        const tarotGame = new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetAvailableCardsToSetAside, dummyEndOfGameCallback);
        tarotGame.setAside(players[1], DECK_78.slice(0, 4));
        expect(players[1].setAsideError).toHaveBeenCalled()
    })

    test(`Given no determined taker,
    when a player try to set cards aside,
    then the player is notified that he cannot perform this action`, () => {
        const tarotGame = new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetAvailableCardsToSetAside, dummyEndOfGameCallback);
        tarotGame.setAside(players[0], []);
        expect(players[0].setAsideError).toHaveBeenCalled()
    })


    test(`Given a determined taker,
    when a player that is not the taker try to set cards aside,
    then the player is notifies that he cannot perform this action`, () => {
        announceManager.announcesAreComplete.mockReturnValue(of({
            taker: players[1],
            announce: Announce.PRISE
        }));
        const tarotGame = new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetAvailableCardsToSetAside, dummyEndOfGameCallback);
        tarotGame.setAside(players[0], []);
        expect(players[0].setAsideError).toHaveBeenCalled()
    })
});
