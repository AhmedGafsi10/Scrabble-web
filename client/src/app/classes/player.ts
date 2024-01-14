import { Injectable } from '@angular/core';

// TODO: make it an interface
@Injectable({
    providedIn: 'root',
})
export class Player {
    pseudo: string;
    socketId: string;
    points: number;
    isCreator: boolean;
    isItsTurn: boolean;
}
