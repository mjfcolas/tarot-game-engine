import {TarotPlayer} from "../player/tarot-player";
import {TarotTable} from "../table/ports/tarot-table";
import {TarotDealer} from "./tarot-dealer";
import {PlayingCard} from "tarot-card-deck";

export type DealtCards = {
    playersDecks: PlayingCard[][]
    dog: PlayingCard[]
}

export class DefaultTarotDealer implements TarotDealer{

    constructor(
        private readonly tarotTable: TarotTable,
        private readonly players: readonly TarotPlayer[],
        private readonly dealFunction: (deck: readonly PlayingCard[], numberOfPlayers: number, numberOfCardsInDog) => DealtCards) {
    }

    deal(): void {
        const dealtCards: DealtCards = this.dealFunction(this.tarotTable.gatherDeck(), this.players.length, 6);
        dealtCards.playersDecks
            .forEach((playerDeck, index) => playerDeck
                .forEach((currentCard) => this.tarotTable.giveCardTo(currentCard.identifier, this.players[index].id)))

        dealtCards.dog.forEach((currentCard) => this.tarotTable.putCardInDog(currentCard.identifier));

        this.players.forEach((player) => player.notify({
            type: "GOT_AVAILABLE_CARDS",
            cards: this.tarotTable.listCardsOf(player.id)
        }))
    }

}
