import {DealFunction} from "./domain/tarot-game/dealer/default-tarot-dealer";
import {DECK_78, PlayingCard} from "tarot-card-deck";
import {
    CLUB_1,
    CLUB_10,
    CLUB_2,
    CLUB_3,
    CLUB_4,
    CLUB_5,
    CLUB_6,
    CLUB_7,
    CLUB_8,
    CLUB_9,
    CLUB_C,
    CLUB_J,
    CLUB_K,
    CLUB_Q,
    DIAMOND_1,
    DIAMOND_10,
    DIAMOND_2,
    DIAMOND_3,
    DIAMOND_4,
    DIAMOND_5,
    DIAMOND_6,
    DIAMOND_7,
    DIAMOND_8,
    DIAMOND_9,
    DIAMOND_C,
    DIAMOND_J,
    DIAMOND_K,
    DIAMOND_Q,
    HEART_1,
    HEART_10,
    HEART_2,
    HEART_3,
    HEART_4,
    HEART_5,
    HEART_6,
    HEART_7,
    HEART_8,
    HEART_9,
    HEART_C,
    HEART_J,
    HEART_K,
    HEART_Q,
    EXCUSE,
    SPADE_1,
    SPADE_10,
    SPADE_2,
    SPADE_3,
    SPADE_4,
    SPADE_5,
    SPADE_6,
    SPADE_7,
    SPADE_8,
    SPADE_9,
    SPADE_C,
    SPADE_J,
    SPADE_K,
    SPADE_Q,
    TRUMP_1,
    TRUMP_10,
    TRUMP_11,
    TRUMP_12,
    TRUMP_13,
    TRUMP_14,
    TRUMP_15,
    TRUMP_16,
    TRUMP_17,
    TRUMP_18,
    TRUMP_19,
    TRUMP_2,
    TRUMP_20,
    TRUMP_21,
    TRUMP_3,
    TRUMP_4,
    TRUMP_5,
    TRUMP_6,
    TRUMP_7,
    TRUMP_8,
    TRUMP_9
} from "tarot-card-deck/dist/cards/all-playing-cards";
import {GameResultWithDeck, TarotGame} from "./domain/tarot-game/tarot-game";
import {getTarotGame} from "./tarot-game-provider";
import {TarotPlayer} from "./domain/tarot-game/player/tarot-player";
import {TarotPlayerNotification} from "./domain/tarot-game/player/tarot-player-notification";
import {CardGamePlayerNotification} from "./domain/card-game/player/card-game-player-notification";
import {PlayerIdentifier} from "./domain/card-game/player/card-game-player";
import {Announce} from "./domain/tarot-game/announce/announce";

