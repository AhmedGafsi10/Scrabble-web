import { BoardMessageContent, BoardMessageTitle } from '@app/classes/board-model/constants';

export interface BoardMessage {
    title: BoardMessageTitle;
    content?: BoardMessageContent | string;
    score?: number;
}
