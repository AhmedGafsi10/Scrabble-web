import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRefMock } from '@app/components/leaderboard-dialog-data/leaderboard-dialog-data.component.spec';
import { HttpService } from '@app/http.service';
import { Bot } from '@app/interfaces/bot';
import { of } from 'rxjs';
import { EditBotPopupComponent } from './edit-bot-popup.component';

describe('EditDictionaryPopupComponent', () => {
    let component: EditBotPopupComponent;
    let fixture: ComponentFixture<EditBotPopupComponent>;
    let httpService: HttpService;
    const fakeBot: Bot = { name: 'BOT A', gameType: 'expert' };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [EditBotPopupComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: fakeBot },
                { provide: HttpService },
                { provide: FormBuilder },
                { provide: MatDialogRef, useClass: MatDialogRefMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditBotPopupComponent);
        component = fixture.componentInstance;
        httpService = fixture.debugElement.injector.get(HttpService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('canModifyBot tests', () => {
        it('should return false when the new name is empty', () => {
            (component.botForm.get('name') as FormControl).setValue('');
            expect(component.canModifyBot()).toBeFalse();
        });
        it('should return false when the new gameType is empty', () => {
            (component.botForm.get('gameType') as FormControl).setValue('');
            expect(component.canModifyBot()).toBeFalse();
        });
        it('should return false when nothing has been modified', () => {
            expect(component.canModifyBot()).toBeFalse();
        });
        it('should return true when only the name has been modified', () => {
            (component.botForm.get('name') as FormControl).setValue('Moha');
            expect(component.canModifyBot()).toBeTrue();
        });
        it('should return true when only the gameType has been modified', () => {
            (component.botForm.get('gameType') as FormControl).setValue('Moha');
            expect(component.canModifyBot()).toBeTrue();
        });
        it('should return true when the gameType and the name have been modified', () => {
            (component.botForm.get('name') as FormControl).setValue('Moha');
            (component.botForm.get('gameType') as FormControl).setValue('Moha');
            expect(component.canModifyBot()).toBeTrue();
        });
    });
    describe('modifyBot tests', () => {
        it('should call updateBot with value of the initial bot from the httpService', async () => {
            const spy = spyOn(httpService, 'updateBot').and.returnValue(of(fakeBot));
            await component.modifyBot();
            expect(spy).toHaveBeenCalledWith(fakeBot.name, fakeBot);
        });
    });
});
