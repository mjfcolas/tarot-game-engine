import {GameResultWithDeck, TarotGame} from "./domain/tarot-game/tarot-game";
import {DealFunction, DefaultTarotDealer} from "./domain/tarot-game/dealer/default-tarot-dealer";
import {TarotPlayer} from "./domain/tarot-game/player/tarot-player";
import {AnnounceManager} from "./domain/tarot-game/announce/announce-manager";
import {DefaultAnnounceManager} from "./domain/tarot-game/announce/default-announce-manager";
import {CardGameManager} from "./domain/card-game/card-game-manager";
import {DefaultCardGameManager} from "./domain/card-game/default-card-game-manager";
import {resolveTarotTurn} from "./domain/tarot-game/functions/tarot-turn-resolver";
import {getPlayableTarotCards} from "./domain/tarot-game/functions/tarot-playable-cards";
import {dealTarotCards} from "./domain/tarot-game/functions/tarot-card-dealer";
import {TarotDealer} from "./domain/tarot-game/dealer/tarot-dealer";
import {PlayableTarotTable} from "./infrastructure/table/playable-tarot-table";
import {DECK_78, PlayingCard} from "tarot-card-deck";
import {
    getIncorrectCardsSetAside,
    getPossibleCardsToSetAside
} from "./domain/tarot-game/functions/tarot-available-cards-to-set-aside";
import {countTarotEndGameTakerPoints} from "./domain/tarot-game/functions/count-tarot-end-game-taker-points";
import {countFourPlayersTarotScore} from "./domain/tarot-game/functions/count-tarot-end-game-score";

export function getTarotGame(
    playingCards: readonly PlayingCard[],
    players: readonly TarotPlayer[],
    endOfGameCallback: (gameResult: GameResultWithDeck) => void,
): TarotGame {
    return getTarotGameWithCustomDealFunction(playingCards, players, endOfGameCallback, dealTarotCards)
}

export function getTarotGameWithCustomDealFunction(
    playingCards: readonly PlayingCard[],
    players: readonly TarotPlayer[],
    endOfGameCallback: (gameResult: GameResultWithDeck) => void,
    dealFunction: DealFunction
): TarotGame {
    const table: PlayableTarotTable = new PlayableTarotTable(DECK_78)
    const announceManager: AnnounceManager = new DefaultAnnounceManager(players);
    const cardGameManager: CardGameManager = new DefaultCardGameManager(resolveTarotTurn, getPlayableTarotCards, table, players);
    const dealer: TarotDealer = new DefaultTarotDealer(table, players, dealFunction)
    return new TarotGame(players, table, dealer, announceManager, cardGameManager, getIncorrectCardsSetAside, getPossibleCardsToSetAside, countTarotEndGameTakerPoints, countFourPlayersTarotScore, endOfGameCallback);
}
