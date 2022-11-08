import {DefaultCardGameManager} from "./default-card-game-manager";
import {CardGameManager} from "./card-game-manager";
import {MockedPlayableTable} from "./ports/__mock__/mocked-playable-table";
import {DummyCardGamePlayer} from "./player/__dummy__/dummy-card-game-player";
import {DECK_78, SPADE_4, SPADE_C, TRUMP_1, TRUMP_21} from "tarot-card-deck";
import {PlayedCard, TurnResult} from "./functions/resolve-turn";
import {MockedPlugIn} from "./__mock__/mocked-plug-in";

describe(`Default card game manager`, () => {

    const playCompleteTurn = (cardGameManager: CardGameManager) => {
        cardGameManager.begin();
        cardGameManager.play(players[0], aPlayingCard);
        cardGameManager.play(players[1], aPlayingCard);
        cardGameManager.play(players[2], aPlayingCard);
        cardGameManager.play(players[3], aPlayingCard);

    }
    const aPlayingCard = DECK_78[0]

    const mockedTarotTable = new MockedPlayableTable();
    const mockedResolveTurn = jest.fn();
    const mockedGetPlayableCards = jest.fn()
    mockedGetPlayableCards.mockReturnValue([aPlayingCard])

    const playerIdentifiers = [
        "1", "2", "3", "4"
    ]
    let players: DummyCardGamePlayer[];
    beforeEach(() => {
        players = [
            new DummyCardGamePlayer(playerIdentifiers[0]),
            new DummyCardGamePlayer(playerIdentifiers[1]),
            new DummyCardGamePlayer(playerIdentifiers[2]),
            new DummyCardGamePlayer(playerIdentifiers[3])
        ]

    })

    const cardsInTrick: PlayedCard[] = [{
        playerIdentifier: playerIdentifiers[0],
        playingCard: TRUMP_1
    }, {
        playerIdentifier: playerIdentifiers[1],
        playingCard: TRUMP_21
    }, {
        playerIdentifier: playerIdentifiers[2],
        playingCard: SPADE_4
    }, {
        playerIdentifier: playerIdentifiers[3],
        playingCard: SPADE_C
    }];
    const getTurnResultForPlayer: (player: DummyCardGamePlayer) => TurnResult = (player: DummyCardGamePlayer) => ({
        playedCards: cardsInTrick,
        winner: player.id,
        wonCardsByPlayer: [
            {
                playerIdentifier: playerIdentifiers[0],
                wonCards: []
            },
            {
                playerIdentifier: playerIdentifiers[1],
                wonCards: []
            },
            {
                playerIdentifier: playerIdentifiers[2],
                wonCards: []
            },
            {
                playerIdentifier: playerIdentifiers[3],
                wonCards: []
            },
        ]
    })

    test(`Given a card game manager and a game that has not begun,
    when player tries to play,
    then player is notifier that game has not begun`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable, players);
        cardGameManager.play(players[0], aPlayingCard)
        expect(players[0].playError).toHaveBeenCalled()
    })

    test(`Given a card game manager, 
    when game begin, 
    then first player is asked to play and playable cards are known`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable, players);
        cardGameManager.begin();
        expect(players[0].askedToPlay).toHaveBeenCalled()
        expect(players[0].playableCards).toEqual([aPlayingCard])
    });


    test(`Given a game that has just begun,
        when second player tries to play,
        then the player is notified that he cannot play`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable, players);
        cardGameManager.begin();
        cardGameManager.play(players[1], aPlayingCard);
        expect(players[1].playError).toHaveBeenCalled()
    });

    test(`Given a game that has just begun,
        when first player play,
        then played card is emitted to all players`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable, players);
        cardGameManager.begin();
        cardGameManager.play(players[0], aPlayingCard);
        expect(players[0].playedCardIsKnown).toHaveBeenCalledWith(aPlayingCard, players[0].id)
        expect(players[1].playedCardIsKnown).toHaveBeenCalledWith(aPlayingCard, players[0].id)
        expect(players[2].playedCardIsKnown).toHaveBeenCalledWith(aPlayingCard, players[0].id)
        expect(players[3].playedCardIsKnown).toHaveBeenCalledWith(aPlayingCard, players[0].id)
    });

    test(`Given a game that has just begun,
        when first player plays,
        then then second player is asked to play and playable cards are known`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable, players);
        cardGameManager.begin();
        cardGameManager.play(players[0], aPlayingCard);
        expect(players[1].askedToPlay).toHaveBeenCalled()
        expect(players[1].playableCards).toEqual([aPlayingCard])
    });

    test(`Given the three first players that have played,
        when the last player plays its card,
        then result of turn is resolved and turn winner is emitted`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable, players);
        mockedResolveTurn.mockReturnValue(getTurnResultForPlayer(players[0]))

        playCompleteTurn(cardGameManager)

        expect(players[0].turnResultIsKnown).toHaveBeenCalledWith(players[0].id)
        expect(players[1].turnResultIsKnown).toHaveBeenCalledWith(players[0].id)
        expect(players[2].turnResultIsKnown).toHaveBeenCalledWith(players[0].id)
        expect(players[3].turnResultIsKnown).toHaveBeenCalledWith(players[0].id)
    });

    test(`Given an ended turn,
        when the turn winner is known
        then the turn winner is asked to play a second time for the new turn`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable, players);
        mockedResolveTurn.mockReturnValue(getTurnResultForPlayer(players[1]))
        playCompleteTurn(cardGameManager)
        expect(players[1].askedToPlay).toHaveBeenCalledTimes(2)
        expect(players[1].playableCards).toEqual([aPlayingCard])
    });

    test(`Given all the three first players that have played,
        when the last player plays its card,
        then turn winner is asked to play`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable, players);
        mockedResolveTurn.mockReturnValue(getTurnResultForPlayer(players[2]))
        playCompleteTurn(cardGameManager)

        expect(players[2].askedToPlay).toHaveBeenCalled()
        expect(players[2].playableCards).toEqual([aPlayingCard])
    });

    test(`Given the second player that just won last turn,
        when second player plays again,
        then third player is asked to play`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable, players);
        mockedResolveTurn.mockReturnValue(getTurnResultForPlayer(players[0]))
        playCompleteTurn(cardGameManager)
        cardGameManager.play(players[1], aPlayingCard)
        expect(players[2].askedToPlay).toHaveBeenCalled()
        expect(players[2].playableCards).toEqual([aPlayingCard])
    });

    test(`Given the second player that just won last turn,
        when first player tries to play,
        then the player is notified that he cannot play`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable, players);
        mockedResolveTurn.mockReturnValue(getTurnResultForPlayer(players[1]))
        playCompleteTurn(cardGameManager)

        cardGameManager.play(players[0], aPlayingCard)
        expect(players[0].playError).toHaveBeenCalled()

    });

    test(`Given the fourth player that has just won last turn,
        when fourth player plays again,
        then first player is asked to play`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable, players);
        playCompleteTurn(cardGameManager)
        mockedResolveTurn.mockReturnValue(getTurnResultForPlayer(players[3]))
        cardGameManager.play(players[3], aPlayingCard)
        expect(players[0].askedToPlay).toHaveBeenCalled()
        expect(players[0].playableCards).toEqual([aPlayingCard])
    });

    test(`Given the third player that has just won last turn,
        when third, fourth, first and second player plays,
        then result of turn is resolved and turn winner is emitted`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable, players);
        mockedResolveTurn.mockReturnValue(getTurnResultForPlayer(players[2]))
        playCompleteTurn(cardGameManager)

        mockedResolveTurn.mockReturnValue(getTurnResultForPlayer(players[1]))
        cardGameManager.play(players[2], aPlayingCard);
        cardGameManager.play(players[3], aPlayingCard);
        cardGameManager.play(players[0], aPlayingCard);
        cardGameManager.play(players[1], aPlayingCard);

        expect(players[0].turnResultIsKnown).toHaveBeenCalledWith(players[1].id)
        expect(players[1].turnResultIsKnown).toHaveBeenCalledWith(players[1].id)
        expect(players[2].turnResultIsKnown).toHaveBeenCalledWith(players[1].id)
        expect(players[3].turnResultIsKnown).toHaveBeenCalledWith(players[1].id)
    });

    test(`Given a turn that has begun,
        when a player tries to play a forbidden card,
        then the player is notified that he cannot play this card`, () => {
        const mockedLocalGetPlayableCards = jest.fn();
        mockedLocalGetPlayableCards.mockReturnValue([
            DECK_78[1],
            DECK_78[2]
        ])
        mockedTarotTable.getCardsFor.mockReturnValue([
            DECK_78[0],
            DECK_78[1],
            DECK_78[2]
        ])

        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedLocalGetPlayableCards, mockedTarotTable, players);
        cardGameManager.begin()
        cardGameManager.play(players[0], DECK_78[0]);
        expect(players[0].playError).toHaveBeenCalled()
    });

    test(`Given a turn that has just ended,
        when there is no more cards to play,
        then list of all tricks is emitted`, (done) => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable, players);
        cardGameManager.begin();
        mockedResolveTurn.mockReturnValue(getTurnResultForPlayer(players[1]))
        mockedTarotTable.getNumberOfRemainingCardsToPlayFor.mockReturnValue(0);
        cardGameManager.gameIsOver().subscribe(endGameTricks => {
            expect(endGameTricks.length).toEqual(1)
            expect(endGameTricks[0]).toEqual({
                winner: players[1].id,
                cards: cardsInTrick
            })
            done()
        })
        playCompleteTurn(cardGameManager);
    });

    test(`Given a game that has begun,
        when a player plays,
        then the player receives updated available cards`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable, players);
        cardGameManager.begin();

        const mockedAvailableCards = [
            DECK_78[0],
            DECK_78[1]
        ];
        mockedTarotTable.listCardsOf.mockReturnValue(mockedAvailableCards)
        cardGameManager.play(players[0], aPlayingCard)
        expect(players[0].availableCards).toEqual(mockedAvailableCards)
    });

    test(`Given a game that has begun,
        when a player plays,
        then its card is move to the table`, () => {
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, mockedTarotTable, players);
        cardGameManager.begin();
        cardGameManager.play(players[0], aPlayingCard)
        expect(mockedTarotTable.moveCardOfPlayerToTable).toHaveBeenCalledWith(aPlayingCard, players[0].id)
    });

    test(`Given a game that has begun,
        when a turns end,
        then the cards are distributed in won cards of each players`, () => {
        const localMockedTarotTable = new MockedPlayableTable();
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(mockedResolveTurn, mockedGetPlayableCards, localMockedTarotTable, players);
        cardGameManager.begin();
        mockedResolveTurn.mockReturnValue(getTurnResultForPlayer(players[1]))
        playCompleteTurn(cardGameManager)

        expect(localMockedTarotTable.moveFromTableToPointsOf).toHaveBeenCalledTimes(4)
    });

    test(`Given a card game manager and a turn plug-in, 
        when game begin, 
        then plug-in is executed and first player is asked to play after execution of add in`, () => {
        const plugin: MockedPlugIn = new MockedPlugIn();
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(
            mockedResolveTurn,
            mockedGetPlayableCards,
            mockedTarotTable,
            players,
        );
        cardGameManager.registerPlayerTurnPlugin(plugin)
        cardGameManager.begin();
        expect(players[0].askedToPlay).not.toHaveBeenCalled();
        plugin.complete()
        expect(players[0].askedToPlay).toHaveBeenCalled();
    });

    test(`Given a game that has just begun with a turn plug-in, 
        when first player tries to play before ending of of plug-in execution, 
        then the player is notified that he cannot play`, () => {
        const plugin: MockedPlugIn = new MockedPlugIn();
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(
            mockedResolveTurn,
            mockedGetPlayableCards,
            mockedTarotTable,
            players,
        );
        cardGameManager.registerPlayerTurnPlugin(plugin)
        cardGameManager.begin();
        cardGameManager.play(players[0], aPlayingCard);
        expect(players[0].playError).toHaveBeenCalled()
    });

    test(`Given a game that has just begun with a turn plug-in, 
        when first player has played, 
        then plug-in is executed before second player turn and second player is asked to play after second execution of plug-in`, () => {
        const plugin: MockedPlugIn = new MockedPlugIn();
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(
            mockedResolveTurn,
            mockedGetPlayableCards,
            mockedTarotTable,
            players,
        );
        cardGameManager.registerPlayerTurnPlugin(plugin)
        cardGameManager.begin();
        plugin.complete()
        cardGameManager.play(players[0], aPlayingCard);
        expect(players[1].askedToPlay).not.toHaveBeenCalled()
        plugin.complete()
        expect(players[1].askedToPlay).toHaveBeenCalled();
    });

    test(`Given a game that has just begun with a turn plug-in and a first player that has played, 
        when second player tries to play before ending of plug-in execution, 
        then the second player is notified that he cannot play`, () => {
        const plugin: MockedPlugIn = new MockedPlugIn();
        const cardGameManager: DefaultCardGameManager = new DefaultCardGameManager(
            mockedResolveTurn,
            mockedGetPlayableCards,
            mockedTarotTable,
            players
        );
        cardGameManager.registerPlayerTurnPlugin(plugin)
        cardGameManager.begin();
        plugin.complete()
        cardGameManager.play(players[0], aPlayingCard);
        cardGameManager.play(players[1], aPlayingCard);
        expect(players[1].playError).toHaveBeenCalled()
    });
});


