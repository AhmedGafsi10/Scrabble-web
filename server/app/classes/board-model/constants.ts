export enum PlacementDirections {
    Horizontal = 'h',
    Vertical = 'v',
}

export enum Directions {
    Up = 'UP',
    Down = 'DOWN',
    Right = 'RIGHT',
    Left = 'LEFT',
}

export enum BoardMessageTitle {
    // The user will see these, so they are in french
    InProcess = 'Demande de placement en cours de traitement',
    InvalidPlacement = 'Placement invalide',
    SuccessfulPlacement = 'Placement valide',
    RulesBroken = 'Le placement a brisé les règles du jeu',

    // The user will not see these, so we keep them in english
    NoRulesBroken = 'No rules broken',
}

export enum BoardMessageContent {
    // The user will see these, so they are in french
    OutOfBounds = 'Une ligne ou une colonne du placement ne fait pas partie du plateau de jeu!',
    NotValidLetter = 'Une des lettres n est pas un charactère valide!',
    NoLetters = 'Pas de lettres fournies, rien à placer!',
    NoDirection = 'Pas de direction fournie pour le placement de plusieurs lettres!',
    CenterCaseEmpty = 'Un placement lors du premier tour doit couvrir la case centrale!',
    NotConnected = 'Les lettres placées n etaient pas connectées à d anciennes lettres sur le plateau!',
    InvalidWord = 'Un des mots formés est invalide!',

    // The user will not see these, so we keep them in english
    OccupiedCase = 'Can not place on occupied case',
    InternalLogicError = 'Internal logic error',
    NoRulesBroken = 'Letters placed did not break any rules',
}
export interface PlacementIndexes {
    rowLetter: string;
    column: number;
}

export const MIN_COLUMN_INDEX = 1;
export const MAX_COLUMN_INDEX = 15;
export const CENTRAL_COLUMN_INDEX = 8;
export const THIRD_COLUMN_INDEX = 3;
export const DEFAULT_COLUMN_COUNT = 15;
export const DEFAULT_ROWS: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'];
export const DEFAULT_CENTRAL_INDEX = 7;
export const DEFAULT_FIRST_ROW = DEFAULT_ROWS[0];
export const DEFAULT_LAST_ROW = DEFAULT_ROWS[14];
export const DEFAULT_CENTRAL_ROW = DEFAULT_ROWS[DEFAULT_CENTRAL_INDEX];
export const OUT_OF_BOUNDS_ROW = 'p';

// Constants for BoardNode tests:
export const NODE_TEST_COUNT = 5;
export const NODE_TEST_FIRST_INDEX = 0;
export const NODE_TEST_SECOND_INDEX = 1;