describe('Simulate a complete game', function () {

    const predictableDealFunction: DealFunction = deck => {
        const player0Cards: PlayingCard[] = [
            HEART_1, HEART_5, HEART_9, HEART_Q, CLUB_3, CLUB_7, CLUB_J, DIAMOND_1, DIAMOND_5, DIAMOND_9, DIAMOND_Q, SPADE_3, SPADE_7, SPADE_J, TRUMP_1, TRUMP_5, TRUMP_9, TRUMP_13,
        ]
        const player1Cards: PlayingCard[] = [
            HEART_2, HEART_6, HEART_10, HEART_K, CLUB_4, CLUB_8, CLUB_C, DIAMOND_2, DIAMOND_6, DIAMOND_10, DIAMOND_K, SPADE_4, SPADE_8, SPADE_C, TRUMP_2, TRUMP_6, TRUMP_10, TRUMP_14,
        ]
        const player2Cards: PlayingCard[] = [
            HEART_3, HEART_7, HEART_J, CLUB_1, CLUB_5, CLUB_9, CLUB_Q, DIAMOND_3, DIAMOND_7, DIAMOND_J, SPADE_1, SPADE_5, SPADE_9, SPADE_Q, TRUMP_3, TRUMP_7, TRUMP_11, TRUMP_15,
        ]
        const player3Cards: PlayingCard[] = [
            HEART_4, HEART_8, HEART_C, CLUB_2, CLUB_6, CLUB_10, CLUB_K, DIAMOND_4, DIAMOND_8, DIAMOND_C, SPADE_2, SPADE_6, SPADE_10, SPADE_K, TRUMP_4, TRUMP_8, TRUMP_12, TRUMP_16,
        ]

        const dog: PlayingCard[] = [
            TRUMP_17, TRUMP_18, TRUMP_19, TRUMP_20, TRUMP_21, EXCUSE
        ]

        return {
            playersDecks: [
                player0Cards, player1Cards, player2Cards, player3Cards
            ],
            dog: dog
        }
    }

    it(`Given known decks of cards for each player,
        when simulating a complete game,
        then games can complete`, (done) => {

        const players: TarotPlayer[] = [
            new TestPlayer("0"),
            new TestPlayer("1"),
            new TestPlayer("2"),
            new TestPlayer("3")
        ]
        const tarotGame: TarotGame = getTarotGame(
            DECK_78,
            players,
            (gameResult: GameResultWithDeck) => {
                console.log(gameResult)
                expect(gameResult.numberOfPointsForAttack).toEqual(50)
                done()
            },
            predictableDealFunction
        )

        tarotGame.announce(players[0], null)
        tarotGame.announce(players[1], Announce.PRISE)
        tarotGame.announce(players[2], Announce.GARDE)
        tarotGame.announce(players[3], null)

        tarotGame.setAside(players[2], [HEART_3, HEART_7, HEART_J, CLUB_5, CLUB_9, CLUB_Q])

        tarotGame.play(players[0], HEART_1)
        tarotGame.play(players[1], HEART_2)
        tarotGame.play(players[2], TRUMP_3)
        tarotGame.play(players[3], HEART_4)

        tarotGame.play(players[2], SPADE_1)
        tarotGame.play(players[3], SPADE_K)
        tarotGame.play(players[0], SPADE_J)
        tarotGame.play(players[1], SPADE_C)

        tarotGame.play(players[3], SPADE_2)
        tarotGame.play(players[0], SPADE_3)
        tarotGame.play(players[1], SPADE_4)
        tarotGame.play(players[2], SPADE_Q)

        tarotGame.play(players[2], SPADE_5)
        tarotGame.play(players[3], SPADE_6)
        tarotGame.play(players[0], SPADE_7)
        tarotGame.play(players[1], SPADE_8)

        tarotGame.play(players[1], HEART_6)
        tarotGame.play(players[2], TRUMP_7)
        tarotGame.play(players[3], HEART_8)
        tarotGame.play(players[0], HEART_5)

        tarotGame.play(players[2], SPADE_9)
        tarotGame.play(players[3], SPADE_10)
        tarotGame.play(players[0], TRUMP_1)
        tarotGame.play(players[1], TRUMP_2)

        tarotGame.play(players[1], DIAMOND_2)
        tarotGame.play(players[2], DIAMOND_3)
        tarotGame.play(players[3], DIAMOND_C)
        tarotGame.play(players[0], DIAMOND_Q)

        tarotGame.play(players[0], HEART_9)
        tarotGame.play(players[1], HEART_10)
        tarotGame.play(players[2], TRUMP_11)
        tarotGame.play(players[3], HEART_C)

        tarotGame.play(players[2], DIAMOND_7)
        tarotGame.play(players[3], DIAMOND_4)
        tarotGame.play(players[0], DIAMOND_1)
        tarotGame.play(players[1], DIAMOND_K)

        tarotGame.play(players[1], CLUB_4)
        tarotGame.play(players[2], CLUB_1)
        tarotGame.play(players[3], CLUB_K)
        tarotGame.play(players[0], CLUB_J)

        tarotGame.play(players[3], CLUB_2)
        tarotGame.play(players[0], CLUB_3)
        tarotGame.play(players[1], CLUB_8)
        tarotGame.play(players[2], TRUMP_15)

        tarotGame.play(players[2], EXCUSE)
        tarotGame.play(players[3], CLUB_6)
        tarotGame.play(players[0], CLUB_7)
        tarotGame.play(players[1], CLUB_C)

        tarotGame.play(players[1], DIAMOND_6)
        tarotGame.play(players[2], DIAMOND_J)
        tarotGame.play(players[3], DIAMOND_8)
        tarotGame.play(players[0], DIAMOND_5)

        tarotGame.play(players[2], TRUMP_17)
        tarotGame.play(players[3], TRUMP_4)
        tarotGame.play(players[0], TRUMP_5)
        tarotGame.play(players[1], TRUMP_6)

        tarotGame.play(players[2], TRUMP_18)
        tarotGame.play(players[3], TRUMP_8)
        tarotGame.play(players[0], TRUMP_9)
        tarotGame.play(players[1], TRUMP_10)

        tarotGame.play(players[2], TRUMP_19)
        tarotGame.play(players[3], TRUMP_12)
        tarotGame.play(players[0], TRUMP_13)
        tarotGame.play(players[1], TRUMP_14)

        tarotGame.play(players[2], TRUMP_20)
        tarotGame.play(players[3], TRUMP_16)
        tarotGame.play(players[0], DIAMOND_9)
        tarotGame.play(players[1], DIAMOND_10)

        tarotGame.play(players[2], TRUMP_21)
        tarotGame.play(players[3], CLUB_10)
        tarotGame.play(players[0], HEART_Q)
        tarotGame.play(players[1], HEART_K)

    });
});

class TestPlayer implements TarotPlayer {
    constructor(public readonly id: PlayerIdentifier) {
    }

    notify(playerNotification: TarotPlayerNotification | CardGamePlayerNotification) {
    }

}
