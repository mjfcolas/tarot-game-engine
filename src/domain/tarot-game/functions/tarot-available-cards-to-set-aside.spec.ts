import {PlayingCard} from "tarot-card-deck";
import {
    CLUB_1,
    CLUB_2,
    CLUB_3,
    CLUB_4,
    CLUB_K,
    DIAMOND_1,
    DIAMOND_2,
    DIAMOND_3,
    JOKER,
    TRUMP_1,
    TRUMP_2,
    TRUMP_3,
    TRUMP_4,
    TRUMP_5
} from "tarot-card-deck/dist/cards/all-playing-cards";
import {defaultGetAvailableCardsToSetAside} from "./tarot-available-cards-to-set-aside";

describe('Available Cards to set aside', function () {

    test(`Given a game with more than 6 cards that are not either oudlers nor trump nor king,
    when getting available cards to set aside,
    then all cards that are not oudlers nor trump nor king are returned`, () => {
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
            JOKER
        ]

        const expectedCards: PlayingCard[] = [
            DIAMOND_1,
            DIAMOND_2,
            DIAMOND_3,
            CLUB_1,
            CLUB_2,
            CLUB_3,
            CLUB_4
        ]
        expect(defaultGetAvailableCardsToSetAside(playerGame)).toEqual(expectedCards);
    })
});
