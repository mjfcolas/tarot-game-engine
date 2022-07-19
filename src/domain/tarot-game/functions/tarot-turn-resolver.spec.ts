import {PlayedCard, TurnResult} from "../../card-game/functions/resolve-turn";
import {
    HEART_9,
    EXCUSE,
    SPADE_1,
    SPADE_2,
    SPADE_3,
    SPADE_4,
    SPADE_C,
    SPADE_Q,
    TRUMP_1,
    TRUMP_5
} from "tarot-card-deck/dist/cards/all-playing-cards";
import {resolveTarotTurn} from "./tarot-turn-resolver";

describe(`Tarot turn resolver`, () => {
    test(`Given four spades,
        when resolving turn,
        then player that has played the biggest spade wins all the cards`, () => {
        const playedCards: readonly PlayedCard[] = [
            {
                playerIdentifier: "P0",
                playingCard: SPADE_1
            },
            {
                playerIdentifier: "P1",
                playingCard: SPADE_2
            },
            {
                playerIdentifier: "P2",
                playingCard: SPADE_3
            },
            {
                playerIdentifier: "P3",
                playingCard: SPADE_4
            },
        ]
        const expectedTurnResult: TurnResult = {
            playedCards: playedCards,
            winner: "P3",
            wonCardsByPlayer: [
                {
                    playerIdentifier: "P0",
                    wonCards: []
                },
                {
                    playerIdentifier: "P1",
                    wonCards: []
                },
                {
                    playerIdentifier: "P2",
                    wonCards: []
                },
                {
                    playerIdentifier: "P3",
                    wonCards: [SPADE_1, SPADE_2, SPADE_3, SPADE_4]
                },
            ]
        }
        expect(resolveTarotTurn(playedCards)).toEqual(expectedTurnResult);
    });

    test(`Given four spades including rider and queen,
        when resolving turn,
        then player that has played the biggest spade wins all the cards`, () => {
        const playedCards: readonly PlayedCard[] = [
            {
                playerIdentifier: "P0",
                playingCard: SPADE_C
            },
            {
                playerIdentifier: "P1",
                playingCard: SPADE_2
            },
            {
                playerIdentifier: "P2",
                playingCard: SPADE_3
            },
            {
                playerIdentifier: "P3",
                playingCard: SPADE_Q
            },
        ]
        const expectedTurnResult: TurnResult = {
            playedCards: playedCards,
            winner: "P3",
            wonCardsByPlayer: [
                {
                    playerIdentifier: "P0",
                    wonCards: []
                },
                {
                    playerIdentifier: "P1",
                    wonCards: []
                },
                {
                    playerIdentifier: "P2",
                    wonCards: []
                },
                {
                    playerIdentifier: "P3",
                    wonCards: [SPADE_C, SPADE_2, SPADE_3, SPADE_Q]
                },
            ]
        }
        expect(resolveTarotTurn(playedCards)).toEqual(expectedTurnResult);
    });

    test(`Given a trump in the played cards,
        when resolving turn,
        then the player that has played trump wins all the cards`, () => {
        const playedCards: readonly PlayedCard[] = [
            {
                playerIdentifier: "P0",
                playingCard: SPADE_1
            },
            {
                playerIdentifier: "P1",
                playingCard: SPADE_2
            },
            {
                playerIdentifier: "P2",
                playingCard: TRUMP_1
            },
            {
                playerIdentifier: "P3",
                playingCard: SPADE_4
            },
        ]
        const expectedTurnResult: TurnResult = {
            playedCards: playedCards,
            winner: "P2",
            wonCardsByPlayer: [
                {
                    playerIdentifier: "P0",
                    wonCards: []
                },
                {
                    playerIdentifier: "P1",
                    wonCards: []
                },
                {
                    playerIdentifier: "P2",
                    wonCards: [SPADE_1, SPADE_2, TRUMP_1, SPADE_4]
                },
                {
                    playerIdentifier: "P3",
                    wonCards: []
                },
            ]
        }
        expect(resolveTarotTurn(playedCards)).toEqual(expectedTurnResult);
    });
    test(`Given 2 trumps in played cards,
        when resolving turn,
        then the player that has played the biggest trump wins all the cards`, () => {
        const playedCards: readonly PlayedCard[] = [
            {
                playerIdentifier: "P0",
                playingCard: SPADE_1
            },
            {
                playerIdentifier: "P1",
                playingCard: TRUMP_5
            },
            {
                playerIdentifier: "P2",
                playingCard: TRUMP_1
            },
            {
                playerIdentifier: "P3",
                playingCard: SPADE_4
            },
        ]
        const expectedTurnResult: TurnResult = {
            playedCards: playedCards,
            winner: "P1",
            wonCardsByPlayer: [
                {
                    playerIdentifier: "P0",
                    wonCards: []
                },
                {
                    playerIdentifier: "P1",
                    wonCards: [SPADE_1, TRUMP_5, TRUMP_1, SPADE_4]
                },
                {
                    playerIdentifier: "P2",
                    wonCards: []
                },
                {
                    playerIdentifier: "P3",
                    wonCards: []
                },
            ]
        }
        expect(resolveTarotTurn(playedCards)).toEqual(expectedTurnResult);

    });
    test(`Given a spade as first card and a heart bigger than all of the spades,
        when resolving turn,
        then the player that has played the biggest spade win all the cards`, () => {
        const playedCards: readonly PlayedCard[] = [
            {
                playerIdentifier: "P0",
                playingCard: SPADE_1
            },
            {
                playerIdentifier: "P1",
                playingCard: SPADE_3
            },
            {
                playerIdentifier: "P2",
                playingCard: HEART_9
            },
            {
                playerIdentifier: "P3",
                playingCard: SPADE_4
            },
        ]
        const expectedTurnResult: TurnResult = {
            playedCards: playedCards,
            winner: "P3",
            wonCardsByPlayer: [
                {
                    playerIdentifier: "P0",
                    wonCards: []
                },
                {
                    playerIdentifier: "P1",
                    wonCards: []
                },
                {
                    playerIdentifier: "P2",
                    wonCards: []
                },
                {
                    playerIdentifier: "P3",
                    wonCards: [SPADE_1, SPADE_3, HEART_9, SPADE_4]
                },
            ]
        }
        expect(resolveTarotTurn(playedCards)).toEqual(expectedTurnResult);
    });

    test(`Given excuse played as first card and 3 spades,
        when resolving turn,
        then the player that has played the biggest spade wins all the cards`, () => {
        const playedCards: readonly PlayedCard[] = [
            {
                playerIdentifier: "P0",
                playingCard: EXCUSE
            },
            {
                playerIdentifier: "P1",
                playingCard: SPADE_3
            },
            {
                playerIdentifier: "P2",
                playingCard: SPADE_2
            },
            {
                playerIdentifier: "P3",
                playingCard: SPADE_4
            },
        ]
        const expectedTurnResult: TurnResult = {
            playedCards: playedCards,
            winner: "P3",
            wonCardsByPlayer: [
                {
                    playerIdentifier: "P0",
                    wonCards: []
                },
                {
                    playerIdentifier: "P1",
                    wonCards: []
                },
                {
                    playerIdentifier: "P2",
                    wonCards: []
                },
                {
                    playerIdentifier: "P3",
                    wonCards: [EXCUSE, SPADE_3, SPADE_2, SPADE_4]
                },
            ]
        }
        expect(resolveTarotTurn(playedCards)).toEqual(expectedTurnResult);
    });
})
