import {GameResultWithDeck, TarotGame} from "./domain/tarot-game/tarot-game";
import {DefaultTarotDealer} from "./domain/tarot-game/dealer/default-tarot-dealer";
import {TarotPlayer} from "./domain/tarot-game/player/tarot-player";
import {PlayingCard} from "../../tarot-card-deck/src";
import {AnnounceManager} from "./domain/tarot-game/announce/announce-manager";
import {DefaultAnnounceManager} from "./domain/tarot-game/announce/default-announce-manager";
import {CardGameManager} from "./domain/card-game/card-game-manager";
import {DefaultCardGameManager} from "./domain/card-game/default-card-game-manager";
import {resolveTarotTurn} from "./domain/tarot-game/functions/tarot-turn-resolver";
import {getPlayableTarotCards} from "./domain/tarot-game/functions/tarot-playable-cards";
import {dealTarotCards} from "./domain/tarot-game/functions/tarot-card-dealer";
import {TarotDealer} from "./domain/tarot-game/dealer/tarot-dealer";
import {PlayableTarotTable} from "./infrastructure/table/playable-tarot-table";
import {DECK_78} from "../../tarot-card-deck";

export function getTarotGame(
    playingCards: readonly PlayingCard[],
    players: readonly TarotPlayer[],
    endOfGameCallback: (gameResult: GameResultWithDeck) => void
): TarotGame {
    const table: PlayableTarotTable = new PlayableTarotTable(DECK_78)
    const announceManager: AnnounceManager = new DefaultAnnounceManager(players);
    const cardGameManager: CardGameManager = new DefaultCardGameManager(resolveTarotTurn, getPlayableTarotCards, table);
    const dealer: TarotDealer = new DefaultTarotDealer(table, players, dealTarotCards)
    return new TarotGame(players, table, dealer, announceManager, cardGameManager, endOfGameCallback);
}
