import {DefaultTarotDealer} from "./default-tarot-dealer";
import {DummyTarotPlayer} from "../player/__dummy__/dummy-tarot-player";
import {DECK_78} from "../../../../../tarot-card-deck";
import {dealTarotCards} from "../functions/tarot-card-dealer";
import {TarotTable} from "../table/ports/tarot-table";
import {PlayableTarotTable} from "../../../infrastructure/table/playable-tarot-table";

describe('Tarot dealer', function () {
    const table: TarotTable = new PlayableTarotTable(DECK_78)
    const players: DummyTarotPlayer[] = [
        new DummyTarotPlayer("1"),
        new DummyTarotPlayer("2"),
        new DummyTarotPlayer("3"),
        new DummyTarotPlayer("4")
    ]

    test(`Given a tarot table, 
    when dealing cards, 
    then cards are distributed and games are emitted to each players`, () => {
        const tarotTable: DefaultTarotDealer = new DefaultTarotDealer(table, players, dealTarotCards)
        tarotTable.deal();
        const expectedNumberOfCards = 18;
        expect(players[0].availableCards.length).toEqual(expectedNumberOfCards);
        expect(players[1].availableCards.length).toEqual(expectedNumberOfCards);
        expect(players[2].availableCards.length).toEqual(expectedNumberOfCards);
        expect(players[3].availableCards.length).toEqual(expectedNumberOfCards);
    })
});
