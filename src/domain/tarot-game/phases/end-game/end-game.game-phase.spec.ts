import {Announce} from "../../announce/announce";
import {TarotGameState} from "../../tarot-game";
import {SPADE_4, SPADE_C, TRUMP_1, TRUMP_21} from "tarot-card-deck";
import {Trick} from "../../../card-game/card-game-manager";
import {EndGamePhase} from "./end-game.game-phase";
import {DummyTarotPlayer} from "../../player/__dummy__/dummy-tarot-player";
import {MockedTarotTable} from "../../table/ports/__mock__/mocked-tarot-table";
import {PoigneeCardGamePlugin} from "../../poignee/poignee-card-game-plugin";
import {PlayedCard} from "../../../card-game/functions/resolve-turn";

describe(`End of game`, () => {

    const mockedCountEndGameTakerPoints = jest.fn();
    const mockedCountEndOfGameScore = jest.fn();
    const dummyEndOfGameCallback = jest.fn()

    const playerIdentifiers = [
        "1", "2", "3", "4"
    ]

    let players: DummyTarotPlayer[];
    let phase: EndGamePhase;
    let table: MockedTarotTable;
    let poigneePlugin: PoigneeCardGamePlugin

    beforeEach(() => {
        table = new MockedTarotTable();
        players = [
            new DummyTarotPlayer(playerIdentifiers[0]),
            new DummyTarotPlayer(playerIdentifiers[1]),
            new DummyTarotPlayer(playerIdentifiers[2]),
            new DummyTarotPlayer(playerIdentifiers[3])
        ]
        poigneePlugin = new PoigneeCardGamePlugin(players)

        phase = new EndGamePhase(players, table, poigneePlugin, mockedCountEndGameTakerPoints, mockedCountEndOfGameScore, dummyEndOfGameCallback)
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

    test(`Given a taker and a collection of tricks that have been played, 
    when game is over, 
    then end of game callback is triggered with expected winner and all players are notified`, (done) => {
        table.listPointsFor.mockReturnValue(wonCardsByTaker)
        const tricks: Trick[] = [{
            winner: players[0].id,
            cards: cardsInTrick
        }]

        mockedCountEndGameTakerPoints.mockReturnValue(takerEndOfGameScore)
        mockedCountEndOfGameScore.mockReturnValue({
            attackScoreByPlayer,
            defenseScoreByPlayer
        })

        const inputStateWithTakerAndCollectionOfTricks: TarotGameState = {
            endGameTricks: tricks,
            taker: players[1],
            takerAnnounce: Announce.PRISE
        }

        phase.execute(inputStateWithTakerAndCollectionOfTricks).subscribe(() => {
            expect(dummyEndOfGameCallback).toHaveBeenCalledWith(expectedEndOfGameResult);
            expect(players[0].gameOver).toHaveBeenCalledWith(takerEndOfGameScore);
            expect(players[1].gameOver).toHaveBeenCalledWith(takerEndOfGameScore);
            expect(players[2].gameOver).toHaveBeenCalledWith(takerEndOfGameScore);
            expect(players[3].gameOver).toHaveBeenCalledWith(takerEndOfGameScore);
            expect(mockedCountEndOfGameScore).toHaveBeenCalledWith({
                announce: Announce.PRISE,
                attackNumberOfOudlers: 2,
                attackNumberOfPoints: 5,
                petitInLastTrick: "DEFENSE",
                poignee: null
            })
            done()
        })
    })

    test(`Given no taker, 
    when game is over, 
    then game aborted is emitted to all players and end of game callback is called with game results`, (done) => {

        const inputStateWithNoTaker: TarotGameState = {
            taker: undefined,
        }

        phase.execute(inputStateWithNoTaker).subscribe(() => {
            expect(dummyEndOfGameCallback).toHaveBeenCalled();
            expect(players[0].gameAborted).toHaveBeenCalled();
            expect(players[1].gameAborted).toHaveBeenCalled();
            expect(players[2].gameAborted).toHaveBeenCalled();
            expect(players[3].gameAborted).toHaveBeenCalled();
            done()
        })
    })
});
