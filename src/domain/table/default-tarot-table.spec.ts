import {DefaultTarotTable} from "./default-tarot-table";
import {DummyTarotPlayer} from "../player/dummy/dummy-tarot-player";
import {DECK_78, PlayingCard} from "../../../../tarot-card-deck";
import {CardDealer} from "../dealer/card-dealer";
import {DefaultCardDealer} from "../dealer/default-card-dealer";

describe('Default tarot table', function () {
    const cardDealer: CardDealer = new DefaultCardDealer();
    const playingCardDeck: readonly PlayingCard[] = DECK_78;
    const players: DummyTarotPlayer[] = [
        new DummyTarotPlayer("1"),
        new DummyTarotPlayer("2"),
        new DummyTarotPlayer("3"),
        new DummyTarotPlayer("4")
    ]

    test(`Given a tarot table, 
    when dealing cards, 
    then cards are distributed and games are emitted to each players`, () => {
        const tarotTable: DefaultTarotTable = new DefaultTarotTable(playingCardDeck, players, cardDealer)
        tarotTable.deal();
        const expectedNumberOfCards = 18;
        expect(players[0].availableCards.length).toEqual(expectedNumberOfCards);
        expect(players[1].availableCards.length).toEqual(expectedNumberOfCards);
        expect(players[2].availableCards.length).toEqual(expectedNumberOfCards);
        expect(players[3].availableCards.length).toEqual(expectedNumberOfCards);
    })
});
