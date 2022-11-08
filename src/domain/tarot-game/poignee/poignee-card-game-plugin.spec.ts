import {PoigneeCardGamePlugin} from "./poignee-card-game-plugin";
import {DummyTarotPlayer} from "../player/__dummy__/dummy-tarot-player";
import {
    CLUB_3,
    CLUB_7,
    CLUB_J,
    DIAMOND_1, DIAMOND_5, DIAMOND_9, DIAMOND_Q, HEART_1,
    HEART_5,
    HEART_9,
    HEART_Q, SPADE_3, SPADE_7, SPADE_J,
    TRUMP_1,
    TRUMP_10,
    TRUMP_11, TRUMP_13,
    TRUMP_2,
    TRUMP_3,
    TRUMP_4,
    TRUMP_5,
    TRUMP_6,
    TRUMP_7,
    TRUMP_8,
    TRUMP_9
} from "tarot-card-deck";
import {Poignee} from "./poignee";

describe(`Poignee Plugin`, () => {

    const tenTrumps = [TRUMP_1, TRUMP_2, TRUMP_3, TRUMP_4, TRUMP_5, TRUMP_6, TRUMP_7, TRUMP_8, TRUMP_9, TRUMP_10]
    const aGameWithMoreThan10Trumps = [
        ...tenTrumps, TRUMP_11, HEART_5, HEART_9, HEART_Q, CLUB_3, CLUB_7, CLUB_J, DIAMOND_1
    ]
    const aGameWithLessThan10Trumps = [
        TRUMP_1, TRUMP_5, TRUMP_9, TRUMP_13, HEART_1, HEART_5, HEART_9, HEART_Q, CLUB_3, CLUB_7, CLUB_J, DIAMOND_1, DIAMOND_5, DIAMOND_9, DIAMOND_Q, SPADE_3, SPADE_7, SPADE_J
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

    test(`Given a poignee card game plugin and a player that has a game that could lead to a poignee,
        when plugin is executed for a turn that is not the first one,
        then plugin directly complete`, (done) => {
        const plugin: PoigneeCardGamePlugin = new PoigneeCardGamePlugin(players);
        const pluginExecution = plugin.apply(2, players[0], aGameWithMoreThan10Trumps);
        pluginExecution.subscribe({
            complete: () => done()
        })
    });

    test(`Given a poignee card game plugin and a player that has a game that could lead to a poignee,
        when plugin is executed for the first turn and a player decline the poignee,
        then plugin complete after poignee flow is over and there is no available poignee`, (done) => {
        const plugin: PoigneeCardGamePlugin = new PoigneeCardGamePlugin(players);
        const pluginExecution = plugin.apply(1, players[0], aGameWithMoreThan10Trumps);
        plugin.decline(players[0]);
        pluginExecution.subscribe({
            complete: () => done()
        })
        expect(plugin.getPotentialPoignee()).toBeFalsy()
    });

    test(`Given a poignee card game plugin and a player that has a game that could lead to a poignee,
        when plugin is executed for the first turn and a player announce the poignee,
        then plugin complete after poignee flow is over and poignee can be retrieved`, (done) => {
        const plugin: PoigneeCardGamePlugin = new PoigneeCardGamePlugin(players);
        const pluginExecution = plugin.apply(1, players[0], aGameWithMoreThan10Trumps);
        plugin.announce(players[0], tenTrumps);
        pluginExecution.subscribe({
            complete: () => done()
        })
        expect(plugin.getPotentialPoignee()).toEqual(Poignee.SIMPLE)
    });

    test(`Given a poignee card game plugin and a first announced poignee,
        when plugin is executed a second time,
        then initial poignee can be retrieved`, () => {
        const plugin: PoigneeCardGamePlugin = new PoigneeCardGamePlugin(players);
        plugin.apply(1, players[0], aGameWithMoreThan10Trumps);
        plugin.announce(players[0], tenTrumps);
        plugin.apply(1, players[1], aGameWithLessThan10Trumps);

        expect(plugin.getPotentialPoignee()).toEqual(Poignee.SIMPLE)
    });

    test(`Given a poignee card game plugin,
        when player decline a poignee before execution of the plugin,
        then he is notified that he cannot perform this action`, () => {
        const plugin: PoigneeCardGamePlugin = new PoigneeCardGamePlugin(players);
        plugin.decline(players[0]);
        expect(players[0].poigneeAnnounceError).toHaveBeenCalledTimes(1)
    });

    test(`Given a poignee card game plugin,
        when player announce a poignee before execution of the plugin,
        then he is notified that he cannot perform this action`, () => {
        const plugin: PoigneeCardGamePlugin = new PoigneeCardGamePlugin(players);
        plugin.announce(players[0], tenTrumps);
        expect(players[0].poigneeAnnounceError).toHaveBeenCalledTimes(1)
    });
})
