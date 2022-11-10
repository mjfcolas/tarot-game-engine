import {GamePhase} from "../../game-phase";
import {TarotTable} from "../../table/ports/tarot-table";
import {TarotDealer} from "../../dealer/tarot-dealer";
import {Observable, of} from "rxjs";
import {TarotGameState} from "../../tarot-game";

export class InitializeGamePhase implements GamePhase<TarotGameState> {

    constructor(private readonly table: TarotTable,
                private readonly dealer: TarotDealer,
                private readonly numberOfCardsInDog) {
    }

    execute(): Observable<TarotGameState> {
        this.table.shuffle();
        this.table.cut();
        this.dealer.deal(this.numberOfCardsInDog);
        return of({});
    }
}
