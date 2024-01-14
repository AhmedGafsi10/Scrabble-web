import { PlacementDirections } from '@app/classes/board-model/constants';

// An empty interface is necessary for polymorphism
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Data {}
export interface PlacementData extends Data {
    word: string;
    row: string;
    column: number;
    direction: PlacementDirections;
}
export interface ExchangeData extends Data {
    word: string;
}
