export interface ChatMessage {
    text: string;
    sender: string;
    color: string;
}

export enum MessageSenderColors {
    SYSTEM = '#FFC7C7',
    PLAYER1 = '#A8CF9A',
    PLAYER2 = '#FFFFFF',
    GOALS = '#f5dc56',
}
