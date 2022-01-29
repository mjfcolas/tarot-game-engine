import {TarotTable} from "./tarot-table";
import {Table} from "../../../../play-with-deck/src/table/table";
import {PlayingCard} from "../../../../tarot-card-deck/src";
import {CardDealer, DealtCards} from "../dealer/card-dealer";
import {TarotPlayer} from "../player/tarot-player";

const MAIN_DECK_IDENTIFIER = "MAIN";
const DOG_DECK_IDENTIFIER = "DOG"

export class DefaultTarotTable implements TarotTable {
    private readonly table: Table<PlayingCard>

    constructor(deck: readonly PlayingCard[], private readonly players: readonly TarotPlayer[], private readonly cardDealer: CardDealer) {
        this.table = Table.fromDeck<PlayingCard>(MAIN_DECK_IDENTIFIER, deck);
    }

    cut(): void {
        this.table.getPile(MAIN_DECK_IDENTIFIER).cut();
    }

    shuffle(): void {
        this.table.getPile(MAIN_DECK_IDENTIFIER).shuffle();
    }

    deal(): void {
        const dealtCards: DealtCards = this.cardDealer.deal(this.table.getPile(MAIN_DECK_IDENTIFIER).list(), this.players.length, 6);
        dealtCards.playersDecks
            .forEach((playerDeck, index) => playerDeck
                .forEach((currentCard) => this.table.pick(currentCard.identifier, MAIN_DECK_IDENTIFIER, this.players[index].id)))

        dealtCards.dog.forEach((currentCard) => this.table.pick(currentCard.identifier, MAIN_DECK_IDENTIFIER, DOG_DECK_IDENTIFIER))

        this.players.forEach((player) => player.notify({
            type: "GOT_AVAILABLE_CARDS",
            cards: this.table.getPile(player.id).list()
        }))
    }

    gatherDeck(): readonly PlayingCard[] {
        return this.table.gather(MAIN_DECK_IDENTIFIER)
    }

    getNumberOfRemainingCardsToPlay(): number {
        return 1;
    }

}
