import {Announce} from "../announce/announce";
import {countFourPlayersTarotScore, EndGameScore, EndGameStatus} from "./count-tarot-end-game-score";
import {Poignee} from "../poignee/poignee";

describe('Count tarot end game scores', function () {

    const testCases: { parameters: EndGameStatus, expectedResult: EndGameScore }[] = [{
        parameters: {
            announce: Announce.GARDE,
            attackNumberOfPoints: 49,
            poignee: Poignee.SIMPLE,
            petitInLastTrick: "ATTACK",
            attackNumberOfOudlers: 2,
        },
        expectedResult: {
            attackScoreByPlayer: 318,
            defenseScoreByPlayer: -106
        }
    }, {
        parameters: {
            announce: Announce.GARDE_SANS,
            attackNumberOfPoints: 55,
            poignee: null,
            petitInLastTrick: "DEFENSE",
            attackNumberOfOudlers: 1,
        },
        expectedResult: {
            attackScoreByPlayer: 228,
            defenseScoreByPlayer: -76
        }
    }, {
        parameters: {
            announce: Announce.GARDE_CONTRE,
            attackNumberOfPoints: 55,
            poignee: Poignee.TRIPLE,
            petitInLastTrick: null,
            attackNumberOfOudlers: 3,
        },
        expectedResult: {
            attackScoreByPlayer: 912,
            defenseScoreByPlayer: -304
        }
    }, {
        parameters: {
            announce: Announce.PRISE,
            attackNumberOfPoints: 49,
            poignee: Poignee.SIMPLE,
            petitInLastTrick: "ATTACK",
            attackNumberOfOudlers: 0,
        },
        expectedResult: {
            attackScoreByPlayer: -126,
            defenseScoreByPlayer: 42
        }
    }, {
        parameters: {
            announce: Announce.GARDE,
            attackNumberOfPoints: 52,
            poignee: Poignee.SIMPLE,
            petitInLastTrick: null,
            attackNumberOfOudlers: 2,
        },
        expectedResult: {
            attackScoreByPlayer: 276,
            defenseScoreByPlayer: -92
        }
    }, {
        parameters: {
            announce: Announce.PRISE,
            attackNumberOfPoints: 56,
            poignee: Poignee.DOUBLE,
            petitInLastTrick: null,
            attackNumberOfOudlers: 0,
        },
        expectedResult: {
            attackScoreByPlayer: 165,
            defenseScoreByPlayer: -55
        }
    }]

    test.each(testCases)(`Given %p, when counting scores, then returns %p`, (testCase) => {
        const result = countFourPlayersTarotScore(testCase.parameters);
        const expectedResult = testCase.expectedResult;
        expect(result.attackScoreByPlayer).toBe(expectedResult.attackScoreByPlayer)
        expect(result.defenseScoreByPlayer).toBe(expectedResult.defenseScoreByPlayer)
    })

});
