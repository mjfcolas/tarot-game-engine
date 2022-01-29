import {PlayableTable} from "../../domain/card-game/ports/playable-table";
import {PlayingCard} from "../../../../tarot-card-deck";
import {TarotTable} from "../../domain/tarot-game/table/ports/tarot-table";
import {PlayerIdentifier} from "../../domain/tarot-game/player/tarot-player";
import {Table} from "../../../../play-with-deck/dist/table/table";

const MAIN_DECK_IDENTIFIER = "MAIN";
const DOG_DECK_IDENTIFIER = "DOG"


export class PlayableTarotTable implements PlayableTable, TarotTable {

    private readonly table: Table<PlayingCard>

    constructor(deck: readonly PlayingCard[]) {
        this.table = Table.fromDeck<PlayingCard>(MAIN_DECK_IDENTIFIER, deck)
    }

    cut(): void {
        this.table.getPile(MAIN_DECK_IDENTIFIER).cut();
    }

    gatherDeck(): readonly PlayingCard[] {
        return this.table.gather(MAIN_DECK_IDENTIFIER);
    }

    getNumberOfRemainingCardsToPlay(): number {
        return 1;
    }

    shuffle(): void {
        this.table.getPile(MAIN_DECK_IDENTIFIER).shuffle();
    }

    giveCardTo(cardIdentifier: string, player: PlayerIdentifier): void {
        this.table.pick(cardIdentifier, MAIN_DECK_IDENTIFIER, player)
    }

    listCardsFor(player: PlayerIdentifier): PlayingCard[] {
        return this.table.getPile(player).list()
    }

    putCardInDog(cardIdentifier: string): void {
        this.table.pick(cardIdentifier, MAIN_DECK_IDENTIFIER, DOG_DECK_IDENTIFIER)
    }

}
