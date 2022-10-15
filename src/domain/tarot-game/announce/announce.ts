export enum Announce {
    PRISE = "PRISE",
    GARDE = "GARDE",
    GARDE_SANS = "GARDE_SANS",
    GARDE_CONTRE = "GARDE_CONTRE"
}

export function pruneAnnouncesLowerThanGivenAnnounceFrom(arrayToPrune: readonly Announce[], limitAnnounce: Announce): readonly Announce[] {
    if(!limitAnnounce){
        return arrayToPrune
    }
    const indexOfAnnounce = arrayToPrune.findIndex((current) => current === limitAnnounce)
    return arrayToPrune.slice(indexOfAnnounce + 1);
}
