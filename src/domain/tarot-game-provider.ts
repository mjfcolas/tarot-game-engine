import {GameResult, TarotGame} from "./game/tarot-game";
import {DefaultTarotTable} from "./table/default-tarot-table";
import {TarotPlayer} from "./player/tarot-player";
import {PlayingCard} from "../../../tarot-card-deck/src";
import {DefaultCardDealer} from "./dealer/default-card-dealer";
import {TarotTable} from "./table/tarot-table";
import {CardDealer} from "./dealer/card-dealer";
import {AnnounceManager} from "./announce/announce-manager";
import {DefaultAnnounceManager} from "./announce/default-announce-manager";

export function getTarotGame(
    playingCards: readonly PlayingCard[],
    players: readonly TarotPlayer[],
    endOfGameCallback: (gameResult: GameResult) => void
): TarotGame {
    const cardDealer: CardDealer = new DefaultCardDealer();
    const table: TarotTable = new DefaultTarotTable(playingCards, players, cardDealer);
    const announceManager: AnnounceManager = new DefaultAnnounceManager(players);
    return new TarotGame(players, table, announceManager, endOfGameCallback);
}
