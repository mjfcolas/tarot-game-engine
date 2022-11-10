import {MainGamePhase} from "./main-game.game-phase";
import {PoigneeCardGamePlugin} from "../../poignee/poignee-card-game-plugin";
import {MockedTarotTable} from "../../table/ports/__mock__/mocked-tarot-table";
import {MockedCardGameManager} from "../../../card-game/__mock__/mocked-card-game-manager";
import {DummyTarotPlayer} from "../../player/__dummy__/dummy-tarot-player";
import {TarotGameState} from "../../tarot-game";
import {of} from "rxjs";
import {TRUMP_1} from "tarot-card-deck";

describe(`Main game`, () => {
    const table: MockedTarotTable = new MockedTarotTable();

    const cardGameManager: MockedCardGameManager = new MockedCardGameManager();
    const playerIdentifiers = [
        "1", "2", "3", "4"
    ]
    const players: DummyTarotPlayer[] = [
        new DummyTarotPlayer(playerIdentifiers[0]),
        new DummyTarotPlayer(playerIdentifiers[1]),
        new DummyTarotPlayer(playerIdentifiers[2]),
        new DummyTarotPlayer(playerIdentifiers[3])
    ];
    const poigneePlugin: PoigneeCardGamePlugin = new PoigneeCardGamePlugin(players)


    let phase: MainGamePhase;

    beforeEach(() => {
        phase = new MainGamePhase(table, cardGameManager, poigneePlugin)
    })

    test(`Given a began main game phase with a taker,
    when card game manager emits completion,
    then end of phase is emitted with expected output`, (done) => {
        table.listCardsOf.mockReturnValue([])
        cardGameManager.gameIsOver.mockReturnValue(of([]))

        const inputPhaseWithTaker = {
            taker: players[1]
        }

        phase.execute(inputPhaseWithTaker).subscribe((outputState: TarotGameState) => {
            expect(outputState.endGameTricks).toEqual([])
            done()
        })
    })

    test(`Given a began main game phase without a taker,
    then emd of phase is emitted with expected output`, (done) => {
        const inputPhaseWithTaker = {
            taker: undefined
        }
        phase.execute(inputPhaseWithTaker).subscribe(() => {
            done()
        })
    })

    test(`When a player declines poignée,
    then declined poignée is forward to plugin`, () => {
        const spyOnDecline = jest.spyOn(poigneePlugin, "decline")
        phase.declinePoignee(players[0])
        expect(spyOnDecline).toHaveBeenCalledWith(players[0])
    })

    test(`When a player annonces poignée,
    then annonced poignée is forward to plugin`, () => {
        const spyOnAnnounce = jest.spyOn(poigneePlugin, "announce")
        phase.announcePoignee(players[0], [])
        expect(spyOnAnnounce).toHaveBeenCalledWith(players[0], [])
    })

    test(`When a player plays,
    then play card is forward to card game manager`, () => {
        const spyOnPlay = jest.spyOn(cardGameManager, "play")
        phase.play(players[0], TRUMP_1)
        expect(spyOnPlay).toHaveBeenCalledWith(players[0], TRUMP_1)
    })
})
