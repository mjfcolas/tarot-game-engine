import {PlayableTable} from "../../domain/card-game/ports/playable-table";
import {TarotTable} from "../../domain/tarot-game/table/ports/tarot-table";
import {PlayingCard} from "tarot-card-deck";
import {Table} from "play-with-deck/dist/table/table";
import {PlayerIdentifier} from "../../domain/card-game/player/card-game-player";

const MAIN_DECK_IDENTIFIER = "MAIN";
const DOG_DECK_IDENTIFIER = "DOG"
const TABLE_IDENTIFIER = "TABLE"
const PLAYER_PREFIX = "PLAYER"
const POINTS_PREFIX = "POINTS"

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

    getNumberOfRemainingCardsToPlayFor(player: PlayerIdentifier): number {
        return this.listCardsOf(player).length;
    }

    shuffle(): void {
        this.table.getPile(MAIN_DECK_IDENTIFIER).shuffle();
    }

    giveCardTo(cardIdentifier: string, player: PlayerIdentifier): void {
        this.table.pick(cardIdentifier, MAIN_DECK_IDENTIFIER, PLAYER_PREFIX + player)
    }

    listCardsOf(player: PlayerIdentifier): PlayingCard[] {
        return this.table.getPile(PLAYER_PREFIX + player).list()
    }

    putCardInDog(cardIdentifier: string): void {
        this.table.pick(cardIdentifier, MAIN_DECK_IDENTIFIER, DOG_DECK_IDENTIFIER)
    }

    moveCardOfPlayerToTable(cardToMove: PlayingCard, playerThatPlay: PlayerIdentifier): void {
        this.table.pick(cardToMove.identifier, PLAYER_PREFIX + playerThatPlay, TABLE_IDENTIFIER)
    }

    moveToPointsOf(wonCards: PlayingCard[], playerThatGetCards: PlayerIdentifier): void {
        wonCards.forEach(wonCard => this.table.pick(wonCard.identifier, TABLE_IDENTIFIER, POINTS_PREFIX + playerThatGetCards))
    }

    giveDogToPlayer(player: PlayerIdentifier): void {
        this.table.getPile(DOG_DECK_IDENTIFIER).list().forEach(dogCard => this.table.pick(dogCard.identifier, DOG_DECK_IDENTIFIER, PLAYER_PREFIX + player))
    }

    listPointsFor(player: PlayerIdentifier): PlayingCard[] {
        return this.table.getPile(POINTS_PREFIX + player).list();
    }
}
