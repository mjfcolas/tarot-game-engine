import {Observable} from "rxjs";
import {Poignee} from "./poignee";
import {PlayingCard} from "tarot-card-deck";

export interface PlayerPoigneeManager {
    announcePoignee(shownCards: PlayingCard[]);

    declinePoignee();

    observePoigneeAnnounce(): Observable<Poignee>
}
