import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Room } from '@app/classes/room';
import { Score } from '@app/classes/score';
import { LeaderboardDialogDataComponent } from '@app/components/leaderboard-dialog-data/leaderboard-dialog-data.component';
import { ErrorDialogComponent } from '@app/error-dialog/error-dialog.component';
import { HttpService } from '@app/http.service';
import { BehaviorSubject } from 'rxjs';

export const LEADERBOARD_SIZE = 5;
export const DIALOG_WIDTH = '600px';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss', '../dark-theme.scss'],
})
export class MainPageComponent {
    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');
    constructor(public room: Room, private dialog: MatDialog, private httpService: HttpService) {}

    setGameType(type: string) {
        this.room.roomInfo.gameType = type;
    }

    async showLeaderboard() {
        const scores = await this.getLeaderboardScores();
        if (this.httpService.anErrorOccurred()) {
            this.showErrorDialog();
            return;
        }
        this.dialog.open(LeaderboardDialogDataComponent, {
            width: DIALOG_WIDTH,
            autoFocus: true,
            data: scores,
        });
    }

    async showAllScores() {
        const scores = await this.httpService.fetchAllScores().toPromise();
        if (!scores) {
            this.showErrorDialog();
            return;
        }
        this.dialog.open(LeaderboardDialogDataComponent, {
            width: DIALOG_WIDTH,
            autoFocus: true,
            data: [scores],
        });
    }
    private async getLeaderboardScores(): Promise<Score[][] | undefined> {
        const scores: Score[][] = [];
        for (const gameMode of ['log2990', 'classic']) {
            const score = await this.httpService.getNScoresByCategory(gameMode, LEADERBOARD_SIZE).toPromise();
            if (!score) return undefined;
            scores.push(score);
        }
        return scores;
    }
    private showErrorDialog() {
        this.dialog.open(ErrorDialogComponent, {
            width: DIALOG_WIDTH,
            autoFocus: true,
            data: this.httpService.getErrorMessage(),
        });
    }
}
