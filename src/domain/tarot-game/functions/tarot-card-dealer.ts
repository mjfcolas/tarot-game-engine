import {PlayingCard} from "../../../../../tarot-card-deck/src";
import {DealtCards} from "../dealer/default-tarot-dealer";

export function dealTarotCards(deck: PlayingCard[], numberOfPlayers: number, numberOfCardsInDog): DealtCards {
    const result = {
        playersDecks: [[], [], [], []],
        dog: []
    }
    for (let i = 0; i < 72; i++) {
        result.playersDecks[i % 4].push(deck[i])
    }
    for (let i = 72; i < 78; i++) {
        result.dog.push(deck[i])
    }
    return result;
}
