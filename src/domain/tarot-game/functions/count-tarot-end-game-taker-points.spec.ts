import {countTarotEndGameTakerPoints} from "./count-tarot-end-game-taker-points";
import {
    EXCUSE,
    HEART_1,
    HEART_2,
    HEART_3,
    HEART_4,
    HEART_C,
    HEART_J,
    HEART_K,
    HEART_Q,
    PlayingCard,
    TRUMP_1,
    TRUMP_21
} from "tarot-card-deck";


describe('Count tarot end game taker points', function () {

    test(`Given taker that has won 4 small cards and that did not have excuse at start of game,
        when counting his points,
        then returns expected number of points`, () => {
        const wonCards: PlayingCard[] = [HEART_1, HEART_2, HEART_3, HEART_4];
        expect(countTarotEndGameTakerPoints(wonCards, false)).toEqual(2)
    });

    test(`Given taker that has won 3 small cards and a king and that did not have excuse at start of game,
        when counting his points,
        then returns expected number of points`, () => {
        const wonCards: PlayingCard[] = [HEART_1, HEART_2, HEART_3, HEART_K];
        expect(countTarotEndGameTakerPoints(wonCards, false)).toEqual(6)
    });

    test(`Given taker that has won 3 small cards and a queen and that did not have excuse at start of game,
        when counting his points,
        then returns expected number of points`, () => {
        const wonCards: PlayingCard[] = [HEART_1, HEART_2, HEART_3, HEART_Q];
        expect(countTarotEndGameTakerPoints(wonCards, false)).toEqual(5)
    });

    test(`Given taker that has won 3 small cards and a cavalier and that did not have excuse at start of game,
        when counting his points,
        then returns expected number of points`, () => {
        const wonCards: PlayingCard[] = [HEART_1, HEART_2, HEART_3, HEART_C];
        expect(countTarotEndGameTakerPoints(wonCards, false)).toEqual(4)
    });

    test(`Given taker that has won 3 small cards and a jack and that did not have excuse at start of game,
        when counting his points,
        then returns expected number of points`, () => {
        const wonCards: PlayingCard[] = [HEART_1, HEART_2, HEART_3, HEART_J];
        expect(countTarotEndGameTakerPoints(wonCards, false)).toEqual(3)
    });

    test(`Given taker that has won 3 small cards and the one of trump and that did not have excuse at start of game,
        when counting his points,
        then returns expected number of points`, () => {
        const wonCards: PlayingCard[] = [HEART_1, HEART_2, HEART_3, TRUMP_1];
        expect(countTarotEndGameTakerPoints(wonCards, false)).toEqual(6)
    });

    test(`Given taker that has won 3 small cards and the 21 of trump and that did not have excuse at start of game,
        when counting his points,
        then returns expected number of points`, () => {
        const wonCards: PlayingCard[] = [HEART_1, HEART_2, HEART_3, TRUMP_21];
        expect(countTarotEndGameTakerPoints(wonCards, false)).toEqual(6)
    });

    test(`Given taker that has won 3 small cards and the excuse and that did not have excuse at start of game,
        when counting his points,
        then returns expected number of points`, () => {
        const wonCards: PlayingCard[] = [HEART_1, HEART_2, HEART_3, EXCUSE];
        expect(countTarotEndGameTakerPoints(wonCards, false)).toEqual(2)
    });

    test(`Given taker that has won 3 small cards and the excuse and that has excuse at start of game,
        when counting his points,
        then returns expected number of points`, () => {
        const wonCards: PlayingCard[] = [HEART_1, HEART_2, HEART_3, EXCUSE];
        expect(countTarotEndGameTakerPoints(wonCards, true)).toEqual(6)
    });

    test(`Given taker that has won 4 small cards and that has excuse at start of game,
        when counting his points,
        then returns expected number of points`, () => {
        const wonCards: PlayingCard[] = [HEART_1, HEART_2, HEART_3, HEART_4];
        expect(countTarotEndGameTakerPoints(wonCards, true)).toEqual(6)
    });
});
