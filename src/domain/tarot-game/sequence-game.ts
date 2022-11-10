import {GamePhase} from "./game-phase";

export class SequenceGame<T> {

    constructor(public readonly phases: GamePhase<T>[]) {
    }

    public run(){
        this.executeGivenPhase(0, null)
    }

    private executeGivenPhase(phaseIndex: number, lastPhaseState) {
        if (phaseIndex >= this.phases.length) {
            return;
        }
        this.phases[phaseIndex]
            .execute(lastPhaseState)
            .subscribe((outputState) => this.executeGivenPhase(phaseIndex + 1, outputState))
    }
}

