import {DECK_78, PlayingCard} from "../../../../tarot-card-deck/src";
import {DummyTarotPlayer} from "../player/dummy/dummy-tarot-player";
import {getTarotGame} from "../tarot-game-provider";
import {TarotGame} from "./tarot-game";
import {Announce} from "../announce/announce";


describe(`Tarot Game`, () => {

    const dummyEndOfGameCallback = jest.fn()
    const playingCardDeck: readonly PlayingCard[] = DECK_78;
    const players: DummyTarotPlayer[] = [
        new DummyTarotPlayer("1"),
        new DummyTarotPlayer("2"),
        new DummyTarotPlayer("3"),
        new DummyTarotPlayer("4")
    ]

    test(`Given a tarot playing card deck and four players, 
    when initializing a game, 
    then cards are distributed and games are emitted to each players`, () => {
        getTarotGame(playingCardDeck, players, dummyEndOfGameCallback)

        const expectedNumberOfCards = 18;
        expect(players[0].availableCards.length).toEqual(expectedNumberOfCards);
        expect(players[1].availableCards.length).toEqual(expectedNumberOfCards);
        expect(players[2].availableCards.length).toEqual(expectedNumberOfCards);
        expect(players[3].availableCards.length).toEqual(expectedNumberOfCards);

    })

    test(`Given an initialized game, 
    when announces are over and one player has announced something,
    then expected taker is emitted to all players `, () => {
        const game: TarotGame = getTarotGame(playingCardDeck, players, dummyEndOfGameCallback)
        game.announce(players[0], null)
        game.announce(players[1], Announce.PRISE)
        game.announce(players[2], null)
        game.announce(players[3], null)

        expect(players[0].takerIsKnown).toHaveBeenCalledWith(players[1], Announce.PRISE)
        expect(players[1].takerIsKnown).toHaveBeenCalledWith(players[1], Announce.PRISE)
        expect(players[2].takerIsKnown).toHaveBeenCalledWith(players[1], Announce.PRISE)
        expect(players[3].takerIsKnown).toHaveBeenCalledWith(players[1], Announce.PRISE)
    })

    test(`Given an initialized game, 
    when announces are over and nobody has announces something,
    then game over is emitted to all players and end of game callback is called with game results`, () => {
        const game: TarotGame = getTarotGame(playingCardDeck, players, dummyEndOfGameCallback)
        game.announce(players[0], null)
        game.announce(players[1], null)
        game.announce(players[2], null)
        game.announce(players[3], null)

        expect(players[0].gameOver).toHaveBeenCalled();
        expect(players[1].gameOver).toHaveBeenCalled();
        expect(players[2].gameOver).toHaveBeenCalled();
        expect(players[3].gameOver).toHaveBeenCalled();
        expect(dummyEndOfGameCallback).toHaveBeenCalled();

    })

});
