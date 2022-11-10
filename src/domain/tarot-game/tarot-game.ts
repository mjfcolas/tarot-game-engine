import {TarotTable} from "./table/ports/tarot-table";
import {TarotDealer} from "./dealer/tarot-dealer";
import {AnnounceManager} from "./announce/announce-manager";
import {Announce} from "./announce/announce";
import {TarotPlayer} from "./player/tarot-player";
import {PlayingCard} from "tarot-card-deck";
import {CardGameManager, Trick} from "../card-game/card-game-manager";
import {CountEndGameScore} from "./functions/count-tarot-end-game-score";
import {PoigneeCardGamePlugin} from "./poignee/poignee-card-game-plugin";
import {getIncorrectCardsSetAside, getPossibleCardsToSetAside} from "./functions/tarot-available-cards-to-set-aside";
import {countTarotEndGameTakerPoints} from "./functions/count-tarot-end-game-taker-points";
import {SequenceGame} from "./sequence-game";
import {PlayerIdentifier} from "../card-game/player/card-game-player";
import {EndGamePhase} from "./phases/end-game/end-game.game-phase";
import {SetAsideGamePhase} from "./phases/set-aside/set-aside.game-phase";
import {AnnounceGamePhase} from "./phases/announce/announce.game-phase";
import {InitializeGamePhase} from "./phases/initialize/initialize.game-phase";
import {MainGamePhase} from "./phases/main-game/main-game.game-phase";
import {DefaultAnnounceManager} from "./announce/default-announce-manager";
import {DefaultCardGameManager} from "../card-game/default-card-game-manager";
import {resolveTarotTurn} from "./functions/tarot-turn-resolver";
import {getPlayableTarotCards} from "./functions/tarot-playable-cards";

export type TarotGameState = {
    takerAnnounce?: Announce;
    taker?: TarotPlayer;
    hasToSetAside?: boolean;
    takerHasExcuseAtStartOfGame?: boolean,
    endGameTricks?: Trick[]
}

export type PlayerWithScore = {
    player: PlayerIdentifier,
    score: number
}

export type GameResultWithDeck = {
    numberOfPointsForAttack: number
    numberOfPointsForDefense: number
    finalScores: readonly PlayerWithScore[]
    endOfGameDeck: readonly PlayingCard[]
}


export class TarotGame {
    private readonly numberOfCardsInDog = 6;
    private readonly announceGamePhase: AnnounceGamePhase;
    private readonly setAsideGamePhase: SetAsideGamePhase;
    private readonly mainGamePhase: MainGamePhase

    constructor(
        private readonly players: readonly TarotPlayer[],
        private readonly table: TarotTable,
        private readonly dealer: TarotDealer,
        private readonly countEndGameScore: CountEndGameScore,
        private readonly endOfGameCallback: (gameResult: GameResultWithDeck) => void
    ) {
        const poigneePlugin = new PoigneeCardGamePlugin(players);
        const announceManager: AnnounceManager = new DefaultAnnounceManager(players);
        const cardGameManager: CardGameManager = new DefaultCardGameManager(resolveTarotTurn, getPlayableTarotCards, table, players);

        const initializeGamePhase: InitializeGamePhase = new InitializeGamePhase(table, dealer, this.numberOfCardsInDog)
        this.announceGamePhase = new AnnounceGamePhase(players, table, announceManager)
        this.setAsideGamePhase = new SetAsideGamePhase(table, this.numberOfCardsInDog, getIncorrectCardsSetAside, getPossibleCardsToSetAside)
        this.mainGamePhase = new MainGamePhase(table, cardGameManager, poigneePlugin)
        const endGamePhase: EndGamePhase = new EndGamePhase(players, table, poigneePlugin, countTarotEndGameTakerPoints, countEndGameScore, endOfGameCallback)

        new SequenceGame<TarotGameState>([
            initializeGamePhase,
            this.announceGamePhase,
            this.setAsideGamePhase,
            this.mainGamePhase,
            endGamePhase
        ]).run()
    }

    public announce(playerThatAnnounce: TarotPlayer, announce?: Announce): void {
        this.announceGamePhase.announce(playerThatAnnounce, announce)
    }

    public setAside(playerThatSetAside: TarotPlayer, cardsSetAside: PlayingCard[]) {
        this.setAsideGamePhase.setAside(playerThatSetAside, cardsSetAside)
    }

    public declinePoignee(player: TarotPlayer) {
        this.mainGamePhase.declinePoignee(player)
    }

    public announcePoignee(player: TarotPlayer, shownCards: PlayingCard[]) {
        this.mainGamePhase.announcePoignee(player, shownCards)
    }

    public play(playerThatPlay: TarotPlayer, card: PlayingCard) {
        this.mainGamePhase.play(playerThatPlay, card)
    }
}
