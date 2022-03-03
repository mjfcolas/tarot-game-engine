import {PlayingCard} from "tarot-card-deck";
import {
    CLUB_10,
    CLUB_K,
    HEART_3,
    HEART_4,
    HEART_5,
    JOKER,
    SPADE_3,
    SPADE_4,
    TRUMP_1, TRUMP_10,
    TRUMP_14,
    TRUMP_18,
    TRUMP_2,
    TRUMP_20,
    TRUMP_5
} from "tarot-card-deck/dist/cards/all-playing-cards";
import {getPlayableTarotCards} from "./tarot-playable-cards";

describe(`Get playable tarot cards`, () => {

    const handWithHeartsAndTrumps: PlayingCard[] = [
        TRUMP_1, TRUMP_5, TRUMP_20, HEART_4, HEART_5
    ]
    const handWithHeartsAndExcuse: PlayingCard[] = [
        TRUMP_1, JOKER, HEART_4, HEART_5
    ]
    const handWithSpadesAndLowTrumps: PlayingCard[] = [
        SPADE_3, SPADE_4, TRUMP_1, TRUMP_2
    ]
    const handWithSpadesLowAndBigTrumps: PlayingCard[] = [
        SPADE_3, SPADE_4, TRUMP_1, TRUMP_2, TRUMP_18, TRUMP_20
    ]
    const handWithSpadesAndClubs: PlayingCard[] = [
        SPADE_3, SPADE_4, CLUB_10, CLUB_K
    ]
    const handWithHeartsAndSpades: PlayingCard[] = [
        HEART_4, HEART_5, SPADE_3, SPADE_4
    ]

    const noCards: PlayingCard[] = [];
    const aHeart: PlayingCard[] = [HEART_3]
    const aHeartAndAMediumTrump: PlayingCard[] = [HEART_3, TRUMP_14]
    const excuseAndHeart: PlayingCard[] = [JOKER, HEART_3]
    const trumpAndHeart: PlayingCard[] = [TRUMP_10, HEART_3]
    const excuse: PlayingCard[] = [JOKER]

    test(`Given no cards played has first card,
        when getting playable tarot cards,
        then return all cards`, () => {
        expect(getPlayableTarotCards(noCards, handWithHeartsAndTrumps)).toEqual(handWithHeartsAndTrumps);
    });

    test(`Given a heart played has first card and a player that has heart in his hand,
        when getting playable tarot cards,
        then return hearts`, () => {
        const expectedPlayableCards: PlayingCard[] = [HEART_4, HEART_5];
        expect(getPlayableTarotCards(aHeart, handWithHeartsAndTrumps)).toEqual(expectedPlayableCards);
    });

    test(`Given a heart played has first card and a player that has heart and excuse in his hand,
        when getting playable tarot cards,
        then return hearts and excuse`, () => {
        const expectedPlayableCards: PlayingCard[] = [HEART_4, HEART_5, JOKER];
        expect(getPlayableTarotCards(aHeart, handWithHeartsAndExcuse)).toEqual(expectedPlayableCards);
    });

    test(`Given a heart played has first card and a player that does not have hearts but trumps in his hand,
        when getting playable tarot cards,
        then return trumps`, () => {
        const expectedPlayableCards: PlayingCard[] = [TRUMP_1, TRUMP_2];
        expect(getPlayableTarotCards(aHeart, handWithSpadesAndLowTrumps)).toEqual(expectedPlayableCards);
    });

    test(`Given a heart played has first card and a player that does not have hearts nor trumps in his hand,
        when getting playable tarot cards,
        then return all remaining cards`, () => {
        expect(getPlayableTarotCards(aHeart, handWithSpadesAndClubs)).toEqual(handWithSpadesAndClubs);
    });

    test(`Given a heart played has first card, trump has second card and a player that has hearts in his hand,
        when getting playable tarot cards,
        then return hearts`, () => {
        const expectedPlayableCards: PlayingCard[] = [HEART_4, HEART_5];
        expect(getPlayableTarotCards(aHeartAndAMediumTrump, handWithHeartsAndTrumps)).toEqual(expectedPlayableCards);
    });

    test(`Given a heart played has first card, trump has second card and a player that does not have hearts but trump over played trump in his hand,
        when getting playable tarot cards,
        then return trumps over trumps played`, () => {
        const expectedPlayableCards: PlayingCard[] = [TRUMP_18, TRUMP_20];
        expect(getPlayableTarotCards(aHeartAndAMediumTrump, handWithSpadesLowAndBigTrumps)).toEqual(expectedPlayableCards);
    });

    test(`Given a heart played has first card, trump has second card and a player that does not have hearts but trump below played trump in his hand,
        when getting playable tarot cards,
        then return all trumps`, () => {
        const expectedPlayableCards: PlayingCard[] = [TRUMP_1, TRUMP_2];
        expect(getPlayableTarotCards(aHeartAndAMediumTrump, handWithSpadesAndLowTrumps)).toEqual(expectedPlayableCards);
    });

    test(`Given excuse played has first card, heart has second card and a player that does have hearts in its hand,
        when getting playable tarot cards,
        then return all hearts`, () => {
        const expectedPlayableCards: PlayingCard[] = [HEART_4, HEART_5];
        expect(getPlayableTarotCards(excuseAndHeart, handWithHeartsAndTrumps)).toEqual(expectedPlayableCards);
    });

    test(`Given excuse played has first and a player that does have cards in its hand,
        when getting playable tarot cards,
        then return all cards`, () => {
        expect(getPlayableTarotCards(excuse, handWithHeartsAndTrumps)).toEqual(handWithHeartsAndTrumps);
    });

    test(`Given a trump played has first card, a heart played as second card and a player that does have hearts and trumps in its game,
        when getting playable tarot cards,
        then return trumps over first played trump`, () => {
        const expectedPlayableCards: PlayingCard[] = [TRUMP_20];
        expect(getPlayableTarotCards(trumpAndHeart, handWithHeartsAndTrumps)).toEqual(expectedPlayableCards);
    });

    test(`Given a trump played has first card, a heart played as second card and a player that does have hearts and spades in its game,
        when getting playable tarot cards,
        then return hearts and spades`, () => {
        expect(getPlayableTarotCards(trumpAndHeart, handWithHeartsAndSpades)).toEqual(handWithHeartsAndSpades);
    });
})
