import {
    CLUB_1,
    CLUB_2,
    CLUB_3,
    CLUB_4,
    CLUB_K,
    DIAMOND_1,
    DIAMOND_2,
    DIAMOND_3,
    EXCUSE,
    PlayingCard,
    TRUMP_1,
    TRUMP_2,
    TRUMP_3,
    TRUMP_4,
    TRUMP_5
} from "tarot-card-deck";
import {getIncorrectCardsSetAside, getPossibleCardsToSetAside} from "./tarot-available-cards-to-set-aside";

describe('Available Cards to set aside', function () {

    test(`Given a game with more than 6 cards that are not either oudlers nor trump nor king,
    and a player that set asides 6 cards that are not either oudlers nor trump nor king
    when verifying cards set aside,
    then no cards are returned`, () => {
        const playerGame: PlayingCard[] = [
            DIAMOND_1,
            DIAMOND_2,
            DIAMOND_3,
            CLUB_1,
            CLUB_2,
            CLUB_3,
            CLUB_4,
            CLUB_K,
            TRUMP_1,
            TRUMP_2,
            TRUMP_3,
            TRUMP_4,
            TRUMP_5,
            EXCUSE
        ]

        const setAsideCards: PlayingCard[] = [
            DIAMOND_1,
            DIAMOND_2,
            DIAMOND_3,
            CLUB_1,
            CLUB_2,
            CLUB_3,
        ]
        expect(getIncorrectCardsSetAside(playerGame, setAsideCards)).toEqual([]);
    })

    test(`Given a game with more than 6 cards that are not either oudlers nor trump nor king,
    when getting possible cards to set aside,
    then return cards that are not king nor trumps nor oudlers`, () => {
        const playerGame: PlayingCard[] = [
            DIAMOND_1,
            DIAMOND_2,
            DIAMOND_3,
            CLUB_1,
            CLUB_2,
            CLUB_3,
            CLUB_4,
            CLUB_K,
            TRUMP_1,
            TRUMP_2,
            TRUMP_3,
            TRUMP_4,
            TRUMP_5,
            EXCUSE
        ]

        const expectedPossibleCardsToSetAside: PlayingCard[] = [
            DIAMOND_1,
            DIAMOND_2,
            DIAMOND_3,
            CLUB_1,
            CLUB_2,
            CLUB_3,
            CLUB_4
        ]
        expect(getPossibleCardsToSetAside(playerGame, 6)).toEqual(expectedPossibleCardsToSetAside);
    })

    test(`Given a game with more than 6 cards that are not either oudlers nor trump nor king,
    and a player that set asides cards a trump, a king and an oudler and 3 correct cards,
    when verifying cards set aside,
    then returns the trump the king and the oudler`, () => {
        const playerGame: PlayingCard[] = [
            DIAMOND_1,
            DIAMOND_2,
            DIAMOND_3,
            CLUB_1,
            CLUB_2,
            CLUB_3,
            CLUB_4,
            CLUB_K,
            TRUMP_1,
            TRUMP_2,
            TRUMP_3,
            TRUMP_4,
            TRUMP_5,
            EXCUSE
        ]

        const setAsideCards: PlayingCard[] = [
            EXCUSE,
            CLUB_K,
            TRUMP_1,
            CLUB_1,
            CLUB_2,
            CLUB_3,
        ]
        expect(getIncorrectCardsSetAside(playerGame, setAsideCards)).toEqual([EXCUSE,
            CLUB_K,
            TRUMP_1]);

    })

    test(`Given a game with 5 cards that are not either oudlers nor trump nor king,
    and a player that set asides a trump, a king and an oudler and 3 correct cards,
    when verifying cards set aside,
    then returns the oudler and the king`, () => {
        const playerGame: PlayingCard[] = [
            DIAMOND_1,
            DIAMOND_2,
            DIAMOND_3,
            CLUB_1,
            CLUB_2,
            CLUB_K,
            TRUMP_1,
            TRUMP_2,
            TRUMP_3,
            TRUMP_4,
            TRUMP_5,
            EXCUSE
        ]

        const setAsideCards: PlayingCard[] = [
            EXCUSE,
            CLUB_K,
            TRUMP_2,
            CLUB_1,
            CLUB_2,
            CLUB_3,
        ]
        expect(getIncorrectCardsSetAside(playerGame, setAsideCards)).toEqual([EXCUSE, CLUB_K]);
    })

    test(`Given a game with 5 cards that are not either oudlers nor trump nor king,
    when getting possible cards to set aside,
    then return cards that are not king nor oudlers`, () => {
        const playerGame: PlayingCard[] = [
            DIAMOND_1,
            DIAMOND_2,
            DIAMOND_3,
            CLUB_1,
            CLUB_2,
            CLUB_K,
            TRUMP_1,
            TRUMP_2,
            TRUMP_3,
            TRUMP_4,
            TRUMP_5,
            EXCUSE
        ]

        const expectedPossibleCardsToSetAside: PlayingCard[] = [
            DIAMOND_1,
            DIAMOND_2,
            DIAMOND_3,
            CLUB_1,
            CLUB_2,
            TRUMP_2,
            TRUMP_3,
            TRUMP_4,
            TRUMP_5,
        ]
        expect(getPossibleCardsToSetAside(playerGame, 6)).toEqual(expectedPossibleCardsToSetAside);
    })

    test(`Given a game with 3 cards that are not either oudlers nor trump nor king,
    and a player that set asides 3 trumps and 3 correct cards,
    when verifying cards set aside,
    then no cards are returned`, () => {
        const playerGame: PlayingCard[] = [
            DIAMOND_1,
            DIAMOND_2,
            DIAMOND_3,
            CLUB_K,
            TRUMP_1,
            TRUMP_2,
            TRUMP_3,
            TRUMP_4,
            TRUMP_5,
            EXCUSE
        ]

        const setAsideCards: PlayingCard[] = [
            DIAMOND_1,
            DIAMOND_2,
            DIAMOND_3,
            TRUMP_2,
            TRUMP_3,
            TRUMP_4,
        ]
        expect(getIncorrectCardsSetAside(playerGame, setAsideCards)).toEqual([]);
    })

    test(`Given a game with 3 cards that are not either oudlers nor trump nor king,
    and a player that set asides 4 trumps and 2 correct cards,
    when verifying cards set aside,
    then a trump is returned`, () => {
        const playerGame: PlayingCard[] = [
            DIAMOND_1,
            DIAMOND_2,
            DIAMOND_3,
            CLUB_K,
            TRUMP_1,
            TRUMP_2,
            TRUMP_3,
            TRUMP_4,
            TRUMP_5,
            EXCUSE
        ]

        const setAsideCards: PlayingCard[] = [
            DIAMOND_1,
            DIAMOND_2,
            TRUMP_2,
            TRUMP_3,
            TRUMP_4,
            TRUMP_5,
        ]
        expect(getIncorrectCardsSetAside(playerGame, setAsideCards)).toEqual([TRUMP_5]);
    })
});
