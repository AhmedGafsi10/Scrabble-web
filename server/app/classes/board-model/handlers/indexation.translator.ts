import { DEFAULT_COLUMN_COUNT, DEFAULT_ROWS, Directions, MIN_COLUMN_INDEX } from '@app/classes/board-model/constants';
import { IndexIterator } from './index-iterator';

export class IndexationTranslator {
    rows: string[];
    minColumnIndex: number;
    columnCount: number;
    caseCount: number;
    rowCount: number;
    constructor(rows: string[] = DEFAULT_ROWS, columnCount: number = DEFAULT_COLUMN_COUNT, minColumnIndex: number = MIN_COLUMN_INDEX) {
        this.rows = rows;
        this.columnCount = columnCount;
        this.minColumnIndex = minColumnIndex;
        this.rowCount = this.rows.length;
        this.caseCount = this.columnCount * this.rowCount;
    }
    findNodeIndex(nodeIndex: number, direction: Directions, distance: number): number | undefined {
        let index: number | undefined = nodeIndex;
        while (index && distance > 0) {
            index = this.findNeighborIndex(index, direction);
            distance--;
        }
        return index;
    }
    findTableIndex(row: string, columnIndex: number) {
        if (IndexIterator.getRowIndex(row) < IndexIterator.getRowIndex(this.rows[0])) return undefined;
        if (columnIndex > this.columnCount) return undefined;
        return columnIndex + IndexIterator.getRowIndex(row) * this.columnCount;
    }
    findNeighborIndex(nodeIndex: number, direction: Directions) {
        switch (direction) {
            case Directions.Up:
                return this.getUpNeighborIndex(nodeIndex);
            case Directions.Down:
                return this.getDownNeighborIndex(nodeIndex);
            case Directions.Right:
                return this.getRightNeighborIndex(nodeIndex);
            case Directions.Left:
                return this.getLeftNeighborIndex(nodeIndex);
        }
    }
    // Row iteration 15 * 14
    findRowLetter(tableIndex: number) {
        if (tableIndex > this.caseCount + 1 || tableIndex < 1) return undefined;
        return this.rows[this.computeRowLetter(tableIndex)];
    }
    findColumnIndex(tableIndex: number) {
        if (tableIndex > this.caseCount + 1 || tableIndex < 1) return undefined;
        const modValue = tableIndex % this.columnCount;
        if (modValue === 0) return tableIndex;
        return tableIndex % this.columnCount;
    }
    private isRowEnd(nodeIndex: number): boolean {
        if (nodeIndex % this.columnCount === 0) return true;
        return false;
    }
    private isRowStart(nodeIndex: number): boolean {
        if (nodeIndex % this.columnCount === 1) return true;
        return false;
    }
    // Index computation
    private computeUpNeighborIndex(nodeIndex: number) {
        return nodeIndex - this.columnCount;
    }
    private computeDownNeighborIndex(nodeIndex: number) {
        return nodeIndex + this.columnCount;
    }
    private computeRightNeighborIndex(nodeIndex: number) {
        return nodeIndex + 1;
    }

    private computeLeftNeighborIndex(nodeIndex: number) {
        return nodeIndex - 1;
    }
    private computeRowLetter(tableIndex: number) {
        return (tableIndex - (tableIndex % this.columnCount)) / this.columnCount;
    }
    // Get neighbors
    private getUpNeighborIndex(nodeIndex: number) {
        const index: number = this.computeUpNeighborIndex(nodeIndex);
        if (index < this.minColumnIndex) return undefined;
        return index;
    }
    private getDownNeighborIndex(nodeIndex: number) {
        const index = this.computeDownNeighborIndex(nodeIndex);
        if (index >= this.caseCount + 1) return undefined;
        return index;
    }
    private getRightNeighborIndex(nodeIndex: number) {
        if (this.isRowEnd(nodeIndex)) return undefined;
        return this.computeRightNeighborIndex(nodeIndex);
    }
    private getLeftNeighborIndex(nodeIndex: number) {
        if (this.isRowStart(nodeIndex)) return undefined;
        return this.computeLeftNeighborIndex(nodeIndex);
    }
}
