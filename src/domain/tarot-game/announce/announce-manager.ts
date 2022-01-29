import {TarotPlayer} from "../player/tarot-player";
import {Announce} from "./announce";
import {TakerAnnounce} from "./taker-announce";
import {Observable} from "rxjs";

export interface AnnounceManager{
    beginAnnounces(): void
    announce(playerThatAnnounce: TarotPlayer, announce?: Announce): void
    announcesAreComplete(): Observable<TakerAnnounce>
}
