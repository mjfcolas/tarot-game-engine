import {PlayedCard, TurnResult} from "../../card-game/functions/resolve-turn";
import {PlayingCardType, Suit} from "tarot-card-deck/dist/cards/playing-card";
import {PlayingCard} from "tarot-card-deck";
import {PlayerIdentifier} from "../../card-game/player/card-game-player";
import {ClassicCard, isClassicCard, isTrumpCard, TrumpCard} from "../cards/card-types";

const faceValues = {
    "J": 11,
    "C": 12,
    "Q": 13,
    "K": 14
}

export function resolveTarotTurn(playedCards: readonly PlayedCard[]): TurnResult {
    const trumpPlayed: boolean = playedCards.some(playedCard => playedCard.playingCard.type === PlayingCardType.TRUMP);
    let winnerPlayedCard: PlayedCard;
    if (trumpPlayed) {
        winnerPlayedCard = [...playedCards]
            .filter(playedCard => isTrumpCard(playedCard.playingCard))
            .sort((a, b) => (b.playingCard as TrumpCard).value - (a.playingCard as TrumpCard).value)
            [0]
    } else {
        const masterPlayedCard: PlayingCard = [...playedCards]
            .filter(playedCard => isClassicCard(playedCard.playingCard))[0].playingCard
        const masterSuit: Suit = (masterPlayedCard as ClassicCard).suit;

        winnerPlayedCard = [...playedCards]
            .filter(playedCard => isClassicCard(playedCard.playingCard))
            .filter(playedCard => (playedCard.playingCard as ClassicCard).suit === masterSuit)
            .sort((a, b) => sortClassicCards(a.playingCard as ClassicCard, b.playingCard as ClassicCard))
            [0]
    }

    const players: PlayerIdentifier[] = playedCards.map(playedCard => playedCard.playerIdentifier);

    return {
        playedCards: playedCards,
        winner: winnerPlayedCard.playerIdentifier,
        wonCardsByPlayer: players.map(currentPlayer => {
            if (currentPlayer === winnerPlayedCard.playerIdentifier) {
                return {
                    playerIdentifier: currentPlayer,
                    wonCards: playedCards.map(playedCard => playedCard.playingCard),
                }
            } else {
                return {
                    playerIdentifier: currentPlayer,
                    wonCards: []
                }
            }
        })
    }
}

function sortClassicCards(a: ClassicCard, b: ClassicCard): number {
    return getValueFromCard(b) - getValueFromCard(a);
}

function getValueFromCard(card: ClassicCard): number {
    return card.type === PlayingCardType.CLASSIC ? card.value : faceValues[card.face];
}
