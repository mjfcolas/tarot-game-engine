import {PlayableTable} from "../../domain/card-game/ports/playable-table";
import {TarotTable} from "../../domain/tarot-game/table/ports/tarot-table";
import {PlayingCard} from "tarot-card-deck";
import {Table} from "play-with-deck/dist/table/table";
import {PlayerIdentifier} from "../../domain/card-game/player/card-game-player";

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

    getCardsFor(playerIdentifier: PlayerIdentifier): PlayingCard[] {
        return [];
    }

    listCardsOf(playerIdentifier: PlayerIdentifier): PlayingCard[] {
        return [];
    }

    moveCardOfPlayerToTable(cardToMove: PlayingCard, playerThatPlay: PlayerIdentifier): void {
    }

    moveToPointsOf(wonCards: PlayingCard[], playerThatGetCards: PlayerIdentifier): void {
    }

}
