import {DummyTarotPlayer} from "./player/__dummy__/dummy-tarot-player";
import {TarotGame} from "./tarot-game";
import {Announce} from "./announce/announce";
import {MockedAnnounceManager} from "./announce/__mock__/mocked-announce-manager";
import {of, ReplaySubject} from "rxjs";
import {MockedCardGameManager} from "../card-game/__mock__/mocked-card-game-manager";
import {MockedTarotDealer} from "./dealer/__mock__/mocked-tarot-dealer";
import {MockedTarotTable} from "./table/ports/__mock__/mocked-tarot-table";
import {DECK_78} from "tarot-card-deck";
import {Trick} from "../card-game/card-game-manager";
import {SPADE_4, SPADE_C, TRUMP_1, TRUMP_21} from "tarot-card-deck/dist/cards/all-playing-cards";
import {PlayedCard} from "../card-game/functions/resolve-turn";


describe(`Tarot Game`, () => {

    const dummyEndOfGameCallback = jest.fn()

    const playerIdentifiers = [
        "1", "2", "3", "4"
    ]

    let players: DummyTarotPlayer[]
    beforeEach(() => {
        players = [
            new DummyTarotPlayer(playerIdentifiers[0]),
            new DummyTarotPlayer(playerIdentifiers[1]),
            new DummyTarotPlayer(playerIdentifiers[2]),
            new DummyTarotPlayer(playerIdentifiers[3])
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

    const announceManager: MockedAnnounceManager = new MockedAnnounceManager();
    const table: MockedTarotTable = new MockedTarotTable();
    const dealer: MockedTarotDealer = new MockedTarotDealer();
    const cardGameManager: MockedCardGameManager = new MockedCardGameManager();
    const mockedGetIncorrectCardsSetAside = jest.fn();
    const mockedGetPossibleCardsToSetAside = jest.fn();
    const mockedCountEndGameTakerPoints = jest.fn();
    const mockedCountEndOfGameScore = jest.fn();

    describe(`Initialization`, () => {
        test(`Given players, a table, and an announce manager
    when initializing a game, 
    then initialization is done`, () => {
            announceManager.announcesAreComplete.mockReturnValue(of(undefined));
            new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetIncorrectCardsSetAside, mockedGetPossibleCardsToSetAside, mockedCountEndGameTakerPoints, mockedCountEndOfGameScore, dummyEndOfGameCallback);

            expect(table.shuffle).toHaveBeenCalled();
            expect(table.cut).toHaveBeenCalled();
            expect(dealer.deal).toHaveBeenCalled();
            expect(announceManager.beginAnnounces).toHaveBeenCalled();
        })

    })

    describe(`Announces & Dog`, () => {

        test(`Given an initialized game, 
    when announces are over and one player has announced something,
    then expected taker is emitted to all players `, () => {
            announceManager.announcesAreComplete.mockReturnValue(of({
                taker: players[1],
                announce: Announce.PRISE
            }));
            new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetIncorrectCardsSetAside, mockedGetPossibleCardsToSetAside, mockedCountEndGameTakerPoints, mockedCountEndOfGameScore, dummyEndOfGameCallback);

            expect(players[0].takerIsKnown).toHaveBeenCalledWith(players[1].id, Announce.PRISE)
            expect(players[1].takerIsKnown).toHaveBeenCalledWith(players[1].id, Announce.PRISE)
            expect(players[2].takerIsKnown).toHaveBeenCalledWith(players[1].id, Announce.PRISE)
            expect(players[3].takerIsKnown).toHaveBeenCalledWith(players[1].id, Announce.PRISE)
        })

        test(`Given an initialized game, 
    when announces are over and nobody has announces something,
    then game aborted is emitted to all players and end of game callback is called with game results`, () => {
            announceManager.announcesAreComplete.mockReturnValue(of(undefined));
            new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetIncorrectCardsSetAside, mockedGetPossibleCardsToSetAside, mockedCountEndGameTakerPoints, mockedCountEndOfGameScore, dummyEndOfGameCallback);

            expect(players[0].gameAborted).toHaveBeenCalled();
            expect(players[1].gameAborted).toHaveBeenCalled();
            expect(players[2].gameAborted).toHaveBeenCalled();
            expect(players[3].gameAborted).toHaveBeenCalled();
            expect(dummyEndOfGameCallback).toHaveBeenCalled();
        })

        test.each([
            Announce.PRISE,
            Announce.GARDE
        ])(`Given an initialized game, 
    when taker is determined with a %p,
    then taker retrieve dog's cards and is notified `, (announce) => {
            announceManager.announcesAreComplete.mockReturnValue(of({
                taker: players[1],
                announce: announce
            }));
            new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetIncorrectCardsSetAside, mockedGetPossibleCardsToSetAside, mockedCountEndGameTakerPoints, mockedCountEndOfGameScore, dummyEndOfGameCallback);

            expect(table.giveDogToPlayerHand).toHaveBeenCalledWith(players[1].id)
            expect(players[1].availableCardsAreKnown).toHaveBeenCalled()

        })

        test.each([
            Announce.PRISE,
            Announce.GARDE
        ])(`Given an initialized game,
    when taker is determined with a %p,
    then taker is notify that he has to set aside cards and available cards to set aside are provided`, (announce) => {
            announceManager.announcesAreComplete.mockReturnValue(of({
                taker: players[1],
                announce: announce
            }));
            const availableCardsToSetAside = [DECK_78[0], DECK_78[1]];
            mockedGetPossibleCardsToSetAside.mockReturnValue(availableCardsToSetAside)
            new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetIncorrectCardsSetAside, mockedGetPossibleCardsToSetAside, mockedCountEndGameTakerPoints, mockedCountEndOfGameScore, dummyEndOfGameCallback);

            expect(players[1].hasToSetAside).toHaveBeenCalledWith(availableCardsToSetAside)
        })

        test.each([
            Announce.GARDE_SANS,
            Announce.GARDE_CONTRE
        ])(`Given an initialized game,
    when taker is determined with a %p,
    then card game begin directly`, (announce) => {
            announceManager.announcesAreComplete.mockReturnValue(of({
                taker: players[1],
                announce: announce
            }));
            cardGameManager.gameIsOver.mockReturnValue(new ReplaySubject(1))
            table.listCardsOf.mockReturnValue([])
            new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetIncorrectCardsSetAside, mockedGetPossibleCardsToSetAside, mockedCountEndGameTakerPoints, mockedCountEndOfGameScore, dummyEndOfGameCallback);
            expect(cardGameManager.begin).toHaveBeenCalled()
        })

        test(`Given an initialized game,
    when taker is determined with a GARDE SANS,
    then taker has kept dog in its points at beginning of game`, () => {
            announceManager.announcesAreComplete.mockReturnValue(of({
                taker: players[1],
                announce: Announce.GARDE_SANS
            }));
            cardGameManager.gameIsOver.mockReturnValue(new ReplaySubject(1))
            const localTable = new MockedTarotTable();
            localTable.listCardsOf.mockReturnValue([])
            new TarotGame(players, localTable, dealer, announceManager, cardGameManager, mockedGetIncorrectCardsSetAside, mockedGetPossibleCardsToSetAside, mockedCountEndGameTakerPoints, mockedCountEndOfGameScore, dummyEndOfGameCallback);
            expect(localTable.giveDogToPlayerPoints).toHaveBeenCalledWith(players[1].id)
        })

        test(`Given an initialized game,
    when taker is determined with a GARDE CONTRE,
    then dog is in defense points at beginning of game`, () => {
            announceManager.announcesAreComplete.mockReturnValue(of({
                taker: players[1],
                announce: Announce.GARDE_CONTRE
            }));
            cardGameManager.gameIsOver.mockReturnValue(new ReplaySubject(1))
            const localTable = new MockedTarotTable();
            localTable.listCardsOf.mockReturnValue([])
            new TarotGame(players, localTable, dealer, announceManager, cardGameManager, mockedGetIncorrectCardsSetAside, mockedGetPossibleCardsToSetAside, mockedCountEndGameTakerPoints, mockedCountEndOfGameScore, dummyEndOfGameCallback);
            expect(localTable.giveDogToPlayerPoints).toHaveBeenCalled();
        })
    })


    describe(`Setting aside`, () => {

        test(`Given a determined taker,
    when the taker set asides correct cards,
    then taker is notified with available cards and card game begin`, () => {
            announceManager.announcesAreComplete.mockReturnValue(of({
                taker: players[1],
                announce: Announce.PRISE
            }));
            mockedGetIncorrectCardsSetAside.mockReturnValue([])
            cardGameManager.gameIsOver.mockReturnValue(new ReplaySubject(1))
            table.listCardsOf.mockReturnValue([])
            const tarotGame = new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetIncorrectCardsSetAside, mockedGetPossibleCardsToSetAside, mockedCountEndGameTakerPoints, mockedCountEndOfGameScore, dummyEndOfGameCallback);
            tarotGame.setAside(players[1], DECK_78.slice(0, 6));
            expect(players[1].availableCardsAreKnown).toHaveBeenCalledTimes(2)
            expect(cardGameManager.begin).toHaveBeenCalled()
        })

        test(`Given a determined taker,
    when the taker set asides an incorrect number of cards,
    then the player is notified that he cannot perform this action`, () => {
            announceManager.announcesAreComplete.mockReturnValue(of({
                taker: players[1],
                announce: Announce.PRISE
            }));
            const tarotGame = new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetIncorrectCardsSetAside, mockedGetPossibleCardsToSetAside, mockedCountEndGameTakerPoints, mockedCountEndOfGameScore, dummyEndOfGameCallback);
            tarotGame.setAside(players[1], DECK_78.slice(10, 14));
            expect(players[1].setAsideError).toHaveBeenCalled()
        })

        test(`Given a determined taker,
    when the taker set asides disallowed cards,
    then the player is notified that he cannot perform this action`, () => {
            announceManager.announcesAreComplete.mockReturnValue(of({
                taker: players[1],
                announce: Announce.PRISE
            }));
            mockedGetIncorrectCardsSetAside.mockReturnValue(DECK_78.slice(10, 13))
            const tarotGame = new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetIncorrectCardsSetAside, mockedGetPossibleCardsToSetAside, mockedCountEndGameTakerPoints, mockedCountEndOfGameScore, dummyEndOfGameCallback);

            tarotGame.setAside(players[1], DECK_78.slice(10, 16));
            expect(players[1].setAsideError).toHaveBeenCalled()
        })

        test(`Given no determined taker,
    when a player try to set cards aside,
    then the player is notified that he cannot perform this action`, () => {
            const tarotGame = new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetIncorrectCardsSetAside, mockedGetPossibleCardsToSetAside, mockedCountEndGameTakerPoints, mockedCountEndOfGameScore, dummyEndOfGameCallback);
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
            mockedGetIncorrectCardsSetAside.mockReturnValue([])
            cardGameManager.gameIsOver.mockReturnValue(new ReplaySubject(1))
            table.listCardsOf.mockReturnValue([])
            const tarotGame = new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetIncorrectCardsSetAside, mockedGetPossibleCardsToSetAside, mockedCountEndGameTakerPoints, mockedCountEndOfGameScore, dummyEndOfGameCallback);
            tarotGame.setAside(players[1], DECK_78.slice(0, 6));
            tarotGame.setAside(players[1], DECK_78.slice(0, 6));
            expect(players[1].setAsideError).toHaveBeenCalled()
        })

        test(`Given a taker that has already set aside cards,
    when the taker try to set cards aside,
    then the player is notified that he cannot perform this action`, () => {
            announceManager.announcesAreComplete.mockReturnValue(of({
                taker: players[1],
                announce: Announce.PRISE
            }));
            const tarotGame = new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetIncorrectCardsSetAside, mockedGetPossibleCardsToSetAside, mockedCountEndGameTakerPoints, mockedCountEndOfGameScore, dummyEndOfGameCallback);
            tarotGame.setAside(players[0], []);
            expect(players[0].setAsideError).toHaveBeenCalled()
        })
    })

    describe(`End of game`, () => {

        const takerEndOfGameScore = 5;
        const defenseEndOfGameScore = 86;
        const attackScoreByPlayer = -300;
        const defenseScoreByPlayer = 100;
        const wonCardsByTaker = [
            TRUMP_1, TRUMP_21, SPADE_C, SPADE_4
        ]
        const expectedEndOfGameResult = {
            numberOfPointsForAttack: takerEndOfGameScore,
            numberOfPointsForDefense: defenseEndOfGameScore,
            finalScores: [
                {
                    player: playerIdentifiers[0],
                    score: defenseScoreByPlayer
                },
                {
                    player: playerIdentifiers[1],
                    score: attackScoreByPlayer
                }, {
                    player: playerIdentifiers[2],
                    score: defenseScoreByPlayer
                }, {
                    player: playerIdentifiers[3],
                    score: defenseScoreByPlayer
                }
            ],
            endOfGameDeck: undefined
        }

        test(`Given a collection of tricks that have been played, 
    when game is over, 
    then end of game callback is triggered with expected winner and all players are notified`, (done) => {
            announceManager.announcesAreComplete.mockReturnValue(of({
                taker: players[1],
                announce: Announce.PRISE
            }));
            mockedGetIncorrectCardsSetAside.mockReturnValue([])

            const endOfGameSubject = new ReplaySubject(1);
            cardGameManager.gameIsOver.mockReturnValue(endOfGameSubject)

            table.listCardsOf.mockReturnValue([])
            const tarotGame = new TarotGame(players, table, dealer, announceManager, cardGameManager, mockedGetIncorrectCardsSetAside, mockedGetPossibleCardsToSetAside, mockedCountEndGameTakerPoints, mockedCountEndOfGameScore, dummyEndOfGameCallback);
            tarotGame.setAside(players[1], DECK_78.slice(0, 6));

            mockedCountEndGameTakerPoints.mockReturnValue(takerEndOfGameScore)
            mockedCountEndOfGameScore.mockReturnValue({
                attackScoreByPlayer,
                defenseScoreByPlayer
            })
            table.listPointsFor.mockReturnValue(wonCardsByTaker)
            endOfGameSubject.subscribe(_ => {
                expect(dummyEndOfGameCallback).toHaveBeenCalledWith(expectedEndOfGameResult);
                expect(players[0].gameOver).toHaveBeenCalledWith(takerEndOfGameScore);
                expect(players[1].gameOver).toHaveBeenCalledWith(takerEndOfGameScore);
                expect(players[2].gameOver).toHaveBeenCalledWith(takerEndOfGameScore);
                expect(players[3].gameOver).toHaveBeenCalledWith(takerEndOfGameScore);
                done()
            })

            const tricks: Trick[] = [{
                winner: players[0].id,
                cards: cardsInTrick
            }]
            endOfGameSubject.next(tricks)
            expect(mockedCountEndOfGameScore).toHaveBeenCalledWith({
                announce: Announce.PRISE,
                attackNumberOfOudlers: 2,
                attackNumberOfPoints: 5,
                petitInLastTrick: "DEFENSE",
                poignee: null
            })
        })
    })
});
