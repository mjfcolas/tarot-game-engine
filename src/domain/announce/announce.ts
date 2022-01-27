export enum Announce {
    PRISE = "PRISE",
    GARDE = "GARDE",
    GARDE_SANS = "GARDE_SANS",
    GARDE_CONTRE = "GARDE_CONTRE"
}

export function pruneAnnouncesLowerThanGivenAnnounce(announce: Announce): Announce[] {
    if(!announce){
        return Object.values(Announce)
    }
    const indexOfAnnounce = Object.values(Announce).findIndex((current) => current === announce)
    return Object.values(Announce).slice(indexOfAnnounce + 1);
}
