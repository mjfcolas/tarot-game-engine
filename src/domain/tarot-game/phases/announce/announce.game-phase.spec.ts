import {of} from "rxjs";
import {Announce} from "../../announce/announce";
import {TarotGameState} from "../../tarot-game";
import {MockedTarotTable} from "../../table/ports/__mock__/mocked-tarot-table";
import {AnnounceGamePhase} from "./announce.game-phase";
import {DummyTarotPlayer} from "../../player/__dummy__/dummy-tarot-player";
import {MockedAnnounceManager} from "../../announce/__mock__/mocked-announce-manager";

describe(`Announces & Dog`, () => {
    let table: MockedTarotTable;
    const announceManager: MockedAnnounceManager = new MockedAnnounceManager();

    const inputGameState: TarotGameState = {}

    const playerIdentifiers = [
        "1", "2", "3", "4"
    ]

    let players: DummyTarotPlayer[];
    let phase: AnnounceGamePhase;

    beforeEach(() => {
        table = new MockedTarotTable();
        players = [
            new DummyTarotPlayer(playerIdentifiers[0]),
            new DummyTarotPlayer(playerIdentifiers[1]),
            new DummyTarotPlayer(playerIdentifiers[2]),
            new DummyTarotPlayer(playerIdentifiers[3])
        ]
        phase = new AnnounceGamePhase(players, table, announceManager)
    })

    test(`Given announce game phase,
    when announces are over and one player has announced something,
    then expected taker is emitted to all players `, () => {
        announceManager.announcesAreComplete.mockReturnValue(of({
            taker: players[1],
            announce: Announce.PRISE
        }));
        phase.execute(inputGameState).subscribe(() => {
            expect(players[0].takerIsKnown).toHaveBeenCalledWith(players[1].id, Announce.PRISE)
            expect(players[1].takerIsKnown).toHaveBeenCalledWith(players[1].id, Announce.PRISE)
            expect(players[2].takerIsKnown).toHaveBeenCalledWith(players[1].id, Announce.PRISE)
            expect(players[3].takerIsKnown).toHaveBeenCalledWith(players[1].id, Announce.PRISE)
        })

    })

    test(`Given announce game phase,
    when announces are over and nobody has announces something,
    then no announces is true in output state`, (done) => {
        announceManager.announcesAreComplete.mockReturnValue(of(undefined));
        phase.execute(inputGameState).subscribe(outputGameState => {
            expect(outputGameState.taker).toBeFalsy()
            done()
        })
    })

    test.each([
        Announce.PRISE,
        Announce.GARDE
    ])(`Given announce game phase,
    when taker is determined with a %p,
    then taker retrieve dog's cards and is notified and need to set aside is set in output state`, (announce, done: any) => {
        announceManager.announcesAreComplete.mockReturnValue(of({
            taker: players[1],
            announce: announce
        }));
        phase.execute(inputGameState).subscribe(outputGameState => {
            expect(outputGameState.taker).toBeTruthy()
            expect(outputGameState.hasToSetAside).toBeTruthy()
            expect(table.giveDogToPlayerHand).toHaveBeenCalledWith(players[1].id)
            done()
        })
    })

    test.each([
        Announce.GARDE_SANS,
        Announce.GARDE_CONTRE
    ])(`Given announce game phase,
    when taker is determined with a %p,
    then no need to set aside in output game state `, (announce, done: any) => {
        announceManager.announcesAreComplete.mockReturnValue(of({
            taker: players[1],
            announce: announce
        }));
        phase.execute(inputGameState).subscribe(outputGameState => {
            expect(outputGameState.taker).toBeTruthy()
            expect(outputGameState.hasToSetAside).toBeFalsy()
            done()
        })
    })


    test(`Given announce game phase,
    when taker is determined with a GARDE SANS,
    then taker has kept dog in its points at beginning of game`, (done) => {
        announceManager.announcesAreComplete.mockReturnValue(of({
            taker: players[1],
            announce: Announce.GARDE_SANS
        }));
        phase.execute(inputGameState).subscribe(() => {
            expect(table.giveDogToPlayerPoints).toHaveBeenCalledWith(players[1].id)
            done()
        })
    })

    test(`Given an initialized game,
    when taker is determined with a GARDE CONTRE,
    then dog is in defense points at beginning of game`, (done) => {
        announceManager.announcesAreComplete.mockReturnValue(of({
            taker: players[1],
            announce: Announce.GARDE_CONTRE
        }));
        phase.execute(inputGameState).subscribe(() => {
            expect(table.giveDogToPlayerPoints).not.toHaveBeenCalledWith(players[1].id)
            expect(table.giveDogToPlayerPoints).toHaveBeenCalled()
            done()
        })
    })
})
