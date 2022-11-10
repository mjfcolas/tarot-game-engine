import {InitializeGamePhase} from "./initialize.game-phase";
import {MockedTarotTable} from "../../table/ports/__mock__/mocked-tarot-table";
import {MockedTarotDealer} from "../../dealer/__mock__/mocked-tarot-dealer";

describe(`Initialization`, () => {

    test(`Given a table, a dealer and a number of cards
    when initializing a game,
    then initialization is done`, (done) => {
        const table: MockedTarotTable = new MockedTarotTable();
        const dealer: MockedTarotDealer = new MockedTarotDealer();
        const numberOfCards = 6
        const phase: InitializeGamePhase = new InitializeGamePhase(table, dealer, numberOfCards);

        phase.execute().subscribe(() => {
            done()
            expect(table.shuffle).toHaveBeenCalled();
            expect(table.cut).toHaveBeenCalled();
            expect(dealer.deal).toHaveBeenCalled();
        })
    })
})
