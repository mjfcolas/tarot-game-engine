import {
    CLUB_3,
    CLUB_7,
    CLUB_J,
    DIAMOND_1,
    DIAMOND_5,
    DIAMOND_9,
    DIAMOND_Q,
    EXCUSE,
    HEART_1,
    HEART_4,
    HEART_5,
    HEART_9,
    HEART_Q,
    SPADE_3,
    SPADE_7,
    SPADE_J,
    TRUMP_1,
    TRUMP_10,
    TRUMP_11,
    TRUMP_12,
    TRUMP_13,
    TRUMP_14,
    TRUMP_15,
    TRUMP_2,
    TRUMP_3,
    TRUMP_4,
    TRUMP_5,
    TRUMP_6,
    TRUMP_7,
    TRUMP_8,
    TRUMP_9
} from "tarot-card-deck";
import {DefaultPlayerPoigneeManager} from "./default-player-poignee-manager";
import {DummyTarotPlayer} from "../player/__dummy__/dummy-tarot-player";
import {Poignee} from "./poignee";


describe(`Default player poignee manager`, () => {

    const tenTrumps = [TRUMP_1, TRUMP_2, TRUMP_3, TRUMP_4, TRUMP_5, TRUMP_6, TRUMP_7, TRUMP_8, TRUMP_9, TRUMP_10]
    const thirteenTrumps = [...tenTrumps, TRUMP_11, TRUMP_12, TRUMP_13]
    const fifteenTrumps = [...thirteenTrumps, TRUMP_11, TRUMP_14, TRUMP_15]


    const nineTrumpsAndExcuse = [TRUMP_1, TRUMP_2, TRUMP_3, TRUMP_4, TRUMP_5, TRUMP_6, TRUMP_7, TRUMP_8, TRUMP_9, EXCUSE]

    const aGameWithLessThan10Trumps = [
        TRUMP_1, TRUMP_5, TRUMP_9, TRUMP_13, HEART_1, HEART_5, HEART_9, HEART_Q, CLUB_3, CLUB_7, CLUB_J, DIAMOND_1, DIAMOND_5, DIAMOND_9, DIAMOND_Q, SPADE_3, SPADE_7, SPADE_J
    ]

    const aGameWithMoreThan10Trumps = [
        ...tenTrumps, TRUMP_11, HEART_5, HEART_9, HEART_Q, CLUB_3, CLUB_7, CLUB_J, DIAMOND_1
    ]

    const aGameWith13Trumps = [
        ...thirteenTrumps, HEART_Q, CLUB_3, CLUB_7, CLUB_J, DIAMOND_1
    ]

    const aGameWith15Trumps = [
        ...fifteenTrumps, CLUB_7, CLUB_J, DIAMOND_1
    ]

    const aGameWithMoreThan10TrumpsAndExcuse = [
        ...tenTrumps, TRUMP_11, HEART_5, HEART_9, HEART_Q, CLUB_3, CLUB_7, CLUB_J, EXCUSE
    ]

    const aGameWithExactly9TrumpsAndExcuse = [
        ...nineTrumpsAndExcuse, HEART_4, HEART_5, HEART_9, HEART_Q, CLUB_3, CLUB_7, CLUB_J, DIAMOND_1
    ]

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

    test(`Given a player that has less than 10 trumps,
        when instantiating the player poignee manager,
        then poignee announce is directly complete with no poignee announced`, (done) => {
        const playerPoigneeManager = new DefaultPlayerPoigneeManager(players[0], aGameWithLessThan10Trumps, players)
        playerPoigneeManager.observePoigneeAnnounce().subscribe(announcedPoignee => {
            expect(announcedPoignee).toBeFalsy();
            done()
        })
    });

    test(`Given a player that has more than 10 trumps,
        when instantiating the player poignee manager,
        then player is asked to announce its poignee with cards that can be shown`, () => {
        new DefaultPlayerPoigneeManager(players[0], aGameWithMoreThan10Trumps, players)
        expect(players[0].askedForPoigneeAnnounce).toHaveBeenCalledTimes(1)
        expect(players[0].askedForPoigneeAnnounce).toHaveBeenCalledWith(
            [TRUMP_1, TRUMP_2, TRUMP_3, TRUMP_4, TRUMP_5, TRUMP_6, TRUMP_7, TRUMP_8, TRUMP_9, TRUMP_10, TRUMP_11],
            10
        )

    });

    test(`Given a player that has less than 10 trumps,
        when player announce a poignee,
        then he is notified that this is not possible`, () => {
        const playerPoigneeManager = new DefaultPlayerPoigneeManager(players[0], aGameWithLessThan10Trumps, players)
        playerPoigneeManager.announcePoignee(tenTrumps)
        expect(players[0].poigneeAnnounceError).toHaveBeenCalledTimes(1)
    });

    test(`Given a player that has more than 10 trumps,
        when player announce a poignee with correct cards but not enough of them,
        then he is notified that this is not possible`, () => {
        const playerPoigneeManager = new DefaultPlayerPoigneeManager(players[0], aGameWithMoreThan10Trumps, players)
        playerPoigneeManager.announcePoignee(tenTrumps.slice(0, 5))
        expect(players[0].poigneeAnnounceError).toHaveBeenCalledTimes(1)
    });

    test(`Given a player that has more than 10 trumps,
        when player decline a poignee,
        then poignee announce is complete and player are not notified`, (done) => {
        const playerPoigneeManager = new DefaultPlayerPoigneeManager(players[0], aGameWithMoreThan10Trumps, players)
        playerPoigneeManager.declinePoignee()
        playerPoigneeManager.observePoigneeAnnounce().subscribe(announcedPoignee => {
            expect(announcedPoignee).toEqual(undefined);
            done()
        })
        expect(players[0].poigneeHasBeenAnnounced).not.toHaveBeenCalled();
        expect(players[1].poigneeHasBeenAnnounced).not.toHaveBeenCalled();
        expect(players[2].poigneeHasBeenAnnounced).not.toHaveBeenCalled();
        expect(players[3].poigneeHasBeenAnnounced).not.toHaveBeenCalled();
    });

    test(`Given a player that has more than 10 trumps,
        when player decline a poignee after poignee announces are complete,
        then he is notified that this is not possible`, () => {
        const playerPoigneeManager = new DefaultPlayerPoigneeManager(players[0], aGameWithMoreThan10Trumps, players)
        playerPoigneeManager.declinePoignee()
        playerPoigneeManager.declinePoignee()
        expect(players[0].poigneeAnnounceError).toHaveBeenCalledTimes(1)
    });


    test(`Given a player that has more than 10 trumps,
        when player announce a poignee with correct cards,
        then other players are notified and poignee announce is complete`, (done) => {
        const playerPoigneeManager = new DefaultPlayerPoigneeManager(players[0], aGameWithMoreThan10Trumps, players)
        playerPoigneeManager.announcePoignee(tenTrumps)
        playerPoigneeManager.observePoigneeAnnounce().subscribe(announcedPoignee => {
            expect(announcedPoignee).toEqual(Poignee.SIMPLE);
            done()
        })
        expect(players[0].poigneeHasBeenAnnounced).toHaveBeenCalledWith(players[0].id, tenTrumps);
        expect(players[1].poigneeHasBeenAnnounced).toHaveBeenCalledWith(players[0].id, tenTrumps);
        expect(players[2].poigneeHasBeenAnnounced).toHaveBeenCalledWith(players[0].id, tenTrumps);
        expect(players[3].poigneeHasBeenAnnounced).toHaveBeenCalledWith(players[0].id, tenTrumps);
    });

    test(`Given a player that has 13 trumps,
        when player announce a poignee with correct cards,
        then double poignee is announced`, (done) => {
        const playerPoigneeManager = new DefaultPlayerPoigneeManager(players[0], aGameWith13Trumps, players)
        playerPoigneeManager.announcePoignee(thirteenTrumps)
        playerPoigneeManager.observePoigneeAnnounce().subscribe(announcedPoignee => {
            expect(announcedPoignee).toEqual(Poignee.DOUBLE);
            done()
        })
    });

    test(`Given a player that has 15 trumps,
        when player announce a poignee with correct cards,
        then triple poignee is announced`, (done) => {
        const playerPoigneeManager = new DefaultPlayerPoigneeManager(players[0], aGameWith15Trumps, players)
        playerPoigneeManager.announcePoignee(fifteenTrumps)
        playerPoigneeManager.observePoigneeAnnounce().subscribe(announcedPoignee => {
            expect(announcedPoignee).toEqual(Poignee.TRIPLE);
            done()
        })
    });

    test(`Given a player that has more than 10 trumps,
        when player announce a poignee with incorrect cards,
        then he is notified that this is not possible`, () => {
        const playerPoigneeManager = new DefaultPlayerPoigneeManager(players[0], aGameWithMoreThan10Trumps, players)
        playerPoigneeManager.announcePoignee([...tenTrumps.slice(0, 9), HEART_5])
        expect(players[0].poigneeAnnounceError).toHaveBeenCalledTimes(1)
    });


    test(`Given a player that has exactly 9 trumps and excuse,
        when instantiating the player poignee manager,
        then player is asked to announce its poignee with cards that can be shown`, () => {
        new DefaultPlayerPoigneeManager(players[0], aGameWithExactly9TrumpsAndExcuse, players)
        expect(players[0].askedForPoigneeAnnounce).toHaveBeenCalledTimes(1)
        expect(players[0].askedForPoigneeAnnounce).toHaveBeenCalledWith(
            nineTrumpsAndExcuse,
            10
        )
    });

    test(`Given a player that has more that 9 trumps and excuse,
        when instantiating the player poignee manager,
        then player is asked to announce its poignee with cards only trumps that can be shown`, () => {
        new DefaultPlayerPoigneeManager(players[0], aGameWithMoreThan10TrumpsAndExcuse, players)
        expect(players[0].askedForPoigneeAnnounce).toHaveBeenCalledTimes(1)
        expect(players[0].askedForPoigneeAnnounce).toHaveBeenCalledWith(
            [...tenTrumps, TRUMP_11],
            10
        )
    });

    test(`Given a player poignee manager on which announces are already complete,
        when player tries to announce,
        then he is notified that poignee announces are complete`, () => {
        const playerPoigneeManager = new DefaultPlayerPoigneeManager(players[0], aGameWithMoreThan10Trumps, players)
        playerPoigneeManager.announcePoignee(tenTrumps)
        playerPoigneeManager.announcePoignee(tenTrumps)
        expect(players[0].poigneeAnnounceError).toHaveBeenCalledTimes(1)
    });
})
