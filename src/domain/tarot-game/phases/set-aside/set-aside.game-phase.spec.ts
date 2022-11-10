import {TarotGameState} from "../../tarot-game";
import {DECK_78} from "tarot-card-deck";
import {SetAsideGamePhase} from "./set-aside.game-phase";
import {MockedTarotTable} from "../../table/ports/__mock__/mocked-tarot-table";
import {DummyTarotPlayer} from "../../player/__dummy__/dummy-tarot-player";

describe(`Set aside`, () => {

    const aPlayerIdentifier = "1";
    let aPlayer;
    const aNumberOfCardsInDog = 6
    const table: MockedTarotTable = new MockedTarotTable();
    const mockedGetIncorrectCardsSetAside = jest.fn();
    const mockedGetPossibleCardsToSetAside = jest.fn();

    let phase: SetAsideGamePhase

    beforeEach(() => {
        aPlayer = new DummyTarotPlayer(aPlayerIdentifier);
        phase = new SetAsideGamePhase(table, aNumberOfCardsInDog, mockedGetIncorrectCardsSetAside, mockedGetPossibleCardsToSetAside)
    })

    test(`Given set aside game phase with input state stating that taker has to set aside,
    when executing phase,
    then taker is notify that he has to set aside cards and available cards to set aside are provided`, () => {
        const availableCardsToSetAside = [DECK_78[0], DECK_78[1]];
        mockedGetPossibleCardsToSetAside.mockReturnValue(availableCardsToSetAside)
        const inputState: TarotGameState = {
            hasToSetAside: true,
            taker: aPlayer
        }
        phase.execute(inputState);
        expect(aPlayer.hasToSetAside).toHaveBeenCalledWith(availableCardsToSetAside)
    })

    test(`Given set aside game phase with input state stating that taker does not have to set aside,
    when executing phase,
    then taker is not notify that he has to set aside and end of phase is emitted`, (done) => {
        const availableCardsToSetAside = [DECK_78[0], DECK_78[1]];
        mockedGetPossibleCardsToSetAside.mockReturnValue(availableCardsToSetAside)
        const inputState: TarotGameState = {
            hasToSetAside: false,
            taker: aPlayer
        }
        phase.execute(inputState).subscribe(() => {
            expect(aPlayer.hasToSetAside).not.toHaveBeenCalled()
            done()
        })

    })

    test(`Given a determined taker,
    when the taker set asides correct cards,
    then taker is notified with available cards and end of phase is emitted`, (done) => {
        mockedGetIncorrectCardsSetAside.mockReturnValue([])
        table.listCardsOf.mockReturnValue([])

        const inputState: TarotGameState = {
            hasToSetAside: true,
            taker: aPlayer
        }
        phase.execute(inputState).subscribe(() => {
            done()
        })
        expect(aPlayer.availableCardsAreKnown).toHaveBeenCalled()
        phase.setAside(aPlayer, DECK_78.slice(0, 6));
    })

    test(`Given a determined taker,
    when the taker set asides an incorrect number of cards,
    then the player is notified that he cannot perform this action`, () => {
        const inputState: TarotGameState = {
            hasToSetAside: true,
            taker: aPlayer
        }
        phase.execute(inputState)
        phase.setAside(aPlayer, DECK_78.slice(10, 14));
        expect(aPlayer.setAsideError).toHaveBeenCalled()

    })

    test(`Given a determined taker,
    when the taker set asides disallowed cards,
    then the player is notified that he cannot perform this action`, () => {
        mockedGetIncorrectCardsSetAside.mockReturnValue(DECK_78.slice(10, 13))

        const inputState: TarotGameState = {
            hasToSetAside: true,
            taker: aPlayer
        }
        phase.execute(inputState)
        phase.setAside(aPlayer, DECK_78.slice(10, 16));
        expect(aPlayer.setAsideError).toHaveBeenCalled()

    })

    test(`Given no determined taker,
    when a player try to set cards aside,
    then the player is notified that he cannot perform this action`, () => {
        const inputState: TarotGameState = {
            taker: undefined
        }
        phase.execute(inputState)
        phase.setAside(aPlayer, []);
        expect(aPlayer.setAsideError).toHaveBeenCalled()

    })

    test(`Given a taker that has already set aside cards,
    when the taker try to set cards aside,
    then the player is notified that he cannot perform this action`, () => {
        mockedGetIncorrectCardsSetAside.mockReturnValue([])
        table.listCardsOf.mockReturnValue([])

        const inputState: TarotGameState = {
            hasToSetAside: true,
            taker: aPlayer
        }
        phase.execute(inputState)
        phase.setAside(aPlayer, DECK_78.slice(0, 6));
        phase.setAside(aPlayer, DECK_78.slice(0, 6));
        expect(aPlayer.setAsideError).toHaveBeenCalled()
    })

    test(`Given a determined taker,
    when a player that is not the taker try to set cards aside,
    then the player is notifies that he cannot perform this action`, () => {
        mockedGetIncorrectCardsSetAside.mockReturnValue([])
        table.listCardsOf.mockReturnValue([])

        const anotherPlayer = new DummyTarotPlayer("another")
        const inputState: TarotGameState = {
            hasToSetAside: true,
            taker: aPlayer
        }
        phase.execute(inputState)
        phase.setAside(anotherPlayer, DECK_78.slice(0, 6));
        expect(anotherPlayer.setAsideError).toHaveBeenCalled()
    })
});
