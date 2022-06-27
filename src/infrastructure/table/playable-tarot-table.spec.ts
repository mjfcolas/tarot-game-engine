import {DECK_78} from "tarot-card-deck";
import {PlayableTarotTable} from "./playable-tarot-table";

describe('Playable Tarot Table', function () {

    const aDeck = DECK_78;

    test(`Given a table, 
    when cutting,
    then the main deck of the table is cut`, () => {
        const table: PlayableTarotTable = new PlayableTarotTable(aDeck);
        table.cut();
        expect(table.gatherDeck().length).toEqual(aDeck.length);
        expect(table.gatherDeck()[0]).not.toEqual(aDeck[0]);
    })

    test(`Given a table, 
    when gathering cards,
    then cards are gathered`, () => {
        const table: PlayableTarotTable = new PlayableTarotTable(aDeck);
        table.giveCardTo(DECK_78[0].identifier, "PLAYER")
        expect(table.gatherDeck().length).toEqual(aDeck.length);
    })

    test(`Given a table, 
    when getting number of remaining cards to play for a player,
    then returns the number of remaining cards to play`, () => {
        const table: PlayableTarotTable = new PlayableTarotTable(aDeck);
        table.giveCardTo(DECK_78[0].identifier, "P0")
        expect(table.getNumberOfRemainingCardsToPlayFor("P0")).toEqual(1);
    })

    test(`Given a table, 
    when shuffling,
    then the main deck of the table is shuffled`, () => {
        const table: PlayableTarotTable = new PlayableTarotTable(aDeck);
        table.shuffle();
        expect(table.gatherDeck().length).toEqual(aDeck.length);
        expect(table.gatherDeck()).not.toEqual(aDeck);
    })

    test(`Given a table, 
    when giving a card to a player,
    then a card is moved from the main deck to the player's deck`, () => {
        const table: PlayableTarotTable = new PlayableTarotTable(aDeck);
        table.giveCardTo(DECK_78[0].identifier, "PLAYER")
        expect(table.listCardsOf("PLAYER")).toEqual([DECK_78[0]]);
    })

    test(`Given a table, 
    when putting cards in dog and giving the dog to a player hand,
    then a player has those cards in its deck`, () => {
        const table: PlayableTarotTable = new PlayableTarotTable(aDeck);
        table.putCardInDog(DECK_78[0].identifier)
        table.putCardInDog(DECK_78[1].identifier)

        table.giveDogToPlayerHand("PLAYER")
        expect(table.listCardsOf("PLAYER")).toEqual([
            DECK_78[0],
            DECK_78[1]
        ]);
    })

    test(`Given a table, 
    when putting cards in dog and giving the dog to a player points,
    then the player has those cards in its points`, () => {
        const table: PlayableTarotTable = new PlayableTarotTable(aDeck);
        table.putCardInDog(DECK_78[0].identifier)
        table.putCardInDog(DECK_78[1].identifier)

        table.giveDogToPlayerPoints("PLAYER")
        expect(table.listPointsFor("PLAYER")).toEqual([
            DECK_78[0],
            DECK_78[1]
        ]);
    })

    test(`Given a table, 
    when moving a player's card on the table and moving the card to points of an other player,
    then the second player has this card in its points`, () => {
        const table: PlayableTarotTable = new PlayableTarotTable(aDeck);
        table.giveCardTo(DECK_78[0].identifier, "P1")
        table.moveCardOfPlayerToTable(DECK_78[0], "P1")
        table.moveFromTableToPointsOf([DECK_78[0]], "P2")
        expect(table.listPointsFor("P2")).toEqual([DECK_78[0]]);
    })
});
