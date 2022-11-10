import {Observable} from "rxjs";

export interface GamePhase<T> {
    execute(inputState: T): Observable<T>
}
