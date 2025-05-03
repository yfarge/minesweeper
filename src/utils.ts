export const ADJACENT_POSITIONS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
]

export const ACTIONS = {
    REVEAL: 'REVEAL',
    FLAG: 'FLAG'
} as const;

export function inBounds(r: number, c: number, rows: number, cols: number): boolean {
    return r >= 0 && r < rows && c >= 0 && c < cols;
}

