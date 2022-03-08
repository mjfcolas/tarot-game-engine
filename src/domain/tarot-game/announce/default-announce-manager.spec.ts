import {Announce} from "./announce";
import {AnnounceManager} from "./announce-manager";
import {DefaultAnnounceManager} from "./default-announce-manager";
import {DummyTarotPlayer} from "../player/__dummy__/dummy-tarot-player";
import {lastValueFrom} from "rxjs";

describe(`Default announce manager`, () => {

    const players: DummyTarotPlayer[] = [
        new DummyTarotPlayer("1"),
        new DummyTarotPlayer("2"),
        new DummyTarotPlayer("3"),
        new DummyTarotPlayer("4")
    ]

    test(`Given an announce manager and announces that has not began, 
    when a player announces something, 
    then an error is emitted to the player`, () => {
        const announceManager: AnnounceManager = new DefaultAnnounceManager(players)
        announceManager.announce(players[0], null)
        expect(players[0].announceError).toHaveBeenCalled()
    })

    test(`Given an announce manager, 
    when beginning announces, 
    then an announce request is emitted to first player with all choices`, () => {
        const announceManager: AnnounceManager = new DefaultAnnounceManager(players)
        announceManager.beginAnnounces();
        const expectedAnnounces = [
            "PRISE",
            "GARDE",
            "GARDE_SANS",
            "GARDE_CONTRE"
        ];
        expect(players[0].availableAnnounces).toEqual(expectedAnnounces);
    })

    test(`Given an announce manager and announces that has begun, 
    when first player announces nothing, 
    then an announce request is emitted to second player with all choices`, () => {
        const announceManager: AnnounceManager = new DefaultAnnounceManager(players)
        announceManager.beginAnnounces();
        announceManager.announce(players[0], null)
        const expectedAnnounces = [
            Announce.PRISE,
            Announce.GARDE,
            Announce.GARDE_SANS,
            Announce.GARDE_CONTRE
        ];
        expect(players[1].availableAnnounces).toEqual(expectedAnnounces)
    })

    test(`Given an announce manager and announces that has begun, 
    when first player announces something, 
    then an announce request is emitted to second player with remaining choices`, () => {
        const announceManager: AnnounceManager = new DefaultAnnounceManager(players)
        announceManager.beginAnnounces();
        announceManager.announce(players[0], Announce.GARDE)
        const expectedAnnounces = [
            Announce.GARDE_SANS,
            Announce.GARDE_CONTRE
        ];
        expect(players[1].availableAnnounces).toEqual(expectedAnnounces)
    })

    test(`Given an announce manager and announces that has begun, 
    when first player announces biggest announce, 
    then an announce request is emitted to second player with no remaining choices`, () => {
        const announceManager: AnnounceManager = new DefaultAnnounceManager(players)
        announceManager.beginAnnounces();
        announceManager.announce(players[0], Announce.GARDE_CONTRE)
        const expectedAnnounces = [];
        expect(players[1].availableAnnounces).toEqual(expectedAnnounces)
    })


    test(`Given an announce manager and announces that has begun, 
    when a player announces an unavailable announce, 
    then an error is emitted to the player`, () => {
        const announceManager: AnnounceManager = new DefaultAnnounceManager(players)
        announceManager.beginAnnounces();
        announceManager.announce(players[0], Announce.GARDE)
        announceManager.announce(players[1], Announce.PRISE)
        expect(players[1].announceError).toHaveBeenCalled()
    })

    test(`Given an announce manager and announces that has begun, 
    when first player announces something, 
    then announce is emitted to all players`, () => {
        const announceManager: AnnounceManager = new DefaultAnnounceManager(players)
        announceManager.beginAnnounces();
        announceManager.announce(players[0], Announce.PRISE)

        expect(players[0].announceDone).toHaveBeenCalledWith(players[0], Announce.PRISE);
        expect(players[1].announceDone).toHaveBeenCalledWith(players[0], Announce.PRISE);
        expect(players[2].announceDone).toHaveBeenCalledWith(players[0], Announce.PRISE);
        expect(players[3].announceDone).toHaveBeenCalledWith(players[0], Announce.PRISE);
    })

    test(`Given an announce manager and announces that has begun, 
    when a player that must not yet announce still announces,
    then an error is emitted to the player `, () => {
        const announceManager: AnnounceManager = new DefaultAnnounceManager(players)
        announceManager.beginAnnounces();
        announceManager.announce(players[1], Announce.PRISE)
        expect(players[1].announceError).toHaveBeenCalled()
    })

    test(`Given an announce manager, 
    when all announces are done, 
    then taker is emitted with its announce`, async () => {
        const announceManager: AnnounceManager = new DefaultAnnounceManager(players)
        announceManager.beginAnnounces();
        announceManager.announce(players[0], null)
        announceManager.announce(players[1], Announce.GARDE)
        announceManager.announce(players[2], null)
        announceManager.announce(players[3], null)
        const takerAnnounce = await lastValueFrom(announceManager.announcesAreComplete())
        expect(takerAnnounce.announce).toEqual(Announce.GARDE)
        expect(takerAnnounce.taker).toEqual(players[1])
    })

    test(`Given an announce manager with all announces done, 
    when player tries to announce, 
    then an error is emitted to the player`, async () => {
        const announceManager: AnnounceManager = new DefaultAnnounceManager(players)
        announceManager.beginAnnounces();
        announceManager.announce(players[0], null)
        announceManager.announce(players[1], Announce.PRISE)
        announceManager.announce(players[2], null)
        announceManager.announce(players[3], null)

        announceManager.announce(players[0], null)
        expect(players[0].announceError).toHaveBeenCalled()
        announceManager.announce(players[1], null)
        expect(players[1].announceError).toHaveBeenCalled()
        announceManager.announce(players[2], null)
        expect(players[2].announceError).toHaveBeenCalled()
        announceManager.announce(players[3], null)
        expect(players[3].announceError).toHaveBeenCalled()
    })

    test(`Given an announce manager and all announces are done, 
    when a player announces something, 
    then an error is emitted to the player`, () => {
        const announceManager: AnnounceManager = new DefaultAnnounceManager(players)
        announceManager.beginAnnounces();
        announceManager.announce(players[0], null)
        announceManager.announce(players[1], Announce.GARDE_SANS)
        announceManager.announce(players[2], null)
        announceManager.announce(players[3], null)

        announceManager.announce(players[0], Announce.GARDE)

        expect(players[0].announceError).toHaveBeenCalled()
    })
});
