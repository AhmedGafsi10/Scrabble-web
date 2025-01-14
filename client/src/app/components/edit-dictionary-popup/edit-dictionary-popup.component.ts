import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FORBIDDEN_MESSAGE } from '@app/constants/http-constants';
import { HttpService } from '@app/http.service';
import { Dictionary } from '@app/interfaces/dictionary';
import { DictionaryValidatorService } from '@app/services/dictionary-validator.service';

// TODO: Assess mending
@Component({
    selector: 'app-edit-dictionary-popup',
    templateUrl: './edit-dictionary-popup.component.html',
    styleUrls: ['./edit-dictionary-popup.component.scss'],
})
export class EditDictionaryPopupComponent {
    // Homer-mending: 9 attributes, maybe use interfaces for some like isProcessing and errorMessage
    dictionaryForm: FormGroup;
    isProcessing: boolean;
    errorMessage: string;
    private initialDictionary: Dictionary;
    // Homer-mending: use a more meaningful name for the form builder
    constructor(
        @Inject(MAT_DIALOG_DATA) private dictionary: Dictionary,
        private fb: FormBuilder,
        private httpService: HttpService,
        private dialogRef: MatDialogRef<EditDictionaryPopupComponent>,
        private dictionaryValidator: DictionaryValidatorService,
    ) {
        this.initialDictionary = this.deepCopyDictionary(dictionary);
        this.dictionaryForm = this.fb.group({
            title: [this.dictionary.title, [Validators.required, Validators.minLength(1)]],
            description: [this.dictionary.description, [Validators.required, Validators.minLength(1)]],
        });
        this.isProcessing = false;
        this.errorMessage = '';
    }

    canModifyDictionary(): boolean {
        return this.hasBeenModified() && this.dictionaryForm.valid;
    }

    async modifyDictionary() {
        this.isProcessing = true;
        const updatedDictionary: Dictionary = this.getUpdatedDictionary();
        if (!this.isUpdateDictionaryFormatValid(updatedDictionary)) {
            return this.handleInvalidDictionaryFormat();
        }
        await this.httpService.updateDictionary(this.initialDictionary.title, updatedDictionary).toPromise();
        if (this.httpService.anErrorOccurred()) {
            return this.handleHttpError(updatedDictionary.title);
        }
        this.handleSuccessfulmodification(updatedDictionary);
    }

    private handleSuccessfulmodification(updatedDictionary: Dictionary) {
        this.hideProcessing();
        this.dialogRef.close(updatedDictionary);
    }
    private handleHttpError(newTitle: string) {
        this.hideProcessing();
        if (this.httpService.getErrorMessage() === FORBIDDEN_MESSAGE) {
            this.errorMessage = `On ne peut pas modifier votre dictionnaire car il y a déjà un dictionnaire avec le titre "${newTitle}"`;
            return;
        }
        this.errorMessage = this.httpService.getErrorMessage();
        return;
    }

    private handleInvalidDictionaryFormat() {
        this.hideProcessing();
        this.errorMessage = this.dictionaryValidator.errorMessage;
        return;
    }

    private getUpdatedDictionary(): Dictionary {
        return { title: this.title, description: this.description };
    }

    private isUpdateDictionaryFormatValid(updatedDictionary: Dictionary): boolean {
        return (
            this.dictionaryValidator.isTitleValid(updatedDictionary.title) &&
            this.dictionaryValidator.isDescriptionValid(updatedDictionary.description)
        );
    }
    private hasBeenModified(): boolean {
        return this.titleHasBeenModified() || this.descriptionHasBeenModified();
    }

    private get title(): string {
        return (this.dictionaryForm.controls.title as FormControl).value;
    }
    private get description(): string {
        return (this.dictionaryForm.controls.description as FormControl).value;
    }

    private titleHasBeenModified(): boolean {
        return this.initialDictionary.title !== this.title;
    }
    private descriptionHasBeenModified(): boolean {
        return this.initialDictionary.description !== this.description;
    }
    private deepCopyDictionary(dictionary: Dictionary) {
        return { title: dictionary.title.slice(0), description: dictionary.description.slice(0) };
    }
    private hideProcessing() {
        this.isProcessing = false;
    }
}
