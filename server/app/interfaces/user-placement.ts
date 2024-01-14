import { PlacementDirections } from '@app/classes/board-model/constants';

export interface UserPlacement {
    row: string;
    col: number;
    direction: PlacementDirections;
    oldWord: string;
    newWord: string;
    letters: string;
    points?: number;
}
