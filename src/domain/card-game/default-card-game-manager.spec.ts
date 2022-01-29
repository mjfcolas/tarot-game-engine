import {DefaultCardGameManager} from "./default-card-game-manager";
import {DummyTarotPlayer} from "../player/dummy/dummy-tarot-player";
import {DECK_78} from "../../../../tarot-card-deck";
import {CardGameManager} from "./card-game-manager";
import {MockedTarotTable} from "../table/__mock__/mocked-tarot-table";
import {lastValueFrom} from "rxjs";
import {Announce} from "../announce/announce";

describe(`Default card game manager`, () => {

    const playCompleteTurn = (cardGameManager: CardGameManager) => {
        cardGameManager.begin();
        cardGameManager.play(players[0], aPlayingCard);
        cardGameManager.play(players[1], aPlayingCard);
        cardGameManager.play(players[2], aPlayingCard);
        cardGameManager.play(players[3], aPlayingCard);

    }
    const aPlayingCard = DECK_78[0]

    const mockedTarotTable = new MockedTarotTable();
    const mockedResolveTurn = jest.fn();
    const mockedGetPlayableCards = jest.fn()
    mockedGetPlayableCards.mockReturnValue(aPlayingCard)


    const players: DummyTarotPlayer[] = [
        new DummyTarotPlayer("1"),
        new DummyTarotPlayer("2"),
        new DummyTarotPlayer("3"),
        new DummyTarotPlayer("4")
    ]

    test(`Given a card game manager, 
    when game begin, 
    then first player is asked to play`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable);
        cardGameManager.begin();
        expect(players[0].askedToPlay).toHaveBeenCalled()
    });

    test(`Given a game that has just begun,
        when second player tries to play,
        then the player is notified that he cannot play`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable);
        cardGameManager.begin();
        cardGameManager.play(players[1], aPlayingCard);
        expect(players[0].playError).toHaveBeenCalled()
    });

    test(`Given a game that has just begun,
        when first player play,
        then played card is emitted to all players`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable);
        cardGameManager.begin();
        cardGameManager.play(players[0], aPlayingCard);
        expect(players[0].playedCardIsKnown).toHaveBeenCalledWith(aPlayingCard)
        expect(players[1].playedCardIsKnown).toHaveBeenCalledWith(aPlayingCard)
        expect(players[2].playedCardIsKnown).toHaveBeenCalledWith(aPlayingCard)
        expect(players[3].playedCardIsKnown).toHaveBeenCalledWith(aPlayingCard)
    });

    test(`Given a game that has just begun,
        when first player plays,
        then then second player is asked to play`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable);
        cardGameManager.begin();
        cardGameManager.play(players[0], aPlayingCard);
        expect(players[1].askedToPlay).toHaveBeenCalled()
    });

    test(`Given the three first players that have played,
        when the last player plays its card,
        then result of turn is resolved and turn winner is emitted`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable);
        mockedResolveTurn.mockReturnValue(players[0].id)

        playCompleteTurn(cardGameManager)

        expect(players[0].turnResultIsKnown).toHaveBeenCalledWith(players[0])
        expect(players[1].turnResultIsKnown).toHaveBeenCalledWith(players[0])
        expect(players[2].turnResultIsKnown).toHaveBeenCalledWith(players[0])
        expect(players[3].turnResultIsKnown).toHaveBeenCalledWith(players[0])
    });

    test(`Given all the three first players that have played,
        when the last player plays its card,
        then turn winner is asked to play`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable);
        mockedResolveTurn.mockReturnValue(players[2].id)
        playCompleteTurn(cardGameManager)

        expect(players[2].askedToPlay).toHaveBeenCalled()

    });

    test(`Given the second player that just won last turn,
        when second player plays again,
        then third player is asked to play`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable);
        mockedResolveTurn.mockReturnValue(players[2].id)
        playCompleteTurn(cardGameManager)
        cardGameManager.play(players[2], aPlayingCard)
        expect(players[3].askedToPlay).toHaveBeenCalled()
    });

    test(`Given the second player that just won last turn,
        when first player tries to play,
        then the player is notified that he cannot play`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable);
        mockedResolveTurn.mockReturnValue(players[2].id)
        playCompleteTurn(cardGameManager)

        cardGameManager.play(players[0], aPlayingCard)
        expect(players[0].playError).toHaveBeenCalled()

    });

    test(`Given the fourth player that has just won last turn,
        when fourth player plays again,
        then first player is asked to play`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable);
        playCompleteTurn(cardGameManager)
        mockedResolveTurn.mockReturnValue(players[4].id)
        cardGameManager.play(players[4], aPlayingCard)
        expect(players[1].askedToPlay).toHaveBeenCalled()
    });

    test(`Given the third player that has just won last turn,
        when third, fourth, first and second player plays,
        then result of turn is resolved and turn winner is emitted`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable);
        mockedResolveTurn.mockReturnValue(players[3].id)
        playCompleteTurn(cardGameManager)

        mockedResolveTurn.mockReturnValue(players[2].id)
        cardGameManager.play(players[3], aPlayingCard);
        cardGameManager.play(players[4], aPlayingCard);
        cardGameManager.play(players[1], aPlayingCard);
        cardGameManager.play(players[2], aPlayingCard);

        expect(players[0].turnResultIsKnown).toHaveBeenCalledWith(players[2])
        expect(players[1].turnResultIsKnown).toHaveBeenCalledWith(players[2])
        expect(players[2].turnResultIsKnown).toHaveBeenCalledWith(players[2])
        expect(players[3].turnResultIsKnown).toHaveBeenCalledWith(players[2])
    });

    test(`Given a turn that has begun,
        when a player tries to play a forbidden card,
        then the player is notified that he cannot play this card`, () => {
        const mockedOtherGetPlayableCards = jest.fn();
        mockedOtherGetPlayableCards.mockReturnValue([
            DECK_78[1],
            DECK_78[2]
        ])
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable);
        cardGameManager.begin()
        cardGameManager.play(players[0], DECK_78[0]);
        expect(players[0].playError).toHaveBeenCalled()
    });

    test(`Given a turn that has just ended,
        when there is no more cards to play,
        then table after end of game is emitter`, async () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable);
        cardGameManager.begin();
        mockedTarotTable.getNumberOfRemainingCardsToPlay.mockReturnValue(0);
        playCompleteTurn(cardGameManager);
        const endGameTable = await lastValueFrom(cardGameManager.gameIsOver())
        expect(endGameTable).toBeTruthy()
    });
});


