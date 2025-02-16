import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Player } from '@app/classes/player';
import { Room } from '@app/classes/room';
import { GONE_RESSOURCE_MESSAGE } from '@app/constants/http-constants';
import { HttpService } from '@app/http.service';
import { SocketClientService } from '@app/services/socket-client.service';

@Component({
    selector: 'app-start-game',
    templateUrl: './start-game.component.html',
    styleUrls: ['./start-game.component.scss'],
})
export class StartGameComponent implements OnInit {
    @Input() gameForm: FormGroup | undefined;
    @Output() private dictionaryDeleted;
    @Output() private httpError;
    onProcess: boolean = false;
    constructor(
        private socketService: SocketClientService,
        private router: Router,
        public room: Room,
        public player: Player,
        private httpService: HttpService,
    ) {
        // this.hasGameType = this.validateGameType();
        this.dictionaryDeleted = new EventEmitter<void>();
        this.httpError = new EventEmitter<void>();
    }

    ngOnInit() {
        this.connect();
    }

    connect() {
        if (this.socketService.isSocketAlive()) {
            this.socketService.disconnect();
        }
        this.socketService.connect();
        this.configureBaseSocketFeatures();
    }

    configureBaseSocketFeatures() {
        this.socketService.on('joinRoomStatus', (serverRoomName: string) => {
            this.onProcess = false;
            if (!serverRoomName.startsWith('Room')) return;
            this.room.roomInfo.name = serverRoomName;
            this.router.navigate(['/game/multiplayer/wait']);
        });
    }

    async joinRoom() {
        if (!this.gameForm) return;
        if (!this.hasValidGameType) return;
        if (!this.dictionaryExists()) return;
        const dictionary = this.gameForm.controls.dictionary as FormControl;
        await this.dictionarySelectedExists(dictionary.value);
        if (this.httpService.anErrorOccurred()) {
            this.handleHttpError();
            return;
        }
        // this.hasGameType = true;
        this.initializeRoom();
        this.onProcess = true;
        this.socketService.send('joinRoom', this.room);
    }
    get hasValidGameType(): boolean {
        // TODO: use constant or enum for those gameType
        return ['classic', 'log2990'].includes(this.room.roomInfo.gameType);
    }

    get isFormValid(): boolean {
        if (!this.gameForm) return false;
        return this.gameForm.valid && this.isDictionarySelected();
    }

    private dictionaryExists(): boolean {
        if (!this.gameForm) return false;
        const dictionary = this.gameForm.controls.dictionary as FormControl;
        return dictionary && dictionary.value !== '';
    }
    private handleHttpError() {
        if (this.httpService.getErrorMessage() !== GONE_RESSOURCE_MESSAGE) {
            this.httpError.emit();
            return;
        }
        this.dictionaryDeleted.emit();
        return;
    }

    private isDictionarySelected(): boolean {
        if (!this.gameForm) return false;
        const dictionary = this.gameForm.controls.dictionary as FormControl;
        if (!dictionary.value) return false;
        return true;
    }

    private async dictionarySelectedExists(title: string): Promise<boolean> {
        const dictionary = await this.httpService.getDictionary(title, false).toPromise();
        return dictionary?.title === title;
    }

    private initializeRoom() {
        if (!this.gameForm) return;
        const dictionary = this.gameForm.controls.dictionary as FormControl;
        const pseudo = this.gameForm.controls.pseudo as FormControl;
        const timerPerTurn = this.gameForm.controls.timerPerTurn as FormControl;
        this.room.currentPlayerPseudo = pseudo.value;
        this.room.roomInfo.timerPerTurn = timerPerTurn.value;
        this.room.roomInfo.dictionary = dictionary.value;
        this.player.pseudo = pseudo.value;
        this.player.isCreator = true;
        this.player.socketId = this.socketService.socket.id;
        this.room.players = [this.player];
    }
}
