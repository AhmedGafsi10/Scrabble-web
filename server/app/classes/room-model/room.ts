import { BoardMessage } from '@app/classes/board-model/board-message';
import { Goal } from '@app/classes/goals/goal';
import { LetterBank } from '@app/classes/letter-bank/letter-bank';
import { Player } from '@app/classes/player';
import { PlacementFinder } from '@app/classes/virtual-placement-logic/placement-finder';
import { VirtualPlayer } from '@app/classes/virtual-player/virtual-player';
import { DEFAULT_DICTIONARY_TITLE } from '@app/controllers/dictionaries.controller';
import { BotGreeting } from '@app/enums/bot-greetings';
// import { COUNT_PLAYER_TURN } from '@app/constants/constants';
import { GameLevel } from '@app/enums/game-level';
import { PlacementData } from '@app/interfaces/datas';
import { ReachedGoal } from '@app/interfaces/reached-goal';
import { DictionariesFileService } from '@app/services/dictionaries-files.service';
import { GameManager } from './game-manager';
import { RoomInfo } from './room-info';
export class Room {
    elapsedTime: number;
    players: Player[];
    roomInfo: RoomInfo;
    bot: VirtualPlayer;
    startDate: Date;
    private isFirstGame: boolean;
    private gameManager: GameManager;
    constructor(clientRoom?: Room) {
        this.players = [];
        this.elapsedTime = 0;
        this.startDate = new Date();
        // TODO: Give default surrender value
        this.roomInfo = { name: '', timerPerTurn: '', dictionary: DEFAULT_DICTIONARY_TITLE, gameType: '', maxPlayers: 2, surrender: '' };
        if (clientRoom) {
            this.roomInfo = {
                name: '',
                timerPerTurn: clientRoom.roomInfo.timerPerTurn,
                dictionary: clientRoom.roomInfo.dictionary,
                gameType: clientRoom.roomInfo.gameType,
                maxPlayers: 2,
                surrender: '',
            };
        } else this.roomInfo = { name: '', timerPerTurn: '', dictionary: DEFAULT_DICTIONARY_TITLE, gameType: '', maxPlayers: 2, surrender: '' };
        this.gameManager = new GameManager(
            new DictionariesFileService().convertTitleIntoFilename(this.roomInfo.dictionary),
            this.roomInfo.gameType === 'log2990',
        );
        this.isFirstGame = true;
    }

    get turnPassedCounter(): number {
        return this.gameManager.turnPassedCounter;
    }

    get placementFinder(): PlacementFinder {
        return this.gameManager.placementFinder;
    }

    get maxPlayers() {
        return this.roomInfo.maxPlayers;
    }

    get isSolo() {
        return this.roomInfo.isSolo;
    }
    /* switchBoardManipulator() {
        // TODO: Remove magical string
        const manipulator = new BoardManipulator2990(this.gameManager.getLetterBank().produceValueMap());
        if (this.roomInfo.gameType !== 'log2990') return this.addPlayer(this.bot);
        if (this.getCurrentPlayerTurn() === undefined) return;
        this.gameManager.switchTo2990(this.getCurrentPlayerTurn() as Player, manipulator);
        if (this.bot === undefined) return;
        const botIndex = this.players.indexOf(this.bot);
        this.bot = this.createPlayerVirtual(this.bot.socketId, this.bot.pseudo, this.bot.wordFetcher, this.bot.level as GameLevel);
        this.players[botIndex] = this.bot;
    }*/
    hasTimer(): boolean {
        return this.gameManager.hasTimeout;
    }

    stopOtherTimerCreation() {
        this.gameManager.hasTimeout = true;
    }

    incrementTurnPassedCounter() {
        this.gameManager.turnPassedCounter++;
    }

    resetTurnPassedCounter() {
        this.gameManager.turnPassedCounter = 0;
    }

    get letterBank(): LetterBank {
        return this.gameManager.managerLetterBank;
    }

    addPlayer(player: Player) {
        if (this.players.length < this.maxPlayers) {
            this.fillPlayerRack(player);
            this.players.push(player);
        }
        if (this.isFirstGame && this.players.length !== 0) {
            this.isFirstGame = false;
            this.startDate = new Date();
        }
    }
    createPlayerVirtual(socketId: string, name: string, desiredLevel = GameLevel.Beginner) {
        this.bot = this.gameManager.getNewVirtualPlayer(socketId, name, this.gameManager.fetcher, desiredLevel);
        this.addPlayer(this.bot);
        return this.bot;
    }

    givesPlayerGoals() {
        this.gameManager.givePlayerGoals(this.players);
    }

    getAllGoals(): Goal[] {
        return this.gameManager.allGoals;
    }
    getReachedGoals(): ReachedGoal[] {
        return this.gameManager.reachedGoals;
    }
    fillPlayerRack(player: Player) {
        this.gameManager.fillPlayerRack(player);
    }

    removePlayer(player: Player) {
        const playerToRemove = this.players.find((element) => element.socketId === player.socketId);
        if (playerToRemove) {
            this.players.splice(this.players.indexOf(playerToRemove), 1);
        }
    }

    askPlacement(placement: PlacementData): BoardMessage {
        return this.gameManager.askPlacement(placement, this.getCurrentPlayerTurn());
    }

    getPlayer(playerSocketId: string): Player | undefined {
        return this.players.find((element) => element.socketId === playerSocketId);
    }

    getPlayerName(playerSocketId: string): string | undefined {
        const player = this.getPlayer(playerSocketId);
        if (!player) return;
        return player.pseudo;
    }

    choseRandomTurn() {
        this.gameManager.choseRandomTurn(this.players);
    }

    changePlayerTurn() {
        this.gameManager.changePlayerTurn(this.players);
        this.elapsedTime = 0;
    }

    canChangePlayerTurn(): boolean {
        return this.gameManager.canChangePlayerTurn(this.players);
    }

    getCurrentPlayerTurn(): Player | undefined {
        return this.gameManager.getCurrentPlayerTurn(this.players);
    }

    verifyBothPlayersExist(): boolean {
        return this.gameManager.verifyBothPlayersExist(this.players);
    }

    isGameFinished(): boolean {
        return this.gameManager.isGameFinished(this.players);
    }

    setPlayersTurnToFalse() {
        this.gameManager.setPlayersTurnToFalse(this.players);
    }

    updateScoreOnPassFinish() {
        this.gameManager.updateScoreOnPassFinish(this.players);
    }

    updateScoresOnPlaceFinish(winner: Player) {
        return this.gameManager.updateScoresOnPlaceFinish(winner, this.players);
    }

    getWinner(): Player[] {
        return this.gameManager.getWinner(this.players);
    }
    getBotGreeting(): BotGreeting | undefined {
        if (!this.bot) return undefined;
        return this.bot.greeting;
    }
}
