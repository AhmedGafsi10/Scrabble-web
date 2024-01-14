import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '@app/http.service';
import { Bot } from '@app/interfaces/bot';

@Component({
    selector: 'app-edit-bot-popup',
    templateUrl: './edit-bot-popup.component.html',
    styleUrls: ['./edit-bot-popup.component.scss'],
})
export class EditBotPopupComponent {
    botForm: FormGroup;
    modeEdit: boolean;
    private initialBot: Bot;
    private botHasBeenEdited;

    constructor(
        @Inject(MAT_DIALOG_DATA) private bot: Bot,
        private fb: FormBuilder,
        private httpService: HttpService,
        private dialogRef: MatDialogRef<EditBotPopupComponent>,
    ) {
        this.initialBot = this.deepCopyBot(bot);
        this.botForm = this.fb.group({
            name: [this.bot.name, [Validators.required, Validators.minLength(1)]],
            gameType: [this.bot.gameType, [Validators.required, Validators.minLength(1)]],
        });
        this.botHasBeenEdited = false;
        this.modeEdit = this.initialBot.name !== '';
    }

    canModifyBot(): boolean {
        return this.hasBeenModified() && this.botForm.valid;
    }

    async modifyBot() {
        const updatedBot = { name: this.name, gameType: this.gameType };
        let nameToSearch = this.initialBot.name;
        if (this.initialBot.name === '') {
            nameToSearch = this.name;
        }
        await this.httpService.updateBot(nameToSearch, updatedBot).toPromise();
        // TODO Add further verification to see if the update is successful and then close the dialog
        this.botHasBeenEdited = true;
        this.dialogRef.close();
    }

    isClosedByEditing() {
        return this.botHasBeenEdited;
    }

    private hasBeenModified(): boolean {
        return this.nameHasBeenModified() || this.gameTypeHasBeenModified();
    }

    private get name(): string {
        return (this.botForm.controls.name as FormControl).value;
    }

    private get gameType(): string {
        return (this.botForm.controls.gameType as FormControl).value;
    }

    private nameHasBeenModified(): boolean {
        return this.initialBot.name !== this.name;
    }

    private gameTypeHasBeenModified(): boolean {
        return this.initialBot.gameType !== this.gameType;
    }

    private deepCopyBot(bot: Bot) {
        return { name: bot.name.slice(0), gameType: bot.gameType.slice(0) };
    }
}
